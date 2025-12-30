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

function parseTable(viewHTML: string): string {
  // console.log("[fed-watch-html] parseTable");

  const match = viewHTML.match(
    /<table[^>]*>\s*<tr[^>]*>[\s\S]*?<th[^>]*>\s*Target\s+Rate[\s\S]*?<\/th>[\s\S]*?<th[^>]*>\s*Probability[\s\S]*?<\/th>[\s\S]*?<\/tr>([\s\S]*?)<\/table>/i
  );
  if (!match) {
    throw new Error(
      `[fed-watch-html] parseTable - fail with viewHTML: ${viewHTML}`
    );
  }
  const table = match[1].trim();
  // console.log(`[fed-watch-html] parseTable - table: ${table}`);

  return table;
}

function parseRateProbs(table: string): RateProb[] {
  // console.log("[fed-watch-html] parseRateProbs");

  type Cell = { rate: number; prob: number };
  const cells: Cell[] = [];
  let currentCell: Cell | undefined = undefined;

  const regex =
    /<tr[^>]*>\s*<td[^>]*>([^<]+?)<\/td>\s*<td[^>]*>([^<]*?)<\/td>[\s\S]*?<\/tr>/gi;

  let match: RegExpExecArray | null;
  while ((match = regex.exec(table))) {
    const rateText = match[1].trim();
    if (!rateText) continue;
    // console.log(`[fed-watch-html] parseRateProbs - rateText: ${rateText}`);
    const rateTextMatch = rateText.match(/^\d+\-(\d+)(\s*\(Current\))?$/i);
    if (!rateTextMatch) continue;
    const rate = Number(rateTextMatch[1]);
    const isCurrent = !!rateTextMatch[2];

    const probText = match[2].trim();
    if (!probText) continue;
    // console.log(`[fed-watch-html] parseRateProbs - probText: ${probText}`);
    const probTextMatch = probText.match(/^(\d+\.\d)\s*%$/);
    if (!probTextMatch) {
      throw new Error(
        `[fed-watch-html] parseRateProbs - bad probability format with table: ${table}`
      );
    }
    const [v, f] = probTextMatch[1].split(".");
    const prob = Number(v + f.padEnd(1, "0"));

    if (!isCurrent && prob === 0) continue;

    const cell = { rate, prob };
    if (isCurrent) {
      if (currentCell) {
        throw new Error(
          `[fed-watch-html] parseRateProbs - dup current cell with table: ${table}`
        );
      }
      currentCell = cell;
    }

    cells.push(cell);
  }

  if (!currentCell) {
    throw new Error(
      `[fed-watch-html] parseRateProbs - empty current cell with table: ${table}`
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

function parseRateProbsTime(table: string): number {
  // console.log("[fed-watch-html] parseRateProbsTime");

  const monthMap: Record<string, number> = {
    Jan: 0,
    Feb: 1,
    Mar: 2,
    Apr: 3,
    May: 4,
    Jun: 5,
    Jul: 6,
    Aug: 7,
    Sep: 8,
    Oct: 9,
    Nov: 10,
    Dec: 11,
  };

  const match = table.match(
    /Data as of\s+(\d{1,2})\s+(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)\s+(\d{2,4})\s+(\d{1,2}):(\d{1,2}):(\d{1,2})\s+CT\s*\</i
  );
  if (!match) {
    throw new Error(
      `[fed-watch-html] parseRateProbsTime - match fail with table: ${table}`
    );
  }

  const day = parseInt(match[1]);
  const month =
    monthMap[match[2].toLowerCase().replace(/^\w/, (c) => c.toUpperCase())];
  const year = parseInt(match[3]);
  const hour = parseInt(match[4]);
  const minute = parseInt(match[5]);
  const second = parseInt(match[6]);

  const chicagoOffsetHours = (() => {
    const d = new Date(Date.UTC(year, month, day, hour, minute, second));
    const tz = Intl.DateTimeFormat("en-US", {
      timeZone: "America/Chicago",
      timeZoneName: "short",
    }).formatToParts(d);
    // console.log({ tz });
    return tz.some((p) => p.value === "CDT") ? 5 : 6;
  })();

  const time =
    Date.UTC(year, month, day, hour, minute, second) +
    chicagoOffsetHours * 3600 * 1000;
  // console.log(`[fed-watch-html] parseRateProbsTime - time: ${time}`);

  return time;
}

async function fetchData(): Promise<{
  rateProbs: RateProb[];
  rateProbsTime: number;
}> {
  // let st;

  // st = Date.now();
  // const entryHTML = await fetchEntryHTML();
  // console.log(`[fed-watch-html] fetchEntryHTML - elapse: ${Date.now() - st}ms`);

  // const toolsURL = parseToolsURL(entryHTML);
  // const viewURL = convertViewURL(toolsURL);

  // Use static viewURL to enhance efficiency.
  const viewURL =
    "https://cmegroup-tools.quikstrike.net/User/QuikStrikeView.aspx?viewitemid=IntegratedFedWatchTool&userId=lwolf&jobRole=&company=&companyType=";

  // st = Date.now();
  const viewHTML = await fetchViewHTML(viewURL);
  // console.log(`[fed-watch-html] fetchViewHTML - elapse: ${Date.now() - st}ms`);

  // st = Date.now();
  const table = parseTable(viewHTML);
  // console.log(`[fed-watch-html] parseTable - elapse: ${Date.now() - st}ms`);

  // st = Date.now();
  const rateProbs = parseRateProbs(table);
  // console.log(`[fed-watch-html] parseRateProbs - elapse: ${Date.now() - st}ms`);

  // st = Date.now();
  const rateProbsTime = parseRateProbsTime(table);
  // console.log(
  //   `[fed-watch-html] parseRateProbsTime - elapse: ${Date.now() - st}ms`
  // );

  return { rateProbs, rateProbsTime };
}

export {
  parseToolsURL,
  convertViewURL,
  parseTable,
  parseRateProbs,
  parseRateProbsTime,
  fetchData,
};
