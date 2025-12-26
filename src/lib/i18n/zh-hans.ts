export default {
  title: "FOMC 下次利率变动概率 | Zekele",
  desc: "查看下次 FOMC 会议的利率变动概率，包含加息、降息或维持不变的可能性及对应幅度，基于市场定价实时更新。",

  name: "FOMC 利率预期",

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

  nextMeetingCountdown: "FOMC 下次会议倒计时",
  days: "天",
  hours: "时",
  minutes: "分",
  shortDays: "天",
  shortHours: "时",
  shortMinutes: "分",

  updateTime: {
    prefix: "",
    suffix: "前更新",
  },

  dataSource: {
    prefix: "数据来源：",
    fedWatchTool: "芝商所 FedWatch 工具",
    fomcMeetingCalendar: "FOMC 会议日程",
  },

  disclaimer: "免责声明：本站信息仅供参考，不构成任何投资建议。",

  copyright: "Copyright © ###year### Zekele.",
};
