# Backlog

Deferred work, feedback, and ideas noted during development. Not tracked in a formal issue tracker — just a running log. Add to it freely; anything with a clear owner and priority can be broken out into an issue later.

Format: one bullet per item. Prefix with `[YYYY-MM-DD]` when added. Group under headings by concern. Cross out or delete items when done.

---

## Chat quality

- **[2026-07-04] Tool-calling for unknown-question capture.** Currently uses a `[[UNKNOWN]] "..."` sentinel in the model output; server regex-catches it and writes a `feedback` row. Local quantized models don't tool-call reliably; when we deploy to a bigger hosted model, switch to proper OpenAI function-calling for cleaner semantics.
- **[2026-07-04] Router quality on ambiguous questions.** The router picks lessons based on a summary index. If a student asks something that only vaguely matches, it may pick nothing useful and the answer will refuse. Consider expanding lesson summaries or falling back to loading a broader set when confidence is low.

## Design / layout

- **[2026-07-04] Overall layout and design are in poor shape.** Runtime UI needs a proper pass: typography, spacing, color, chat pane sizing, source-chip readability. Split-screen breakpoints need work. Cinema mode overlay position and sizing should be revisited.

## Feedback + backlog

- **[2026-07-04] In-app feedback review UI.** `feedback` table captures unknown questions server-side. Build an admin view (`/admin/feedback`) that lists them and lets Andrew mark as answered / added-to-course.
- **[2026-07-04] "Flag this answer" button in the chat.** For when the model answered but got it wrong. Writes a `feedback` row with `category='flagged'` and the assistant's response text.

## Deploy path

- **[2026-07-04] Bundle `.md` transcripts for deploy.** Right now `lessons.ts` reads them from `data/transcripts/output/**/*.md` on disk. That works locally. Deploy needs either (a) commit the files into the build, or (b) upload to Supabase Storage and read from there. Punt to P3.
- **[2026-07-04] Confirm hosted LLM options.** Groq free tier (Llama 3.3 70B) is the current default plan for deploy. OpenRouter and hosted Gemini via a proxy are alternatives. Try each once we get to P2.

---

## Ideas / future direction

- Multi-course support: hardcoded `creative-coding-101` today; add Builder UI in M2.
- Preserve chat history per student across sessions (needs auth).
- Analytics on router routing decisions — which lessons get picked most, which pairs cluster together.
- Consider indexing `.knowledge.json` structured Q&A as a second router-visible summary layer.

---

## Done (kept for context)

- **[2026-07-04] Retrieval quality inconsistency.** Fixed by architecture pivot: dropped chunk-based RAG, replaced with router → full-lesson-in-prompt. See `docs/handoff-v1.md` § pivot note.
- **[2026-07-04] `.md` polished files.** Now the primary corpus for the answering LLM. Confirmed via pivot.

## notes about abstracting and generalizing the chatbot into a chatbot factory

`src/lib/server/persona.ts` > needs to abstract and the system persona.
