<script>
  import { page } from "$app/state";
</script>

<div class="flex items-center justify-center w-full gap-3 p-3">
  <h1 class="text-4xl font-thin">
    {page.status}
  </h1>
  {#if page.error}
    <span class="text-2xl font-thin">|</span>
    <p class="text-2xl font-extralight">{page.error.message}</p>
  {/if}
</div>
