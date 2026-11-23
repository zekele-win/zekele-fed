<script lang="ts">
  import { onMount } from "svelte";
  import { page } from "$app/state";
  import type { PageProps } from "./$types";
  import type { RateProb } from "$lib/fed";
  import links from "$lib/meta/links";

  const { data }: PageProps = $props();
  const { i18n, lang, fedData: initFedData } = (() => data)();

  const ogImageUrl = `${page.url.origin}/og/og-${lang}.png`;
  const jsonLdString = JSON.stringify({
    "@context": "https://schema.org",
    "@type": "WebApplication",
    applicationCategory: "FinanceApplication",
    operatingSystem: "Web",
    inLanguage: lang,
    name: i18n.title,
    alternateName: i18n.name,
    description: i18n.desc,
    url: page.url.href,
    image: ogImageUrl,
    dateModified: initFedData
      ? new Date(initFedData.rateProbsTime).toISOString()
      : undefined,
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
    },
    author: {
      "@type": "Organization",
      name: "Zekele",
      url: links.x,
      sameAs: [links.x, links.github],
    },
  });

  let fedData = $state(initFedData);

  let getFedDataTS = 0;
  let getFedDataING = false;

  const getFedData = async () => {
    if (getFedDataING) return;

    // console.log("begin getFedData");
    getFedDataING = true;
    try {
      const res = await fetch("/api/get-fed-data");
      const data = await res.json();
      fedData = data.fedData;
      getFedDataTS = Date.now();
      // console.log({ fedData: JSON.stringify(fedData) });
    } catch (error) {
      console.error("Error fetching Fed data:", error);
    } finally {
      getFedDataING = false;
      // console.log("end getFedData");
    }
  };

  const getCurrentRateProb = () => {
    if (!fedData) return null;
    return fedData.rateProbs.find((c) => c.deltaRate === 0) || null;
  };

  let currentRateProb = $derived(getCurrentRateProb());

  const formatRateRangeText = (rateProb: RateProb) => {
    return `${(rateProb.fromRate / 100).toFixed(2)}% - ${(rateProb.rate / 100).toFixed(2)}%`;
  };

  const isMaxProb = (rateProbs: RateProb[], rateProb: RateProb) => {
    const maxRateProb = rateProbs
      .filter((c) => c.deltaRate !== 0)
      .reduce<RateProb | null>(
        (max, cur) => (!max || cur.prob > max.prob ? cur : max),
        null,
      );
    return rateProb === maxRateProb;
  };

  const formatRateText = (rateProb: RateProb) => {
    if (rateProb.deltaRate === 0) {
      return i18n.noChangeProbability;
    }
    if (rateProb.deltaRate > 0) {
      return `${i18n.hikeProbability} ${rateProb.deltaRate} bps`;
    } else {
      return `${i18n.cutProbability} ${Math.abs(rateProb.deltaRate)} bps`;
    }
  };

  const formatProbText = (rateProb: RateProb) => {
    return (rateProb.prob / 10).toFixed(1) + "%";
  };

  const formatRateProbDesc = (rateProb: RateProb) => {
    if (rateProb.deltaRate > 0) {
      return `${i18n.hikeProbabilityDescription.prefix}${rateProb.deltaRate}${i18n.hikeProbabilityDescription.suffix}${formatProbText(rateProb)}`;
    } else if (rateProb.deltaRate < 0) {
      return `${i18n.cutProbabilityDescription.prefix}${Math.abs(rateProb.deltaRate)}${i18n.cutProbabilityDescription.suffix}${formatProbText(rateProb)}`;
    } else {
      return `${i18n.noChangeProbabilityDescription.suffix}${formatProbText(rateProb)}`;
    }
  };

  const calcRateProbsElapse = () => {
    if (!fedData) return null;

    const diff = Date.now() - fedData.rateProbsTime;
    const days = diff <= 0 ? 0 : Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours =
      diff <= 0
        ? 0
        : Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes =
      diff <= 0 ? 0 : Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

    return { days, hours, minutes };
  };

  let rateProbsElapse = $derived(calcRateProbsElapse());

  const calcMeetingCountdown = () => {
    if (!fedData) return null;

    const diff = fedData.meetingTime - Date.now();
    const days = diff <= 0 ? 0 : Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours =
      diff <= 0
        ? 0
        : Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes =
      diff <= 0 ? 0 : Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    return { days, hours, minutes };
  };

  let meetingCountdown = $derived(calcMeetingCountdown());

  const getFedDataDelay = 4.5 * 60 * 1000;
  const getFedDataDelayForForce = 30 * 1000;
  const tickDelay = 10 * 1000;

  const tick = (force = false) => {
    const now = Date.now();

    if (force) {
      if (now - getFedDataTS >= getFedDataDelayForForce) {
        // console.log("tick with getFedData for force");
        getFedData();
      }
    } else {
      if (now - getFedDataTS >= getFedDataDelay) {
        // console.log("tick with getFedData");
        getFedData();
      }
    }

    // console.log("tick for calcRateProbsElapse");
    rateProbsElapse = calcRateProbsElapse();

    // console.log("tick for calcMeetingCountdown");
    meetingCountdown = calcMeetingCountdown();
  };

  let timer: number | null = null;

  const start = () => {
    if (timer) return;
    // console.log("start ticking");
    tick(true);
    timer = window.setInterval(tick, tickDelay);
  };

  const stop = () => {
    if (!timer) return;
    // console.log("stop ticking");
    clearInterval(timer);
    timer = null;
  };

  const onVisibilityChange = () => {
    // console.log(
    //   `onVisibilityChange: ${document.visibilityState} at ${new Date().toISOString()}`
    // );
    document.visibilityState === "visible" ? start() : stop();
  };

  const onFocus = () => {
    // console.log(`onFocus at ${new Date().toISOString()}`);
    start();
  };

  const onBlur = () => {
    // console.log(`onBlur at ${new Date().toISOString()}`);
    stop();
  };

  onMount(() => {
    start();

    document.addEventListener("visibilitychange", onVisibilityChange);
    window.addEventListener("focus", onFocus);
    window.addEventListener("blur", onBlur);

    return () => {
      document.removeEventListener("visibilitychange", onVisibilityChange);
      window.removeEventListener("focus", onFocus);
      window.removeEventListener("blur", onBlur);
    };
  });
