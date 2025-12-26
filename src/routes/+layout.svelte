<script lang="ts">
  import "./layout.css";
  import LogoIcon from "$lib/assets/logo.svg";

  let { children } = $props();
</script>

<svelte:head>
  <link rel="icon" href={LogoIcon} />
  <meta name="robots" content="index, follow" />
</svelte:head>

{@render children()}
