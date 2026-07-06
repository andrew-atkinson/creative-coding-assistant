<script lang="ts">
  let {
    label,
    title,
    onClick
  }: {
    label: string;
    title?: string;
    onClick: () => void;
  } = $props();
</script>

<button
  class="inline-flex items-center rounded-full bg-neutral-800 hover:bg-neutral-700 px-2 py-0.5 text-xs text-neutral-100 border border-neutral-700 tabular-nums"
  title={title ?? ''}
  onclick={onClick}
>
  {label}
</button>
