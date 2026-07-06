// Given a student question, return the relevant lesson slugs.
// Two paths:
//   1) Router LLM (LLM_ROUTER_MODEL if set, else LLM_MODEL) returns a JSON
//      array of slugs.
//   2) Fallback: keyword overlap between the question tokens and each
//      lesson's title + summary. Used when the LLM output can't be parsed
//      or produces zero slugs.

import { complete } from './llm';
import { loadIndex, type LessonIndexEntry } from './lessons';

const MAX_LESSONS = 4;

function tokens(s: string): Set<string> {
  return new Set(
    s
      .toLowerCase()
      .replace(/[^a-z0-9\s]/g, ' ')
      .split(/\s+/)
      .filter((w) => w.length > 3)
  );
}

function keywordFallback(question: string, index: LessonIndexEntry[], k: number): string[] {
  const qTokens = tokens(question);
  if (qTokens.size === 0) return index.slice(0, k).map((e) => e.slug);
  const scored = index.map((e) => {
    const t = tokens(`${e.title} ${e.summary}`);
    let overlap = 0;
    for (const w of qTokens) if (t.has(w)) overlap++;
    return { slug: e.slug, score: overlap };
  });
  scored.sort((a, b) => b.score - a.score);
  return scored.slice(0, k).map((s) => s.slug);
}

function tryParseSlugs(raw: string, valid: Set<string>): string[] {
  // Local models sometimes wrap JSON in prose or code fences.
  const match = raw.match(/\[[\s\S]*\]/);
  const text = match ? match[0] : raw;
  try {
    const parsed = JSON.parse(text);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter((s): s is string => typeof s === 'string' && valid.has(s));
  } catch {
    return [];
  }
}

export async function selectLessons(
  env: Record<string, string | undefined>,
  question: string
): Promise<string[]> {
  const index = await loadIndex();
  if (index.length === 0) return [];

  const validSlugs = new Set(index.map((e) => e.slug));
  const lessonList = index.map((e) => `- ${e.slug}: ${e.summary}`).join('\n');

  const prompt =
    `You are a lesson router. Given a student's question and a list of course lessons, ` +
    `return a JSON array of the lesson slugs relevant to answering the question. ` +
    `Return ONLY the array — no other text, no explanation, no code fences.\n\n` +
    `If multiple lessons are relevant (e.g. the student is working on a later topic ` +
    `but needs a refresher on an earlier one), include all of them. ` +
    `Return at most ${MAX_LESSONS} slugs, most relevant first.\n\n` +
    `Lessons:\n${lessonList}\n\n` +
    `Question: ${question}\n\n` +
    `Response:`;

  let slugs: string[] = [];
  try {
    const raw = await complete(
      env,
      [{ role: 'user', content: prompt }],
      { model: env.LLM_ROUTER_MODEL || env.LLM_MODEL, temperature: 0, max_tokens: 200 }
    );
    slugs = tryParseSlugs(raw, validSlugs).slice(0, MAX_LESSONS);
  } catch {
    slugs = [];
  }

  if (slugs.length === 0) {
    slugs = keywordFallback(question, index, 3);
  }

  return slugs;
}
