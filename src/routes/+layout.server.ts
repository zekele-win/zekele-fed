import { redirect } from "@sveltejs/kit";
import type { LayoutServerLoad } from "./$types";
import langs, { type Lang } from "$lib/i18n/langs";

export const load: LayoutServerLoad = async ({ url, request, cookies }) => {
  // Only handle the root path (/).
  // All other routes are already language-scoped (e.g. /en, /zh-hans).
  if (url.pathname !== "/") {
    return;
  }

  // List of supported language codes
  const supportedLangs = Object.keys(langs) as Lang[];

  // 1. Highest priority: language stored in cookie.
  // If a valid language cookie exists, redirect immediately.
  const cookieLang = cookies.get("lang")?.toLowerCase() as Lang | undefined;
  if (cookieLang && supportedLangs.includes(cookieLang)) {
    redirect(302, `/${cookieLang}`);
  }

  // 2. Fallback: detect browser language from Accept-Language header.
  const accept = request.headers.get("accept-language")?.toLowerCase();
  if (accept) {
    // Parse browser-preferred languages in order.
    const browserLangs = accept.split(",").map((x) => x.split(";")[0].trim());

    for (const browserLang of browserLangs) {
      for (const key of supportedLangs) {
        const info = langs[key];

        // Match either exact language code or defined aliases.
        if (browserLang === key || info.aliases.includes(browserLang)) {
          redirect(302, `/${key}`);
        }
      }
    }
  }

  // 3. Final fallback: default to English.
  redirect(302, "/en");
};