</script>

<svelte:head>
  {@html `<script type="application/ld+json">${jsonLdString}<\/script>`}
</svelte:head>

<h1 class="text-lg text-center mb-3 md:sr-only" id="main-name">
  {i18n.name}
</h1>

<section
  class="flex flex-col items-center justify-center w-full gap-3"
  aria-labelledby="main-name"
>
  {#if fedData}
    {#if currentRateProb}
      <div class="card bg-base-200 border border-base-300 w-full max-w-xl">
        <div class="card-body items-center text-center gap-1 p-4">
          <h2 class="text-sm text-base-content/70" id="fomc-current-rate-range">
            {i18n.currentRateRange}
          </h2>
          <p class="text-3xl text-base-content/80">
            {formatRateRangeText(currentRateProb)}
          </p>
        </div>
      </div>
    {/if}

    <div class="card bg-base-200 border border-base-300 w-full max-w-xl">
      <div class="card-body items-center text-center gap-1 p-4">
        <div
          class="flex flex-col md:flex-row items-center justify-center gap-0 md:gap-3"
        >
          {#each fedData.rateProbs as rateProb, idx}
            <h2 class="sr-only" id={`fomc-rate-probability-${idx + 1}`}>
              {formatRateProbDesc(rateProb)}
            </h2>
            <section
              class="flex flex-col items-center p-1 {isMaxProb(
                fedData.rateProbs,
                rateProb,
              )
                ? ''
                : 'text-base-content/50'}"
              aria-labelledby="fomc-rate-probability-${idx + 1}"
            >
              <p class="text-base">{formatRateText(rateProb)}</p>
              <p class="text-6xl">
                {formatProbText(rateProb)}
              </p>
            </section>
          {/each}
        </div>

        {#if rateProbsElapse}
          <section
            class="flex items-center justify-center text-sm text-base-content/70 w-full gap-1"
          >
            <span class="relative flex opacity-70 h-2 w-2">
              <span
                class="animate-ping absolute inline-flex h-full w-full rounded-full bg-success"
                style="animation-duration: 4s;"
              >
              </span>
              <span class="relative inline-flex rounded-full h-2 w-2 bg-success">
              </span>
            </span>
            {#if rateProbsElapse.days || rateProbsElapse.hours || rateProbsElapse.minutes}
              <span>{i18n.updateTime.prefix}</span>
              <time
                datetime={new Date(fedData.rateProbsTime).toISOString()}
                title={new Date(fedData.rateProbsTime).toLocaleString()}
              >
                {#if rateProbsElapse.days !== 0}
                  <span>
                    {rateProbsElapse.days}{i18n.shortDays}
                  </span>
                {/if}
                {#if rateProbsElapse.hours !== 0}
                  <span>
                    {rateProbsElapse.hours}{i18n.shortHours}
                  </span>
                {/if}
                <span>
                  {rateProbsElapse.minutes}{i18n.shortMinutes}
                </span>
              </time>
              <span>{i18n.updateTime.suffix}</span>
            {:else}
              <span>{i18n.updateTime.just}</span>
            {/if}
          </section>
        {/if}
      </div>
    </div>

    {#if meetingCountdown}
      <div class="card bg-base-200 border border-base-300 w-full max-w-xl">
        <div class="card-body items-center text-center gap-1 p-4">
          <h2 class="text-sm text-base-content/70" id="fomc-meeting-countdown">
            {i18n.nextMeetingCountdown}
          </h2>
          <div class="flex gap-4 text-base-content/80">
            {#if meetingCountdown.days !== 0}
              <p>
                <span class="text-3xl">{meetingCountdown.days}</span>
                <span class="text-sm">{i18n.days}</span>
              </p>
            {/if}
            {#if meetingCountdown.hours !== 0}
              <p>
                <span class="text-3xl">{meetingCountdown.hours}</span>
                <span class="text-sm">{i18n.hours}</span>
              </p>
            {/if}
            <p>
              <span class="text-3xl">{meetingCountdown.minutes}</span>
              <span class="text-sm">{i18n.minutes}</span>
            </p>
          </div>
        </div>
      </div>
    {/if}
  {:else}
    <p class="text-base-content/70 font-extralight text-3xl py-12">
      {i18n.noData}
    </p>
  {/if}

  <section
    class="card bg-base-200 border border-base-300 w-full max-w-xl overflow-hidden"
  >
    <h2 class="sr-only" id="about-fed-probabilities">{i18n.about.heading}</h2>
    <details
      class="collapse collapse-arrow border-b border-base-300 rounded-none"
      open
    >
      <summary class="collapse-title font-medium">{i18n.about.what.title}</summary>
      <div class="collapse-content text-sm text-base-content/80">
        <p>{i18n.about.what.body}</p>
      </div>
    </details>
    <details
      class="collapse collapse-arrow border-b border-base-300 rounded-none"
    >
      <summary class="collapse-title font-medium">{i18n.about.how.title}</summary>
      <div class="collapse-content text-sm text-base-content/80">
        <p>{i18n.about.how.body}</p>
      </div>
    </details>
    <details class="collapse collapse-arrow rounded-none">
      <summary class="collapse-title font-medium">{i18n.about.read.title}</summary>
      <div class="collapse-content text-sm text-base-content/80">
        <p>{i18n.about.read.body}</p>
      </div>
    </details>
  </section>
</section>
