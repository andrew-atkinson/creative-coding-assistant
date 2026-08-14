# TutorGen (chatbotGA)

A TA/GA style AI tutor for my Creative Coding course. Students see the lesson video and a chat side-by-side. The tutor is grounded in the transcripts of the class recordings: it identifies which lesson(s) are relevant to a question, loads their full transcripts as context, answers in a TA voice (guides students toward solutions rather than handing them over), and cites specific video moments that seek the player when clicked. When it genuinely doesn't know, it logs the question for the instructor to review.

Currently at **M1 — proof-of-concept**, deployed to Netlify. Single-course, single-tenant. See [docs/handoff-v1.md](docs/handoff-v1.md) for the earlier design spec (superseded 2026-07-04), [docs/ROADMAP.md](docs/ROADMAP.md) for the sequenced plan, and [BACKLOG.md](BACKLOG.md) for the running feedback log.

---

## Architecture

- **Frontend + backend:** SvelteKit 2 (Svelte 5) with the Netlify adapter, styled with Tailwind v4.
- **Storage (pluggable):** two backends selected by env var — no-DB (course from JSON, feedback via email or webhook) or Supabase (Postgres). See [Two paths](#two-paths) below.
- **LLM:** any OpenAI-compatible endpoint. Local dev: [LM Studio](https://lmstudio.ai/) at `http://localhost:1234/v1` with a quantized Gemma 4 26B model. Deploy: Groq's free tier (Llama 3.3 70B). Swap providers by changing env vars.
- **Retrieval:** no vector search. A small router LLM call selects the relevant lesson(s) from `data/index.json`; the answering call gets the _full_ transcript `.md` for each selected lesson in its system prompt. Cross-lesson questions naturally load multiple `.md`s at once.
- **Transcripts:** consumed as `.rich.json` metadata (routing summaries) + `.md` content (LLM context) from `data/transcripts/{rich,output}/**/`. Produced by the sibling [video_transcription](https://github.com/andrew-atkinson/video_transcription) project. Bundled into the SvelteKit build via `import.meta.glob`, so the deployed function has them without a separate upload step.
- **Video hosting:** provider-agnostic. `video_url` is any HTTPS URL. My videos live on Bunny CDN; the code doesn't care.

Per-turn flow: `question → router → slugs → load .md files → persona system prompt → stream answer with inline [MM:SS video_id] citations → post-process into source chips and, if the response contains [[UNKNOWN]], a feedback event`.

---

## Two paths

The storage backend is selected by the `STORAGE_BACKEND` env var. Two options:

| | **Path A: no-DB (recommended)** | **Path B: Supabase** |
| --- | --- | --- |
| `STORAGE_BACKEND` | `static-webhook` | `supabase` |
| Course metadata | `data/course.json` (committed) | `courses` table (seeded) |
| Feedback destination | Email (Resend) or webhook (Discord/Slack) | `feedback` table |
| Usage metering | None (IP rate limit only) | `usage_events` table |
| Local prereqs | LM Studio + `.env` | LM Studio + Docker Desktop + Supabase CLI + `.env` |
| Hosted prereqs | Netlify + LLM provider + Resend (or webhook) | Netlify + LLM provider + hosted Supabase |
| Auto-pause risk | None | Supabase free tier pauses after ~7 days idle |
| SQL analytics | No | Yes |

**If in doubt, pick Path A.** It's simpler to set up, has no auto-pause failure mode, and covers everything M1 needs. Move to Path B only when you actually want SQL queries over usage/feedback (e.g. a real admin dashboard).

Instructions below are labelled **Path A** or **Path B** or **Both**. Skip whichever isn't yours.

---

## Prerequisites (Both)

- Node 22+ and pnpm 10+ (`brew install node pnpm`)
- [LM Studio](https://lmstudio.ai/) with a chat-capable model loaded (my default: `unsloth-gemma-4-26b-a4b-it-qat-oq4`), or any OpenAI-compatible endpoint.
- Transcripts at `data/transcripts/rich/**/*.rich.json` and `data/transcripts/output/**/*.md` in the shape produced by the transcription project.

### Additional prereqs — Path B only

- Docker Desktop (for local Supabase)
- Supabase CLI (`brew install supabase/tap/supabase`)

---

## Local setup

### Both — install + LLM

```bash
pnpm install

# Start LM Studio (or any OpenAI-compatible LLM) and load your model.
# Its server should be listening on http://localhost:1234.
```

Copy `.env.example` to `.env`.

### Path A env vars (no-DB)

```bash
# Storage
STORAGE_BACKEND=static-webhook

# Feedback destination — pick email OR webhook
FEEDBACK_MODE=email
RESEND_API_KEY=re_...           # from resend.com
FEEDBACK_EMAIL_TO=you@example.com
FEEDBACK_EMAIL_FROM=onboarding@resend.dev    # or your verified domain

# LLM
LLM_BASE_URL=http://localhost:1234/v1
LLM_API_KEY=lmstudio            # LM Studio ignores it
LLM_MODEL=unsloth-gemma-4-26b-a4b-it-qat-oq4    # exact id from LM Studio
LLM_ROUTER_MODEL=               # empty → falls back to LLM_MODEL

# App
ADMIN_SECRET=any-random-string
PUBLIC_RUNTIME_ORIGIN=http://localhost:5173
```

Full walkthrough for Resend (signup, API key, sending domain): [docs/resend-setup.md](docs/resend-setup.md). For a webhook destination (Discord/Slack), set `FEEDBACK_MODE=webhook` and `FEEDBACK_WEBHOOK_URL=https://...` instead of the four email vars.

**No `pnpm run seed` needed** — course metadata is read straight from `data/course.json`.

### Path B env vars (Supabase)

Start local Supabase first:

```bash
supabase start          # first run downloads Docker images (~2 min)
supabase status         # prints the URLs and keys you'll paste below
```

Then fill `.env`:

```bash
# Storage
STORAGE_BACKEND=supabase

# Supabase (local Docker)
SUPABASE_URL=http://127.0.0.1:54321
SUPABASE_SERVICE_ROLE_KEY=<Secret from `supabase status`>
PUBLIC_SUPABASE_URL=http://127.0.0.1:54321
PUBLIC_SUPABASE_ANON_KEY=<Publishable from `supabase status`>

# LLM — same as Path A
LLM_BASE_URL=http://localhost:1234/v1
LLM_API_KEY=lmstudio
LLM_MODEL=unsloth-gemma-4-26b-a4b-it-qat-oq4
LLM_ROUTER_MODEL=

# App
ADMIN_SECRET=any-random-string
PUBLIC_RUNTIME_ORIGIN=http://localhost:5173
```

Migrations apply automatically on `supabase start`. Studio at [http://127.0.0.1:54323](http://127.0.0.1:54323) if you want to see the tables.

**Path B also needs a seed:**

```bash
pnpm run seed           # insert user + course row (idempotent)
```

### Both — build the router index

```bash
pnpm run build-index    # writes data/index.json (fast; no LLM or embedding calls)
```

Re-run whenever transcripts change.

---

## Running locally

```bash
pnpm dev
```

Open [http://localhost:5173/c/creative-coding-101](http://localhost:5173/c/creative-coding-101).

Ask a question. The response streams in with inline `[MM:SS video_id]` citations rendered as clickable chips. Clicking a chip switches the video to that lesson (if needed) and seeks. On desktop, the **Cinema mode** toggle expands the video and floats the chat as a corner overlay. On narrow widths, use the hamburger to browse lessons; the ⛶ button opens the video full-screen natively.

### Switching paths

Change `STORAGE_BACKEND` in `.env`, **restart `pnpm dev`** (the storage factory caches at module load — Vite doesn't reload it on env changes alone), and you're on the other path. Course metadata, feedback destination, and metering shift accordingly.

---

## Testing locally against hosted (Both, before deploy)

Once you've set up hosted LLM + storage (see [Deployment](#deployment)), you can point your local dev server at the hosted infrastructure without touching Netlify. Put hosted creds in `.env.hosted` (git-ignored template lives in the repo), then:

```bash
set -a; source .env.hosted; set +a
pnpm run seed          # Path B only — hosted Supabase seeding
pnpm dev               # local UI, hosted backend
```

Same URL (`localhost:5173`), hosted DB + hosted LLM behind it. Useful for catching deploy-specific issues (rate limits, model quirks) without a Netlify build round-trip.

---

## CLI reference

| Command | Path | What it does |
| --- | --- | --- |
| `pnpm dev` | Both | Start the SvelteKit dev server on `:5173`. |
| `pnpm run build` | Both | Production build. Bundles all `.md` transcripts. |
| `pnpm run preview` | Both | Preview the production build locally. |
| `pnpm run check` | Both | `svelte-check` — type + Svelte checks. |
| `pnpm run build-index` | Both | Walk transcripts → write `data/index.json`. Idempotent. |
| `pnpm run smoketest` | Both | Checks LLM reachable, index present, router picks a plausible lesson. `LLM_TIMEOUT_MS` overrides the 3-min per-call cap. |
| `pnpm run seed` | Path B | Insert/upsert user + course row into Supabase from `data/course.json`. |
| `supabase start` | Path B | Bring up local Postgres + PostgREST + Studio. |
| `supabase stop` | Path B | Stop the local stack. |
| `supabase status` | Path B | Print URLs and keys for the running stack. |
| `supabase db reset` | Path B | Drop + re-create local DB; re-apply migrations. Re-run seed after. |

---

## Context budget (Both)

Two env knobs cap per-request context size to stay under free-tier LLM per-request token caps:

| Var | Default | Purpose |
| --- | --- | --- |
| `MAX_LESSONS_PER_TURN` | `2` | Max lessons the router will select for one turn. |
| `MAX_LESSON_CHARS` | `8000` | Per-lesson truncation of `.md` content (`[... transcript truncated for length ...]` appended when hit). |

With defaults: 2 × 8000 = 16k chars ≈ 4k tokens for the corpus, + persona overhead ~800 tokens = ~5k tokens per request. Well under Groq's free-tier 12k-tokens-per-request cap on `llama-3.3-70b-versatile`.

Local LM Studio has no per-request cap; you can leave both blank or bump them for richer cross-lesson answers.

---

## Deployment

The site is deployed on Netlify. This section covers both paths.

### Both — Hosted LLM

Groq's free tier is generous and fast:

- `LLM_BASE_URL=https://api.groq.com/openai/v1`
- `LLM_API_KEY=gsk_...` (from [console.groq.com](https://console.groq.com))
- `LLM_MODEL=llama-3.3-70b-versatile`
- `LLM_ROUTER_MODEL=openai/gpt-oss-20b` (smaller than the main model, plenty smart for routing)

Alternatives that also work with the same `openai` client: OpenRouter, Cerebras, hosted Gemini via a proxy.

### Path A — Hosted storage (no-DB)

Nothing to provision beyond your feedback destination:

- **Email**: sign up for [Resend](https://resend.com), get an API key, ideally verify a sending domain. Full walkthrough in [docs/resend-setup.md](docs/resend-setup.md).
- **Webhook**: create a Discord (or Slack) incoming webhook. Set `FEEDBACK_MODE=webhook` + `FEEDBACK_WEBHOOK_URL` in Netlify env vars.

That's it — course metadata ships in the build via `data/course.json`.

### Path B — Hosted storage (Supabase)

- Create a project at [supabase.com](https://supabase.com) (free tier).
- SQL editor → run each migration in order: `supabase/migrations/0001_init.sql`, `0002_pivot.sql`, `0003_rls.sql`.
- Grab `Project URL`, `service_role` (or `sb_secret_...`) key, and `anon` (or `sb_publishable_...`) key.
- With env vars pointed at the hosted DB (via `.env.hosted`), run `pnpm run seed` from your machine to insert the course row.
- **Note the auto-pause**: Supabase free tier suspends projects after ~7 days of inactivity. If you don't have consistent traffic, Path A is more durable.

### Both — Netlify site

- Push this repo to GitHub.
- Netlify → **Add new site → Import from Git** → pick the repo.
- `netlify.toml` already sets the right build command (`pnpm run build-index && pnpm run build`) and publish dir (`build`).
- Under **Site settings → Environment variables**, add every var from `.env.example` with the hosted values, matching your chosen path.
- `PUBLIC_RUNTIME_ORIGIN` should be your site URL — initially the assigned `<name>.netlify.app`, later your custom domain. **Any change to this var requires a redeploy** so the new value is baked into the client bundle.
- First deploy. Watch the log: `build-index` writes the index, then Vite builds. `chunks/lessons.js` should be ~500 kB — that's the bundled `.md` content.

### Both — Custom domain

- Netlify → **Domain management** → add your custom domain (e.g. `teaching.andrewatkinson.net`) as an alias.
- If the root domain isn't on Netlify DNS, Netlify asks you to add a TXT `subdomain-owner-verification` record at your DNS provider. Do that, wait for propagation (`dig TXT subdomain-owner-verification.<root> +short`), retry.
- Add a CNAME at your DNS provider: `<subdomain> CNAME <your-site>.netlify.app`.
- Netlify auto-provisions Let's Encrypt SSL once the CNAME resolves. Takes 1-3 min.
- Update `PUBLIC_RUNTIME_ORIGIN` to `https://<custom-domain>` and trigger a redeploy.

---

## Troubleshooting

### Local / dev — Both

- **Chat returns quickly with no text.** LM Studio isn't running, or the model in `LLM_MODEL` isn't loaded. `pnpm run smoketest` names the specific failure. Verify at `http://localhost:1234/v1/models`.
- **First chat is very slow (30-90s).** Cold-start of the local model on first request. Subsequent are fast.
- **Router picks nonsense slugs / no slugs.** LLM JSON output couldn't be parsed. Router falls back to keyword overlap. If consistent, try a more capable `LLM_ROUTER_MODEL`.
- **Answer contains `[[UNKNOWN]]` when the content is in the transcripts.** Router picked wrong lessons. Refine that lesson's `summary` in `.rich.json` and re-run `pnpm run build-index`.
- **Raw `[MM:SS video_id]` in the answer with no clickable chip.** The model output a `video_id` that isn't in the loaded lesson set. Endpoint only echoes citations whose `video_id` matches; hallucinated ones drop.

### Local / dev — Path B only

- **`permission denied for table users` during seed.** service_role wasn't granted table privileges. `supabase db reset` reapplies the migrations that fix it.
- **`Docker unknown reference` when running `supabase start`.** Stale Supabase CLI. `brew upgrade supabase` and retry.
- **404 on `/c/creative-coding-101` after Supabase restart.** Table was wiped; re-run `pnpm run seed`.

### Hosted / deploy — Both

- **`413 Request too large for model ... TPM Limit 12000, Requested 12956`.** Groq free-tier per-request cap. Lower `MAX_LESSONS_PER_TURN` or `MAX_LESSON_CHARS`; defaults are safe.
- **Netlify build fails with "pnpm not found".** Rare. Add `"packageManager": "pnpm@10.22.0"` to `package.json`.
- **Custom domain: "Another project is already using this domain".** Old Netlify site claiming it. Find that site (or the Netlify DNS zone in the Domains section) and release/delete the alias.
- **Custom domain: "Domain not owned by your Netlify account".** Root domain isn't on Netlify DNS. Add the TXT verification record they show; don't switch nameservers unless you actually want Netlify managing all DNS for the domain.
- **Custom domain: SSL "provide your own certificate" prompt.** Netlify's Let's Encrypt can't complete. Usually no CNAME points at Netlify yet, or a CAA record blocks LE. Add the CNAME; if a CAA blocks LE, add `0 issue "letsencrypt.org"`.
- **After deploy the client can't reach the API (CORS).** `PUBLIC_RUNTIME_ORIGIN` wasn't updated to the actual origin. Set it and redeploy.

### Hosted / deploy — Path A only

- **No email arriving.** Walk through [docs/resend-setup.md § 6](docs/resend-setup.md). Silent-drop is the default when creds are missing — feedback never surfaces failure to the student.

### Hosted / deploy — Path B only

- **Supabase project auto-paused.** Free tier does this after ~7 days idle. Wake it in the Supabase dashboard. If this bites you often, switch to Path A.

---

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
      supabase.ts               service-role client (used by Path B adapter)
      storage/                  pluggable storage layer
        types.ts                StorageAdapter interface, row types
        index.ts                factory — chooses adapter from STORAGE_BACKEND
        static-webhook.ts       Path A adapter (JSON reads, email/webhook writes)
        supabase.ts             Path B adapter (Postgres via service-role)
    components/
      Chat.svelte               chat panel (dynamically imported)
      SourceChip.svelte         clickable timestamp chip
    refusal.ts                  shared refusal string (client + server)

scripts/
  seed.ts                       insert user + course from data/course.json (Path B)
  build-index.ts                walk transcripts, write data/index.json
  smoketest.ts                  local checks (LLM reachable, router works, index present)

supabase/
  migrations/
    0001_init.sql               schema + service_role grants
    0002_pivot.sql              drop chunks/pgvector, add feedback table
    0003_rls.sql                enable RLS on all tables (denies anon by default)

data/
  course.json                   course-level config (both paths — Path A reads directly, Path B seeds)
  index.json                    generated router index (git-ignored)
  transcripts/rich/**/          .rich.json metadata
  transcripts/output/**/        .md content

docs/
  handoff-v1.md                 earlier design spec (superseded 2026-07-04)
  ROADMAP.md                    sequenced plan (Phase 1-5 + ideas)
  reboot.md                     coming-back-after-a-break runbook
  resend-setup.md               end-to-end Resend / email setup walkthrough
  landing-page-ideas.md         design note for the empty-state starfield landing

.env.example                    local dev template (both paths documented)
.env.hosted                     hosted-target template (git-ignored)
netlify.toml                    Netlify build config
```

---

## Contract with the transcriber

The chatbot expects, per lesson:

- `data/transcripts/rich/<week>/<lesson>.rich.json` — provides `metadata.video_title`, `metadata.source_url`, `metadata.duration_seconds`, `metadata.week`, `metadata.topic` (used as the router summary). The `semantic_chunks[]` array is ignored in the current architecture (was used by the deprecated RAG pipeline).
- `data/transcripts/output/<week>/<lesson>.md` — the polished transcript, embedded verbatim into the answering LLM's system prompt (subject to `MAX_LESSON_CHARS` truncation).

The two paths must line up: same week folder, same lesson basename minus extension. `scripts/build-index.ts` enforces this mapping.
