import * as cheerio from "cheerio";
import { Temporal } from "@js-temporal/polyfill";
import { getQueryParam } from "../utils/url";
import type { RateProb } from "./types";

const ENTRY_URL =
  "https://www.cmegroup.com/markets/interest-rates/cme-fedwatch-tool.html";

async function fetchEntryHTML(): Promise<string> {
  // console.log("[fed-watch-html] fetchEntryHTML");

  const res = await fetch(ENTRY_URL, {
    method: "GET",
    headers: {
      "User-Agent":
        "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36",
      Accept:
        "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7",
      "Accept-Language": "en-US,en;q=0.9",
      "Accept-Encoding": "gzip, deflate, br",
      "Cache-Control": "no-cache",
    },
    redirect: "follow",
  });

  if (!res.ok) {
    throw new Error(
      `[fed-watch-html] fetchEntryHTML - http fail with status: ${res.status}`
    );
  }

  const entryHTML = await res.text();
  // console.log(`[fed-watch-html] fetchEntryHTML - entryHTML: ${entryHTML}`);

  return entryHTML;
}

function parseToolsURL(entryHTML: string): string {
  // console.log("[fed-watch-html] parseToolsURL");

  const regex =
    /<iframe[^>]*\ssrc="(https:\/\/cmegroup-tools\.quikstrike\.net\/[^"]*)"/i;
  const match = entryHTML.match(regex);
  if (!match) {
    throw new Error(
      `[fed-watch-html] parseToolsURL - parse fail with entryHTML: ${entryHTML}`
    );
  }

  const toolsURL = match[1].replace(/&amp;/g, "&");
  // console.log(`[fed-watch-html] parseToolsURL - toolsURL: ${toolsURL}`);

  return toolsURL;
}

function convertViewURL(toolsURL: string): string {
  // console.log("[fed-watch-html] convertViewURL");

  const viewParam = getQueryParam(toolsURL, "tmpl") ?? "QuikStrikeView";
  // console.log(`[fed-watch-html] convertViewURL - viewParam: ${viewParam}`);

  const viewURL = toolsURL.replace(
    /User\/QuikStrikeTools\.aspx/i,
    `User/${viewParam}.aspx`
  );
  if (viewURL === toolsURL) {
    throw new Error(
      `[fed-watch-html] convertViewURL - replace fail with toolsURL: ${toolsURL}`
    );
  }
  // console.log(`[fed-watch-html] convertViewURL - viewURL: ${viewURL}`);

  return viewURL;
}

async function fetchViewHTML(viewURL: string): Promise<string> {
  // console.log("[fed-watch-html] fetchViewHTML");

  const res = await fetch(viewURL, {
    method: "GET",
    headers: {
      "User-Agent":
        "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36",
      Accept:
        "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7",
      "Accept-Language": "en-US,en;q=0.9",
      "Accept-Encoding": "gzip, deflate, br",
      "Cache-Control": "no-cache",
      Referer: ENTRY_URL,
    },
    redirect: "follow",
  });

  if (!res.ok) {
    throw new Error(
      `[fed-watch-html] fetchViewHTML - http fail with status: ${res.status}`
    );
  }

  const viewHTML = await res.text();
  // console.log(`[fed-watch-html] fetchViewHTML - viewHTML: ${viewHTML}`);

  return viewHTML;
}

