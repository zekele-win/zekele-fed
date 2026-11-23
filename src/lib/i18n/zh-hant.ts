export default {
  title: "聯準會加息降息機率 即時監測｜FOMC 議息會議預期 | Zekele",
  desc: "即時查看下次 FOMC 議息會議的加息、降息、維持不變機率。數據來自芝商所 CME FedWatch 利率期貨，附當前利率區間與會議倒計時。",

  name: "聯準會利率變動機率",

  noData: "資料載入中 …",

  currentRateRange: "當前利率範圍",

  cutProbability: "降息",
  noChangeProbability: "維持不變",
  hikeProbability: "加息",

  cutProbabilityDescription: {
    prefix: "降息 ",
    suffix: " 個基點的機率為 ",
  },
  noChangeProbabilityDescription: {
    suffix: "維持不變的機率為 ",
  },
  hikeProbabilityDescription: {
    prefix: "加息 ",
    suffix: " 個基點的機率為 ",
  },

  days: "天",
  hours: "時",
  minutes: "分",
  shortDays: "天",
  shortHours: "時",
  shortMinutes: "分",

  updateTime: {
    prefix: "",
    suffix: "前更新",
    just: "剛剛更新",
  },

  nextMeetingCountdown: "距離下次 FOMC 議息會議還有",

  dataSource: {
    prefix: "數據來源：",
    fedWatchTool: "芝商所 FedWatch 工具",
    fomcMeetingCalendar: "FOMC 會議日程",
  },

  disclaimer: "免責聲明：本站資訊僅供參考，不構成任何投資建議。",

  about: {
    heading: "什麼是聯準會利率變動機率？",
    what: {
      title: "它表示什麼",
      body: "聯準會利率變動機率，是市場對聯準會（美國央行）在下次 FOMC 議息會議上降息、維持不變或加息的預期機率。",
    },
    how: {
      title: "如何計算",
      body: "該機率由芝商所（CME）上市的 30 天聯邦基金利率期貨價格推算而來。期貨市場已反映利率預期，因此機率在交易時段內即時更新，不依賴任何問卷調查或預測。",
    },
    read: {
      title: "如何解讀",
      body: "頂部的「當前利率範圍」是聯準會現行的目標區間（如 3.75%–4.00%）。下方每個百分比代表市場認為下次會議後基準利率落在該水準的機率。「加息 25 個基點」即上調 0.25 個百分點。",
    },
  },

  copyright: "© 2025 - ###year###",
};
