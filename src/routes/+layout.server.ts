import { redirect } from "@sveltejs/kit";
import type { LayoutServerLoad } from "./$types";
import langs, { type Lang } from "$lib/i18n/langs";

export const load: LayoutServerLoad = async ({ url, request, cookies }) => {
  if (url.pathname !== "/") {
    return;
  }

  const supportedLangs = Object.keys(langs) as Lang[];

  const cookieLang = cookies.get("lang")?.toLowerCase() as Lang | undefined;
  if (cookieLang && supportedLangs.includes(cookieLang)) {
    redirect(302, `/${cookieLang}`);
  }

  const accept = request.headers.get("accept-language")?.toLowerCase();
  if (accept) {
    const browserLangs = accept.split(",").map((x) => x.split(";")[0].trim());
    for (const browserLang of browserLangs) {
      for (const key of supportedLangs) {
        const info = langs[key];
        if (browserLang === key || info.aliases.includes(browserLang)) {
          redirect(302, `/${key}`);
        }
      }
    }
  }

  redirect(302, "/en");
};
