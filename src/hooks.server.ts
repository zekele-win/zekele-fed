import type { Handle } from "@sveltejs/kit";
import i18n from "$lib/i18n";
import { type Lang } from "$lib/i18n/langs";

export const handle: Handle = async ({ event, resolve }) => {
  // console.log("handle hook:", event.url.pathname);

  const lang = event.params.lang ? event.params.lang : "en";
  const response = i18n[lang as Lang]
    ? await resolve(event, {
        transformPageChunk: ({ html }) => html.replace("###lang###", lang),
      })
    : await resolve(event);

  return response;
};

// !!!
// The code below is used to export cloudflare worker scheduled.

import type {
  ScheduledController,
  ExecutionContext,
} from "@cloudflare/workers-types";
import { refreshData } from "$lib/fed";

export const scheduled = async (
  controller: ScheduledController,
  env: App.Env,
  ctx: ExecutionContext
) => {
  ctx.waitUntil(refreshData(env));
};
