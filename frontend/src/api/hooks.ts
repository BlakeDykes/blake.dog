
import { useMutation } from "@tanstack/react-query"
import type { ApiMutationVariables, ApiMutationMethod, JsonBody, UseApiMutationOptions, ApiBody } from "./types"
import { apiFetch } from "./client"

export const useApiMutation = <
  TResult = unknown,
  TBody extends ApiBody = JsonBody,
  TError = Error,
  TContext = unknown
>({
  method, 
  path,
  options,
} : {
  method: ApiMutationMethod,
  path: string,
  options?: UseApiMutationOptions<TResult, TBody, TError, TContext>
}) => {
  return useMutation<TResult, TError, ApiMutationVariables<TBody>, TContext>({
    mutationFn: ({ path: overridePath, body, request }) => {
      return apiFetch<TResult>(overridePath ?? path, {
        method,
        body,
        ...request,
      });
    },
    ...options
  })
}
