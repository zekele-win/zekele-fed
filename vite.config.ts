import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "vitest/config";
import { playwright } from "@vitest/browser-playwright";
import { sveltekit } from "@sveltejs/kit/vite";
import cloudflareAppendTrigger from "./scripts/cloudflare-append-trigger";

export default defineConfig({
  plugins: [tailwindcss(), sveltekit(), cloudflareAppendTrigger()],

  test: {
    expect: { requireAssertions: true },

    projects: [
      {
        test: {
          name: "browser",
          browser: {
            enabled: true,
            provider: playwright(),
            instances: [{ browser: "chromium", headless: true }],
          },
          include: ["src/**/*.svelte.spec.ts"],
        },
      },

      {
        test: {
          name: "node",
          environment: "node",
          include: ["src/**/*.spec.ts"],
          exclude: ["src/**/*.svelte.spec.ts"],
        },
      },
    ],
  },
});
