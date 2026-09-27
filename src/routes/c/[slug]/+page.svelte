<script lang="ts">
  import { onMount, tick } from 'svelte';
  import Backdrop from '$lib/backdrop/Backdrop.svelte';
  import type { PageData } from './$types';

  let { data }: { data: PageData } = $props();

  let videoEl: HTMLVideoElement | undefined = $state();
  let activeVideoIdx = $state(0);
  let cinemaMode = $state(false);
  let menuOpen = $state(false);

  // Dynamic import keeps the chat bundle out of first paint.
  let ChatComponent: typeof import('$lib/components/Chat.svelte').default | undefined = $state();
  onMount(async () => {
    const mod = await import('$lib/components/Chat.svelte');
    ChatComponent = mod.default;
  });

  const active = $derived(data.videos[activeVideoIdx]);

  // Group videos by week for the hamburger menu.
  type Video = PageData['videos'][number];
  const groupedByWeek = $derived(() => {
    const map = new Map<string, Video[]>();
    for (const v of data.videos) {
      const key = v.week ?? 'Other';
      const list = map.get(key) ?? [];
      list.push(v);
      map.set(key, list);
    }
    // Sort weeks by their numeric suffix ("week 3" → 3).
    return Array.from(map.entries()).sort(([a], [b]) => {
      const na = parseInt(a.replace(/\D+/g, ''), 10) || 0;
      const nb = parseInt(b.replace(/\D+/g, ''), 10) || 0;
      return na - nb;
    });
  });

  async function jumpTo(videoUrl: string, t: number) {
    const target = data.videos.findIndex((v) => v.url === videoUrl);
    if (target !== -1 && target !== activeVideoIdx) activeVideoIdx = target;
    menuOpen = false;
    await tick();
    if (!videoEl) return;
    videoEl.currentTime = t;
    void videoEl.play();
  }

  function selectVideo(i: number) {
    activeVideoIdx = i;
    menuOpen = false;
  }

  function enterNativeFullscreen() {
    if (!videoEl) return;
    // iOS Safari uses webkitEnterFullscreen; everything else uses requestFullscreen.
    const v = videoEl as HTMLVideoElement & { webkitEnterFullscreen?: () => void };
    if (typeof v.webkitEnterFullscreen === 'function') v.webkitEnterFullscreen();
    else if (typeof v.requestFullscreen === 'function') void v.requestFullscreen();
  }
</script>

<svelte:head>
  <title>{data.course.title} · Preceptor</title>
</svelte:head>

<div
  data-theme={data.theme}
  class="isolate flex h-[100dvh] w-screen flex-col overflow-hidden bg-canvas text-ink"
