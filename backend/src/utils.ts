export const normalizeNullableString = (value: string | null | undefined) => {
  const trimmed = value?.trim();
  return trimmed ? trimmed : null;
};

export const hashIpAddress = async (ip: string | null) => {
  if (!ip) return null;

  const encoded = new TextEncoder().encode(ip);
  const digest = await crypto.subtle.digest("SHA-256", encoded);

  return Array.from(new Uint8Array(digest))
    .map((byte) => byte.toString(16).padStart(2, "0"))
    .join("");
};

export const slugify = (value: string) =>
  value
    .trim()
    .toLowerCase()
    .replace(/['"]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

export const isSecureRequest = (requestUrl: string) => {
  return new URL(requestUrl).protocol === "https:";
};

export const normalizeTags = (inputTags: string[]) => {
  const tagMap = new Map<string, { name: string; slug: string }>();

  for (const rawTag of inputTags) {
    const name = rawTag.trim();

    if (!name) continue;

    const slug = slugify(name);

    if (!slug) continue;

    tagMap.set(slug, {
      name,
      slug,
    });
  }

  return [...tagMap.values()];
};

export const copyDefinedFields = <
  TSource extends Record<string, unknown>,
  TKey extends keyof TSource,
>(
  source: TSource,
  keys: readonly TKey[]
) => {
  const output: Partial<Pick<TSource, TKey>> = {};

  for (const key of keys) {
    if (source[key] !== undefined) {
      output[key] = source[key];
    }
  }

  return output;
};
