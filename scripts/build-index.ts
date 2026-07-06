// Builds data/index.json — the router's world. One entry per lesson, sourced
// from the transcriber's .rich.json metadata. The .md path is derived by
// swapping the "rich" subdir for "output".
//
// Run: pnpm run build-index

import 'dotenv/config';
import { readFile, readdir, stat, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { dirname, resolve, relative, sep, basename } from 'node:path';

type IndexEntry = {
  slug: string;
  title: string;
  week: string;
  video_url: string;
  duration_seconds: number | null;
  summary: string;
  md_path: string;
  video_id: string;
};

async function collect(root: string): Promise<string[]> {
  const info = await stat(root).catch(() => null);
  if (!info) return [];
  if (info.isFile()) return root.endsWith('.rich.json') ? [root] : [];
  const out: string[] = [];
  const entries = await readdir(root, { withFileTypes: true });
  for (const e of entries) {
    const full = resolve(root, e.name);
    if (e.isDirectory()) out.push(...(await collect(full)));
    else if (e.isFile() && e.name.endsWith('.rich.json')) out.push(full);
  }
  return out;
}

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

async function main() {
  const here = dirname(fileURLToPath(import.meta.url));
  const repoRoot = resolve(here, '..');
  const richRoot = resolve(repoRoot, 'data/transcripts/rich');
  const outputRoot = resolve(repoRoot, 'data/transcripts/output');
  const files = await collect(richRoot);
  if (files.length === 0) {
    console.error(`no .rich.json files under ${richRoot}`);
    process.exit(1);
  }

  const entries: IndexEntry[] = [];
  for (const file of files) {
    const raw = await readFile(file, 'utf8');
    let rich: {
      metadata: {
        video_title?: string;
        source_url?: string;
        duration_seconds?: number;
        week?: string;
        topic?: string;
      };
    };
    try {
      rich = JSON.parse(raw);
    } catch {
      console.warn(`skip ${file} — invalid JSON`);
      continue;
    }

    const rel = relative(richRoot, file);
    const parts = rel.split(sep);
    const weekFolder = parts[0] ?? '';
    const filename = basename(file, '.rich.json');

    const slug = `${slugify(weekFolder)}/${slugify(filename)}`;
    const video_id = slug.replace('/', '-');
    const mdCandidate = resolve(outputRoot, weekFolder, `${filename}.md`);
    const md_path = relative(repoRoot, mdCandidate);

    entries.push({
      slug,
      title: rich.metadata.video_title ?? filename,
      week: rich.metadata.week ?? weekFolder,
      video_url: rich.metadata.source_url ?? '',
      duration_seconds: rich.metadata.duration_seconds ?? null,
      summary: rich.metadata.topic ?? '',
      md_path,
      video_id
    });
  }

  entries.sort((a, b) => a.slug.localeCompare(b.slug));
  const outPath = resolve(repoRoot, 'data/index.json');
  await writeFile(outPath, JSON.stringify(entries, null, 2));
  console.log(`wrote ${entries.length} lesson entries to data/index.json`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
