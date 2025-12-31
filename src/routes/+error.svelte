<script>
  import { page } from "$app/state";
</script>

<div class="flex items-end justify-center w-full gap-3 p-9">
  <h1 class="text-4xl font-thin">
    {page.status}
  </h1>
  {#if page.error}
    <h2 class="text-2xl font-thin">{page.error.message}</h2>
  {/if}
</div>
