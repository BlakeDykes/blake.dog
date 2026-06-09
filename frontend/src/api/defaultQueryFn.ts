import { type QueryFunction } from "@tanstack/react-query";

import { apiFetch } from "./client";
import { resolveApiPath } from "./url";
import { isGetQueryKey } from "./queryKeys";

export const defaultQueryFn: QueryFunction = ({ queryKey, signal }) => {
  if (!isGetQueryKey(queryKey)) {
    throw new Error(`Unexpected query key shape: ${JSON.stringify(queryKey)}`);
  }

  const [, method, path, options] = queryKey;

  if (method !== "GET") {
    throw new Error(`Unsupported default query method: ${method}`);
  }

  const genPath = resolveApiPath({
    path,
    pathParams: options?.pathParams,
    searchParams: options?.searchParams,
  });

  return apiFetch<unknown>(genPath, {
    method,
    signal,
  });
};
