<script lang="ts">
  import { onMount } from 'svelte';
  import type p5 from 'p5';
  import type { Field } from './types';

  let { field }: { field?: string | null } = $props();

  // Drop a <name>.ts file exporting a default Field into ./fields to add one.
  const fields = import.meta.glob<{ default: Field }>('./fields/*.ts');

  let host: HTMLDivElement;

  onMount(() => {
    const css = getComputedStyle(host);
    const name = field || css.getPropertyValue('--field').trim();
    const load = fields[`./fields/${name}.ts`];
    if (!load) return;

    const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;
    const palette = {
      bg: css.getPropertyValue('--canvas').trim(),
      ink: css.getPropertyValue('--field-ink').trim(),
      accent: css.getPropertyValue('--accent').trim()
    };
    let instance: p5 | undefined;
    let destroyed = false;

    Promise.all([import('p5'), load()]).then(([{ default: P5 }, { default: sketch }]) => {
      if (destroyed) return;
      instance = new P5((p: p5) => {
        sketch(p, { palette, reducedMotion });
        const setup = p.setup;
        p.setup = async () => {
          p.frameRate(30);
          await setup?.call(p);
          // noLoop in setup still runs draw once: a still frame.
          if (reducedMotion) p.noLoop();
        };
        p.windowResized ??= () => p.resizeCanvas(p.windowWidth, p.windowHeight);
      }, host);
    });

    const onVisibility = () => {
      if (document.hidden) instance?.noLoop();
      else if (!reducedMotion) instance?.loop();
    };
    document.addEventListener('visibilitychange', onVisibility);

    return () => {
      destroyed = true;
      document.removeEventListener('visibilitychange', onVisibility);
      instance?.remove();
    };
  });
</script>

<div bind:this={host} class="pointer-events-none fixed inset-0 -z-10" aria-hidden="true"></div>
