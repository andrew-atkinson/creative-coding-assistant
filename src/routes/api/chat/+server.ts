// Chat endpoint. New flow (2026-07-04 pivot): no vector search; a small
// router LLM call picks relevant lessons, their full .md content is loaded
// into a GA-persona system prompt, and the model streams an answer with
// inline [MM:SS video_id] citations. Sentinel [[UNKNOWN]] triggers a
// feedback row for Andrew to review.

import { json, type RequestHandler } from '@sveltejs/kit';
import { env } from '$env/dynamic/private';
import { env as publicEnv } from '$env/dynamic/public';
import { getServerSupabase } from '$lib/server/supabase';
import { selectLessons } from '$lib/server/router';
import { loadLessons } from '$lib/server/lessons';
import { buildSystemPrompt } from '$lib/server/persona';
import { stream as llmStream, type ChatMessage } from '$lib/server/llm';

const SOURCE_SENTINEL = '\n\n[[SOURCES]]';
const UNKNOWN_RE = /\[\[UNKNOWN\]\]\s*"([^"\n]{1,500})"/;
// Matches [MM:SS <slug>] with lenient middle:
//   optional prefix like "video_id:" or "id:" or "lesson:"
//   optional "=" or ":" delimiter between prefix and slug
//   slug allows a-z, digits, and hyphens; may be a partial id (server resolves it)
const CITATION_RE = /\[(\d{1,3}):(\d{2})\s+(?:(?:video[_-]?id|id|lesson[_-]?id|lesson)[\s:=]+)?([a-z0-9][a-z0-9-]{2,})\]/gi;

// Resolve a raw slug from a citation to a known video_id.
// Prefers exact match; falls back to a suffix match (e.g. "3-loop-danger" -> "week-3-3-loop-danger").
function resolveVideoId(raw: string, known: Set<string>): string | null {
  const lower = raw.toLowerCase();
  if (known.has(lower)) return lower;
  for (const id of known) {
    if (id.endsWith('-' + lower) || id.endsWith(lower)) return id;
  }
  return null;
}

type ChatRequest = {
  course_slug: string;
  query: string;
  history?: Array<{ role: 'user' | 'assistant'; content: string }>;
  session_id?: string;
};

const RATE_WINDOW_MS = 60_000;
const RATE_LIMIT = 30;
const hits = new Map<string, number[]>();

function rateLimited(ip: string): boolean {
  const now = Date.now();
  const arr = (hits.get(ip) ?? []).filter((t) => now - t < RATE_WINDOW_MS);
  arr.push(now);
  hits.set(ip, arr);
  return arr.length > RATE_LIMIT;
}

function corsHeaders(origin: string | null): Record<string, string> {
  const allowed = publicEnv.PUBLIC_RUNTIME_ORIGIN;
  if (origin && (origin === allowed || origin.startsWith('http://localhost'))) {
    return {
      'Access-Control-Allow-Origin': origin,
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'content-type'
    };
  }
  return {};
}

export const OPTIONS: RequestHandler = ({ request }) => {
  return new Response(null, { status: 204, headers: corsHeaders(request.headers.get('origin')) });
};

export const POST: RequestHandler = async ({ request, getClientAddress }) => {
  const cors = corsHeaders(request.headers.get('origin'));
  const ip = getClientAddress();
  if (rateLimited(ip)) {
    return json({ error: 'rate_limited' }, { status: 429, headers: cors });
  }

  let body: ChatRequest;
  try {
    body = await request.json();
  } catch {
    return json({ error: 'invalid_json' }, { status: 400, headers: cors });
  }
  const { course_slug, query, history = [], session_id } = body;
  if (!course_slug || !query) {
    return json({ error: 'missing_fields' }, { status: 400, headers: cors });
  }

  const supabase = getServerSupabase(env);

  const { data: course, error: cErr } = await supabase
    .from('courses')
    .select('id, title, status, monthly_request_budget')
    .eq('slug', course_slug)
    .single();
  if (cErr || !course || course.status !== 'published') {
    return json({ error: 'not_found' }, { status: 404, headers: cors });
  }

  const monthStart = new Date();
  monthStart.setDate(1);
  monthStart.setHours(0, 0, 0, 0);
  const { count } = await supabase
    .from('usage_events')
    .select('*', { count: 'exact', head: true })
    .eq('course_id', course.id)
    .eq('kind', 'chat_request')
    .gte('occurred_at', monthStart.toISOString());
  if ((count ?? 0) >= course.monthly_request_budget) {
    return json({ error: 'budget_exhausted' }, { status: 429, headers: cors });
  }

  // Router → slugs → load .md files.
  const slugs = await selectLessons(env, query);
  const lessons = await loadLessons(slugs);
  const knownVideoIds = new Set(lessons.map((l) => l.video_id));

  const maxCharsPerLesson = env.MAX_LESSON_CHARS ? Number(env.MAX_LESSON_CHARS) : undefined;
  const systemPrompt = buildSystemPrompt(course.title, lessons, { maxCharsPerLesson });
  const messages: ChatMessage[] = [
    { role: 'system', content: systemPrompt },
    ...history.map((m) => ({ role: m.role, content: m.content } as ChatMessage)),
    { role: 'user', content: query }
  ];

  const encoder = new TextEncoder();
  const stream = new ReadableStream({
    async start(controller) {
      let full = '';
      try {
        for await (const delta of llmStream(env, messages, { temperature: 0.4 })) {
          full += delta;
          controller.enqueue(encoder.encode(delta));
        }
      } catch (err) {
        const msg = err instanceof Error ? err.message : String(err);
        controller.enqueue(encoder.encode(`\n\n[error] ${msg}`));
      }

      // Extract inline citations. Only accept video_ids from lessons we loaded.
      const sources: Array<{ video_id: string; t: number }> = [];
      const seen = new Set<string>();
      for (const m of full.matchAll(CITATION_RE)) {
        const mm = parseInt(m[1], 10);
        const ss = parseInt(m[2], 10);
        const resolved = resolveVideoId(m[3], knownVideoIds);
        if (!resolved) continue;
        const t = mm * 60 + ss;
        const key = `${resolved}@${t}`;
        if (seen.has(key)) continue;
        seen.add(key);
        sources.push({ video_id: resolved, t });
      }

      const lessonMeta = lessons.map((l) => ({
        slug: l.slug,
        title: l.title,
        video_url: l.video_url,
        video_id: l.video_id
      }));

      controller.enqueue(
        encoder.encode(SOURCE_SENTINEL + JSON.stringify({ sources, lessons: lessonMeta }))
      );
      controller.close();

      // Fire-and-forget: unknown-question capture + usage metering.
      const unknown = full.match(UNKNOWN_RE);
      if (unknown) {
        supabase
          .from('feedback')
          .insert({
            course_id: course.id,
            question: unknown[1] ?? query,
            category: 'unknown',
            session_id: session_id ?? null
          })
          .then(() => {});
      }
      supabase
        .from('usage_events')
        .insert({
          course_id: course.id,
          kind: 'chat_request',
          provider: 'llm',
          input_tokens: null,
          output_tokens: null
        })
        .then(() => {});
    }
  });

  return new Response(stream, {
    headers: {
      ...cors,
      'content-type': 'text/plain; charset=utf-8',
      'cache-control': 'no-store'
    }
  });
};
