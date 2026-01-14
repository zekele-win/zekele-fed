import type { PageServerLoad } from "./$types";
import { getData } from "$lib/fed";

export const load: PageServerLoad = async ({ platform }) => {
  return {
    fedData: await getData(platform!.env),
  };
};
