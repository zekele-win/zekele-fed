/**
 * Static FOMC meeting calendar and helper to resolve
 *   the next upcoming meeting time based on current timestamp.
 *
 * All times are in UTC.
 */

const URL =
  "https://www.cmegroup.com/markets/interest-rates/cme-fedwatch-tool.HTML";

/**
 * Fetch the Federal Open Market Committee HTML page.
 *
 * @returns the Federal Open Market Committee HTML
 */
async function fetchHTML(): Promise<string> {
  //   console.log("[fomc-meeting-html] fetchHTML");

  const res = await fetch(URL, {
    method: "GET",
    headers: {
      "User-Agent":
        "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36",
      Accept:
        "text/HTML,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7",
      "Accept-Language": "en-US,en;q=0.9",
      "Accept-Encoding": "gzip, deflate, br",
      "Cache-Control": "no-cache",
    },
    redirect: "follow",
  });

  if (!res.ok) {
    throw new Error(
      `[fomc-meeting-html] fetchEntryHTML - http fail with status: ${res.status}`,
    );
  }

  const HTML = await res.text();
  //   console.log(`[fomc-meeting-html] fetchEntryHTML - entryHTML: ${HTML}`);

  return HTML;
}

/**
 * Extract the FOMC meeting times from the HTML.
 *
 * @param HTML - the Federal Open Market Committee HTML
 * @returns the FOMC meeting times
 */
