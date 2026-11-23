import type { RequestHandler } from "./$types";

export const GET: RequestHandler = async ({ url }) => {
  const origin = url.origin;
  const content = `# Zekele Fed

> Real-time FOMC rate change probabilities derived from CME FedWatch futures pricing. Shows the market-implied probability of a Fed rate cut, hold, or hike at the next FOMC meeting, plus the current target range and a countdown to the meeting.

## Localized pages

- [English](${origin}/)
- [日本語](${origin}/ja)
- [简体中文](${origin}/zh-hans)
- [繁體中文](${origin}/zh-hant)
`;

  return new Response(content, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
    },
  });
};
