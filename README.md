# TutorGen (chatbotGA)

A TA/GA style AI tutor for my Creative Coding course. Students see the lesson video and a chat side-by-side. The tutor is grounded in the transcripts of the class recordings: it identifies which lesson(s) are relevant to a question, loads their full transcripts as context, answers in a TA voice (guides students toward solutions rather than handing them over), and cites specific video moments that seek the player when clicked. When it genuinely doesn't know, it logs the question to a `feedback` table for the instructor to review.

Currently at **M1 — proof-of-concept**, deployed to Netlify. Single-course, single-tenant. See [docs/handoff-v1.md](docs/handoff-v1.md) for the earlier design spec (superseded 2026-07-04) and [BACKLOG.md](BACKLOG.md) for the current backlog.

## Architecture

- **Frontend + backend:** SvelteKit 2 (Svelte 5) with the Netlify adapter, styled with Tailwind v4.
- **Database:** Supabase (Postgres) for course metadata, usage metering, and unknown-question feedback. Local via Docker for dev; hosted Supabase for deploy.
- **LLM:** any OpenAI-compatible endpoint. Local dev: [LM Studio](https://lmstudio.ai/) at `http://localhost:1234/v1` with a quantized Gemma 3 26B model. Deploy: Groq's free tier (Llama 3.3 70B). Swap providers by changing env vars — same code, different config.
- **Retrieval:** no vector search. A small router LLM call selects the relevant lesson(s) from `data/index.json`; the answering call gets the _full_ transcript `.md` for each selected lesson in its system prompt. Cross-lesson questions naturally load multiple `.md`s at once.
- **Transcripts:** consumed as `.rich.json` metadata (routing summaries) + `.md` content (LLM context) from `data/transcripts/{rich,output}/**/`. Produced by the sibling [video_transcription](https://github.com/andrew-atkinson/video_transcription) project. Bundled into the SvelteKit build via `import.meta.glob`, so the deployed function has them without a separate upload step.
- **Video hosting:** provider-agnostic. `video_url` is any HTTPS URL. My videos live on Bunny CDN; the code doesn't care.

Per-turn flow: `question → router → slugs → load .md files → persona system prompt → stream answer with inline [MM:SS video_id] citations → post-process into source chips and, if the response contains [[UNKNOWN]], a feedback row`.

## Prerequisites

- Node 22+ and pnpm 10+ (`brew install node pnpm`)
- Docker Desktop (for local Supabase only)
- Supabase CLI (`brew install supabase/tap/supabase`; for local dev only)
- [LM Studio](https://lmstudio.ai/) with a chat-capable model loaded (my default: `unsloth-gemma-4-26b-a4b-it-qat-oq4`), or any OpenAI-compatible endpoint.
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
#    Server should be listening on http://localhost:1234.
```

Copy `.env.example` to `.env` and fill in:

- `SUPABASE_URL` and `PUBLIC_SUPABASE_URL` → `http://127.0.0.1:54321`
- `SUPABASE_SERVICE_ROLE_KEY` → the `Secret` value from `supabase status`
- `PUBLIC_SUPABASE_ANON_KEY` → the `Publishable` value from `supabase status`
- `LLM_BASE_URL` → `http://localhost:1234/v1` (LM Studio default)
- `LLM_API_KEY` → any string (LM Studio ignores it; `lmstudio` is fine)
- `LLM_MODEL` → the exact model id shown in LM Studio, e.g. `unsloth-gemma-4-26b-a4b-it-qat-oq4`
- `LLM_ROUTER_MODEL` → leave empty; falls back to `LLM_MODEL`. Override with a smaller model if the router pass feels slow.
- `MAX_LESSONS_PER_TURN`, `MAX_LESSON_CHARS` → leave empty (defaults suit local LM Studio). See [Context budget](#context-budget) below.
- `ADMIN_SECRET` → any random string (unused by the M1 UI, reserved for future admin endpoints)
- `PUBLIC_RUNTIME_ORIGIN` → `http://localhost:5173`

Migrations (`supabase/migrations/0001_init.sql`, `0002_pivot.sql`) apply automatically on `supabase start`. Studio at [http://127.0.0.1:54323](http://127.0.0.1:54323) if you want to see tables.

## Loading data

Two commands, in order:

```bash
# Insert the user + course row (idempotent).
pnpm run seed

# Walk data/transcripts/rich/**/*.rich.json and write data/index.json —
# the router's index (slug, title, week, video_url, duration, summary, md_path).
pnpm run build-index
```

Re-run `pnpm run build-index` whenever transcripts change. It's fast (no embedding, no LLM calls; just filesystem + JSON).

## Running locally

```bash
pnpm dev
```

Then open [http://localhost:5173/c/creative-coding-101](http://localhost:5173/c/creative-coding-101).

Ask a question. The response streams in with inline `[MM:SS video_id]` citations rendered as clickable chips. Clicking a chip switches the video player to that lesson (if needed) and seeks. On desktop, the `Cinema mode` toggle expands the video and floats the chat as a corner overlay. On narrow widths, use the hamburger to browse lessons; the fullscreen ⛶ button opens the video natively.

## Testing locally against hosted (before deploy)

Once you've set up hosted Supabase + Groq (see [Deploy](#deployment)), you can point your local dev server at hosted infrastructure without touching Netlify. Put hosted creds in `.env.hosted` (git-ignored template lives in the repo), then:

```bash
set -a; source .env.hosted; set +a
pnpm run seed          # seed hosted Supabase, once
pnpm dev               # local UI, hosted backend
```

Same URL (localhost:5173), hosted DB + hosted LLM behind it. Useful for catching deploy-specific issues (rate limits, model quirks) without a Netlify build round-trip.

## CLI reference

| Command | What it does |
| --- | --- |
| `pnpm dev`             | Start the SvelteKit dev server on `:5173`. |
| `pnpm run build`       | Production build via the Netlify adapter. Output in `build/`. Bundles all `.md` transcripts into the server chunks. |
| `pnpm run preview`     | Preview the production build locally. |
| `pnpm run check`       | `svelte-check` — TypeScript + Svelte type checks. |
| `pnpm run seed`        | Insert/upsert the user + course row from `data/course.json` into whichever Supabase your env vars point at. |
| `pnpm run build-index` | Walk transcripts, write `data/index.json` (the router's index). Idempotent. |
| `pnpm run smoketest`   | Verifies: LLM endpoint reachable, models listed, short generation, `data/index.json` present, router picks a week-3 lesson for a for-loop question. Requires LM Studio (or equivalent) running. Per-second elapsed counter during LLM calls; 3-min timeout per call (`LLM_TIMEOUT_MS` to override). |
| `supabase start`       | Bring up local Postgres + PostgREST + Studio. |
| `supabase stop`        | Stop the local stack. |
| `supabase status`      | Print URLs and keys for the running stack. |
| `supabase db reset`    | Drop and re-create the local DB, re-applying every migration. Re-run `pnpm run seed && pnpm run build-index` after. |

## Context budget

Two env knobs cap per-request context size to stay under free-tier LLM per-request token caps:

| Var | Default | Purpose |
| --- | --- | --- |
| `MAX_LESSONS_PER_TURN` | `2` | Max lessons the router will select for one turn. |
| `MAX_LESSON_CHARS` | `8000` | Per-lesson truncation of `.md` content (`[... transcript truncated for length ...]` appended when hit). |

With defaults: 2 × 8000 = 16k chars ≈ 4k tokens for the corpus, + persona overhead ~800 tokens = ~5k tokens per request. Well under Groq's free-tier 12k-tokens-per-request cap on `llama-3.3-70b-versatile`.

Local LM Studio has no per-request cap; you can leave both blank or bump them for richer cross-lesson answers.

## Deployment

Deployed to Netlify against hosted Supabase + Groq's free tier. Rough recipe if you're setting up your own:

### 1. Hosted LLM

Groq's free tier is generous and fast:

- `LLM_BASE_URL=https://api.groq.com/openai/v1`
- `LLM_API_KEY=gsk_...` (from [console.groq.com](https://console.groq.com))
- `LLM_MODEL=llama-3.3-70b-versatile`
- `LLM_ROUTER_MODEL=llama-3.1-8b-instant` (smaller, faster, plenty smart enough for routing)

Alternatives that also work with the same `openai` client: OpenRouter, Cerebras, hosted Gemini via a proxy.

### 2. Hosted Supabase

- Create a project at [supabase.com](https://supabase.com) (free tier).
- SQL editor → run `supabase/migrations/0001_init.sql`, then `0002_pivot.sql`.
- Grab `Project URL`, `service_role` (or `sb_secret_...`) key, and `anon` (or `sb_publishable_...`) key.
- With env vars pointed at the hosted DB, run `pnpm run seed` from your machine to insert the course row.

### 3. Netlify site

- Push this repo to GitHub.
- Netlify → **Add new site → Import from Git** → pick the repo.
- `netlify.toml` already sets the right build command (`pnpm run build-index && pnpm run build`) and publish dir (`build`).
- Under **Site settings → Environment variables**, add every var from `.env.example` with the hosted values. `PUBLIC_RUNTIME_ORIGIN` should be your site URL — initially the assigned `<name>.netlify.app`, later your custom domain. Any time you change this var you need to trigger a redeploy so the new value is baked into the client bundle.
- First deploy. Watch the log: `build-index` writes the index, then Vite builds. `chunks/lessons.js` should be ~500 kB — that's the bundled `.md` content.

### 4. Custom domain

- Netlify → **Domain management** → add your custom domain (e.g. `teaching.andrewatkinson.net`) as an alias.
- If the root domain (`andrewatkinson.net`) isn't on Netlify DNS, Netlify asks you to add a TXT `subdomain-owner-verification` record at your DNS provider. Do that, wait for propagation (`dig TXT subdomain-owner-verification.<root> +short`), retry.
- Add a CNAME at your DNS provider: `teaching CNAME <your-site>.netlify.app`.
- Netlify auto-provisions Let's Encrypt SSL once the CNAME resolves. Takes 1-3 min.
- Update `PUBLIC_RUNTIME_ORIGIN` to `https://<custom-domain>` and trigger a redeploy.

## Troubleshooting

**Local / dev**

- **Chat returns quickly with no text.** LM Studio isn't running, or the model in `LLM_MODEL` isn't loaded. Check `pnpm run smoketest` — it names the specific failure. Verify the exact model id at `http://localhost:1234/v1/models`.
- **First chat is very slow (30-90s).** Cold-start of the local model on first request. Subsequent requests are fast.
- **Router picks nonsense slugs / no slugs.** The LLM's JSON output couldn't be parsed. The router falls back to keyword overlap (safe but coarse). If it happens consistently, try a more capable `LLM_ROUTER_MODEL` or bump `max_tokens` in `router.ts`.
- **Answer contains `[[UNKNOWN]]` even when the content is clearly in the transcripts.** Router picked wrong lessons. Refine that lesson's `summary` in `.rich.json` metadata and re-run `pnpm run build-index`.
- **Answer contains raw `[MM:SS video_id]` text but no clickable chip.** The model output a `video_id` that isn't in the loaded lesson set. Endpoint only echoes citations whose `video_id` matches; hallucinated ones drop.
- **`permission denied for table users` during seed.** service_role wasn't granted table privileges. Fixed in the migration; `supabase db reset` reapplies.
- **`Docker unknown reference` when running `supabase start`.** Stale Supabase CLI. `brew upgrade supabase` and retry.

**Hosted / deploy**

- **`413 Request too large for model ... TPM Limit 12000, Requested 12956`.** Groq free-tier per-request cap. Lower `MAX_LESSONS_PER_TURN` or `MAX_LESSON_CHARS` (both env vars); defaults are safe.
- **Netlify build fails with "pnpm not found".** Rare, but add `"packageManager": "pnpm@10.22.0"` to `package.json` to force detection.
- **Custom domain: "Another project is already using this domain".** Old Netlify site claiming it. Find the owning site (or the Netlify DNS zone in the Domains section) and release/delete the alias.
- **Custom domain: "Domain not owned by your Netlify account".** Root domain isn't on Netlify DNS. Add the TXT verification record they show; don't switch nameservers unless you actually want Netlify to manage all DNS for the domain.
- **Custom domain: SSL "provide your own certificate" prompt.** Means Netlify's Let's Encrypt automation can't complete — usually because no CNAME points at Netlify yet, or a CAA record blocks Let's Encrypt. Add the CNAME (`dig CNAME <subdomain> +short` should return your Netlify hostname); if a CAA blocks LE, add `0 issue "letsencrypt.org"`.
- **After deploy the client can't reach the API (CORS).** `PUBLIC_RUNTIME_ORIGIN` wasn't updated to the actual origin. Set it and redeploy.

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
      lessons.ts                index loader + .md content loader (Vite-bundled)
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
  index.json                    generated router index (built by build-index; git-ignored)
  transcripts/rich/**/          .rich.json metadata
  transcripts/output/**/        .md content

docs/
  handoff-v1.md                 earlier design spec (superseded 2026-07-04)
  landing-page-ideas.md         later iteration notes for the empty-state landing sketch

.env.example                    local dev template
.env.hosted                     hosted-target template (git-ignored)
netlify.toml                    Netlify build config
```

## Contract with the transcriber

The chatbot expects, per lesson:

- `data/transcripts/rich/<week>/<lesson>.rich.json` — provides `metadata.video_title`, `metadata.source_url`, `metadata.duration_seconds`, `metadata.week`, `metadata.topic` (used as the router summary). The `semantic_chunks[]` array is ignored in the current architecture (was used by the deprecated RAG pipeline).
- `data/transcripts/output/<week>/<lesson>.md` — the polished transcript, embedded verbatim into the answering LLM's system prompt (subject to `MAX_LESSON_CHARS` truncation).

The two paths must line up: same week folder, same lesson basename minus extension. `scripts/build-index.ts` enforces this mapping.
