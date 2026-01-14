<script lang="ts">
  import "./layout.css";

  let { children } = $props();
</script>

<svelte:head>
  <link rel="icon" href="/logo.svg" type="image/svg+xml" />

  <link rel="icon" href="/logo-32x32.png" sizes="32x32" type="image/png" />
  <link rel="icon" href="/logo-192x192.png" sizes="192x192" type="image/png" />

  <link
    rel="apple-touch-icon"
    href="/logo-180x180.png"
    sizes="180x180"
    type="image/png"
  />

  <meta name="robots" content="index, follow" />
</svelte:head>

{@render children()}
