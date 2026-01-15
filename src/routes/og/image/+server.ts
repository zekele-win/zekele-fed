import type { RequestHandler } from "./$types";
import brandSvgRaw from "$lib/assets/brand.svg?raw";
import i18ns from "$lib/i18n";
import { type Lang } from "$lib/i18n/langs";
import { getData, type RateProb } from "$lib/fed";

const isMaxProb = (rateProbs: RateProb[], rateProb: RateProb) => {
  const maxRateProb = rateProbs
    .filter((c) => c.deltaRate !== 0)
    .reduce<RateProb | null>(
      (max, cur) => (!max || cur.prob > max.prob ? cur : max),
      null
    );
  return rateProb === maxRateProb;
};

const formatRateText = (i18n: any, rateProb: RateProb) => {
  if (rateProb.deltaRate === 0) {
    return i18n.noChangeProbability;
  }
  if (rateProb.deltaRate > 0) {
    return `${i18n.hikeProbability} ${rateProb.deltaRate} bps`;
  } else {
    return `${i18n.cutProbability} ${Math.abs(rateProb.deltaRate)} bps`;
  }
};

const formatProbText = (rateProb: RateProb) => {
  return (rateProb.prob / 10).toFixed(1) + "%";
};

export const GET: RequestHandler = async ({ url, platform }) => {
  const lang = url.searchParams.get("lang")!;
  const i18n = i18ns[lang as Lang];

  const fedData = await getData(platform!.env);

  const brandSvg = brandSvgRaw
    .replace(/^\s*<svg[^>]*>/, "")
    .replace(/<\/svg>\s*$/, "");

  let svg = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">`;

  svg += `
  <rect x="0" y="0" width="1200" height="630" fill="#eeeeee" />`;

  if (!fedData) {
    svg += `
  <g transform="translate(50, 100) scale(3)">
    ${brandSvg}
  </g>
  <text x="50" y="450" style="font: 120px system-ui,sans-serif; fill: #555555;">
    ${i18n.name}
  </text>`;
  } else {
    svg += `
  <g transform="translate(50, 55) scale(2)">
    ${brandSvg}
  </g>
  <text x="50" y="285" style="font: 90px system-ui,sans-serif; fill: #555555;">
    ${i18n.name}
  </text>`;

    const rateProbs = fedData.rateProbs;
    const count = rateProbs.length;
    for (let i = 0; i < count; i++) {
      const rateProb = rateProbs[i];
      const maxProb = isMaxProb(rateProbs, rateProb);

      let x = 55 + (1100 * i) / count;
      let y = 400;
      let fontSize = 40;
      svg += `
  <text x="${x}" y="${y}" style="font: ${fontSize}px system-ui,sans-serif; fill: ${
        maxProb ? `#555555` : `#888888`
      };">
    ${formatRateText(i18n, rateProb)}
  </text>`;

      x = 50 + (1100 * i) / count;
      y = 500;
      fontSize = 100;
      svg += `
  <text x="${x}" y="${y}" style="font: ${fontSize}px system-ui,sans-serif; fill: ${
        maxProb ? `#000000` : `#888888`
      };">
    ${formatProbText(rateProb)}
  </text>`;
    }
  }

  svg += `
</svg>`;

  return new Response(svg, {
    headers: {
      "Content-Type": "image/svg+xml",
      "Cache-Control": "public, max-age=3600",
    },
  });
};
