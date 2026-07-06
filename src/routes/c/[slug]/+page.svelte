<script lang="ts">
  import { onMount } from 'svelte';
  import type { PageData } from './$types';

  let { data }: { data: PageData } = $props();

  let videoEl: HTMLVideoElement | undefined = $state();
  let activeVideoIdx = $state(0);
  let cinemaMode = $state(false);

  // Dynamic import keeps the chat bundle out of first paint.
  let ChatComponent: typeof import('$lib/components/Chat.svelte').default | undefined = $state();
  onMount(async () => {
    const mod = await import('$lib/components/Chat.svelte');
    ChatComponent = mod.default;
  });

  function jumpTo(videoUrl: string, t: number) {
    const target = data.videos.findIndex((v) => v.url === videoUrl);
    if (target !== -1 && target !== activeVideoIdx) activeVideoIdx = target;
    // Give Svelte a tick if the video source changed.
    queueMicrotask(() => {
      if (!videoEl) return;
      videoEl.currentTime = t;
      void videoEl.play();
    });
  }
</script>

<svelte:head>
  <title>{data.course.title}</title>
</svelte:head>

<div class="h-screen w-screen bg-neutral-950 text-neutral-100 flex flex-col">
  <header class="flex items-center justify-between px-4 py-2 border-b border-neutral-800">
    <h1 class="text-sm font-medium">{data.course.title}</h1>
    <button
      class="text-xs px-2 py-1 rounded border border-neutral-700 hover:bg-neutral-800"
      onclick={() => (cinemaMode = !cinemaMode)}
    >
      {cinemaMode ? 'Exit cinema' : 'Cinema mode'}
    </button>
  </header>

  <main class="flex-1 flex overflow-hidden">
    <section
      class={cinemaMode ? 'w-full flex flex-col' : 'w-3/5 flex flex-col border-r border-neutral-800'}
    >
      {#if data.videos.length > 0}
        {@const active = data.videos[activeVideoIdx]}
        <div class="flex-1 flex items-center justify-center bg-black">
          <video
            bind:this={videoEl}
            src={active.url}
            controls
            class="max-h-full max-w-full"
          >
            <track kind="captions" />
          </video>
        </div>
        <nav class="flex gap-2 p-2 overflow-x-auto border-t border-neutral-800 text-xs">
          {#each data.videos as v, i}
            <button
              class="px-2 py-1 rounded whitespace-nowrap {i === activeVideoIdx
                ? 'bg-neutral-100 text-neutral-900'
                : 'bg-neutral-800 hover:bg-neutral-700'}"
              onclick={() => (activeVideoIdx = i)}
            >
              {v.ordinal}. {v.title}
            </button>
          {/each}
        </nav>
      {:else}
        <div class="flex-1 flex items-center justify-center text-neutral-500">
          No videos yet.
        </div>
      {/if}
    </section>

    <aside
      class={cinemaMode
        ? 'fixed bottom-4 right-4 w-96 h-[60vh] rounded-lg border border-neutral-700 bg-neutral-900 shadow-2xl flex flex-col overflow-hidden'
        : 'w-2/5 flex flex-col'}
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
</div>
