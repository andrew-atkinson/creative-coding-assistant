import { error } from '@sveltejs/kit';
import { env } from '$env/dynamic/private';
import { getStorage } from '$lib/server/storage';
import { loadIndex } from '$lib/server/lessons';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ params }) => {
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
    url: e.video_url,
    duration_seconds: e.duration_seconds,
    week: e.week
  }));

  return {
    course: {
      slug: course.slug,
      title: course.title,
      theme_color: course.theme_color
    },
    videos
  };
};
