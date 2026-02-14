import type { RequestHandler } from "./$types";
import { langs, defLang, type Lang } from "$lib/i18n";

const pages = [""];

export const GET: RequestHandler = async ({ url, platform }) => {
  let content = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
  xmlns:xhtml="http://www.w3.org/1999/xhtml">
`;

  for (const page of pages) {
    const hrefs = [];
    for (const lang in langs) {
      const info = langs[lang as Lang];
      const uri = info.uri;
      const href =
        !uri && !page
          ? `${url.origin}/`
          : !uri && page
            ? `${url.origin}/${page}`
            : uri && !page
              ? `${url.origin}/${uri}`
              : `${url.origin}/${uri}/${page}`;
      hrefs.push({ lang, href });
    }

    let hreflangs = "";
    for (const { lang, href } of hrefs) {
      if (lang === defLang) {
        hreflangs += `
    <xhtml:link rel="alternate" hreflang="x-default" href="${href}" />`;
      }
      hreflangs += `
    <xhtml:link rel="alternate" hreflang="${lang}" href="${href}" />`;
    }

    for (const { href } of hrefs) {
      content += `
  <url>
    <loc>${href}</loc>`;
      content += hreflangs;
      content += `
  </url>
`;
    }
  }

  content += `
</urlset>`;

  return new Response(content, {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
    },
  });
};
