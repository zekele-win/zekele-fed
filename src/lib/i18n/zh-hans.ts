export default {
  title: "美联储加息降息概率 实时监测｜FOMC 议息会议预期 | Zekele",
  desc: "实时查看下次 FOMC 议息会议的加息、降息、维持不变概率。数据来自芝商所 CME FedWatch 利率期货，附当前利率区间与会议倒计时。",

  name: "美联储利率变动概率",

  noData: "等待数据 …",

  currentRateRange: "当前利率范围",

  cutProbability: "降息",
  noChangeProbability: "维持不变",
  hikeProbability: "加息",
  bps: "个基点",

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

  days: "天",
  hours: "时",
  minutes: "分",
  shortDays: "天",
  shortHours: "时",
  shortMinutes: "分",

  updateTime: {
    prefix: "",
    suffix: "前更新",
    just: "刚刚更新",
  },

  nextMeetingCountdown: "距离下次 FOMC 议息会议还有",

  dataSource: {
    prefix: "数据来源：",
    fedWatchTool: "芝商所 FedWatch 工具",
    fomcMeetingCalendar: "FOMC 会议日程",
  },

  disclaimer: "免责声明：本站信息仅供参考，不构成任何投资建议。",

  about: {
    heading: "什么是美联储利率变动概率？",
    what: {
      title: "它表示什么",
      body: "美联储利率变动概率，是市场对美联储（美国央行）在下次 FOMC 议息会议上降息、维持不变或加息的预期概率。",
    },
    how: {
      title: "如何计算",
      body: "该概率由芝商所（CME）上市的 30 天联邦基金利率期货价格推算而来。期货市场已反映利率预期，因此概率在交易时段内实时更新，不依赖任何问卷调查或预测。",
    },
    read: {
      title: "如何解读",
      body: "顶部的「当前利率范围」是美联储现行的目标区间（如 3.75%–4.00%）。下方每个百分比代表市场认为下次会议后基准利率落在该水平的概率。「加息 25 个基点」即上调 0.25 个百分点。",
    },
  },

  copyright: "© 2025 - ###year###",
};
