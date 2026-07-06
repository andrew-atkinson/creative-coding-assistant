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
      return (
        `<button type="button" class="chip inline-flex items-center rounded-full bg-neutral-700 hover:bg-neutral-600 px-2 py-0.5 text-xs text-neutral-100 border border-neutral-600 tabular-nums align-middle" ` +
        `data-t="${t}" data-vid="${escapeAttr(resolved)}">${chipLabel(t)}</button>`
      );
    });
    return marked.parse(withChips, { async: false }) as string;
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

<div class="flex flex-col h-full bg-neutral-900">
  <div bind:this={scroller} class="flex-1 overflow-y-auto p-3 space-y-3">
    {#if messages.length === 0}
      <div class="text-neutral-500 text-sm">
        Ask a question about the course. Answers cite the specific video moments to watch.
      </div>
    {/if}
    {#each messages as m, mi (mi)}
      <div class="flex {m.role === 'user' ? 'justify-end' : 'justify-start'}">
        <div
          class="max-w-[85%] rounded-lg px-3 py-2 text-sm {m.role === 'user'
            ? 'bg-neutral-100 text-neutral-900 whitespace-pre-wrap'
            : m.unknown || m.isRefusal
              ? 'bg-amber-950/40 text-amber-200 border border-amber-900'
              : 'bg-neutral-800 text-neutral-100'}"
        >
          {#if m.content === '' && m.role === 'assistant'}
            <span class="inline-flex gap-1 opacity-70">
              <span class="animate-pulse">Thinking</span>
              <span class="animate-pulse [animation-delay:150ms]">.</span>
              <span class="animate-pulse [animation-delay:300ms]">.</span>
              <span class="animate-pulse [animation-delay:450ms]">.</span>
            </span>
          {:else if m.role === 'assistant'}
            <!-- eslint-disable-next-line svelte/no-at-html-tags -->
            <div
              class="prose prose-sm prose-invert max-w-none prose-p:my-2 prose-pre:my-2 prose-headings:my-2 prose-ul:my-2 prose-ol:my-2 prose-li:my-0.5 prose-code:before:content-none prose-code:after:content-none prose-code:bg-neutral-700/60 prose-code:px-1 prose-code:py-0.5 prose-code:rounded prose-code:text-xs prose-pre:bg-neutral-950 prose-pre:text-neutral-100 prose-pre:text-xs prose-a:text-sky-300 hover:prose-a:text-sky-200"
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
          {:else}
            {m.content}
          {/if}
          {#if m.lessons && m.lessons.length > 0 && m.role === 'assistant'}
            <div class="mt-2 pt-2 border-t border-neutral-700/50 text-xs text-neutral-400">
              Referenced: {m.lessons.map((l) => l.title).join(' · ')}
            </div>
          {/if}
        </div>
      </div>
    {/each}
  </div>

  <form
    class="border-t border-neutral-800 p-2 flex gap-2"
    onsubmit={(e) => {
      e.preventDefault();
      send();
    }}
  >
    <textarea
      bind:value={input}
      onkeydown={onKey}
      rows="1"
      placeholder="Ask about the course…"
      class="flex-1 resize-none rounded bg-neutral-800 text-neutral-100 text-sm px-2 py-1.5 focus:outline-none focus:ring-1 focus:ring-neutral-500"
      disabled={busy}
    ></textarea>
    <button
      type="submit"
      disabled={busy || !input.trim()}
      class="px-3 py-1.5 text-sm rounded bg-neutral-100 text-neutral-900 disabled:opacity-40"
    >
      Send
    </button>
  </form>
</div>
