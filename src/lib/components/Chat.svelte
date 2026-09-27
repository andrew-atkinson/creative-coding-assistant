<script lang="ts">
  import { marked } from 'marked';
  import { REFUSAL } from '$lib/refusal';

  const SOURCE_SENTINEL = '\n\n[[SOURCES]]';
  // Matches [MM:SS <slug>] and tolerates an optional label like "video_id:" that
  // some models emit by copying the corpus header.
  const CITATION_RE = /\[(\d{1,3}):(\d{2})\s+(?:(?:video[_-]?id|id|lesson[_-]?id|lesson)[\s:=]+)?([a-z0-9][a-z0-9-]{2,})\]/gi;
  const UNKNOWN_RE = /\[\[UNKNOWN\]\][^\n]*\n?/g;

  // Resolve the citation's slug to a known video_id from the message's lesson
  // list. Exact match first; then suffix match (e.g. "3-loop-danger" ->
  // "week-3-3-loop-danger") so partial ids still work.
  function resolveVideoId(raw: string, lessons: LessonRef[] | undefined): string | null {
    if (!lessons) return null;
    const lower = raw.toLowerCase();
    const ids = lessons.map((l) => l.video_id);
    if (ids.includes(lower)) return lower;
    return ids.find((id) => id.endsWith('-' + lower) || id.endsWith(lower)) ?? null;
  }

  // Preserve newlines as breaks — matches chat expectations more than a strict
  // markdown reader. Everything else is standard: bold, italic, code, lists,
  // links, headings.
  marked.setOptions({ gfm: true, breaks: true });

  type Source = { video_id: string; t: number };
  type LessonRef = { slug: string; title: string; video_url: string; video_id: string };
  type Message = {
    role: 'user' | 'assistant';
    content: string;
    sources?: Source[];
    lessons?: LessonRef[];
    isRefusal?: boolean;
    unknown?: boolean;
  };

  let {
    courseSlug,
    onJump
  }: {
    courseSlug: string;
    onJump: (video_url: string, t: number) => void;
  } = $props();

  let messages: Message[] = $state([]);
  let input = $state('');
  let busy = $state(false);
  let scroller: HTMLDivElement | undefined = $state();

  function scrollToBottom() {
    queueMicrotask(() => {
      if (scroller) scroller.scrollTop = scroller.scrollHeight;
    });
  }

  function cleanForDisplay(text: string): string {
    return text.replace(UNKNOWN_RE, '').trimEnd();
  }

  function chipLabel(t: number): string {
    const mm = Math.floor(t / 60);
    const ss = (t % 60).toString().padStart(2, '0');
    return `${mm}:${ss}`;
  }

  function escapeAttr(s: string): string {
    return s.replace(/[&<>"']/g, (c) => `&#${c.charCodeAt(0)};`);
  }

  // Render assistant markdown → HTML with citations rewritten as chip buttons.
  // The chip element is emitted as inline HTML *before* markdown parsing;
  // marked passes inline HTML through untouched (unlike an underscored
  // placeholder token, which would collide with markdown's __bold__ rule).
  // Click handling is via event delegation on the parent container.
  //
  // If a citation's slug can't be resolved against the loaded lessons (e.g.
  // during streaming, before the sources footer has arrived), the citation is
  // rendered as literal text so the reader can still see it — a placeholder
  // button that fails silently on click would be worse.
  function renderMarkdown(raw: string, lessons: LessonRef[] | undefined): string {
    const withChips = raw.replace(CITATION_RE, (full, mm, ss, video_id) => {
      const resolved = resolveVideoId(video_id, lessons);
      if (!resolved) return full;
      const t = parseInt(mm, 10) * 60 + parseInt(ss, 10);
      const label = chipLabel(t);
      const title = escapeAttr(lessons?.find((l) => l.video_id === resolved)?.title ?? '');
      return (
        `<button type="button" class="chip inline-flex h-6 max-w-full items-center gap-1.5 rounded-full border border-accent/45 bg-accent/10 pl-2 pr-2.5 align-middle text-xs text-ink hover:bg-accent/20" ` +
        `data-t="${t}" data-vid="${escapeAttr(resolved)}" aria-label="Play ${title} at ${label}">` +
        `<svg width="8" height="8" viewBox="0 0 8 8" class="shrink-0 text-accent" aria-hidden="true"><path d="M1 .5v7l6.5-3.5z" fill="currentColor"/></svg>` +
        `<span class="font-mono tabular-nums text-accent">${label}</span>` +
        (title ? `<span class="max-w-56 truncate">${title}</span>` : '') +
        `</button>`
      );
    });
    return marked.parse(withChips, { async: false }) as string;
  }

  // Lessons actually cited in an answer, each with its first cited moment.
  function citedLessons(m: Message): (LessonRef & { t: number })[] {
    if (!m.sources?.length || !m.lessons) return [];
    return m.lessons.flatMap((l) => {
      const s = m.sources!.find((s) => s.video_id === l.video_id);
      return s ? [{ ...l, t: s.t }] : [];
    });
  }

  function handleContentClick(msg: Message, e: MouseEvent) {
    const target = (e.target as HTMLElement | null)?.closest?.('button.chip');
    if (!(target instanceof HTMLButtonElement)) return;
    const t = parseInt(target.dataset.t ?? '0', 10);
    const vid = target.dataset.vid ?? '';
    const url = msg.lessons?.find((l) => l.video_id === vid)?.video_url;
    if (url) onJump(url, t);
  }

  async function send() {
    const query = input.trim();
    if (!query || busy) return;
    input = '';
    busy = true;

    const history = messages.map((m) => ({ role: m.role, content: m.content }));
    messages = [...messages, { role: 'user', content: query }, { role: 'assistant', content: '' }];
    scrollToBottom();

    const idx = messages.length - 1;

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ course_slug: courseSlug, query, history })
      });
      if (!res.ok || !res.body) {
        messages[idx].content = `Error: ${res.status}`;
        return;
      }

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let buf = '';
      while (true) {
        const { value, done } = await reader.read();
        if (done) break;
        buf += decoder.decode(value, { stream: true });
        const sentinelIdx = buf.indexOf(SOURCE_SENTINEL);
        messages[idx].content = sentinelIdx === -1 ? buf : buf.slice(0, sentinelIdx);
        scrollToBottom();
      }

      const sentinelIdx = buf.indexOf(SOURCE_SENTINEL);
      if (sentinelIdx !== -1) {
        const answer = buf.slice(0, sentinelIdx);
        const footer = buf.slice(sentinelIdx + SOURCE_SENTINEL.length);
        messages[idx].content = answer;
        try {
          const parsed = JSON.parse(footer) as { sources: Source[]; lessons: LessonRef[] };
          messages[idx].sources = parsed.sources;
          messages[idx].lessons = parsed.lessons;
        } catch {
          // Footer parse fail — leave sources undefined.
        }
      }
      messages[idx].unknown = UNKNOWN_RE.test(messages[idx].content);
      messages[idx].isRefusal = messages[idx].content.trim() === REFUSAL;
    } catch (e) {
      messages[idx].content = `Network error: ${e instanceof Error ? e.message : String(e)}`;
    } finally {
      busy = false;
      scrollToBottom();
    }
  }

  function onKey(e: KeyboardEvent) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      send();
    }
  }
