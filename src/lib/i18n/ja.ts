export default {
  title: "FRB利上げ・利下げ確率のリアルタイム監視 | Zekele",
  desc: "FRB（米連邦準備制度理事会）の金利進路をリアルタイムで監視。CME FedWatchデータを自動同期し、利上げ、利下げ、据え置きの確率を網羅。最新の市場価格から次回のFOMC金利見通しを追跡。",

  name: "FRB金利確率",
  content: "FRB利上げ・利下げ確率のリアルタ",

  noData: "データ取得中 …",

  cutProbability: "利下げ",
  noChangeProbability: "据え置き",
  hikeProbability: "利上げ",

  cutProbabilityDescription: {
    prefix: "",
    suffix: " bpsの利下げ確率は ",
  },
  noChangeProbabilityDescription: {
    suffix: "据え置きの確率は ",
  },
  hikeProbabilityDescription: {
    prefix: "",
    suffix: " bpsの利上げ確率は ",
  },

  days: "日",
  hours: "時",
  minutes: "分",
  shortDays: "日",
  shortHours: "時",
  shortMinutes: "分",

  updateTime: {
    prefix: "",
    suffix: "前に更新",
    just: "たった今更新",
  },

  nextMeetingCountdown: "次回の FOMC 会合まで残り",

  dataSource: {
    prefix: "情報源：",
    fedWatchTool: "CME FedWatch ツール",
    fomcMeetingCalendar: "FOMC 開催スケジュール",
  },

  disclaimer:
    "免責事項：本サイトの情報は参照用であり、投資の助言を目的としたものではありません。",

  copyright: "© 2025 - ###year###",
};