>
  {#key `${data.theme}:${data.field}`}
    <Backdrop field={data.field} />
  {/key}

  <header class="flex h-14 shrink-0 items-center gap-2 px-2 md:h-16 md:gap-3 md:px-6">
    <button
      class="grid size-11 place-items-center rounded-xl hover:bg-raised"
      aria-label="Open lesson menu"
      aria-expanded={menuOpen}
      onclick={() => (menuOpen = true)}
    >
      <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true">
        <path d="M4 6h16M4 12h16M4 18h10" />
      </svg>
    </button>
    <span class="hidden size-7 place-items-center rounded-full border-2 border-accent sm:grid" aria-hidden="true">
      <span class="size-1.5 rounded-full bg-accent"></span>
    </span>
    <span class="hidden font-semibold tracking-tight sm:inline">Preceptor</span>
    <span class="hidden h-5 w-px bg-line sm:block" aria-hidden="true"></span>
    <div class="flex min-w-0 flex-1 flex-col sm:flex-row sm:items-baseline sm:gap-2">
      <h1 class="truncate text-sm font-medium">{data.course.title}</h1>
      {#if active}
        <span class="truncate text-xs text-muted" title={active.title}>{active.title}</span>
      {/if}
    </div>
    <button
      class="hidden h-11 items-center gap-2 rounded-xl border border-line bg-surface px-4 text-sm backdrop-blur hover:bg-raised md:inline-flex"
      onclick={() => (cinemaMode = !cinemaMode)}
    >
      <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
        <path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7" />
      </svg>
      {cinemaMode ? 'Exit cinema' : 'Cinema'}
    </button>
    <button
      class="grid size-11 place-items-center rounded-xl hover:bg-raised md:hidden"
      aria-label="Fullscreen video"
      onclick={enterNativeFullscreen}
    >
      <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
        <path d="M4 9V4h5M20 9V4h-5M4 15v5h5M20 15v5h-5" />
      </svg>
    </button>
  </header>

  <!-- Body. Stacked at < md, side-by-side ≥ md. -->
  <main class="flex min-h-0 flex-1 flex-col gap-3 px-3 pb-3 md:flex-row md:gap-6 md:px-6 md:pb-6">
    <section
      class={cinemaMode
        ? 'flex min-w-0 flex-1 flex-col'
        : 'flex min-w-0 shrink-0 flex-col gap-5 md:flex-1 md:shrink md:overflow-y-auto'}
    >
      {#if data.videos.length > 0 && active}
        <div class="panel p-1.5 md:p-2.5 {cinemaMode ? 'flex min-h-0 flex-1' : ''}">
          <video
            bind:this={videoEl}
            src={active.url}
            controls
            playsinline
            class="w-full rounded-[calc(var(--radius-panel)-8px)] bg-black {cinemaMode
              ? 'h-full'
              : 'aspect-video max-h-[65dvh]'}"
          >
            <track kind="captions" />
          </video>
        </div>
        {#if !cinemaMode}
          <div class="hidden px-1.5 md:block">
            {#if active.week}
              <div class="text-xs font-semibold uppercase tracking-widest text-accent">{active.week}</div>
            {/if}
            <h2 class="mt-1.5 text-2xl font-semibold tracking-tight">{active.title}</h2>
            {#if active.summary}
              <p class="mt-2 line-clamp-3 max-w-prose text-[15px] leading-relaxed text-muted">{active.summary}</p>
            {/if}
          </div>
        {/if}
      {:else}
        <div class="panel grid flex-1 place-items-center text-muted">No videos yet.</div>
      {/if}
    </section>

    <aside
      class={cinemaMode
        ? 'panel hidden flex-col overflow-hidden md:fixed md:bottom-6 md:right-6 md:flex md:h-[60vh] md:w-96'
        : 'panel flex min-h-0 flex-1 flex-col overflow-hidden md:w-[340px] md:flex-none lg:w-[380px] xl:w-[460px]'}
    >
      {#if ChatComponent}
        <ChatComponent courseSlug={data.course.slug} onJump={jumpTo} />
      {:else}
        <div class="grid flex-1 place-items-center text-sm text-muted">Loading chat…</div>
      {/if}
    </aside>
  </main>

  <!-- Lesson menu (hamburger drawer). Slides from the left, at any width. -->
  {#if menuOpen}
    <div class="fixed inset-0 z-50 flex" role="dialog" aria-modal="true" aria-label="Lessons">
      <div
        class="absolute inset-0 bg-black/60"
        aria-hidden="true"
        onclick={() => (menuOpen = false)}
        role="presentation"
      ></div>
      <div class="relative flex h-full w-[85%] max-w-sm flex-col border-r border-line bg-canvas/95 shadow-2xl backdrop-blur-xl">
        <div class="flex h-14 shrink-0 items-center justify-between border-b border-line px-4">
          <h2 class="text-sm font-semibold">Lessons</h2>
          <button
            class="-mr-2 grid size-11 place-items-center rounded-xl hover:bg-raised"
            aria-label="Close menu"
            onclick={() => (menuOpen = false)}
          >
            <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true">
              <path d="M6 6l12 12M18 6L6 18" />
            </svg>
          </button>
        </div>
        <div class="flex-1 overflow-y-auto py-2">
          {#each groupedByWeek() as [weekName, vids]}
            <div class="px-4 pb-1 pt-4 text-[11px] font-semibold uppercase tracking-widest text-muted">
              {weekName}
            </div>
            <ul>
              {#each vids as v}
                {@const isActive = v.id === active?.id}
                <li>
                  <button
                    class="flex w-full items-center gap-3 px-4 py-2.5 text-left text-sm {isActive
                      ? 'bg-raised text-ink'
                      : 'text-muted hover:bg-raised hover:text-ink'}"
                    onclick={() => selectVideo(data.videos.indexOf(v))}
                  >
                    <span
                      class="size-1.5 shrink-0 rounded-full {isActive ? 'bg-accent' : 'bg-line'}"
                      aria-hidden="true"
                    ></span>
                    <span class="truncate">{v.title}</span>
                  </button>
                </li>
              {/each}
            </ul>
          {/each}
        </div>
      </div>
    </div>
  {/if}
</div>
