import type { Handle } from "@sveltejs/kit";
import i18n from "$lib/i18n";
import { defLang, type Lang } from "$lib/i18n/langs";

/**
 * Global request hook.
 * - Resolves the request with the correct language context.
 * - Injects the resolved language into the HTML output.
 */
export const handle: Handle = async ({ event, resolve }) => {
  // console.log("handle hook:", event.url.pathname);

  // Determine language from route param, fallback to English
  const lang = event.params.lang
    ? (event.params.lang.toLowerCase() as Lang)
    : defLang;

  // If language is supported, inject it into HTML (used for <html lang="...">)
  const response = i18n[lang as Lang]
    ? await resolve(event, {
        transformPageChunk: ({ html }) => html.replace("###lang###", lang),
      })
    : await resolve(event);

  return response;
};

// -----------------------------------------------------------------------------
// Cloudflare Workers scheduled entry
// -----------------------------------------------------------------------------
//
// NOTE:
// This function is intentionally defined here and NOT obfuscated.
// It is used as a stable entry point for a custom Vite plugin to inject
//   into Cloudflare's `_worker.js` during build time.

import type {
  ScheduledController,
  ExecutionContext,
} from "@cloudflare/workers-types";
import { refreshData } from "$lib/fed";

/**
 * Cloudflare Workers scheduled task.
 *
 * - Triggered by cron schedules defined in wrangler configuration.
 * - Refreshes and caches FedWatch-related data asynchronously.
 * - Uses `ctx.waitUntil` to avoid blocking the worker lifecycle.
 */
export const scheduled = async (
  controller: ScheduledController,
  env: App.Env,
  ctx: ExecutionContext
) => {
  ctx.waitUntil(refreshData(env));
};
