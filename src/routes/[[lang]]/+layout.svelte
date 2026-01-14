<script lang="ts">
  import { page } from "$app/state";
  import type { LayoutProps } from "./$types";
  import langs, { defLang, type Lang } from "$lib/i18n/langs";
  import links from "$lib/meta/links";
  import BrandIcon from "$lib/assets/brand.svg";
  import LanguageIcon from "$lib/assets/language.svelte";
  import ArrowDownIcon from "$lib/assets/arrow-down.svelte";
  import MailIcon from "$lib/assets/mail.svelte";
  import XIcon from "$lib/assets/x.svelte";
  import GithubIcon from "$lib/assets/github.svelte";

  const { children, data }: LayoutProps = $props();
  const { i18n, lang } = (() => data)();

  const getMainHostname = () => {
    const hostname = page.url.hostname;
    const cs = hostname.split(".");
    const c2 = cs.at(-2);
    const c1 = cs.at(-1);
    return c2 && c1 ? `${c2}.${c1}` : hostname;
  };

  const getMainUrl = () => {
    return page.url.origin.replace(page.url.hostname, getMainHostname()) + "/";
  };

  const changeLang = (newLang: string) => {
    document.cookie = `lang=${newLang}; path=/; max-age=${60 * 60 * 24 * 365}`;
  };

  const jsonLdString = JSON.stringify({
    "@context": "https://schema.org",
    "@type": "WebApplication",
    applicationCategory: "FinanceApplication",
    operatingSystem: "Web",

    inLanguage: lang,

    name: i18n.title,
    description: i18n.desc,

    url: page.url.href,
    image: `${page.url.origin}/slogan.png`,

    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
    },

    author: {
      "@type": "Organization",
      name: "Zekele",
      url: `${links.x}`,
    },
  });
</script>

<svelte:head>
  <title>{i18n.title}</title>
  <meta name="description" content={i18n.desc} />

  <!-- Open Graph / Facebook -->
  <meta property="og:title" content={i18n.title} />
  <meta property="og:description" content={i18n.desc} />
  <meta property="og:url" content={page.url.href} />
  <meta property="og:image" content="{page.url.origin}/slogan.png" />

  <!-- Twitter Card -->
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content={i18n.title} />
  <meta name="twitter:description" content={i18n.desc} />
  <meta name="twitter:image" content="{page.url.origin}/slogan.png" />

  <link
    rel="canonical"
    href="{page.url.origin}{lang === defLang ? `/` : `/${lang}`}"
  />

  <link rel="alternate" hreflang="x-default" href="{page.url.origin}/" />
  {#each Object.keys(langs) as v}
    <link
      rel="alternate"
      hreflang={v}
      href="{page.url.origin}{v === defLang ? `/` : `/${v}`}"
    />
  {/each}

  {@html `<script type="application/ld+json">${jsonLdString}<\/script>`}
</svelte:head>

{#snippet languageItems()}
  {#each Object.keys(langs) as v}
    <li>
      <a
        data-sveltekit-reload
        href={v === defLang ? "/" : `/${v}`}
        onclick={() => changeLang(v)}
        class={`bg-base-100 transition-opacity ${v === lang ? "font-medium cursor-default" : "opacity-70 hover:opacity-100"}`}
      >
        {langs[v as Lang].name}
      </a>
    </li>
  {/each}
{/snippet}

<header>
  <div class="navbar border-b border-base-300 min-h-6">
    <div class="navbar-start">
      <a data-sveltekit-reload class="mb-1.5" href="/">
        <img class="h-6" src={BrandIcon} alt="Zekele" />
      </a>
    </div>

    <div class="navbar-center">
      <p>{i18n.name}</p>
    </div>

    <div class="navbar-end">
      <div class="dropdown dropdown-end">
        <button
          tabindex="0"
          class="btn btn-ghost opacity-70 hover:opacity-100 hover:bg-base-100 border-0 flex items-center shrink-0 gap-0 h-fit p-1.5"
        >
          <LanguageIcon class="h-5" />
          <ArrowDownIcon class="h-4" />
        </button>
        <ul
          tabindex="-1"
          class="menu dropdown-content shadow-sm bg-base-100 z-50 min-w-max p-1"
        >
          {@render languageItems()}
        </ul>
      </div>
    </div>
  </div>
</header>

<main class="place-items-center w-full p-3">
  {@render children()}
</main>

<footer class="footer footer-center border-t border-base-300 p-3">
  <div class="text-base-content/70 text-sm">
    <p>
      {i18n.dataSource.prefix}<a
        class="inline-text-link"
        href={links.fedWatchTool}
        target="_blank"
        rel="nofollow noopener noreferrer"
        >{i18n.dataSource.fedWatchTool}
      </a>
      <span class="opacity-50">·</span>
      <a
        class="inline-text-link"
        href={links.fomcMeetingCalendar}
        target="_blank"
        rel="nofollow noopener noreferrer"
        >{i18n.dataSource.fomcMeetingCalendar}
      </a>
    </p>

    <p>{i18n.disclaimer}</p>

    <p>
      {i18n.copyright.replace(
        "###year###",
        new Date().getFullYear().toString()
      )}
      <a data-sveltekit-reload class="inline-text-link" href={getMainUrl()}>
        {getMainHostname()}
      </a>
    </p>

    <div class="flex justify-center items-center gap-3">
      <a href={links.email} class="inline-img-link">
        <MailIcon class="h-4" />
      </a>
      <a
        href={links.x}
        target="_blank"
        rel="nofollow noopener noreferrer"
        class="inline-img-link"
      >
        <XIcon class="h-4" />
      </a>
      <a
        href={links.github}
        target="_blank"
        rel="nofollow noopener noreferrer"
        class="inline-img-link"
      >
        <GithubIcon class="h-4" />
      </a>
    </div>
  </div>
</footer>
