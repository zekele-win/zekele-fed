import { describe, it, expect } from "vitest";

import { getQueryParam } from "./url";

describe("getQueryParam", () => {
  const cases = [
    {
      name: "should work with the first query param",
      url: "https://example.com?a=1&b=2",
      key: "a",
      expected: "1",
    },
    {
      name: "should work with the other query param",
      url: "https://example.com?a=1&b=2",
      key: "b",
      expected: "2",
    },
    {
      name: "should work with the empty query param",
      url: "https://example.com?a=1&b=2&c=",
      key: "c",
      opts: { ignoreEmpty: false },
      expected: "",
    },
    {
      name: "should not work with the empty query param",
      url: "https://example.com?a=1&b=2&c=",
      key: "c",
      expected: undefined,
    },
    {
      name: "should not work without the query param",
      url: "https://example.com?a=1&b=2",
      key: "c",
      expected: undefined,
    },
  ];

  cases.forEach(({ name, url, key, opts, expected }) => {
    it(name, () => {
      expect(getQueryParam(url, key, opts)).toBe(expected);
    });
  });
});
