import { describe, it, expect } from "vitest";
import { parseMeetingTimes } from "./fomc-meeting-html";

describe("parseMeetingTimes", () => {
  const cases = [
    // ========== 正常情况 ==========
    {
      name: "should parse 2026 FOMC meetings with full HTML",
      HTML: `<div class="panel panel-default">
        <div class="panel-heading"><h4><a id="42828">2026 FOMC Meetings</a></h4></div>
        <div class="row fomc-meeting">
          <div class="fomc-meeting__month col-xs-5 col-sm-3 col-md-2"><strong>January</strong></div>
          <div class="fomc-meeting__date col-xs-4 col-sm-9 col-md-10 col-lg-1">27-28</div>
        </div>
        <div class="fomc-meeting--shaded row fomc-meeting">
          <div class="fomc-meeting__month col-xs-5 col-sm-3 col-md-2"><strong>March</strong></div>
          <div class="fomc-meeting__date col-xs-4 col-sm-9 col-md-10 col-lg-1">17-18*</div>
        </div>
      </div>`,
      expected: ["2026-01-28T19:00Z", "2026-03-18T18:00Z"],
    },
    {
      name: "should parse 2026 and 2027 FOMC meetings",
      HTML: `<div class="panel panel-default">
        <div class="panel-heading"><h4><a id="42828">2026 FOMC Meetings</a></h4></div>
        <div class="row fomc-meeting">
          <div class="fomc-meeting__month col-xs-5 col-sm-3 col-md-2"><strong>January</strong></div>
          <div class="fomc-meeting__date col-xs-4 col-sm-9 col-md-10 col-lg-1">27-28</div>
        </div>
      </div>
      <div class="panel panel-default">
        <div class="panel-heading"><h4><a id="45694">2027 FOMC Meetings</a></h4></div>
        <div class="row fomc-meeting">
          <div class="fomc-meeting__month col-xs-5 col-sm-3 col-md-2"><strong>January</strong></div>
          <div class="fomc-meeting__date col-xs-4 col-sm-9 col-md-10 col-lg-1">26-27</div>
        </div>
      </div>`,
      expected: ["2026-01-28T19:00Z", "2027-01-27T19:00Z"],
    },
    {
      name: "should handle meetings without <strong> tags",
      HTML: `<div class="panel panel-default">
        <div class="panel-heading"><h4><a id="42828">2026 FOMC Meetings</a></h4></div>
        <div class="row fomc-meeting">
          <div class="fomc-meeting__month col-xs-5 col-sm-3 col-md-2">January</div>
          <div class="fomc-meeting__date col-xs-4 col-sm-9 col-md-10 col-lg-1">27-28</div>
        </div>
      </div>`,
      expected: ["2026-01-28T19:00Z"],
    },
    {
      name: "should handle extra classes in month and date elements",
      HTML: `<div class="panel panel-default">
        <div class="panel-heading"><h4><a id="42828">2026 FOMC Meetings</a></h4></div>
        <div class="row fomc-meeting">
          <div class="col-xs-5 col-sm-3 col-md-2 fomc-meeting__month extra-class"><strong>January</strong></div>
          <div class="col-xs-4 col-sm-9 col-md-10 col-lg-1 fomc-meeting__date extra-class">27-28</div>
        </div>
      </div>`,
      expected: ["2026-01-28T19:00Z"],
    },
    {
      name: "should handle dates with asterisk",
      HTML: `<div class="panel panel-default">
        <div class="panel-heading"><h4><a id="42828">2026 FOMC Meetings</a></h4></div>
        <div class="row fomc-meeting">
          <div class="fomc-meeting__month col-xs-5 col-sm-3 col-md-2"><strong>March</strong></div>
          <div class="fomc-meeting__date col-xs-4 col-sm-9 col-md-10 col-lg-1">17-18*</div>
        </div>
      </div>`,
      expected: ["2026-03-18T18:00Z"],
    },
    {
      name: "should handle multiple meetings in same year",
      HTML: `<div class="panel panel-default">
        <div class="panel-heading"><h4><a id="42828">2026 FOMC Meetings</a></h4></div>
        <div class="row fomc-meeting">
          <div class="fomc-meeting__month col-xs-5 col-sm-3 col-md-2"><strong>January</strong></div>
          <div class="fomc-meeting__date col-xs-4 col-sm-9 col-md-10 col-lg-1">27-28</div>
        </div>
        <div class="row fomc-meeting">
          <div class="fomc-meeting__month col-xs-5 col-sm-3 col-md-2"><strong>March</strong></div>
          <div class="fomc-meeting__date col-xs-4 col-sm-9 col-md-10 col-lg-1">17-18*</div>
        </div>
        <div class="row fomc-meeting">
          <div class="fomc-meeting__month col-xs-5 col-sm-3 col-md-2"><strong>April</strong></div>
          <div class="fomc-meeting__date col-xs-4 col-sm-9 col-md-10 col-lg-1">28-29</div>
        </div>
      </div>`,
      expected: ["2026-01-28T19:00Z", "2026-03-18T18:00Z", "2026-04-29T18:00Z"],
    },
    {
      name: "should handle June meeting with asterisk (summer time)",
      HTML: `<div class="panel panel-default">
        <div class="panel-heading"><h4><a id="42828">2026 FOMC Meetings</a></h4></div>
        <div class="row fomc-meeting">
          <div class="fomc-meeting__month col-xs-5 col-sm-3 col-md-2"><strong>June</strong></div>
          <div class="fomc-meeting__date col-xs-4 col-sm-9 col-md-10 col-lg-1">16-17*</div>
        </div>
      </div>`,
      expected: ["2026-06-17T18:00Z"],
    },
    {
      name: "should handle whitespace in month text",
      HTML: `<div class="panel panel-default">
        <div class="panel-heading"><h4><a id="42828">2026 FOMC Meetings</a></h4></div>
        <div class="row fomc-meeting">
          <div class="fomc-meeting__month col-xs-5 col-sm-3 col-md-2"><strong>  January  </strong></div>
          <div class="fomc-meeting__date col-xs-4 col-sm-9 col-md-10 col-lg-1">27-28</div>
        </div>
      </div>`,
      expected: ["2026-01-28T19:00Z"],
    },
    {
      name: "should handle cross-month meeting (Apr/May with 30-1)",
      HTML: `<div class="panel panel-default">
        <div class="panel-heading"><h4><a id="42828">2026 FOMC Meetings</a></h4></div>
        <div class="row fomc-meeting">
          <div class="fomc-meeting__month col-xs-5 col-sm-3 col-md-2"><strong>Apr/May</strong></div>
          <div class="fomc-meeting__date col-xs-4 col-sm-9 col-md-10 col-lg-1">30-1</div>
        </div>
      </div>`,
      expected: ["2026-05-01T18:00Z"],
    },
    {
      name: "should handle cross-month meeting with asterisk",
      HTML: `<div class="panel panel-default">
        <div class="panel-heading"><h4><a id="42828">2026 FOMC Meetings</a></h4></div>
        <div class="row fomc-meeting">
          <div class="fomc-meeting__month col-xs-5 col-sm-3 col-md-2"><strong>Apr/May</strong></div>
          <div class="fomc-meeting__date col-xs-4 col-sm-9 col-md-10 col-lg-1">30-1*</div>
        </div>
      </div>`,
      expected: ["2026-05-01T18:00Z"],
    },
    {
      name: "should handle cross-month meeting with full month names",
      HTML: `<div class="panel panel-default">
        <div class="panel-heading"><h4><a id="42828">2026 FOMC Meetings</a></h4></div>
        <div class="row fomc-meeting">
          <div class="fomc-meeting__month col-xs-5 col-sm-3 col-md-2"><strong>April/May</strong></div>
          <div class="fomc-meeting__date col-xs-4 col-sm-9 col-md-10 col-lg-1">30-1</div>
        </div>
      </div>`,
      expected: ["2026-05-01T18:00Z"],
    },

    // ========== 异常情况 ==========
    {
      name: "should throw when no year found",
      HTML: `<div class="row fomc-meeting">
        <div class="fomc-meeting__month col-xs-5"><strong>January</strong></div>
        <div class="fomc-meeting__date col-xs-4">27-28</div>
      </div>`,
      shouldThrow: true,
    },
    {
      name: "should throw when no month found",
      HTML: `<div class="panel panel-default">
        <div class="panel-heading"><h4><a id="42828">2026 FOMC Meetings</a></h4></div>
        <div class="row fomc-meeting">
          <div class="fomc-meeting__date col-xs-4">27-28</div>
        </div>
      </div>`,
      shouldThrow: true,
    },
    {
      name: "should throw when no date found",
      HTML: `<div class="panel panel-default">
        <div class="panel-heading"><h4><a id="42828">2026 FOMC Meetings</a></h4></div>
        <div class="row fomc-meeting">
          <div class="fomc-meeting__month col-xs-5"><strong>January</strong></div>
        </div>
      </div>`,
      shouldThrow: true,
    },
    {
      name: "should throw when date format is invalid (three parts)",
      HTML: `<div class="panel panel-default">
        <div class="panel-heading"><h4><a id="42828">2026 FOMC Meetings</a></h4></div>
        <div class="row fomc-meeting">
          <div class="fomc-meeting__month col-xs-5"><strong>January</strong></div>
          <div class="fomc-meeting__date col-xs-4">27-28-29</div>
        </div>
      </div>`,
      shouldThrow: true,
    },
    {
      name: "should throw when date format is invalid (no separator)",
      HTML: `<div class="panel panel-default">
        <div class="panel-heading"><h4><a id="42828">2026 FOMC Meetings</a></h4></div>
        <div class="row fomc-meeting">
          <div class="fomc-meeting__month col-xs-5"><strong>January</strong></div>
          <div class="fomc-meeting__date col-xs-4">2728</div>
        </div>
      </div>`,
      shouldThrow: true,
    },
    {
      name: "should throw when end day exceeds month max days",
      HTML: `<div class="panel panel-default">
        <div class="panel-heading"><h4><a id="42828">2021 FOMC Meetings</a></h4></div>
        <div class="row fomc-meeting">
          <div class="fomc-meeting__month col-xs-5"><strong>February</strong></div>
          <div class="fomc-meeting__date col-xs-4">28-30</div>
        </div>
      </div>`,
      shouldThrow: true,
    },
    {
      name: "should throw when end day exceeds month max days (cross-month)",
      HTML: `<div class="panel panel-default">
        <div class="panel-heading"><h4><a id="42828">2026 FOMC Meetings</a></h4></div>
        <div class="row fomc-meeting">
          <div class="fomc-meeting__month col-xs-5"><strong>Apr/May</strong></div>
          <div class="fomc-meeting__date col-xs-4">30-32</div>
        </div>
      </div>`,
      shouldThrow: true,
    },
    {
      name: "should throw when end day value is NaN",
      HTML: `<div class="panel panel-default">
        <div class="panel-heading"><h4><a id="42828">2026 FOMC Meetings</a></h4></div>
        <div class="row fomc-meeting">
          <div class="fomc-meeting__month col-xs-5"><strong>January</strong></div>
          <div class="fomc-meeting__date col-xs-4">27-XX</div>
        </div>
      </div>`,
      shouldThrow: true,
    },
    {
      name: "should throw when start day value is NaN",
      HTML: `<div class="panel panel-default">
        <div class="panel-heading"><h4><a id="42828">2026 FOMC Meetings</a></h4></div>
        <div class="row fomc-meeting">
          <div class="fomc-meeting__month col-xs-5"><strong>January</strong></div>
          <div class="fomc-meeting__date col-xs-4">XX-28</div>
        </div>
      </div>`,
      shouldThrow: true,
    },
    {
      name: "should throw when month name is unknown",
      HTML: `<div class="panel panel-default">
        <div class="panel-heading"><h4><a id="42828">2026 FOMC Meetings</a></h4></div>
        <div class="row fomc-meeting">
          <div class="fomc-meeting__month col-xs-5"><strong>InvalidMonth</strong></div>
          <div class="fomc-meeting__date col-xs-4">27-28</div>
        </div>
      </div>`,
      shouldThrow: true,
    },
    {
      name: "should throw when month not found before date",
      HTML: `<div class="panel panel-default">
        <div class="panel-heading"><h4><a id="42828">2026 FOMC Meetings</a></h4></div>
        <div class="row fomc-meeting">
          <div class="fomc-meeting__date col-xs-4">27-28</div>
          <div class="fomc-meeting__month col-xs-5"><strong>January</strong></div>
        </div>
      </div>`,
      shouldThrow: true,
    },
    {
      name: "should throw when year not found before date",
      HTML: `<div class="row fomc-meeting">
        <div class="fomc-meeting__month col-xs-5"><strong>January</strong></div>
        <div class="fomc-meeting__date col-xs-4">27-28</div>
      </div>
      <div class="panel panel-default">
        <div class="panel-heading"><h4><a id="42828">2026 FOMC Meetings</a></h4></div>
      </div>`,
      shouldThrow: true,
    },
    {
      name: "should throw when end day is 0",
      HTML: `<div class="panel panel-default">
        <div class="panel-heading"><h4><a id="42828">2026 FOMC Meetings</a></h4></div>
        <div class="row fomc-meeting">
          <div class="fomc-meeting__month col-xs-5"><strong>January</strong></div>
          <div class="fomc-meeting__date col-xs-4">27-0</div>
        </div>
      </div>`,
      shouldThrow: true,
    },
    {
      name: "should throw when end day is 32",
      HTML: `<div class="panel panel-default">
        <div class="panel-heading"><h4><a id="42828">2026 FOMC Meetings</a></h4></div>
        <div class="row fomc-meeting">
          <div class="fomc-meeting__month col-xs-5"><strong>January</strong></div>
          <div class="fomc-meeting__date col-xs-4">27-32</div>
        </div>
      </div>`,
      shouldThrow: true,
    },
    {
      name: "should throw when cross-month month format is invalid (no slash)",
      HTML: `<div class="panel panel-default">
        <div class="panel-heading"><h4><a id="42828">2026 FOMC Meetings</a></h4></div>
        <div class="row fomc-meeting">
          <div class="fomc-meeting__month col-xs-5"><strong>AprMay</strong></div>
          <div class="fomc-meeting__date col-xs-4">30-1</div>
        </div>
      </div>`,
      shouldThrow: true,
    },
  ];

  cases.forEach(({ name, HTML, expected, shouldThrow }) => {
    it(name, () => {
      if (shouldThrow) {
        expect(() => {
          parseMeetingTimes(HTML);
        }).toThrow();
      } else {
        const result = parseMeetingTimes(HTML);
        const expectedTimestamps = expected!.map((ts) =>
          new Date(ts).getTime(),
        );
        expect(result).toStrictEqual(expectedTimestamps);
      }
    });
  });
});
