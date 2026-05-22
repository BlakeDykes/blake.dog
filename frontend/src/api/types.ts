import type { UseMutationOptions } from "@tanstack/react-query";

export type JsonBody =
  | Record<string, unknown>
  | unknown[]
  | string
  | number
  | boolean
  | null;

export type ApiClientOptions = Omit<RequestInit, "body"> & {
  body?: BodyInit | JsonBody;
};

export type ApiBody = ApiClientOptions["body"];

export type ApiSearchParams = Record<
  string,
  string | number | boolean | null | undefined
>;

export type ApiPathParams = Record<string, string | number>;

export type ApiGetQueryOptions = {
  pathParams?: ApiPathParams;
  searchParams?: ApiSearchParams;
};

export type ApiMethod = [];

export type ApiGetQueryKey = readonly [
  "api",
  "GET",
  string,
  ApiGetQueryOptions,
];

export type ApiMutationMethod = "POST" | "PATCH" | "PUT" | "DELETE";

export type ApiMutationVariables<TBody extends ApiBody = JsonBody> = {
  path?: string;
  body?: TBody;
  request?: Omit<ApiClientOptions, "body" | "method">;
};

export type UseApiMutationOptions<
  TResult,
  TBody extends ApiBody,
  TError,
  TContext,
> = Omit<
  UseMutationOptions<TResult, TError, ApiMutationVariables<TBody>, TContext>,
  "mutationFn"
>;

export type SearchParams = Record<
  string,
  string | number | boolean | null | undefined
>;

export type PathParams = Record<string, string | number>;
