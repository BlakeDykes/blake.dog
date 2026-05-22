import { type QueryFunction } from "@tanstack/react-query";

import { apiFetch } from "./client";
import type { ApiGetQueryKey } from "./types";
import { resolveApiPath } from "./url";


export const defaultQueryFn : QueryFunction<unknown, ApiGetQueryKey> = ({
  queryKey,
  signal
}) => {
  const [, method, path, options] = queryKey;

  if(method !== "GET") {
    throw new Error(`Unsupported default query method: ${method}`);
  }

  const genPath = resolveApiPath({
    path,
    pathParams: options?.pathParams,
    searchParams: options?.searchParams
  });

  return apiFetch<unknown>(genPath, {
    method,
    signal
  });
}