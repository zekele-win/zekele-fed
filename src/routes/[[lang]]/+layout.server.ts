import { error, redirect, type Cookies } from "@sveltejs/kit";
import type { LayoutServerLoad } from "./$types";
import i18n from "$lib/i18n";
import langs, { defLang, type Lang } from "$lib/i18n/langs";

const supportedLangs = Object.keys(langs) as Lang[];

function findCookieLang(cookies: Cookies): string | null {
  const cookieLang = cookies.get("lang")?.toLowerCase() as Lang | undefined;
  // console.log("cookieLang:", cookieLang);

  if (cookieLang && supportedLangs.includes(cookieLang)) {
    if (cookieLang !== defLang) {
      redirect(302, `/${cookieLang}`);
    }
    return cookieLang;
  }

  return null;
}

function findAcceptLang(request: Request): string | null {
  const acceptLang = request.headers.get("accept-language")?.toLowerCase();
  // console.log("acceptLang:", acceptLang);

  if (acceptLang) {
    const browserLangs = acceptLang
      .split(",")
      .map((x) => x.split(";")[0].trim());
    for (const browserLang of browserLangs) {
      for (const key of supportedLangs) {
        const info = langs[key];
        if (browserLang === key || info.aliases.includes(browserLang)) {
          if (key !== defLang) {
            redirect(302, `/${key}`);
          }
          return key;
        }
      }
    }
  }

  return null;
}

export const load: LayoutServerLoad = async ({ params, cookies, request }) => {
  let lang = params.lang ? params.lang.toLowerCase() : null;
  if (!lang) lang = findCookieLang(cookies);
  if (!lang) findAcceptLang(request);
  if (!lang) lang = defLang;

  if (!supportedLangs.includes(lang as Lang)) {
    error(404, "Not Found");
  }

  return { lang, i18n: i18n[lang as Lang] };
};
