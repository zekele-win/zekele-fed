import { describe, it, expect } from "vitest";
import {
  parseToolsURL,
  convertViewURL,
  parseRateProbs,
  parseRateProbsTime,
} from "./fed-watch-html";

describe("parseToolsURL", () => {
  const cases = [
    {
      name: "should work",
      entryHTML: `
        <iframe src="https://cmegroup-tools.quikstrike.net/" />
      `,
      expected: "https://cmegroup-tools.quikstrike.net/",
    },
    {
      name: "should work with '<IFRAME'",
      entryHTML: `
        <IFRAME src="https://cmegroup-tools.quikstrike.net/" />
      `,
      expected: "https://cmegroup-tools.quikstrike.net/",
    },
    {
      name: "should work with '</iframe>'",
      entryHTML: `
        <iframe src="https://cmegroup-tools.quikstrike.net/">
        </iframe>
      `,
      expected: "https://cmegroup-tools.quikstrike.net/",
    },
    {
      name: "should work with query params",
      entryHTML: `
        <iframe src="https://cmegroup-tools.quikstrike.net/somepath?x=1&y=2">
        </iframe>
      `,
      expected: "https://cmegroup-tools.quikstrike.net/somepath?x=1&y=2",
    },
    {
      name: "should work with other attributes",
      entryHTML: `
        <iframe
          width="100"
          height="100"
          src="https://cmegroup-tools.quikstrike.net/somepath?x=1&amp;y=2">
        </iframe>
      `,
      expected: "https://cmegroup-tools.quikstrike.net/somepath?x=1&y=2",
    },
    {
      name: "should throw with unknown url 1",
      entryHTML: `
        <iframe src="https://cmegroup-tools-.quikstrike.net/" />
      `,
    },
    {
      name: "should throw with unknown url 2",
      entryHTML: `
        <iframe src="https://cmegroup-tools.quikstrike.com/" />
      `,
    },
    {
      name: "should throw with unknown url 3",
      entryHTML: `
        <iframe src="https://cmegroup-tools.quiksview.net/" />
      `,
    },
  ];

  cases.forEach(({ name, entryHTML, expected }) => {
    it(name, () => {
      if (expected) {
        expect(parseToolsURL(entryHTML)).toBe(expected);
      } else {
        expect(() => {
          convertViewURL(entryHTML);
        }).toThrowError();
      }
    });
  });
});

describe("convertViewURL", () => {
  const cases = [
    {
      name: "should work",
      toolsURL: "https://test.site/User/QuikStrikeTools.aspx?a=aa&b=bb",
      expected: "https://test.site/User/QuikStrikeView.aspx?a=aa&b=bb",
    },
    {
      name: "should work with lower case",
      toolsURL: "https://test.site/user/quikstriketools.aspx?a=aa&b=bb",
      expected: "https://test.site/User/QuikStrikeView.aspx?a=aa&b=bb",
    },
    {
      name: "should work with the query param of 'tmpl'",
      toolsURL:
        "https://test.site/User/QuikStrikeTools.aspx?a=aa&b=bb&tmpl=Abcd",
      expected: "https://test.site/User/Abcd.aspx?a=aa&b=bb&tmpl=Abcd",
    },
    {
      name: "should throw with the unknown tools url'",
      toolsURL: "https://test.site/User/QuikStrikeTools1.aspx?a=aa&b=bb",
    },
  ];

  cases.forEach(({ name, toolsURL, expected }) => {
    it(name, () => {
      if (expected) {
        expect(convertViewURL(toolsURL)).toBe(expected);
      } else {
        expect(() => {
          convertViewURL(toolsURL);
        }).toThrowError();
      }
    });
  });
});

