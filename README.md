# TutorGen (chatbotGA)

A TA/GA style AI tutor for my Creative Coding course. Students see the lesson video and a chat side-by-side. The tutor is grounded in the transcripts of the class recordings: it identifies which lesson(s) are relevant to a question, loads their full transcripts as context, answers in a TA voice (guides students toward solutions rather than handing them over), and cites specific video moments that seek the player when clicked. When it genuinely doesn't know, it logs the question to a `feedback` table for the instructor to review.

Currently at **M1 — proof-of-concept**. Single-course, single-tenant, local-first. See [docs/handoff-v1.md](docs/handoff-v1.md) for the earlier design spec (superseded on 2026-07-04; see [BACKLOG.md](BACKLOG.md) for the current direction and open items).

## Architecture

- **Frontend + backend:** SvelteKit 2 (Svelte 5) with the Netlify adapter, styled with Tailwind v4.
- **Database:** Supabase (Postgres) for course/video metadata, usage metering, and unknown-question feedback. Local via Docker for M1; hosted for deploy.
- **LLM:** any OpenAI-compatible endpoint. Local dev uses [LM Studio](https://lmstudio.ai/) at `http://localhost:1234/v1` with a quantized Gemma 3 26B model. Deploy swaps `LLM_BASE_URL` to Groq / OpenRouter / etc. — same code, different config.
- **Retrieval:** no vector search. A small router LLM call selects the relevant lesson(s) from an index; the answering call gets the _full_ transcript `.md` for each selected lesson in its system prompt. Cross-lesson questions naturally load multiple `.md`s at once.
- **Transcripts:** consumed as `.rich.json` metadata + `.md` content from `data/transcripts/{rich,output}/**/`. Produced by the sibling [video_transcription](https://github.com/andrew-atkinson/video_transcription) project.
- **Video hosting:** provider-agnostic. `videos.url` is any HTTPS URL. Andrew's videos live on Bunny CDN; the code doesn't care.

Per-turn flow: `question → router → slugs → load .md files → persona system prompt → stream answer with inline [MM:SS video_id] citations → post-process into source chips and, if the response contains [[UNKNOWN]], a feedback row`.

## Prerequisites

- Node 22+ and pnpm 10+ (`brew install node pnpm`)
- Docker Desktop, for local Supabase
- Supabase CLI (`brew install supabase/tap/supabase`)
- [LM Studio](https://lmstudio.ai/) with a chat-capable model loaded (Andrew's default: `unsloth-gemma-4-26b-a4b-it-qat-oq4`). Or any other OpenAI-compatible endpoint.
- Transcripts at `data/transcripts/rich/**/*.rich.json` and `data/transcripts/output/**/*.md` in the shape produced by the transcription project.

## Local setup

```bash
# 1. Install deps.
pnpm install

# 2. Start Supabase (Postgres + PostgREST + Studio) via Docker.
supabase start

# 3. Grab local credentials.
supabase status

# 4. Start LM Studio (or any OpenAI-compatible LLM) and load your model.
#    Make sure the server is listening on port 1234.
```

Copy `.env.example` to `.env` and fill in:

- `SUPABASE_URL` and `PUBLIC_SUPABASE_URL` → `http://127.0.0.1:54321`
- `SUPABASE_SERVICE_ROLE_KEY` → the `Secret` value from `supabase status`
- `PUBLIC_SUPABASE_ANON_KEY` → the `Publishable` value from `supabase status`
- `LLM_BASE_URL` → `http://localhost:1234/v1` (LM Studio default)
- `LLM_API_KEY` → any string (LM Studio ignores it; `lmstudio` is fine)
- `LLM_MODEL` → the exact model id shown in LM Studio, e.g. `unsloth-gemma-4-26b-a4b-it-qat-oq4`
- `LLM_ROUTER_MODEL` → leave empty; falls back to `LLM_MODEL`. Override with a smaller model if the router pass feels slow.
- `ADMIN_SECRET` → any random string (unused by the M1 UI, reserved for future admin endpoints)
- `PUBLIC_RUNTIME_ORIGIN` → `http://localhost:5173`

Migrations (`supabase/migrations/0001_init.sql`, `0002_pivot.sql`) apply automatically on `supabase start`. Studio at [http://127.0.0.1:54323](http://127.0.0.1:54323) if you want to see tables.

## Loading data

Two commands, in order:

```bash
# Insert the course row (idempotent).
pnpm run seed

# Walk data/transcripts/rich/**/*.rich.json and write data/index.json —
# the router's world (slug, title, week, video_url, duration, summary, md_path).
# Videos are also upserted into Supabase from this same metadata.
pnpm run build-index
```

Re-run `pnpm run build-index` whenever transcripts change. It's fast (no embedding, no LLM calls; just filesystem + JSON).

## Running locally

```bash
pnpm dev
```

Then open [http://localhost:5173/c/creative-coding-101](http://localhost:5173/c/creative-coding-101).

Ask a question. The response streams in with inline `[MM:SS video_id]` citations rendered as clickable chips. Clicking a chip switches the video player to that lesson (if needed) and seeks. The `Cinema mode` toggle expands the video and floats the chat as a corner overlay.

## CLI reference

| Command                | What it does                                                                                                                                                                                    |
| ---------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `pnpm dev`             | Start the SvelteKit dev server on `:5173`.                                                                                                                                                      |
| `pnpm run build`       | Production build via the Netlify adapter. Output in `build/`.                                                                                                                                   |
| `pnpm run preview`     | Preview the production build locally.                                                                                                                                                           |
| `pnpm run check`       | `svelte-check` — TypeScript + Svelte type checks.                                                                                                                                               |
| `pnpm run seed`        | Insert/upsert the user + course row from `data/course.json`.                                                                                                                                    |
| `pnpm run build-index` | Walk transcripts, write `data/index.json` (the router's index). Also (TODO) upsert `videos` rows in Supabase. Idempotent.                                                                       |
| `pnpm run smoketest`   | Verifies: LLM endpoint reachable, models listed, short generation, `data/index.json` present, router picks a week-3 lesson for a for-loop question. Requires LM Studio (or equivalent) running. |
| `supabase start`       | Bring up local Postgres + PostgREST + Studio.                                                                                                                                                   |
| `supabase stop`        | Stop the local stack.                                                                                                                                                                           |
| `supabase status`      | Print URLs and keys for the running stack.                                                                                                                                                      |
| `supabase db reset`    | Drop and re-create the local database, re-applying every migration. Re-run `pnpm run seed && pnpm run build-index` afterwards.                                                                  |

## Deployment

Deploy is not part of M1 acceptance. Sketch of the path:

### 1. Hosted LLM

Swap `LLM_BASE_URL` to a hosted OpenAI-compatible provider. Two known-good candidates:

- **Groq** (recommended, free tier is generous) — `LLM_BASE_URL=https://api.groq.com/openai/v1`, `LLM_API_KEY=gsk_...`, `LLM_MODEL=llama-3.3-70b-versatile`.
- **OpenRouter** — supports many models, some free.

No code change. Same `openai` client library.

### 2. Hosted Supabase

- Create a project at [supabase.com](https://supabase.com) (free tier).
- SQL editor → run `supabase/migrations/0001_init.sql`, then `0002_pivot.sql`.
- Grab `Project URL`, `service_role` (or `sb_secret_...`) key, and `anon` (or `sb_publishable_...`) key. These become the Supabase env vars in Netlify.
- Run `pnpm run seed && pnpm run build-index` with the hosted URL/key set in your shell to populate.

### 3. Netlify site

- Push this repo to GitHub. (Currently `.gitignore` excludes `src/`, `docs/`, `data/` and more — unblock before push.)
- Netlify: **Add new site → Import from Git**.
- Set every env var from `.env.example`. `PUBLIC_RUNTIME_ORIGIN` should be your public URL.
- **`.md` transcripts must be reachable.** The current `lessons.ts` reads them from `data/transcripts/output/**/*.md` on disk. For deploy, either (a) commit those files (they're small), or (b) upload to Supabase Storage and update `lessons.ts` to fetch. Punt to P3 — see [BACKLOG.md](BACKLOG.md).

### 4. Custom domain

Add `teaching.andrewatkinson.net` as a domain alias in Netlify — SSL provisions automatically.

## Troubleshooting

- **Chat returns quickly with no text.** LM Studio isn't running, or the model in `LLM_MODEL` isn't loaded. Check `pnpm run smoketest` — it will name the specific failure. Also verify the exact model id at `http://localhost:1234/v1/models`.
- **Router picks nonsense slugs / no slugs.** The LLM output couldn't be parsed as JSON. Router falls back to keyword overlap, which is safe but coarse. If this happens consistently, either the model is too small for the routing task or the prompt is being cut off — try `LLM_ROUTER_MODEL=<a-more-capable-model>` or increase `max_tokens` in `router.ts`.
- **Answer contains `[[UNKNOWN]]` even when the content clearly is in the transcripts.** The router likely selected the wrong lessons. Check the server logs — the endpoint prints selected slugs. If routing was wrong, refine that lesson's `summary` in `.rich.json` metadata and re-run `pnpm run build-index`.
- **Answer contains raw `[MM:SS video_id]` text but no clickable chip.** Either the `video_id` in the model output doesn't match any loaded lesson, or the regex in `Chat.svelte` didn't match. The endpoint only echoes citations whose `video_id` is in the loaded set — if the model hallucinated a video_id, it gets dropped from the sources footer.
- **`permission denied for table users` during seed.** The service_role wasn't granted table privileges. Fixed in the migration; `supabase db reset` reapplies.
- **`Docker unknown reference` when running `supabase start`.** Usually a stale Supabase CLI. `brew upgrade supabase` and retry.
- **`.md` files not found for a lesson.** `pnpm run build-index` writes the expected `md_path` based on the `.rich.json` location. If the transcriber's output layout differs, adjust the derivation in `scripts/build-index.ts`.

## Repository layout

```
src/
  routes/
    +page.svelte                landing page
    c/[slug]/                   the Runtime UI (student-facing)
    api/chat/+server.ts         chat endpoint (router + persona + stream)
  lib/
    server/
      llm.ts                    OpenAI-compatible chat client (complete + stream)
      router.ts                 lesson selector (LLM + keyword fallback)
      lessons.ts                index loader + .md content loader
      persona.ts                GA system prompt builder
      supabase.ts               service-role client
    components/
      Chat.svelte               chat panel (dynamically imported)
      SourceChip.svelte         clickable timestamp chip
    refusal.ts                  shared refusal string (client + server)

scripts/
  seed.ts                       insert user + course from data/course.json
  build-index.ts                walk transcripts, write data/index.json
  smoketest.ts                  local checks (LLM reachable, router works, index present)

supabase/
  migrations/
    0001_init.sql               schema + service_role grants
    0002_pivot.sql              drop chunks/pgvector, add feedback table

data/
  course.json                   course-level seed input
  index.json                    generated router index (built by build-index)
  transcripts/rich/**/          .rich.json metadata
  transcripts/output/**/        .md content

docs/
  handoff-v1.md                 earlier design spec (superseded 2026-07-04)
```

## Contract with the transcriber

The chatbot expects, per lesson:

- `data/transcripts/rich/<week>/<lesson>.rich.json` — provides `metadata.video_title`, `metadata.source_url`, `metadata.duration_seconds`, `metadata.week`, `metadata.topic` (used as the router summary). The `semantic_chunks[]` array is ignored in the current architecture (was used by the deprecated RAG pipeline).
- `data/transcripts/output/<week>/<lesson>.md` — the polished transcript, embedded verbatim into the answering LLM's system prompt.

The two paths must line up: same week folder, same lesson basename minus extension. `scripts/build-index.ts` enforces this mapping.
