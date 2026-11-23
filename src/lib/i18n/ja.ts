export default {
  title: "FRB利上げ・利下げ確率 リアルタイム｜FOMC金利予想 | Zekele",
  desc: "次回FOMC会合での利上げ・利下げ・据え置き確率をリアルタイム表示。CME FedWatchの金利先物から算出し、現在の金利範囲と会合までのカウントダウンも掲載。",

  name: "FRB金利変動確率",

  noData: "データ取得中 …",

  currentRateRange: "現在の金利範囲",

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

  about: {
    heading: "FRB金利変動確率とは",
    what: {
      title: "これは何を示すか",
      body: "FRB金利変動確率とは、米国の中央銀行である連邦準備制度理事会（FRB）が、次回のFOMC会合で政策金利を引き下げるか、据え置くか、引き上げるかを市場がどの程度見込んでいるかを示す数値です。",
    },
    how: {
      title: "算出方法",
      body: "この確率は、CMEグループが上場する30日物フェデラルファンド金利先物の価格から算出されます。先物市場にはすでに金利予想が織り込まれているため、取引時間中はリアルタイムで更新され、アンケートや予測は一切使用しません。",
    },
    read: {
      title: "見方",
      body: "上部の「現在の金利範囲」は、FRBが現在設定している誘導目標レンジ（例：3.75%–4.00%）です。その下に並ぶ各パーセンテージは、次回会合後に政策金利がその水準に落ち着く市場の予想確率を示します。「25bpsの利上げ」は0.25ポイントの引き上げを意味します。",
    },
  },

  copyright: "© 2025 - ###year###",
};
