export function getQueryParam(
  url: string,
  key: string,
  opts?: { ignoreEmpty?: boolean }
): string | undefined {
  const ignoreEmpty = opts?.ignoreEmpty ?? true;

  const target = key.toLowerCase();

  const u = new URL(url);
  for (const [k, v] of u.searchParams.entries()) {
    if (k.toLowerCase() !== target) continue;
    if (ignoreEmpty && v === "") continue;
    return v;
  }

  return undefined;
}
