<script lang="ts">
  import SourceChip from './SourceChip.svelte';
  import { REFUSAL } from '$lib/refusal';

  const SOURCE_SENTINEL = '\n\n[[SOURCES]]';
  const CITATION_RE = /\[(\d{1,3}):(\d{2})\s+([a-z0-9-]+)\]/g;
  const UNKNOWN_RE = /\[\[UNKNOWN\]\][^\n]*\n?/g;

  type Source = { video_id: string; t: number };
  type LessonRef = { slug: string; title: string; video_url: string; video_id: string };
  type Segment = { type: 'text'; text: string } | { type: 'chip'; t: number; video_id: string };
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

  function segmentize(text: string): Segment[] {
    const segs: Segment[] = [];
    let last = 0;
    for (const m of text.matchAll(CITATION_RE)) {
      const idx = m.index ?? 0;
      if (idx > last) segs.push({ type: 'text', text: text.slice(last, idx) });
      const mm = parseInt(m[1], 10);
      const ss = parseInt(m[2], 10);
      segs.push({ type: 'chip', t: mm * 60 + ss, video_id: m[3] });
      last = idx + m[0].length;
    }
    if (last < text.length) segs.push({ type: 'text', text: text.slice(last) });
    return segs;
  }

  function chipLabel(t: number): string {
    const mm = Math.floor(t / 60);
    const ss = (t % 60).toString().padStart(2, '0');
    return `${mm}:${ss}`;
  }

  function urlForVideoId(msg: Message, video_id: string): string | null {
    return msg.lessons?.find((l) => l.video_id === video_id)?.video_url ?? null;
  }

  function titleForVideoId(msg: Message, video_id: string): string | undefined {
    return msg.lessons?.find((l) => l.video_id === video_id)?.title;
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

  function handleChipClick(msg: Message, video_id: string, t: number) {
    const url = urlForVideoId(msg, video_id);
    if (url) onJump(url, t);
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
          class="max-w-[85%] rounded-lg px-3 py-2 text-sm whitespace-pre-wrap {m.role === 'user'
            ? 'bg-neutral-100 text-neutral-900'
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
            {#each segmentize(cleanForDisplay(m.content)) as seg}
              {#if seg.type === 'text'}{seg.text}{:else}
                <span class="inline-block align-middle mx-0.5">
                  <SourceChip
                    label={chipLabel(seg.t)}
                    title={titleForVideoId(m, seg.video_id)}
                    onClick={() => handleChipClick(m, seg.video_id, seg.t)}
                  />
                </span>
              {/if}
            {/each}
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