</script>

<div class="flex h-full min-h-0 flex-col">
  <div class="hidden h-16 shrink-0 items-center gap-3 border-b border-line px-5 md:flex">
    <div class="min-w-0 flex-1">
      <div class="text-[15px] font-semibold">Ask about this course</div>
      <div class="text-xs text-muted">Answers link to moments in the lessons</div>
    </div>
    {#if messages.length > 0}
      <button
        type="button"
        class="h-10 rounded-xl border border-line px-3.5 text-sm hover:bg-raised disabled:opacity-40"
        disabled={busy}
        onclick={() => (messages = [])}
      >
        New chat
      </button>
    {/if}
  </div>

  <div bind:this={scroller} class="flex min-h-0 flex-1 flex-col gap-5 overflow-y-auto px-4 py-5 md:px-5">
    {#if messages.length === 0}
      <p class="text-sm text-muted">
        Ask a question about the course. Answers cite the specific video moments to watch.
      </p>
    {/if}
    {#each messages as m, mi (mi)}
      {#if m.role === 'user'}
        <div class="max-w-[85%] self-end whitespace-pre-wrap rounded-2xl rounded-br-md border border-line bg-raised px-3.5 py-2.5 text-[15px] leading-normal">
          {m.content}
        </div>
      {:else}
        {@const warn = m.unknown || m.isRefusal}
        {@const cited = citedLessons(m)}
        <div class="flex gap-3">
          <span
            class="mt-0.5 grid size-7 shrink-0 place-items-center rounded-full border-2 {warn ? 'border-warn' : 'border-accent'}"
            aria-hidden="true"
          >
            <span class="size-1.5 rounded-full {warn ? 'bg-warn' : 'bg-accent'}"></span>
          </span>
          <div class="min-w-0 flex-1 {warn ? 'rounded-xl border border-warn/40 bg-warn/10 px-3 py-2' : ''}">
            {#if m.content === ''}
              <span class="inline-flex gap-1 text-sm text-muted">
                <span class="animate-pulse">Thinking</span>
                <span class="animate-pulse [animation-delay:150ms]">.</span>
                <span class="animate-pulse [animation-delay:300ms]">.</span>
                <span class="animate-pulse [animation-delay:450ms]">.</span>
              </span>
            {:else}
              <!-- eslint-disable-next-line svelte/no-at-html-tags -->
              <div
                class="prose prose-sm prose-themed max-w-none text-[15px] prose-p:my-2 prose-pre:my-2 prose-pre:border prose-pre:border-line prose-pre:text-xs prose-headings:my-2 prose-ul:my-2 prose-ol:my-2 prose-li:my-0.5 prose-code:rounded prose-code:bg-raised prose-code:px-1 prose-code:py-0.5 prose-code:text-xs prose-code:before:content-none prose-code:after:content-none"
                onclick={(e) => handleContentClick(m, e)}
                onkeydown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    const t = e.target as HTMLElement;
                    if (t.closest('button.chip')) handleContentClick(m, e as unknown as MouseEvent);
                  }
                }}
                role="presentation"
              >
                {@html renderMarkdown(cleanForDisplay(m.content), m.lessons)}
              </div>
            {/if}
            {#if cited.length > 0}
              <div class="mt-3 border-t border-line pt-3">
                <div class="mb-2 text-[11px] font-semibold uppercase tracking-widest text-muted">
                  From {cited.length} {cited.length === 1 ? 'lesson' : 'lessons'}
                </div>
                <div class="flex flex-wrap gap-2">
                  {#each cited as l (l.video_id)}
                    <button
                      type="button"
                      class="h-9 max-w-full truncate rounded-xl border border-line bg-raised px-3 text-[13px] font-medium hover:border-accent/45"
                      onclick={() => onJump(l.video_url, l.t)}
                    >
                      {l.title}
                    </button>
                  {/each}
                </div>
              </div>
            {/if}
          </div>
        </div>
      {/if}
    {/each}
  </div>

  <form
    class="shrink-0 p-3 md:px-4 md:pb-4"
    onsubmit={(e) => {
      e.preventDefault();
      send();
    }}
  >
    <div class="flex items-end gap-2 rounded-2xl border border-line bg-raised p-1.5 pl-4 focus-within:border-accent/45">
      <textarea
        bind:value={input}
        onkeydown={onKey}
        rows="1"
        aria-label="Ask a question"
        placeholder="Ask about the course…"
        class="flex-1 resize-none bg-transparent py-2.5 text-base leading-snug text-ink placeholder:text-muted focus:outline-none md:text-[15px]"
        disabled={busy}
      ></textarea>
      <button
        type="submit"
        aria-label="Send"
        disabled={busy || !input.trim()}
        class="grid size-11 shrink-0 place-items-center rounded-xl bg-accent text-on-accent disabled:opacity-40"
      >
        <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
          <path d="M12 19V5M5 12l7-7 7 7" />
        </svg>
      </button>
    </div>
  </form>
</div>