describe("parseRateProbs", () => {
  const cases = [
    {
      name: "should work",
      viewHTML: `
        <table class="grid-thm grid-thm-v2 w-lg">
            <tr>
                <th rowspan="2">Target Rate (bps)</th>
                <th colspan="4">Probability(%)</th>
            </tr>

            <tr class="">
                <td class="center">325-350 </td>
                <td class="number highlight">24.4%</td>
                <td class="number">24.4%</td>
                <td class="number">21.6%</td>
                <td class="number">16.7%</td>
            </tr>

            <tr class="">
                <td class="center">350-375 (Current)</td>
                <td class="number highlight">75.6%</td>
                <td class="number">75.6%</td>
                <td class="number">69.8%</td>
                <td class="number">48.6%</td>
            </tr>

            <tr class="">
                <td class="center">375-400 </td>
                <td class="number highlight">10.5%</td>
                <td class="number">0.0%</td>
                <td class="number">8.6%</td>
                <td class="number">34.7%</td>
            </tr>
        </table>
      `,
      expected: [
        {
          deltaRate: -25,
          rate: 350,
          prob: 244,
        },
        {
          deltaRate: 0,
          rate: 375,
          prob: 756,
        },
        {
          deltaRate: 25,
          rate: 400,
          prob: 105,
        },
      ],
    },
    {
      name: "should work with 0 probability",
      viewHTML: `
        <table class="grid-thm grid-thm-v2 w-lg">
            <tr>
                <th rowspan="2">Target Rate (bps)</th>
                <th colspan="4">Probability(%)</th>
            </tr>

            <tr class="">
                <td class="center">325-350 </td>
                <td class="number highlight">24.4%</td>
                <td class="number">24.4%</td>
                <td class="number">21.6%</td>
                <td class="number">16.7%</td>
            </tr>

            <tr class="">
                <td class="center">350-375 (Current)</td>
                <td class="number highlight">75.6%</td>
                <td class="number">75.6%</td>
                <td class="number">69.8%</td>
                <td class="number">48.6%</td>
            </tr>

            <tr class="">
                <td class="center">375-400 </td>
                <td class="number highlight">0.0%</td>
                <td class="number">0.0%</td>
                <td class="number">8.6%</td>
                <td class="number">34.7%</td>
            </tr>
        </table>
      `,
      expected: [
        {
          deltaRate: -25,
          rate: 350,
          prob: 244,
        },
        {
          deltaRate: 0,
          rate: 375,
          prob: 756,
        },
      ],
    },
    {
      name: "should work with hide tr",
      viewHTML: `
        <table class="grid-thm grid-thm-v2 w-lg">
            <tr>
                <th rowspan="2">Target Rate (bps)</th>
                <th colspan="4">Probability(%)</th>
            </tr>

            <tr class="hide">
                <td class="center">300-325 </td>
                <td class="number highlight">10.5%</td>
                <td class="number">0.0%</td>
                <td class="number">0.0%</td>
                <td class="number">0.0%</td>
            </tr>

            <tr class="">
                <td class="center">325-350 </td>
                <td class="number highlight">24.4%</td>
                <td class="number">24.4%</td>
                <td class="number">21.6%</td>
                <td class="number">16.7%</td>
            </tr>

            <tr class="">
                <td class="center">350-375 (Current)</td>
                <td class="number highlight">75.6%</td>
                <td class="number">75.6%</td>
                <td class="number">69.8%</td>
                <td class="number">48.6%</td>
            </tr>

            <tr class="">
                <td class="center">375-400 </td>
                <td class="number highlight">10.5%</td>
                <td class="number">0.0%</td>
                <td class="number">8.6%</td>
                <td class="number">34.7%</td>
            </tr>

            <tr class="hide">
                <td class="center">400-425 </td>
                <td class="number highlight">10.5%</td>
                <td class="number">0.0%</td>
                <td class="number">0.0%</td>
                <td class="number">0.0%</td>
            </tr>
        </table>
      `,
      expected: [
        {
          deltaRate: -25,
          rate: 350,
          prob: 244,
        },
        {
          deltaRate: 0,
          rate: 375,
          prob: 756,
        },
        {
          deltaRate: 25,
          rate: 400,
          prob: 105,
        },
      ],
    },
    {
      name: "should work with unknown center cells",
      viewHTML: `
        <table class="grid-thm grid-thm-v2 w-lg">
            <tr>
                <th rowspan="2">Target Rate (bps)</th>
                <th colspan="4">Probability(%)</th>
            </tr>

            <tr class="">
                <td class="center">325-350 </td>
                <td class="number highlight">24.4%</td>
                <td class="number">24.4%</td>
                <td class="number">21.6%</td>
                <td class="number">16.7%</td>
            </tr>

            <tr class="">
                <td class="center">350-375 (Current)</td>
                <td class="number highlight">75.6%</td>
                <td class="number">75.6%</td>
                <td class="number">69.8%</td>
                <td class="number">48.6%</td>
            </tr>

            <tr class="">
                <td class="center">375-400 </td>
                <td class="number highlight">10.5%</td>
                <td class="number">0.0%</td>
                <td class="number">8.6%</td>
                <td class="number">34.7%</td>
            </tr>

            <tr class="odd">
              <td colspan="5" class="center" style="color:darkgray">* Data as of 16 12月 2025 01:32:40 CT</td>
            </tr>
        </table>
      `,
      expected: [
        {
          deltaRate: -25,
          rate: 350,
          prob: 244,
        },
        {
          deltaRate: 0,
          rate: 375,
          prob: 756,
        },
        {
          deltaRate: 25,
          rate: 400,
          prob: 105,
        },
      ],
    },

    {
      name: "should work with unordered cells",
      viewHTML: `
        <table class="grid-thm grid-thm-v2 w-lg">
            <tr>
                <th rowspan="2">Target Rate (bps)</th>
                <th colspan="4">Probability(%)</th>
            </tr>

            <tr class="">
                <td class="center">325-350 </td>
                <td class="number highlight">24.4%</td>
                <td class="number">24.4%</td>
                <td class="number">21.6%</td>
                <td class="number">16.7%</td>
            </tr>

            <tr class="">
                <td class="center">375-400 </td>
                <td class="number highlight">10.5%</td>
                <td class="number">0.0%</td>
                <td class="number">8.6%</td>
                <td class="number">34.7%</td>
            </tr>

            <tr class="">
                <td class="center">350-375 (Current)</td>
                <td class="number highlight">75.6%</td>
                <td class="number">75.6%</td>
                <td class="number">69.8%</td>
                <td class="number">48.6%</td>
            </tr>
        </table>
      `,
      expected: [
        {
          deltaRate: -25,
          rate: 350,
          prob: 244,
        },
        {
          deltaRate: 0,
          rate: 375,
          prob: 756,
        },
        {
          deltaRate: 25,
          rate: 400,
          prob: 105,
        },
      ],
    },

    {
      name: "should throw without the table 1",
      viewHTML: `
        <table class="">
            <tr>
                <th rowspan="2">Target Rate (bps)</th>
                <th colspan="4">Probability(%)</th>
            </tr>
        </table>
      `,
    },

    {
      name: "should throw without the table 2",
      viewHTML: `
        <table class="grid-thm grid-thm-v2 w-lg">
            <tr>
                <th rowspan="2">Target Rate (bps)</th>
            </tr>
        </table>
      `,
    },

    {
      name: "should throw without the table 3",
      viewHTML: `
        <table class="grid-thm grid-thm-v2 w-lg">
            <tr>
                <th colspan="4">Probability(%)</th>
            </tr>
        </table>
      `,
    },

    {
      name: "should throw without cells",
      viewHTML: `
        <table class="grid-thm grid-thm-v2 w-lg">
            <tr>
                <th rowspan="2">Target Rate (bps)</th>
                <th colspan="4">Probability(%)</th>
            </tr>
        </table>
      `,
    },

    {
      name: "should throw without the current cell",
      viewHTML: `
        <table class="grid-thm grid-thm-v2 w-lg">
            <tr>
                <th rowspan="2">Target Rate (bps)</th>
                <th colspan="4">Probability(%)</th>
            </tr>

            <tr class="">
                <td class="center">325-350 </td>
                <td class="number highlight">24.4%</td>
                <td class="number">24.4%</td>
                <td class="number">21.6%</td>
                <td class="number">16.7%</td>
            </tr>

            <tr class="">
                <td class="center">350-375</td>
                <td class="number highlight">75.6%</td>
                <td class="number">75.6%</td>
                <td class="number">69.8%</td>
                <td class="number">48.6%</td>
            </tr>

            <tr class="">
                <td class="center">375-400 </td>
                <td class="number highlight">10.5%</td>
                <td class="number">0.0%</td>
                <td class="number">8.6%</td>
                <td class="number">34.7%</td>
            </tr>
        </table>
      `,
    },

    {
      name: "should throw without multi current cells",
      viewHTML: `
        <table class="grid-thm grid-thm-v2 w-lg">
            <tr>
                <th rowspan="2">Target Rate (bps)</th>
                <th colspan="4">Probability(%)</th>
            </tr>

            <tr class="">
                <td class="center">325-350 (Current)</td>
                <td class="number highlight">24.4%</td>
                <td class="number">24.4%</td>
                <td class="number">21.6%</td>
                <td class="number">16.7%</td>
            </tr>

            <tr class="">
                <td class="center">350-375 (Current)</td>
                <td class="number highlight">75.6%</td>
                <td class="number">75.6%</td>
                <td class="number">69.8%</td>
                <td class="number">48.6%</td>
            </tr>

            <tr class="">
                <td class="center">375-400 </td>
                <td class="number highlight">10.5%</td>
                <td class="number">0.0%</td>
                <td class="number">8.6%</td>
                <td class="number">34.7%</td>
            </tr>
        </table>
      `,
    },

    {
      name: "should throw without highlight td",
      viewHTML: `
        <table class="grid-thm grid-thm-v2 w-lg">
            <tr>
                <th rowspan="2">Target Rate (bps)</th>
                <th colspan="4">Probability(%)</th>
            </tr>

            <tr class="">
                <td class="center">325-350</td>
                <td class="number ">24.4%</td>
                <td class="number">24.4%</td>
                <td class="number">21.6%</td>
                <td class="number">16.7%</td>
            </tr>

            <tr class="">
                <td class="center">350-375 (Current)</td>
                <td class="number highlight">75.6%</td>
                <td class="number">75.6%</td>
                <td class="number">69.8%</td>
                <td class="number">48.6%</td>
            </tr>

            <tr class="">
                <td class="center">375-400 </td>
                <td class="number highlight">10.5%</td>
                <td class="number">0.0%</td>
                <td class="number">8.6%</td>
                <td class="number">34.7%</td>
            </tr>
        </table>
      `,
    },

    {
      name: "should throw without bad probability format",
      viewHTML: `
        <table class="grid-thm grid-thm-v2 w-lg">
            <tr>
                <th rowspan="2">Target Rate (bps)</th>
                <th colspan="4">Probability(%)</th>
            </tr>

            <tr class="">
                <td class="center">325-350</td>
                <td class="number highlight">-24.4%</td>
                <td class="number">24.4%</td>
                <td class="number">21.6%</td>
                <td class="number">16.7%</td>
            </tr>

            <tr class="">
                <td class="center">350-375 (Current)</td>
                <td class="number highlight">75.6%</td>
                <td class="number">75.6%</td>
                <td class="number">69.8%</td>
                <td class="number">48.6%</td>
            </tr>

            <tr class="">
                <td class="center">375-400 </td>
                <td class="number highlight">10.5%</td>
                <td class="number">0.0%</td>
                <td class="number">8.6%</td>
                <td class="number">34.7%</td>
            </tr>
        </table>
      `,
    },
  ];

  cases.forEach(({ name, viewHTML, expected }) => {
    it(name, () => {
      if (expected) {
        expect(parseRateProbs(viewHTML)).toStrictEqual(expected);
      } else {
        expect(() => {
          parseRateProbs(viewHTML);
        }).toThrowError();
      }
    });
  });
});

