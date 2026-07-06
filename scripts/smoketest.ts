// Local smoke test — no Supabase, no browser.
// Confirms: LLM endpoint reachable, router picks the right lesson,
// generation returns non-empty text. Requires:
//   - .env with LLM_BASE_URL, LLM_API_KEY, LLM_MODEL
//   - LM Studio (or any OpenAI-compatible endpoint) running with the model loaded
//   - data/index.json built (`pnpm run build-index`)
//
// Usage: pnpm run smoketest
//
// Note on first-run timing: loading a large model (e.g. Gemma 26B in LM Studio)
// takes 30-90 seconds on the first chat completion. This script prints
// per-second elapsed time during LLM calls and gives up cleanly at
// LLM_TIMEOUT_MS (default 3 minutes) instead of hanging forever.

import 'dotenv/config';
import { complete } from '../src/lib/server/llm.js';
import { selectLessons } from '../src/lib/server/router.js';
import { loadIndex } from '../src/lib/server/lessons.js';

const green = (s: string) => `\x1b[32m${s}\x1b[0m`;
const red = (s: string) => `\x1b[31m${s}\x1b[0m`;
const dim = (s: string) => `\x1b[2m${s}\x1b[0m`;
const yellow = (s: string) => `\x1b[33m${s}\x1b[0m`;

const LLM_TIMEOUT_MS = Number(process.env.LLM_TIMEOUT_MS ?? 180_000);

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

// Runs an async task with a visible per-second elapsed counter on stderr,
// and enforces a hard timeout. Returns the task's resolved value, or throws.
async function withProgress<T>(label: string, work: Promise<T>): Promise<T> {
  const started = Date.now();
  process.stderr.write(dim(`  ${label}… `));
  const ticker = setInterval(() => {
    const secs = Math.floor((Date.now() - started) / 1000);
    process.stderr.write(dim(`${secs}s `));
  }, 1000);
  const timeout = new Promise<never>((_, reject) => {
    setTimeout(
      () => reject(new Error(`timed out after ${Math.round(LLM_TIMEOUT_MS / 1000)}s`)),
      LLM_TIMEOUT_MS
    );
  });
  try {
    const value = await Promise.race([work, timeout]);
    const secs = ((Date.now() - started) / 1000).toFixed(1);
    process.stderr.write(dim(`(${secs}s)\n`));
    return value;
  } catch (e) {
    process.stderr.write(dim(`(failed)\n`));
    throw e;
  } finally {
    clearInterval(ticker);
  }
}

async function main() {
  console.log('Running Tier A smoke tests');
  console.log(
    dim(
      `LLM: ${process.env.LLM_BASE_URL ?? '(unset)'}  model: ${process.env.LLM_MODEL ?? '(unset)'}\n`
    )
  );
  console.log(
    yellow(
      `Note: first LLM call after loading a large local model can take 30-90s.\n` +
        `      Per-second elapsed time is printed while calls are in flight.\n`
    )
  );

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
      console.log(
        dim(
          `  warn: LLM_MODEL "${process.env.LLM_MODEL}" not in loaded models: ${models.join(', ')}`
        )
      );
    }
  });

  await check('data/index.json exists and has entries', async () => {
    const idx = await loadIndex();
    if (idx.length === 0) throw new Error('empty index — run `pnpm run build-index`');
    console.log(dim(`  ${idx.length} lessons in index`));
  });

  await check('Short generation returns non-empty text', async () => {
    const out = await withProgress(
      'generating',
      complete(
        process.env,
        [{ role: 'user', content: 'Say the single word "ok" and nothing else.' }],
        { temperature: 0, max_tokens: 20 }
      )
    );
    if (!out || out.trim().length === 0) throw new Error('empty completion');
    console.log(dim(`  received: ${JSON.stringify(out.trim().slice(0, 60))}`));
  });

  await check('Router picks a week-3 lesson for a for-loop question', async () => {
    const slugs = await withProgress(
      'routing',
      selectLessons(process.env, 'What is a for loop?')
    );
    console.log(dim(`  router → ${JSON.stringify(slugs)}`));
    if (slugs.length === 0) throw new Error('router returned no slugs');
    if (!slugs.some((s) => s.startsWith('week-3'))) {
      throw new Error(`no week-3 slug in ${JSON.stringify(slugs)}`);
    }
  });

  console.log(
    `\n${failed === 0 ? green('All checks passed.') : red(`${failed} check(s) failed.`)}`
  );
  process.exit(failed === 0 ? 0 : 1);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
