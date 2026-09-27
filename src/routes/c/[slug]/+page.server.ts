import { error } from '@sveltejs/kit';
import { env } from '$env/dynamic/private';
import { getStorage } from '$lib/server/storage';
import { loadIndex } from '$lib/server/lessons';
import { THEMES, DEFAULT_THEME } from '$lib/themes';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ params, url }) => {
  const store = getStorage(env);

  const course = await store.loadCourse(params.slug);
  if (!course || course.status !== 'published') {
    throw error(404, 'Course not found');
  }

  // Videos come from the transcripts index, not the storage backend — the
  // storage layer only owns course metadata + feedback + usage.
  const index = await loadIndex().catch(() => []);
  const videos = index.map((e, i) => ({
    id: e.video_id,
    ordinal: i + 1,
    title: e.title,
    summary: e.summary,
    url: e.video_url,
    duration_seconds: e.duration_seconds,
    week: e.week
  }));

  // ?theme= / ?field= override the course's choice, for previewing combinations.
  const theme = url.searchParams.get('theme') ?? course.theme;

  return {
    course: {
      slug: course.slug,
      title: course.title,
      theme_color: course.theme_color
    },
    videos,
    theme: theme && THEMES.includes(theme) ? theme : DEFAULT_THEME,
    field: url.searchParams.get('field') ?? course.field ?? null
  };
};
