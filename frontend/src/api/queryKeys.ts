import { isObjectType } from "@/utils";
import type { ApiGetQueryKey, ApiGetQueryOptions } from "./types";

export const apiKeys = {
  all: ["api"] as const,
  get: (path: string, options: ApiGetQueryOptions = {}) =>
    ["api", "GET", path, options] as const satisfies ApiGetQueryKey,
};

export const isGetQueryKey = (key: unknown): key is ApiGetQueryKey => {
  return (
    Array.isArray(key) &&
    key?.[0] === "api" &&
    key?.[1] === "GET" &&
    typeof key?.[2] === "string" &&
    isObjectType(key?.[3])
  );
};
