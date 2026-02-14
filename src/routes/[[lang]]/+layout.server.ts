import { error, redirect, type Cookies } from "@sveltejs/kit";
import type { LayoutServerLoad, LayoutParams } from "./$types";
import i18n, {
  langs,
  defLang,
  findLangByParam,
  findLangByCookie,
  findLangByAccept,
} from "$lib/i18n";

export const load: LayoutServerLoad = async ({ params, cookies, request }) => {
  const paramsLangStr = params.lang;
  // console.log("paramsLangStr:", paramsLangStr);
  const paramsLang = findLangByParam(paramsLangStr);
  if (!paramsLang) {
    error(404, "Not Found");
  }

  if (paramsLang !== defLang) {
    return { lang: paramsLang, i18n: i18n[paramsLang] };
  }

  const cookieLangStr = cookies.get("lang");
  // console.log("cookieLangStr:", cookieLangStr);
  const cookieLang = findLangByCookie(cookieLangStr);
  if (cookieLang) {
    if (cookieLang !== paramsLang) {
      redirect(302, `/${langs[cookieLang].uri}`);
    }
    return { lang: cookieLang, i18n: i18n[cookieLang] };
  }

  const acceptLangStr = request.headers.get("accept-language");
  // console.log("acceptLangStr:", acceptLangStr);
  const acceptLang = findLangByAccept(acceptLangStr);
  if (acceptLang) {
    if (acceptLang !== paramsLang) {
      redirect(302, `/${langs[acceptLang].uri}`);
    }
    return { lang: acceptLang, i18n: i18n[acceptLang] };
  }

  return { lang: defLang, i18n: i18n[defLang] };
};
