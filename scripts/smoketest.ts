// Local smoke test — no Supabase, no browser.
// Confirms: LLM endpoint reachable, router picks the right lesson,
// generation returns non-empty text. Requires:
//   - .env with LLM_BASE_URL, LLM_API_KEY, LLM_MODEL
//   - LM Studio (or any OpenAI-compatible endpoint) running with the model loaded
//   - data/index.json built (`pnpm run build-index`)
//
// Usage: pnpm run smoketest

import 'dotenv/config';
import { complete } from '../src/lib/server/llm.js';
import { selectLessons } from '../src/lib/server/router.js';
import { loadIndex } from '../src/lib/server/lessons.js';

const green = (s: string) => `\x1b[32m${s}\x1b[0m`;
const red = (s: string) => `\x1b[31m${s}\x1b[0m`;
const dim = (s: string) => `\x1b[2m${s}\x1b[0m`;

let failed = 0;

async function check(name: string, fn: () => Promise<void>) {
  try {
    await fn();
    console.log(`${green('✓')} ${name}`);
  } catch (e) {
    failed++;
    console.log(`${red('✗')} ${name}`);
    console.log(dim(`  ${e instanceof Error ? e.message : String(e)}`));
  }
}

async function main() {
  console.log('Running Tier A smoke tests (requires LM Studio or equivalent)\n');

  await check('LLM_BASE_URL and LLM_MODEL are set', async () => {
    if (!process.env.LLM_BASE_URL) throw new Error('LLM_BASE_URL missing');
    if (!process.env.LLM_MODEL) throw new Error('LLM_MODEL missing');
  });

  await check('LLM endpoint reachable and can list models', async () => {
    const base = process.env.LLM_BASE_URL!;
    const res = await fetch(`${base}/models`, {
      headers: { Authorization: `Bearer ${process.env.LLM_API_KEY ?? 'unused'}` }
    });
    if (!res.ok) throw new Error(`GET /models → ${res.status}`);
    const data = (await res.json()) as { data?: Array<{ id: string }> };
    const models = data.data?.map((m) => m.id) ?? [];
    if (models.length === 0) throw new Error('no models returned');
    if (!models.includes(process.env.LLM_MODEL!)) {
      console.log(dim(`  warn: LLM_MODEL "${process.env.LLM_MODEL}" not in loaded models: ${models.join(', ')}`));
    }
  });

  await check('data/index.json exists and has entries', async () => {
    const idx = await loadIndex();
    if (idx.length === 0) throw new Error('empty index — run `pnpm run build-index`');
    console.log(dim(`  ${idx.length} lessons in index`));
  });

  await check('Short generation returns non-empty text', async () => {
    const out = await complete(
      process.env,
      [{ role: 'user', content: 'Say the single word "ok" and nothing else.' }],
      { temperature: 0, max_tokens: 20 }
    );
    if (!out || out.trim().length === 0) throw new Error('empty completion');
    console.log(dim(`  received: ${JSON.stringify(out.trim().slice(0, 60))}`));
  });

  await check('Router picks a week-3 lesson for a for-loop question', async () => {
    const slugs = await selectLessons(process.env, 'What is a for loop?');
    console.log(dim(`  router → ${JSON.stringify(slugs)}`));
    if (slugs.length === 0) throw new Error('router returned no slugs');
    if (!slugs.some((s) => s.startsWith('week-3'))) {
      throw new Error(`no week-3 slug in ${JSON.stringify(slugs)}`);
    }
  });

  console.log(`\n${failed === 0 ? green('All checks passed.') : red(`${failed} check(s) failed.`)}`);
  process.exit(failed === 0 ? 0 : 1);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
