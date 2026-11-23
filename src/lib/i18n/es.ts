export default {
  title: "Probabilidad de subida y recorte de tipos de la Fed en vivo | FOMC | Zekele",
  desc: "Probabilidad en tiempo real de subida, recorte o mantenimiento de tipos en la próxima reunión de la FOMC. Datos de los futuros de fondos federales del CME FedWatch, con el rango actual de tipos y la cuenta atrás.",

  name: "Probabilidad de cambios de tipos de la Fed",

  noData: "Esperando datos …",

  currentRateRange: "Rango actual de tipos",

  cutProbability: "Recorte",
  noChangeProbability: "Mantener",
  hikeProbability: "Subida",
  bps: "pb",

  cutProbabilityDescription: {
    prefix: "Probabilidad de un recorte de ",
    suffix: " pb: ",
  },
  noChangeProbabilityDescription: {
    suffix: "Probabilidad de mantener tipos: ",
  },
  hikeProbabilityDescription: {
    prefix: "Probabilidad de una subida de ",
    suffix: " pb: ",
  },

  days: "Días",
  hours: "Horas",
  minutes: "Min",
  shortDays: "d",
  shortHours: "h",
  shortMinutes: "min",

  updateTime: {
    prefix: "Actualizado hace ",
    suffix: "",
    just: "Actualizado ahora",
  },

  nextMeetingCountdown: "Próxima reunión de la FOMC en",

  dataSource: {
    prefix: "Fuente: ",
    fedWatchTool: "CME FedWatch",
    fomcMeetingCalendar: "Calendario de la FOMC",
  },

  disclaimer:
    "Aviso: solo con fines informativos, no constituye asesoramiento de inversión.",

  about: {
    heading: "¿Qué es la probabilidad de cambios de tipos de la Fed?",
    what: {
      title: "Qué muestra",
      body: "La probabilidad de cambios de tipos de la Fed es la estimación del mercado sobre la probabilidad de que la Reserva Federal (el banco central de EE. UU.) recorte, mantenga o suba su tipo de interés de referencia en la próxima reunión de la FOMC.",
    },
    how: {
      title: "Cómo se calcula",
      body: "Estas probabilidades se derivan de los precios de los futuros de fondos federales a 30 días del CME Group. Como el mercado de futuros ya descuenta las expectativas de tipos, las probabilidades se actualizan en tiempo real durante el horario de mercado, sin encuestas ni pronósticos.",
    },
    read: {
      title: "Cómo leerlo",
      body: "El rango actual de tipos de arriba es el objetivo vigente de la Fed (por ejemplo, 3,75%–4,00%). Cada porcentaje inferior muestra la probabilidad implícita de que el tipo objetivo acabe en ese nivel tras la próxima reunión. Una subida de 25 pb equivale a 0,25 puntos porcentuales.",
    },
  },

  copyright: "© 2025 - ###year###",
};
