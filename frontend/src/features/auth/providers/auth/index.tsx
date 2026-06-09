import { useCallback, useMemo } from "react";
import {
  type AuthContext,
  type AuthResponse,
  type AuthStatus,
  type LoginInput,
  type LoginResponse,
  type LogoutResponse,
} from "@/features/auth/auth.types";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { authKeys } from "@/features/auth/auth.keys";
import { useApiMutation } from "@/api/hooks";
import { isUnauthorizedError, type ApiError } from "@/api/ApiError";
import type { ApiGetQueryKey } from "@/api/types";
import { AuthCtx } from "./context";

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const queryClient = useQueryClient();

  const authQuery = useQuery<
    AuthResponse,
    ApiError,
    AuthContext["principal"],
    ApiGetQueryKey
  >({
    queryKey: authKeys.user(),
    retry: false,
    select: (res) =>
      (res as LoginResponse)?.data ? (res as LoginResponse).data : null,
  });

  const clearNonAuthQueries = useCallback(() => {
    queryClient.removeQueries({
      predicate: (query) => !authKeys.isAuthQueryKey(query.queryKey),
    });
  }, [queryClient]);

  const logoutMutation = useApiMutation<LogoutResponse, never, ApiError>({
    method: "POST",
    path: "/auth/logout",
    options: {
      onSuccess: (res) => {
        clearNonAuthQueries();
        if (res?.ok) {
          queryClient.setQueryData<AuthResponse>(authKeys.user(), res);
        }
      },
    },
  });

  const loginMutation = useApiMutation<AuthResponse, LoginInput, ApiError>({
    method: "POST",
    path: "/auth/login",
    options: {
      onSuccess: (res) => {
        clearNonAuthQueries();
        queryClient.setQueryData<AuthResponse>(authKeys.user(), res);
      },
    },
  });

  const login = useCallback(
    async (input: LoginInput) => {
      return await loginMutation.mutateAsync({
        body: input,
      });
    },
    [loginMutation]
  );

  const logout = useCallback(async () => {
    await logoutMutation.mutateAsync({});
  }, [logoutMutation]);

  const refresh = useCallback(async () => {
    await queryClient.invalidateQueries({
      queryKey: authKeys.user(),
    });
  }, [queryClient]);

  const principal = authQuery.data ?? null;

  const status = useMemo<AuthStatus>(() => {
    if (loginMutation.isPending) return "authenticating";
    if (logoutMutation.isPending) return "logging-out";
    if (authQuery.isPending) return "checking";
    if (principal) return "authenticated";

    return "anonymous";
  }, [
    authQuery.isPending,
    loginMutation.isPending,
    logoutMutation.isPending,
    principal,
  ]);

  const authError = isUnauthorizedError(authQuery.error)
    ? null
    : authQuery.error;

  const error =
    loginMutation.error ?? logoutMutation.error ?? authError ?? null;

  const value = useMemo<AuthContext>(
    () => ({
      principal,
      status,
      isChecking: status === "checking",
      isAuthenticated: status === "authenticated",
      error,
      login,
      logout,
      refresh,
    }),
    [principal, status, error, login, logout, refresh]
  );

  return <AuthCtx.Provider value={value}>{children}</AuthCtx.Provider>;
};
