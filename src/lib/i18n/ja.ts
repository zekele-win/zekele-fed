export default {
  title: "次回FOMC 利上げ・利下げ確率 | Zekele",
  desc: "次回FOMC会合における政策金利の変更確率（利上げ・利下げ・据え置き）を、市場データに基づきリアルタイムで表示します。",

  name: "FOMC 金利予測",

  cutProbability: "利下げ",
  noChangeProbability: "据え置き",
  hikeProbability: "利上げ",

  cutProbabilityDescription: {
    prefix: "利下げ ",
    suffix: " ベーシスポイントの確率は ",
  },
  noChangeProbabilityDescription: {
    suffix: "据え置きの確率は ",
  },
  hikeProbabilityDescription: {
    prefix: "利上げ ",
    suffix: " ベーシスポイントの確率は ",
  },

  nextMeetingCountdown: "次回FOMC会合まで",
  days: "日",
  hours: "時間",
  minutes: "分",
  shortDays: "日",
  shortHours: "時",
  shortMinutes: "分",

  updateTime: {
    prefix: "",
    suffix: "前に更新",
  },

  dataSource: {
    prefix: "データ提供元：",
    fedWatchTool: "CME FedWatch ツール",
    fomcMeetingCalendar: "FOMC 会合日程",
  },

  disclaimer:
    "免責事項：本サイトの情報は参考目的であり、投資助言ではありません。",

  copyright: "Copyright © ###year### Zekele.",
};
