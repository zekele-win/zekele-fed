/**
 * Data access layer for FedWatch-related data.
 *
 * Responsibilities:
 * 1. Read cached Fed data from KV
 * 2. Refresh data by fetching CME FedWatch HTML
 * 3. Attach next FOMC meeting time
 */

import type { FedData } from "./types";
import { fetchData } from "./fed-watch-html";
import { getMeetingTime } from "./fomc-meeting";

/**
 * Get Fed data from KV cache.
 *
 * If cache exists, return it directly.
 * If cache is empty (e.g. cold start), return an empty placeholder object.
 *
 * @param env - Cloudflare Worker environment
 * @returns Cached or fallback FedData
 */
export async function getData(env: App.Env): Promise<FedData> {
  // console.log("[store] getData");

  const cacheFedData: FedData | null = await env.KV.get("FED_DATA", "json");
  if (cacheFedData) {
    // console.log(
    //   `[store] getData - cacheFedData: ${JSON.stringify(cacheFedData)}`
    // );
    return cacheFedData;
  }

  // Fallback data for cold start or KV miss
  const fakeFedData: FedData = {
    rateProbs: [],
    rateProbsTime: 0,
    meetingTime: 0,
    cacheTime: Date.now(),
  };
  // console.log(`[store] getData - fakeFedData: ${JSON.stringify(fakeFedData)}`);
  return fakeFedData;
}

/**
 * Refresh Fed data and write it into KV.
 *
 * Workflow:
 * 1. Fetch latest rate probabilities from CME FedWatch HTML
 * 2. Compute next FOMC meeting time
 * 3. Store normalized result into KV
 *
 * @param env - Cloudflare Worker environment
 */
export async function refreshData(env: App.Env): Promise<void> {
  // console.log("[store] refreshData");

  try {
    const theData = await fetchData();
    const theMeetingTime = getMeetingTime();

    const fedData: FedData = {
      rateProbs: theData.rateProbs,
      rateProbsTime: theData.rateProbsTime,
      meetingTime: theMeetingTime,
      cacheTime: Date.now(),
    };

    await env.KV.put("FED_DATA", JSON.stringify(fedData));

    // console.log(`[store] refreshData - fedData: ${JSON.stringify(fedData)}`);
  } catch (error) {
    console.error("[store] refreshData - error:", error);
  }
}
