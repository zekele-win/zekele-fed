import { describe, it, expect } from "vitest";
import { findLangByParam, findLangByCookie, findLangByAccept } from "./index";

describe("findLangByParam", () => {
  const cases = [
    {
      name: "should work without param",
      param: undefined,
      expected: "en",
    },
    {
      name: "should work with null param",
      param: null,
      expected: "en",
    },
    {
      name: "should work with empty param",
      param: "",
      expected: "en",
    },
    {
      name: "should work with valid param (en)",
      param: "en",
      expected: "en",
    },
    {
      name: "should work with valid param (EN)",
      param: "EN",
      expected: "en",
    },
    {
      name: "should work with valid param (ja)",
      param: "ja",
      expected: "ja",
    },
    {
      name: "should work with valid param (JA)",
      param: "JA",
      expected: "ja",
    },
    {
      name: "should work with valid param (zh-hans)",
      param: "zh-hans",
      expected: "zh-hans",
    },
    {
      name: "should work with valid param (ZH-HANS)",
      param: "ZH-HANS",
      expected: "zh-hans",
    },
    {
      name: "should work with valid param (zh-hant)",
      param: "zh-hant",
      expected: "zh-hant",
    },
    {
      name: "should work with valid param (ZH-HANT)",
      param: "ZH-HANT",
      expected: "zh-hant",
    },
    {
      name: "should return null for invalid param",
      param: "abcd",
      expected: null,
    },
  ];

  cases.forEach(({ name, param, expected }) => {
    it(name, () => {
      expect(findLangByParam(param)).toBe(expected);
    });
  });
});

describe("findLangByCookie", () => {
  const cases = [
    {
      name: "should work without cookie",
      cookie: undefined,
      expected: null,
    },
    {
      name: "should work with null cookie",
      cookie: null,
      expected: null,
    },
    {
      name: "should work with empty cookie",
      cookie: "",
      expected: null,
    },
    {
      name: "should work with valid cookie (en)",
      cookie: "en",
      expected: "en",
    },
    {
      name: "should work with valid cookie (EN)",
      cookie: "EN",
      expected: "en",
    },
    {
      name: "should work with valid cookie (ja)",
      cookie: "ja",
      expected: "ja",
    },
    {
      name: "should work with valid cookie (JA)",
      cookie: "JA",
      expected: "ja",
    },
    {
      name: "should work with valid cookie (zh-hans)",
      cookie: "zh-hans",
      expected: "zh-hans",
    },
    {
      name: "should work with valid cookie (ZH-HANS)",
      cookie: "ZH-HANS",
      expected: "zh-hans",
    },
    {
      name: "should work with valid cookie (zh-hant)",
      cookie: "zh-hant",
      expected: "zh-hant",
    },
    {
      name: "should work with valid cookie (ZH-HANT)",
      cookie: "ZH-HANT",
      expected: "zh-hant",
    },
    {
      name: "should return null for invalid cookie",
      cookie: "abcd",
      expected: null,
    },
  ];

  cases.forEach(({ name, cookie, expected }) => {
    it(name, () => {
      expect(findLangByCookie(cookie)).toBe(expected);
    });
  });
});

describe("findLangByAccept", () => {
  const cases = [
    {
      name: "should work without accept",
      accept: undefined,
      expected: null,
    },
    {
      name: "should work with null accept",
      accept: null,
      expected: null,
    },
    {
      name: "should work with empty accept",
      accept: "",
      expected: null,
    },
    {
      name: "should work with valid accept (en)",
      accept: "en",
      expected: "en",
    },
    {
      name: "should work with valid accept (ja)",
      accept: "ja",
      expected: "ja",
    },
    {
      name: "should work with valid accept (zh-CN,zh;q=0.9,en;q=0.8)",
      accept: "zh-CN,zh;q=0.9,en;q=0.8",
      expected: "zh-hans",
    },
    {
      name: "should work with valid accept (zh-hans-CN,zh;q=0.9,en;q=0.8)",
      accept: "zh-hans-CN,zh;q=0.9,en;q=0.8",
      expected: "zh-hans",
    },
    {
      name: "should work with valid accept (zh-SG,zh;q=0.9,en;q=0.8)",
      accept: "zh-SG,zh;q=0.9,en;q=0.8",
      expected: "zh-hans",
    },
    {
      name: "should work with valid accept (zh-hans-SG,zh;q=0.9,en;q=0.8)",
      accept: "zh-hans-SG,zh;q=0.9,en;q=0.8",
      expected: "zh-hans",
    },
    {
      name: "should work with valid accept (zh-MY,zh;q=0.9,en;q=0.8)",
      accept: "zh-MY,zh;q=0.9,en;q=0.8",
      expected: "zh-hans",
    },
    {
      name: "should work with valid accept (zh-hans-MY,zh;q=0.9,en;q=0.8)",
      accept: "zh-hans-MY,zh;q=0.9,en;q=0.8",
      expected: "zh-hans",
    },
    {
      name: "should work with valid accept (zh-hant)",
      accept: "zh-hant",
      expected: "zh-hant",
    },
    {
      name: "should work with valid accept (zh-TW,zh;q=0.9,en;q=0.8)",
      accept: "zh-TW,zh;q=0.9,en;q=0.8",
      expected: "zh-hant",
    },
    {
      name: "should work with valid accept (zh-hant-TW,zh;q=0.9,en;q=0.8)",
      accept: "zh-hant-TW,zh;q=0.9,en;q=0.8",
      expected: "zh-hant",
    },
    {
      name: "should work with valid accept (zh-HK,zh;q=0.9,en;q=0.8)",
      accept: "zh-HK,zh;q=0.9,en;q=0.8",
      expected: "zh-hant",
    },
    {
      name: "should work with valid accept (zh-hant-HK,zh;q=0.9,en;q=0.8)",
      accept: "zh-hant-HK,zh;q=0.9,en;q=0.8",
      expected: "zh-hant",
    },
    {
      name: "should work with valid accept (zh-MO,zh;q=0.9,en;q=0.8)",
      accept: "zh-MO,zh;q=0.9,en;q=0.8",
      expected: "zh-hant",
    },
    {
      name: "should work with valid accept (zh-hant-MO,zh;q=0.9,en;q=0.8)",
      accept: "zh-hant-MO,zh;q=0.9,en;q=0.8",
      expected: "zh-hant",
    },
    {
      name: "should return null for invalid accept",
      accept: "abcd",
      expected: null,
    },
  ];

  cases.forEach(({ name, accept, expected }) => {
    it(name, () => {
      expect(findLangByAccept(accept)).toBe(expected);
    });
  });
});
