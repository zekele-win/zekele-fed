export default {
  title: "Live Watch: Fed Rate Hike/Cut Probabilities | Zekele",
  desc: "Real-time monitoring of Fed interest rate paths. Automatically synced with CME FedWatch data, covering hike, cut, and hold probabilities.",

  name: "Fed Rate Change Probabilities",

  noData: "Waiting for data …",

  cutProbability: "Cut",
  noChangeProbability: "Hold",
  hikeProbability: "Hike",

  cutProbabilityDescription: {
    prefix: "Probability of a ",
    suffix: " bps cut: ",
  },
  noChangeProbabilityDescription: {
    suffix: "Probability of a hold: ",
  },
  hikeProbabilityDescription: {
    prefix: "Probability of a ",
    suffix: " bps hike: ",
  },

  days: "Days",
  hours: "Hours",
  minutes: "Mins",
  shortDays: "d",
  shortHours: "h",
  shortMinutes: "m",

  updateTime: {
    prefix: "Updated",
    suffix: "ago",
    just: "Just updated",
  },

  nextMeetingCountdown: "Next FOMC Meeting In",

  dataSource: {
    prefix: "Source: ",
    fedWatchTool: "CME FedWatch Tool",
    fomcMeetingCalendar: "FOMC Meeting Calendar",
  },

  disclaimer:
    "Disclaimer: For informational purposes only, not investment advice.",

  copyright: "© 2025 - ###year###",
};
