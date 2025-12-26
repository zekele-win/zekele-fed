import { redirect } from "@sveltejs/kit";
import type { LayoutServerLoad } from "./$types";
import { type Lang } from "$lib/i18n/langs";
import i18n from "$lib/i18n";

export const load: LayoutServerLoad = async ({ params }) => {
  const lang = params.lang as Lang;

  if (!lang || !i18n[lang]) {
    redirect(302, "/");
  }

  return { lang, i18n: i18n[lang] };
};
