import en from "./en";
import ja from "./ja";
import zh_hans from "./zh-hans";
import zh_hant from "./zh-hant";

export default {
  en,
  ja,
  "zh-hans": zh_hans,
  "zh-hant": zh_hant,
};

export const langs = {
  en: {
    name: "English",
    aliases: ["en-us", "en-gb", "en-ca", "en-au"],
    uri: "",
  },
  ja: {
    name: "日本語",
    aliases: ["ja-jp"],
    uri: "ja",
  },
  "zh-hans": {
    name: "简体中文",
    aliases: [
      "zh-cn",
      "zh-hans-cn",
      "zh-sg",
      "zh-hans-sg",
      "zh-my",
      "zh-hans-my",
    ],
    uri: "zh-hans",
  },
  "zh-hant": {
    name: "繁體中文",
    aliases: [
      "zh-tw",
      "zh-hant-tw",
      "zh-hk",
      "zh-hant-hk",
      "zh-mo",
      "zh-hant-mo",
    ],
    uri: "zh-hant",
  },
};

export const defLang = "en" as Lang;

export type Lang = keyof typeof langs;

export function findLangByParam(param?: string | null): Lang | null {
  if (!param) {
    return defLang;
  }
  param = param.toLowerCase();

  if (langs[param as Lang]) {
    return param as Lang;
  }

  return null;
}

export function findLangByCookie(cookie?: string | null): Lang | null {
  if (!cookie) {
    return null;
  }
  cookie = cookie.toLowerCase();

  if (langs[cookie as Lang]) {
    return cookie as Lang;
  }

  return null;
}

export function findLangByAccept(accept?: string | null): Lang | null {
  if (!accept) {
    return null;
  }
  accept = accept.toLowerCase();

  const browsers = accept.split(",").map((x) => x.split(";")[0].trim());
  for (const browser of browsers) {
    for (const key in langs) {
      const lang = key as Lang;
      const info = langs[lang];
      if (browser === lang || info.aliases.includes(browser)) {
        return lang;
      }
    }
  }

  return null;
}
