export default {
  title: "Probabilidade de alta e corte de juros do Fed ao vivo | FOMC | Zekele",
  desc: "Probabilidade em tempo real de alta, corte ou manutenção de juros na próxima reunião do FOMC. Dados dos futuros de fundos federais do CME FedWatch, com a faixa atual de juros e a contagem regressiva.",

  name: "Probabilidade de mudança de juros do Fed",

  noData: "Aguardando dados …",

  currentRateRange: "Faixa atual de juros",

  cutProbability: "Corte",
  noChangeProbability: "Manutenção",
  hikeProbability: "Alta",
  bps: "pb",

  cutProbabilityDescription: {
    prefix: "Probabilidade de corte de ",
    suffix: " pb: ",
  },
  noChangeProbabilityDescription: {
    suffix: "Probabilidade de manutenção: ",
  },
  hikeProbabilityDescription: {
    prefix: "Probabilidade de alta de ",
    suffix: " pb: ",
  },

  days: "Dias",
  hours: "Horas",
  minutes: "Min",
  shortDays: "d",
  shortHours: "h",
  shortMinutes: "min",

  updateTime: {
    prefix: "Atualizado há ",
    suffix: "",
    just: "Atualizado agora",
  },

  nextMeetingCountdown: "Próxima reunião do FOMC em",

  dataSource: {
    prefix: "Fonte: ",
    fedWatchTool: "CME FedWatch",
    fomcMeetingCalendar: "Calendário do FOMC",
  },

  disclaimer:
    "Aviso: apenas para fins informativos, não é aconselhamento de investimento.",

  about: {
    heading: "O que é a probabilidade de mudança de juros do Fed?",
    what: {
      title: "O que mostra",
      body: "A probabilidade de mudança de juros do Fed é a estimativa do mercado sobre a chance de o Federal Reserve (o banco central dos EUA) cortar, manter ou elevar sua taxa básica de juros na próxima reunião do FOMC.",
    },
    how: {
      title: "Como é calculada",
      body: "Essas probabilidades são derivadas dos preços dos futuros de fundos federais de 30 dias listados pelo CME Group. Como o mercado futuro já precifica as expectativas de juros, as probabilidades se atualizam em tempo real durante o horário de negociação, sem pesquisas nem previsões.",
    },
    read: {
      title: "Como ler",
      body: "A faixa atual de juros no topo é a meta vigente do Fed (por exemplo, 3,75%–4,00%). Cada porcentagem abaixo mostra a chance implícita de a taxa básica terminar naquele nível após a próxima reunião. Uma alta de 25 pb equivale a 0,25 ponto percentual.",
    },
  },

  copyright: "© 2025 - ###year###",
};
