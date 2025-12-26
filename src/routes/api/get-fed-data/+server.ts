import { json } from "@sveltejs/kit";
import type { RequestHandler } from "./$types";
import { getData } from "$lib/fed";

export const GET: RequestHandler = async ({ url, platform }) => {
  return json({
    fedData: await getData(platform!.env),
  });
};
