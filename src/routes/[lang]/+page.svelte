<script lang="ts">
  import { onMount } from "svelte";
  import type { PageProps } from "./$types";
  import type { RateProb } from "$lib/fed";

  const { data }: PageProps = $props();
  const { i18n, fedData: initFedData } = (() => data)();

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
      fedData = { ...data.fedData };
      getFedDataTS = Date.now();
      // console.log({ fedData: JSON.stringify(fedData) });
    } catch (error) {
      console.error("Error fetching Fed data:", error);
    } finally {
      getFedDataING = false;
      // console.log("end getFedData");
    }
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

  const formatRateProbsStyle = (rateProb: RateProb | null) => {
    const maxRateProb = fedData.rateProbs
      .filter((c) => c.deltaRate !== 0)
      .reduce<RateProb | null>(
        (max, cur) => (!max || cur.prob > max.prob ? cur : max),
        null
      );
    return !rateProb || rateProb !== maxRateProb ? "text-base-content/50" : "";
  };

  const calcRateProbsElapse = () => {
    if (fedData.rateProbsTime === 0) return null;

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
    if (fedData.meetingTime === 0) return null;

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

<h1
  class="text-xl text-center text-base-content/70 my-3 sm:hidden sm:sr-only"
  id="main-name"
>
  {i18n.name}
</h1>

<section
  class="flex flex-col items-center justify-center w-full gap-9 mb-3"
  aria-labelledby="main-name"
>
  <div class="flex flex-col w-full gap-3">
    <div
      class="flex flex-col sm:flex-row items-center justify-center w-full gap-0 sm:gap-3"
    >
      {#each fedData.rateProbs as rateProb, idx}
        <h2 class="sr-only" id={`fomc-rate-probability-${idx + 1}`}>
          {formatRateProbDesc(rateProb)}
        </h2>
        <section
          class="flex flex-col items-center p-3
        {formatRateProbsStyle(rateProb)}"
          aria-labelledby="fomc-rate-probability-${idx + 1}"
        >
          <p class="text-base">{formatRateText(rateProb)}</p>
          <p class="text-6xl">
            {formatProbText(rateProb)}
          </p>
        </section>
      {:else}
        <p
          class="text-6xl text-base-content/70
        {formatRateProbsStyle(null)}"
        >
          N/A
        </p>
      {/each}
    </div>

    <section
      class="flex items-center justify-center text-sm text-base-content/70 w-full gap-1"
    >
      <span>{i18n.updateTime.prefix}</span>
      {#if rateProbsElapse}
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
      {:else}
        N/A
      {/if}
      <span>{i18n.updateTime.suffix}</span>
    </section>
  </div>

  <div class="flex flex-col items-center justify-center w-full gap-1">
    <h2 class="text-sm text-base-content/70" id="fomc-meeting-countdown">
      {i18n.nextMeetingCountdown}
    </h2>
    <section class="flex gap-4" aria-labelledby="fomc-meeting-countdown">
      {#if meetingCountdown}
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
      {:else}
        <p class="text-3xl text-base-content/70">N/A</p>
      {/if}
    </section>
  </div>
</section>
