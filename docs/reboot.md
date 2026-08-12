# Reboot — coming back after a break

Practical checklist for restarting local dev after time away, plus fixes for the common failures we've hit. Skim top-to-bottom the first time you're back; after that, jump to the failure that matches.

---

## The clean cold-start (in order)

Every command from the project root (`~/chatbotGA`).

```bash
# 1. Make sure Docker Desktop is running.
docker info >/dev/null && echo "Docker up" || echo "Start Docker Desktop"

# 2. Bring Supabase's local containers back up.
supabase start
# On the first run after a Docker Desktop restart this can take 30-60s.
# Ignore any "no such container" warnings — start recreates them.

# 3. Sanity-check Supabase is really up.
supabase status
# Should print API URL http://127.0.0.1:54321 plus keys.

# 4. Re-seed the course row (idempotent).
pnpm run seed
# Expect: Seeded course "Creative Coding 101" (0 videos).

# 5. Start LM Studio and load your model.
#    Menu bar → LM Studio → Local Server → Start Server.
#    Make sure LLM_MODEL in .env matches the model id shown.

# 6. Start the dev server.
pnpm dev

# 7. Open the app.
open http://localhost:5173/c/creative-coding-101
```

If that all works, you're back. Ask a question, chip should render + seek. Done.

---

## Common failures and their fixes

### `docker ps` shows Supabase containers missing / exited

Docker Desktop was restarted (updated, force-quit, machine rebooted) and Supabase's container stack didn't come back cleanly.

```bash
supabase stop
supabase start
```

If `supabase stop` fails with "no project" or a connection error, the state is really broken:

```bash
supabase stop --no-backup   # skips the "back up DB before stopping" step
supabase start
```

`--no-backup` **wipes the DB**. You'll need to re-run `pnpm run seed` after. Since we don't persist student-facing data locally, that's fine.

### 404 on `/c/creative-coding-101`

`loadCourse('creative-coding-101')` returned `null`. Almost always: the courses table is empty. Re-seed:

```bash
pnpm run seed
```

If it's still 404 after that:

- **Wrong env sourced.** `env | grep SUPABASE_URL` should print `http://127.0.0.1:54321` for local. If it prints a `.supabase.co` URL, you're pointed at hosted (from an earlier `source .env.hosted`) — open a fresh shell.
- **Migrations didn't apply.** [Studio](http://127.0.0.1:54323) → Table Editor should show `users`, `courses`, `videos`, `usage_events`, `feedback`. If not, `supabase db reset` and re-seed.

### Chat returns empty / hangs (local)

- **LM Studio isn't running or the model isn't loaded.** Fastest confirm: `curl http://localhost:1234/v1/models` should return a JSON list including your `LLM_MODEL`.
- **First response is slow (30-90s).** Normal cold-start of a large local model. Subsequent are fast.
- **Model name mismatch.** `LLM_MODEL` in `.env` must exactly match what LM Studio's server exposes.

Test in isolation:

```bash
pnpm run smoketest
```

Names the specific check that failed.

### Chat returns empty / hangs (hosted / against Groq)

- **Quota.** `llama-3.3-70b-versatile` on free tier caps at 12k tokens per request. If you see `413 Request too large`, drop `MAX_LESSONS_PER_TURN` to 1 or `MAX_LESSON_CHARS` to 6000.
- **Wrong model id.** Groq occasionally deprecates model ids. Current lineup at [console.groq.com](https://console.groq.com).
- **Rate limit (429).** Free tier also caps requests-per-minute. Wait 60 s and retry.

### Port 5173 already in use

Another `pnpm dev` is running (or Vite auto-incremented to 5174 in a prior session).

```bash
lsof -i :5173         # see who owns it
kill <PID>            # or `pkill -f "vite dev"` to nuke all
pnpm dev              # fresh start on 5173
```

### Storage backend confusion (which one am I on?)

Check `.env`:

```bash
grep STORAGE_BACKEND .env
```

- Empty or `static-webhook` → JSON + webhook path. No Supabase needed. Course lives in `data/course.json`.
- `supabase` → Postgres path. Local Supabase (Docker) or hosted, depending on `SUPABASE_URL`.

Switching is env-var-only, but **you must restart `pnpm dev`** — the storage factory caches the adapter at module load, and Vite doesn't reload the module just because `.env` changed. `Ctrl-C` then `pnpm dev` again. Symptom of forgetting: 404 on the course page, or the "wrong" backend behavior after a swap.

### Deployed site (`teaching.andrewatkinson.net`) is broken

- **Env var changed but no redeploy.** `PUBLIC_RUNTIME_ORIGIN` and any `LLM_*` change requires a Netlify redeploy — the client bundle bakes them in at build time. Netlify → Deploys → **Trigger deploy → Deploy site**.
- **Supabase free tier auto-paused.** If we're on the Supabase backend, the project pauses after ~7 days of inactivity. Netlify function errors will name it. Wake it via the Supabase dashboard. This is one reason the ROADMAP recommends moving fully to the static-webhook backend.

---

## Deploying an update

1. Commit + push to GitHub. Netlify auto-builds on push to `main`.
2. Watch the build log in Netlify Deploys tab (~1-2 min).
3. If you changed any `LLM_*` or `PUBLIC_*` env var, redeploy manually after saving the new value.

Nothing else. No manual deploy step; no cache to purge (SvelteKit + Netlify handle it).

---

## Nuclear reset (last resort)

If Supabase local is genuinely stuck and normal restarts don't help:

```bash
# Stop everything, remove all Supabase-project containers and volumes.
docker ps -a --filter name=supabase --format '{{.ID}}' | xargs -r docker rm -f
docker volume ls --filter name=supabase --format '{{.Name}}' | xargs -r docker volume rm

# Fresh start.
supabase start
supabase db reset      # applies all migrations
pnpm run seed
pnpm run build-index
```

Same for a from-scratch clone on a new machine: after the initial `pnpm install`, this is the sequence.