function parseRateProbs(viewHTML: string): RateProb[] {
  // console.log("[fed-watch-html] parseRateProbs");

  const $ = cheerio.load(viewHTML);
  const tables = $("table.grid-thm");

  let $theTable = undefined;
  for (const table of tables.toArray()) {
    const $table = $(table);
    const trs = $table.find("tr");
    for (const tr of trs.toArray()) {
      const $tr = $(tr);
      const trText = $tr.text().trim().toLowerCase();
      if (trText.includes("target rate") && trText.includes("probability")) {
        $theTable = $table;
        break;
      }
    }
    if ($theTable) {
      break;
    }
  }
  if (!$theTable) {
    throw new Error(
      `[fed-watch-html] parseRateProbs - find table fail with viewHTML: ${viewHTML}`
    );
  }

  type Cell = { rate: number; prob: number };
  const cells: Cell[] = [];
  let currentCell: Cell | undefined = undefined;

  $theTable.find("tr").each((_, tr) => {
    const $tr = $(tr);
    if ($tr.hasClass("hide")) return;

    const targetRateTd = $tr.find("td.center");
    if (targetRateTd.length !== 1) return;
    const targetRateText = $(targetRateTd[0]).text().trim();
    const targetRateTextMatch = targetRateText.match(
      /^\d+\-(\d+)(\s*\(Current\))?$/i
    );
    if (!targetRateTextMatch) return;
    const rate = Number(targetRateTextMatch[1]);
    const isCurrent = !!targetRateTextMatch[2];

    const probabilityTd = $tr.find("td.number.highlight");
    if (probabilityTd.length !== 1) {
      throw new Error(
        `[fed-watch-html] parseRateProbs - multi probability td with viewHTML: ${viewHTML}`
      );
    }
    const probabilityText = $(probabilityTd[0]).text().trim();
    const probabilityTextMatch = probabilityText.match(/^(\d+\.\d)\s*%$/);
    if (!probabilityTextMatch) {
      throw new Error(
        `[fed-watch-html] parseRateProbs - bad probability format with viewHTML: ${viewHTML}`
      );
    }
    const [v, f] = probabilityTextMatch[1].split(".");
    const prob = Number(v + f.padEnd(1, "0"));
    if (!isCurrent && prob === 0) return;

    const cell = { rate, prob };
    if (isCurrent) {
      if (currentCell) {
        throw new Error(
          `[fed-watch-html] parseRateProbs - dup current cell with viewHTML: ${viewHTML}`
        );
      }
      currentCell = cell;
    }

    cells.push(cell);
  });
  if (!currentCell) {
    throw new Error(
      `[fed-watch-html] parseRateProbs - empty current cell with viewHTML: ${viewHTML}`
    );
  }

  const rateProbs = cells
    .sort((a, b) => a.rate - b.rate)
    .map<RateProb>((v) => ({
      ...v,
      deltaRate: v.rate - currentCell!.rate,
    }));

  // console.log(
  //   `[fed-watch-html] parseRateProbs - rateProbs: ${JSON.stringify(rateProbs)}`
  // );

  return rateProbs;
}

function parseRateProbsTime(viewHTML: string): number {
  // console.log("[fed-watch-html] parseRateProbsTime");

  const monthMap: Record<string, number> = {
    Jan: 1,
    Feb: 2,
    Mar: 3,
    Apr: 4,
    May: 5,
    Jun: 6,
    Jul: 7,
    Aug: 8,
    Sep: 9,
    Oct: 10,
    Nov: 11,
    Dec: 12,
  };

  const regex =
    /Data as of\s+(\d{1,2})\s+(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)\s+(\d{2,4})\s+(\d{1,2}):(\d{1,2}):(\d{1,2}) CT\s*\</i;
  const match = viewHTML.match(regex);
  if (!match) {
    throw new Error(
      `[fed-watch-html] parseRateProbsTime - parse fail with viewHTML: ${viewHTML}`
    );
  }

  const day = parseInt(match[1]);
  const month =
    monthMap[match[2].toLowerCase().replace(/^\w/, (c) => c.toUpperCase())];
  const year = parseInt(match[3]);
  const hour = parseInt(match[4]);
  const minute = parseInt(match[5]);
  const second = parseInt(match[6]);

  const zdt = Temporal.ZonedDateTime.from({
    year,
    month,
    day,
    hour,
    minute,
    second,
    timeZone: "America/Chicago",
  });

  const rateProbsDate = new Date(zdt.epochMilliseconds);
  if (isNaN(rateProbsDate.getTime())) {
    throw new Error(
      `[fed-watch-html] parseRateProbsTime - invalid rateProbsDate with viewHTML: ${viewHTML}`
    );
  }
  // console.log(
  //   `[fed-watch-html] parseRateProbsTime - rateProbsDate: ${rateProbsDate}`
  // );

  const rateProbsTime = rateProbsDate.getTime();
  // console.log(
  //   `[fed-watch-html] parseRateProbsTime - rateProbsTime: ${rateProbsTime}`
  // );

  return rateProbsTime;
}

async function fetchData(): Promise<{
  rateProbs: RateProb[];
  rateProbsTime: number;
}> {
  let st;

  // st = Date.now();
  // const entryHTML = await fetchEntryHTML();
  // console.log(`[fed-watch-html] fetchEntryHTML - elapse: ${Date.now() - st}ms`);

  // const toolsURL = parseToolsURL(entryHTML);
  // const viewURL = convertViewURL(toolsURL);

  // Use static viewURL to enhance efficiency.
  const viewURL =
    "https://cmegroup-tools.quikstrike.net/User/QuikStrikeView.aspx?viewitemid=IntegratedFedWatchTool&userId=lwolf&jobRole=&company=&companyType=";

  st = Date.now();
  const viewHTML = await fetchViewHTML(viewURL);
  // console.log(`[fed-watch-html] fetchViewHTML - elapse: ${Date.now() - st}ms`);

  return {
    rateProbs: parseRateProbs(viewHTML),
    rateProbsTime: parseRateProbsTime(viewHTML),
  };
}

export {
  parseToolsURL,
  convertViewURL,
  parseRateProbs,
  parseRateProbsTime,
  fetchData,
};
