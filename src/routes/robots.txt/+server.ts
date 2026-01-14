import type { RequestHandler } from "./$types";

export const GET: RequestHandler = async ({ url, platform }) => {
  const content = `# allow crawling everything by default
User-agent: *
Disallow:

Sitemap: ${url.origin}/sitemap.xml
`;

  return new Response(content, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
    },
  });
};
