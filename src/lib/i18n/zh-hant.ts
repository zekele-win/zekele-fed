export default {
  title: "實時監測聯準會升降息機率 | Zekele",
  desc: "實時監測聯準會(Fed)利率路徑。自動同步 CME FedWatch 官方數據，涵蓋加息、降息及維持不變機率。",

  name: "聯準會利率變動機率",

  noData: "資料載入中 …",

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

  copyright: "© 2025 - ###year###",
};