function parseMeetingTimes(HTML: string): number[] {
  //   console.log(`[fomc-meeting-html] parseMeetingTimes`);

  const timestamps: number[] = [];

  // 提取所有年份（包含位置索引）
  const yearRegex = /<a id="\d+">(\d{4}) FOMC Meetings<\/a>/g;
  const years: { year: number; index: number }[] = [];
  let yearMatch: RegExpExecArray | null;
  while ((yearMatch = yearRegex.exec(HTML)) !== null) {
    years.push({
      year: parseInt(yearMatch[1]),
      index: yearMatch.index,
    });
  }
  if (years.length === 0) {
    throw new Error(
      "[fomc-meeting-html] parseMeetingTimes - No FOMC meeting years found in HTML",
    );
  }

  // 提取所有月份（包含位置索引）
  // 支持常规月份和 Apr/May 这样的跨月格式
  const monthRegex =
    /<div[^>]*class="[^"]*fomc-meeting__month[^"]*"[^>]*>(?:<\w+>)?\s*([A-Za-z/]+)\s*(?:<\/\w+>)?/g;
  const months: { month: string; index: number }[] = [];
  let monthMatch: RegExpExecArray | null;
  while ((monthMatch = monthRegex.exec(HTML)) !== null) {
    months.push({
      month: monthMatch[1],
      index: monthMatch.index,
    });
  }
  if (months.length === 0) {
    throw new Error(
      "[fomc-meeting-html] parseMeetingTimes - No FOMC meeting months found in HTML",
    );
  }

  // 提取所有日期（包含位置索引）
  // 匹配 >DD-DD< 或 >DD-DD*< 格式，只取结束日期
  const dateRegex =
    /<div[^>]*class="[^"]*fomc-meeting__date[^"]*"[^>]*>\s*(\d{1,2})-(\d{1,2})(?:\*)?\s*</g;
  const dates: { endDay: number; index: number }[] = [];
  let dateMatch: RegExpExecArray | null;
  while ((dateMatch = dateRegex.exec(HTML)) !== null) {
    const endDay = parseInt(dateMatch[2]);

    // 验证结束日期是否在 1-31 之间
    if (endDay < 1 || endDay > 31) {
      throw new Error(
        `[fomc-meeting-html] parseMeetingTimes - Invalid end day: ${endDay} (must be between 1-31)`,
      );
    }

    dates.push({
      endDay: endDay,
      index: dateMatch.index,
    });
  }
  if (dates.length === 0) {
    throw new Error(
      "[fomc-meeting-html] parseMeetingTimes - No FOMC meeting dates found in HTML",
    );
  }

  // 月份映射（支持缩写和完整名称）
  const monthMap: Record<string, number> = {
    January: 0,
    Jan: 0,
    February: 1,
    Feb: 1,
    March: 2,
    Mar: 2,
    April: 3,
    Apr: 3,
    May: 4,
    June: 5,
    Jun: 5,
    July: 6,
    Jul: 6,
    August: 7,
    Aug: 7,
    September: 8,
    Sep: 8,
    Sept: 8,
    October: 9,
    Oct: 9,
    November: 10,
    Nov: 10,
    December: 11,
    Dec: 11,
  };

  // 匹配每个日期对应的月份和年份
  for (const date of dates) {
    // 找到最近的月份（在日期之前）
    let nearestMonth: string | null = null;
    for (let i = months.length - 1; i >= 0; i--) {
      if (months[i].index < date.index) {
        nearestMonth = months[i].month;
        break;
      }
    }
    if (!nearestMonth) {
      throw new Error(
        `[fomc-meeting-html] parseMeetingTimes - No matching month found for date ending on day ${date.endDay} at position ${date.index}`,
      );
    }

    // 处理跨月情况，如 "Apr/May"，取结束月份
    let monthName: string;
    if (nearestMonth.includes("/")) {
      // 取斜杠后面的月份（结束月份）
      const parts = nearestMonth.split("/");
      monthName = parts[parts.length - 1];
    } else {
      monthName = nearestMonth;
    }

    const monthIndex = monthMap[monthName];
    if (monthIndex === undefined) {
      throw new Error(
        `[fomc-meeting-html] parseMeetingTimes - Unknown month name: ${monthName} (from: ${nearestMonth})`,
      );
    }

    // 找到最近的年份（在日期之前）
    let nearestYear: number | null = null;
    for (let i = years.length - 1; i >= 0; i--) {
      if (years[i].index < date.index) {
        nearestYear = years[i].year;
        break;
      }
    }
    if (!nearestYear) {
      throw new Error(
        `[fomc-meeting-html] parseMeetingTimes - No matching year found for date ending on day ${date.endDay} at position ${date.index}`,
      );
    }

    // 验证日期是否真实存在
    const maxDay = new Date(nearestYear, monthIndex + 1, 0).getDate();
    if (date.endDay > maxDay) {
      throw new Error(
        `[fomc-meeting-html] parseMeetingTimes - Invalid day ${date.endDay} for month ${monthName} ${nearestYear} (max ${maxDay} days)`,
      );
    }

    // 根据日期判断夏令时
    function isDST(year: number, month: number, day: number): boolean {
      // 美国夏令时规则：3月第二个周日开始，11月第一个周日结束
      // 如果日期在3月第二个周日之后且在11月第一个周日之前，则为夏令时
      const date = new Date(year, month, day);

      // 计算3月第二个周日
      const marchFirst = new Date(year, 2, 1);
      const marchSecondSunday = new Date(
        year,
        2,
        1 + ((7 - marchFirst.getDay()) % 7) + 7,
      );

      // 计算11月第一个周日
      const novemberFirst = new Date(year, 10, 1);
      const novemberFirstSunday = new Date(
        year,
        10,
        1 + ((7 - novemberFirst.getDay()) % 7),
      );

      return date >= marchSecondSunday && date < novemberFirstSunday;
    }

    // 会议结束时间：夏令时 UTC 19:00，冬令时 UTC 18:00
    const hourUTC = isDST(nearestYear, monthIndex, date.endDay) ? 18 : 19;

    // 生成时间戳
    const timestamp = Date.UTC(
      nearestYear,
      monthIndex,
      date.endDay,
      hourUTC,
      0,
      0,
    );
    timestamps.push(timestamp);
  }

  //   console.log(
  //     `[fomc-meeting-html] parseMeetingTimes - timestamps: ${JSON.stringify(timestamps.map((t) => new Date(t).toISOString()))}`,
  //   );

  return timestamps;
}

/**
 * Returns the timestamp of the next upcoming FOMC meeting.
 *
 * @param currentTime - Current time in milliseconds (defaults to Date.now())
 * @returns Meeting time in milliseconds
 * @throws If no future meeting date is found
 */
async function getMeetingTime(
  currentTime: number = Date.now(),
): Promise<number> {
  //   let st;

  //   st = Date.now();
  const HTML = await fetchHTML();
  //   console.log(`[fomc-meeting-html] fetchHTML - elapse: ${Date.now() - st}ms`);

  //   st = Date.now();
  const timestamps = parseMeetingTimes(HTML);
  //   console.log(
  //     `[fomc-meeting-html] parseMeetingTimes - elapse: ${Date.now() - st}ms`,
  //   );

  for (const timestamp of timestamps) {
    // First meeting strictly after current time
    if (timestamp > currentTime) {
      return timestamp;
    }
  }

  throw new Error(
    "[fomc-meeting-html] getMeetingTime - No upcoming FOMC meeting date found.",
  );
}

export { parseMeetingTimes, getMeetingTime };
