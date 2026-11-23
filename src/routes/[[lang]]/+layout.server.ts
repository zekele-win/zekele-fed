import { error, redirect } from "@sveltejs/kit";
import type { LayoutServerLoad } from "./$types";
import i18n, { langs, defLang, resolveLangByParam } from "$lib/i18n";

export const load: LayoutServerLoad = async ({ params }) => {
  const param = params.lang;
  const lang = resolveLangByParam(param);
  if (!lang) {
    error(404, "Not Found");
  }

  // Normalize non-canonical language URLs to their canonical form via 301.
  // This collapses duplicate-content variants (e.g. /en and /) into a single
  // indexable URL so search engines do not split signals across duplicates.
  //   /en    -> /
  //   /en-us -> /
  //   /zh-cn -> /zh-hans
  //   /zh-tw -> /zh-hant
  //   /ja-jp -> /ja
  if (param) {
    const canonicalUri = lang === defLang ? "" : langs[lang].uri;
    if (param.toLowerCase() !== canonicalUri) {
      redirect(301, `/${canonicalUri}`);
    }
  }

  return { lang, i18n: i18n[lang] };
};
