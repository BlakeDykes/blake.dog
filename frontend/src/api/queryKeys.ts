import type { ApiGetQueryKey, ApiGetQueryOptions } from "./types";

export const apiKeys = {
  all: ["api"] as const,
  get: (path: string, options: ApiGetQueryOptions = {}) =>
    ["api", "GET", path, options] as const satisfies ApiGetQueryKey,
};
