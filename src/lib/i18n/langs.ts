const langs = {
  en: {
    name: "English",
    aliases: ["en-us", "en-gb", "en-ca", "en-au"],
  },
  ja: {
    name: "日本語",
    aliases: ["ja-jp"],
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
  },
};

export type Lang = keyof typeof langs;
export default langs;
