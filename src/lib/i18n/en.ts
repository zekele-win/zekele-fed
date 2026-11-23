export default {
  title: "Fed Rate Cut & Hike Probabilities — Live FOMC Odds | Zekele",
  desc: "Live FOMC rate decision odds from CME FedWatch: the probability of a Fed rate cut, hike, or hold at the next meeting, plus the current target range and countdown.",

  name: "Fed Rate Change Probabilities",

  noData: "Waiting for data …",

  currentRateRange: "Current Rate Range",

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

  about: {
    heading: "What is the Fed rate change probability?",
    what: {
      title: "What it shows",
      body: "Fed rate change probability is the market's estimate of how likely the U.S. Federal Reserve is to cut, hold, or raise its benchmark interest rate at the next FOMC meeting.",
    },
    how: {
      title: "How it is calculated",
      body: "These probabilities are derived from 30-Day Fed Funds futures prices listed by CME Group. Because the futures market already prices in rate expectations, the implied probabilities update in real time during trading hours — no surveys or forecasts are used.",
    },
    read: {
      title: "How to read it",
      body: "The current rate range at the top is the Fed's existing target range (for example, 3.75%–4.00%). Each percentage below shows the market-implied chance that the target rate will land at that level after the next meeting. A hike of 25 bps means a 0.25 percentage point increase.",
    },
  },

  copyright: "© 2025 - ###year###",
};
