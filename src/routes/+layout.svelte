<script lang="ts">
  import "./layout.css";

  let { children } = $props();
</script>

<svelte:head>
  <link rel="icon" href="/logo.png" sizes="any" type="image/png" />
  <link rel="icon" href="/logo.svg" sizes="any" type="image/svg+xml" />

  <link rel="apple-touch-icon" href="/logo.png" sizes="any" type="image/png" />

  <meta name="robots" content="index, follow" />
</svelte:head>

{@render children()}
