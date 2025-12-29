import type { Plugin } from "vite";
import fs from "fs";
import path from "path";

export default function plugin(): Plugin {
  return {
    name: "vite-append-trigger",

    closeBundle(error?: Error) {
      if (error) return;

      const workerPath = path.resolve(
        __dirname,
        "../.svelte-kit/cloudflare/_worker.js"
      );

      if (!fs.existsSync(workerPath)) {
        console.warn("❌ _worker.js not found, skipping scheduled append.");
        return;
      }

      let content = fs.readFileSync(workerPath, "utf-8");

      content += `
import { scheduled } from "../output/server/chunks/hooks.server.js"
worker_default.scheduled = scheduled;
`;

      fs.writeFileSync(workerPath, content, "utf-8");
      console.log("✅ Scheduled function appended to _worker.js");
    },
  };
}
