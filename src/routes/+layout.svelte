<script lang="ts">
  import '../app.css';
  import.meta.glob('/src/lib/themes/*.css', { eager: true });
  let { children } = $props();
</script>

{@render children()}
