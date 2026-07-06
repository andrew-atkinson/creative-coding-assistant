<script lang="ts">
  import { onMount, tick } from 'svelte';
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
  <title>{data.course.title}</title>
</svelte:head>

<div class="h-[100dvh] w-screen bg-neutral-950 text-neutral-100 flex flex-col overflow-hidden">
  <!-- Header: hamburger + course/lesson title on every width; cinema on md+, fullscreen ⛶ on narrow. -->
  <header class="flex items-center gap-2 px-3 py-2 border-b border-neutral-800 shrink-0">
    <button
      class="-ml-1 p-2 rounded hover:bg-neutral-800"
      aria-label="Open lesson menu"
      aria-expanded={menuOpen}
      onclick={() => (menuOpen = true)}
    >
      <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true">
        <path d="M4 6h16M4 12h16M4 18h16" />
      </svg>
    </button>
    <div class="flex-1 min-w-0 flex items-baseline gap-2">
      <h1 class="text-sm font-medium truncate">{data.course.title}</h1>
      {#if active}
        <span class="hidden sm:inline text-xs text-neutral-400 truncate" title={active.title}>
          · {active.title}
        </span>
      {/if}
    </div>
    <button
      class="hidden md:inline-flex text-xs px-2 py-1 rounded border border-neutral-700 hover:bg-neutral-800"
      onclick={() => (cinemaMode = !cinemaMode)}
    >
      {cinemaMode ? 'Exit cinema' : 'Cinema mode'}
    </button>
    <button
      class="md:hidden text-xs px-2 py-1 rounded border border-neutral-700 hover:bg-neutral-800"
      aria-label="Fullscreen video"
      onclick={enterNativeFullscreen}
    >
      ⛶
    </button>
  </header>

  <!-- Body. Stacked at < md, side-by-side ≥ md. -->
  <main class="flex-1 flex flex-col md:flex-row overflow-hidden">
    <!-- Video pane -->
    <section
      class={cinemaMode
        ? 'w-full flex flex-col'
        : 'md:w-3/5 md:border-r md:border-neutral-800 flex flex-col shrink-0'}
    >
      {#if data.videos.length > 0 && active}
        <div
          class="w-full bg-black flex items-center justify-center
                 md:flex-1 h-[42vh] md:h-auto"
        >
          <video
            bind:this={videoEl}
            src={active.url}
            controls
            playsinline
            class="max-h-full max-w-full"
          >
            <track kind="captions" />
          </video>
        </div>
      {:else}
        <div class="flex-1 flex items-center justify-center text-neutral-500">
          No videos yet.
        </div>
      {/if}
    </section>

    <!-- Chat pane -->
    <aside
      class={cinemaMode
        ? 'hidden md:flex md:fixed md:bottom-4 md:right-4 md:w-96 md:h-[60vh] md:rounded-lg md:border md:border-neutral-700 md:bg-neutral-900 md:shadow-2xl md:flex-col md:overflow-hidden'
        : 'flex-1 md:w-2/5 flex flex-col min-h-0'}
    >
      {#if ChatComponent}
        <ChatComponent courseSlug={data.course.slug} onJump={jumpTo} />
      {:else}
        <div class="flex-1 flex items-center justify-center text-neutral-500 text-sm">
          Loading chat…
        </div>
      {/if}
    </aside>
  </main>

  <!-- Lesson menu (hamburger drawer). Slides from the left, at any width. -->
  {#if menuOpen}
    <div
      class="fixed inset-0 z-50 flex"
      role="dialog"
      aria-modal="true"
      aria-label="Lessons"
    >
      <div
        class="absolute inset-0 bg-black/60"
        aria-hidden="true"
        onclick={() => (menuOpen = false)}
        role="presentation"
      ></div>
      <div class="relative w-[85%] max-w-sm h-full bg-neutral-950 border-r border-neutral-800 flex flex-col shadow-2xl">
        <div class="flex items-center justify-between px-3 py-2 border-b border-neutral-800 shrink-0">
          <h2 class="text-sm font-medium">Lessons</h2>
          <button
            class="p-2 -mr-1 rounded hover:bg-neutral-800"
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
            <div class="px-3 pt-3 pb-1 text-[10px] uppercase tracking-wider text-neutral-500">
              {weekName}
            </div>
            <ul>
              {#each vids as v}
                {@const isActive = v.id === active?.id}
                <li>
                  <button
                    class="w-full text-left px-3 py-2 text-sm flex items-center gap-2 {isActive
                      ? 'bg-neutral-800 text-neutral-100'
                      : 'text-neutral-300 hover:bg-neutral-900'}"
                    onclick={() => selectVideo(data.videos.indexOf(v))}
                  >
                    <span
                      class="w-1.5 h-1.5 rounded-full shrink-0 {isActive
                        ? 'bg-emerald-400'
                        : 'bg-neutral-700'}"
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
