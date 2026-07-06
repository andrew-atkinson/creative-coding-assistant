import { error } from '@sveltejs/kit';
import { env } from '$env/dynamic/private';
import { getServerSupabase } from '$lib/server/supabase';
import { loadIndex } from '$lib/server/lessons';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ params }) => {
  const supabase = getServerSupabase(env);

  const { data: course, error: cErr } = await supabase
    .from('courses')
    .select('id, slug, title, theme_color, status')
    .eq('slug', params.slug)
    .single();
  if (cErr || !course || course.status !== 'published') {
    throw error(404, 'Course not found');
  }

  // Videos come from the transcripts index, not Supabase — no separate videos
  // upsert step required. Post-pivot the videos table exists but is unused.
  const index = await loadIndex().catch(() => []);
  const videos = index.map((e, i) => ({
    id: e.video_id,
    ordinal: i + 1,
    title: e.title,
    url: e.video_url,
    duration_seconds: e.duration_seconds
  }));

  return {
    course: {
      slug: course.slug,
      title: course.title,
      theme_color: course.theme_color as string | null
    },
    videos
  };
};
