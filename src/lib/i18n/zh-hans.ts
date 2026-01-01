export default {
  title: "实时监测美联储升降息概率 | Zekele",
  desc: "实时监测美联储(Fed)利率路径。自动同步 CME FedWatch 官方数据，涵盖加息、降息及维持不变概率。免刷新、零延迟，为您追踪下次 FOMC 议息会议最新市场定价。",

  name: "美联储利率变动概率",

  cutProbability: "降息",
  noChangeProbability: "维持不变",
  hikeProbability: "加息",

  cutProbabilityDescription: {
    prefix: "降息 ",
    suffix: " 个基点的概率是 ",
  },
  noChangeProbabilityDescription: {
    suffix: "维持不变的概率是 ",
  },
  hikeProbabilityDescription: {
    prefix: "加息 ",
    suffix: " 个基点的概率是 ",
  },

  nextMeetingCountdown: "距离下次 FOMC 议息会议还有",
  days: "天",
  hours: "时",
  minutes: "分",
  shortDays: "天",
  shortHours: "时",
  shortMinutes: "分",

  updateTime: {
    prefix: "",
    suffix: "前",
  },

  dataSource: {
    prefix: "数据来源：",
    fedWatchTool: "芝商所 FedWatch 工具",
    fomcMeetingCalendar: "FOMC 会议日程",
  },

  disclaimer: "免责声明：本站信息仅供参考，不构成任何投资建议。",

  copyright: "Copyright © 2025-###year### Zekele.",
};
