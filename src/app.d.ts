// See https://svelte.dev/docs/kit/types#app.d.ts
// for information about these interfaces

import { KVNamespace, DurableObjectNamespace } from "@cloudflare/workers-types";

declare global {
  namespace App {
    // interface Error {}

    // interface Locals {}

    // interface PageData {}

    // interface PageState {}

    interface Env {
      KV: KVNamespace;
    }

    interface Platform {
      env: Env;
    }
  }
}

export {};