describe("parseRateProbsTime", () => {
  const cases = [
    {
      name: "should work",
      viewHTML: "Data as of 24 Dec 2025 02:40:12 CT<",
      expected: new Date("2025-12-24T08:40:12.000Z").getTime(),
    },
    {
      name: "should work with lower case 'ct'",
      viewHTML: "Data as of 24 Dec 2025 02:40:12 ct<",
      expected: new Date("2025-12-24T08:40:12.000Z").getTime(),
    },
    {
      name: "should work with lower case month",
      viewHTML: "Data as of 24 dec 2025 02:40:12 CT<",
      expected: new Date("2025-12-24T08:40:12.000Z").getTime(),
    },
    {
      name: "should work with upper case month",
      viewHTML: "Data as of 24 DEC 2025 02:40:12 CT<",
      expected: new Date("2025-12-24T08:40:12.000Z").getTime(),
    },
    {
      name: "should work with short number day",
      viewHTML: "Data as of 2 DEC 2025 2:4:5 CT<",
      expected: new Date("2025-12-02T08:04:05.000Z").getTime(),
    },
    {
      name: "should work with short number time",
      viewHTML: "Data as of 24 DEC 2025 2:4:5 CT<",
      expected: new Date("2025-12-24T08:04:05.000Z").getTime(),
    },
    {
      name: "should work with short number time",
      viewHTML: "Data as of 24 DEC 2025 2:4:5 CT <",
      expected: new Date("2025-12-24T08:04:05.000Z").getTime(),
    },

    {
      name: "should throw without prefix",
      viewHTML: "24 Dec 2025 02:40:12 CT<",
    },
    {
      name: "should throw with invalid prefix",
      viewHTML: " as of 24 Dec 2025 02:40:12 CT<",
    },
    {
      name: "should throw without suffix",
      viewHTML: "Data as of 24 Dec 2025 02:40:12 CT",
    },
    {
      name: "should throw with invalid suffix",
      viewHTML: "Data as of 24 Dec 2025 02:40:12 CT>",
    },

    {
      name: "should throw with bad format of month",
      viewHTML: "Data as of 24 Abc 2025 02:40:12 CT<",
    },
    {
      name: "should throw with bad format of day",
      viewHTML: "Data as of 124 Dec 2025 02:40:12 CT<",
    },
    {
      name: "should throw with bad format of time 1",
      viewHTML: "Data as of 124 Dec 2025 102:40:12 CT<",
    },
    {
      name: "should throw with bad format of time 2",
      viewHTML: "Data as of 124 Dec 2025 02:140:12 CT<",
    },
    {
      name: "should throw with bad format of time 3",
      viewHTML: "Data as of 124 Dec 2025 02:40:112 CT<",
    },
  ];

  cases.forEach(({ name, viewHTML, expected }) => {
    it(name, () => {
      if (expected) {
        expect(parseRateProbsTime(viewHTML)).toStrictEqual(expected);
      } else {
        expect(() => {
          parseRateProbsTime(viewHTML);
        }).toThrowError();
      }
    });
  });
});
