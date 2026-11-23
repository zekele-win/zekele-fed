export default {
  title: "연준 금리 인상·인하 확률 실시간 | FOMC 금리 전망 | Zekele",
  desc: "다음 FOMC 회의에서의 금리 인상·인하·동결 확률을 실시간으로 확인하세요. CME 페드워치 금리 선물 기반 데이터로, 현재 기준금리 범위와 회의까지의 카운트다운도 함께 제공합니다.",

  name: "연준 금리 변동 확률",

  noData: "데이터 대기 중 …",

  currentRateRange: "현재 기준금리 범위",

  cutProbability: "인하",
  noChangeProbability: "동결",
  hikeProbability: "인상",
  bps: "bp",

  cutProbabilityDescription: {
    prefix: "",
    suffix: " bp 인하 확률은 ",
  },
  noChangeProbabilityDescription: {
    suffix: "동결 확률은 ",
  },
  hikeProbabilityDescription: {
    prefix: "",
    suffix: " bp 인상 확률은 ",
  },

  days: "일",
  hours: "시간",
  minutes: "분",
  shortDays: "일",
  shortHours: "시간",
  shortMinutes: "분",

  updateTime: {
    prefix: "",
    suffix: "전 업데이트",
    just: "방금 업데이트",
  },

  nextMeetingCountdown: "다음 FOMC 회의까지",

  dataSource: {
    prefix: "출처: ",
    fedWatchTool: "CME 페드워치",
    fomcMeetingCalendar: "FOMC 회의 일정",
  },

  disclaimer: "면책 조항: 본 정보는 참고용이며 투자 조언이 아닙니다.",

  about: {
    heading: "연준 금리 변동 확률이란?",
    what: {
      title: "무엇을 보여주나요",
      body: "연준 금리 변동 확률은 미국 중앙은행인 연방준비제도(Fed·연준)가 다음 FOMC 회의에서 기준금리를 인하할지, 동결할지, 인상할지를 시장이 어느 정도로 예상하는지를 나타내는 수치입니다.",
    },
    how: {
      title: "어떻게 계산하나요",
      body: "이 확률은 시카고상품거래소(CME)에 상장된 30일물 연방기금 금리 선물 가격에서 산출됩니다. 선물 시장에는 이미 금리 전망이 반영되어 있어 거래 시간 중 실시간으로 업데이트되며, 설문이나 예측은 전혀 사용하지 않습니다.",
    },
    read: {
      title: "어떻게 읽나요",
      body: "상단의 '현재 기준금리 범위'는 연준이 현재 설정한 목표 범위(예: 3.75%~4.00%)입니다. 아래 각 퍼센트는 다음 회의 후 기준금리가 해당 수준에 도달할 시장의 예상 확률을 나타냅니다. '25bp 인상'은 0.25%포인트 인상을 의미합니다.",
    },
  },

  copyright: "© 2025 - ###year###",
};
