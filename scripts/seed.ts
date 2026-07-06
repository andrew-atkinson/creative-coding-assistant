// Seed the M1 course. Reads data/course.json and inserts one user, one course,
// and its videos. Idempotent on (owner email, course slug, video ordinal).
//
// Usage: pnpm run seed

import 'dotenv/config';
import { readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';
import { getServerSupabase } from '../src/lib/server/supabase.js';

type CourseSeed = {
  owner: { email: string; display_name?: string };
  course: {
    slug: string;
    title: string;
    theme_color?: string;
    status?: 'draft' | 'published';
    llm_provider?: 'gemini' | 'huggingface' | 'groq';
    llm_model_id?: string;
    temperature?: number;
    system_prompt?: string | null;
  };
  videos: Array<{
    ordinal: number;
    title: string;
    url: string;
    duration_seconds?: number;
  }>;
};

async function main() {
  const here = dirname(fileURLToPath(import.meta.url));
  const seedPath = resolve(here, '..', 'data', 'course.json');
  const raw = await readFile(seedPath, 'utf8');
  const seed: CourseSeed = JSON.parse(raw);

  const supabase = getServerSupabase(process.env);

  // Upsert user by email.
  const { data: user, error: uErr } = await supabase
    .from('users')
    .upsert({ email: seed.owner.email, display_name: seed.owner.display_name }, { onConflict: 'email' })
    .select('id')
    .single();
  if (uErr || !user) throw uErr ?? new Error('user upsert failed');

  // Upsert course by slug.
  const { data: course, error: cErr } = await supabase
    .from('courses')
    .upsert(
      {
        owner_id: user.id,
        slug: seed.course.slug,
        title: seed.course.title,
        theme_color: seed.course.theme_color ?? null,
        status: seed.course.status ?? 'draft',
        llm_provider: seed.course.llm_provider ?? 'gemini',
        llm_model_id: seed.course.llm_model_id ?? 'gemini-2.5-flash',
        temperature: seed.course.temperature ?? 0.2,
        system_prompt: seed.course.system_prompt ?? null
      },
      { onConflict: 'slug' }
    )
    .select('id')
    .single();
  if (cErr || !course) throw cErr ?? new Error('course upsert failed');

  // Upsert videos by (course_id, ordinal).
  for (const v of seed.videos) {
    const { error: vErr } = await supabase
      .from('videos')
      .upsert(
        {
          course_id: course.id,
          ordinal: v.ordinal,
          title: v.title,
          url: v.url,
          duration_seconds: v.duration_seconds ?? null
        },
        { onConflict: 'course_id,ordinal' }
      );
    if (vErr) throw vErr;
  }

  console.log(`Seeded course "${seed.course.title}" (${seed.videos.length} videos).`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
