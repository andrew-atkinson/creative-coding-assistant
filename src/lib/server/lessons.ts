// Reads lesson content and the router index from the build.
//
// Design note: at request time we can't rely on files being on disk (Netlify
// Functions ship only the compiled bundle). So:
//   - `data/index.json` is imported statically — Vite bundles it as a JS
//     module. Node's ESM handles it too, so scripts (smoketest, seed) work.
//   - `.md` transcripts are pulled via `import.meta.glob(..., { query: '?raw' })`.
//     Vite bundles every match as a string at build time. This code path is
//     never called from Node scripts, only from the SvelteKit request handler.

import indexJson from '../../../data/index.json';

export type LessonIndexEntry = {
  slug: string;
  title: string;
  week: string;
  video_url: string;
  duration_seconds: number | null;
  summary: string;
  md_path: string;
  video_id: string;
};

export type LoadedLesson = LessonIndexEntry & {
  md_content: string;
};

const index = indexJson as LessonIndexEntry[];

// Vite bundles every .md file under data/transcripts/output/ as a raw string.
// The map's keys are project-root-absolute (e.g. "/data/transcripts/output/week 3/2 for loops.md").
// The try/catch keeps Node scripts (smoketest, seed) importable — they never
// need the transcript content, they just call loadIndex().
let mdModules: Record<string, string> = {};
try {
  mdModules = import.meta.glob<string>('/data/transcripts/output/**/*.md', {
    query: '?raw',
    import: 'default',
    eager: true
  });
} catch {
  // Non-Vite runtime (tsx). loadLessons() will return placeholder content;
  // that's fine because scripts don't call it.
}

export async function loadIndex(): Promise<LessonIndexEntry[]> {
  return index;
}

export async function loadLessons(slugs: string[]): Promise<LoadedLesson[]> {
  const bySlug = new Map(index.map((e) => [e.slug, e]));
  const out: LoadedLesson[] = [];
  for (const slug of slugs) {
    const entry = bySlug.get(slug);
    if (!entry) continue;
    // md_path is repo-relative ("data/..."); glob keys are root-absolute ("/data/...").
    const key = '/' + entry.md_path;
    const md_content = mdModules[key];
    out.push({
      ...entry,
      md_content: md_content ?? `(no transcript available for ${entry.title})`
    });
  }
  return out;
}
