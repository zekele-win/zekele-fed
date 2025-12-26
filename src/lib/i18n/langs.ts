const langs = {
  en: {
    name: "English",
    aliases: ["en-us", "en-gb", "en-ca", "en-au"],
  },
  "zh-hans": {
    name: "简体中文",
    aliases: [
      "zh-cn",
      "zh-hans-cn",
      "zh-hk",
      "zh-hans-hk",
      "zh-mo",
      "zh-hans-mo",
      "zh-sg",
      "zh-hans-sg",
    ],
  },
};

export type Lang = keyof typeof langs;
export default langs;
