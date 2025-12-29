import type { FedData } from "./types";
import { fetchData } from "./fed-watch-html";
import { getMeetingTime } from "./fomc-meeting";

export async function getData(env: App.Env): Promise<FedData> {
  // console.log("[store] getData");

  const cacheFedData: FedData | null = await env.KV.get("FED_DATA", "json");
  if (cacheFedData) {
    // console.log(
    //   `[store] getData - cacheFedData: ${JSON.stringify(cacheFedData)}`
    // );
    return cacheFedData;
  }

  const fakeFedData: FedData = {
    rateProbs: [],
    rateProbsTime: 0,
    meetingTime: 0,
    cacheTime: Date.now(),
  };
  // console.log(`[store] getData - fakeFedData: ${JSON.stringify(fakeFedData)}`);
  return fakeFedData;
}

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
