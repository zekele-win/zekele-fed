import { describe, it, expect } from "vitest";
import { getMeetingTime } from "./fomc-meeting";

describe("getMeetingTime", () => {
  const cases = [
    {
      name: "should work 1",
      currentTime: new Date("2025-12-15T18:00Z").getTime(),
      expected: new Date("2026-01-28T19:00Z").getTime(),
    },
    {
      name: "should work 2",
      currentTime: new Date("2026-02-15T18:00Z").getTime(),
      expected: new Date("2026-03-18T18:00Z").getTime(),
    },
    {
      name: "should throw with out of range date",
      currentTime: new Date("2027-02-15T18:00Z").getTime(),
    },
  ];

  cases.forEach(({ name, currentTime, expected }) => {
    it(name, () => {
      if (expected) {
        expect(getMeetingTime(currentTime)).toStrictEqual(expected);
      } else {
        expect(() => {
          getMeetingTime(currentTime);
        }).toThrowError();
      }
    });
  });
});
