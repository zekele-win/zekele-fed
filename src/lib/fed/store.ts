import type { FedData } from "./types";
import { fetchData } from "./fed-watch-html";
import { getMeetingTime } from "./fomc-meeting";

const TTL = 4.9 * 60; // units: seconds

export async function getData(env: App.Env): Promise<FedData> {
  // console.log("[store] getData");

  const cache: any | null = await env.KV.get("FED_DATA", "json");
  // console.log(`[store] getData - cache: ${JSON.stringify(cache)}`);

  const now = Date.now();
  if (cache && now - cache.cacheTime < TTL * 1000) {
    // console.log(`[store] getData - cache data: ${JSON.stringify(cache)}`);
    return cache;
  }

  const fedData: FedData = {
    rateProbs: [],
    rateProbsTime: 0,
    meetingTime: 0,
    cacheTime: now,
  };
  try {
    const theFedData = await fetchData();
    const theMeetingTime = getMeetingTime();
    fedData.rateProbs = theFedData.rateProbs;
    fedData.rateProbsTime = theFedData.rateProbsTime;
    fedData.meetingTime = theMeetingTime;
  } catch (error) {
    console.error(
      "[store] getData - fetchData or getMeetingTime error:",
      error
    );
    return cache ?? fedData;
  }

  await env.KV.put("FED_DATA", JSON.stringify(fedData));

  // console.log(`[store] getData - instant data: ${JSON.stringify(fedData)}`);
  return fedData;
}
