import { useCallback, useMemo, useRef } from "react";
import { AuthContext, AuthStatus, type AuthPrincipal, type AuthResponse, type LoginInput, type LoginMutateAsync, type LogoutMutateAsync, type LogoutResponse } from "../../features/auth/auth.types";
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
    AuthPrincipal | undefined,
    ApiGetQueryKey
  >({
      queryKey: authKeys.user(),
      retry: false,
      select: (response) => response.data
    });

    const clearNonAuthQueries = useCallback(() => {
      queryClient.removeQueries({
        predicate: (query) => !authKeys.isAuthQueryKey(query.queryKey)
      })
    }, [queryClient]);

    const logoutMutation = useApiMutation<LogoutResponse, never, ApiError>({
      method: "POST",
      path: "/auth/logout",
      options: {
        onSettled: () => {
          clearNonAuthQueries();
          queryClient.setQueryData<AuthResponse | undefined>(
            authKeys.user(),
            undefined
          )
        }
      }
    });
    const logoutMutateAsync : LogoutMutateAsync = logoutMutation.mutateAsync;


    const loginMutation = useApiMutation<AuthResponse, LoginInput, ApiError>({
      method: "POST",
      path: "/auth/login",
      options: {
        onSuccess: (response) => {
          clearNonAuthQueries();
          queryClient.setQueryData<AuthResponse>(
            authKeys.user(),
            response
          )
        }
      }
    });
    const loginMutateAsync : LoginMutateAsync = loginMutation.mutateAsync;


    const login = useCallback(async (input : LoginInput) => {
      const res = await loginMutateAsync({
        body: input
      });

      return res.data;
    }, [loginMutateAsync]);

    const logout = useCallback(async () => {
      return await logoutMutateAsync({});
    }, [logoutMutateAsync]);

    const refresh = useCallback(async () => {
      await queryClient.invalidateQueries({
        queryKey: authKeys.user()
      })
    }, [queryClient]);

    const principal = authQuery.data;

    const status = useMemo<AuthStatus>(() => {
      if(loginMutation.isPending) return "authenticating";
      if(logoutMutation.isPending) return "logging-out";
      if(authQuery.isPending) return "checking"
      if(principal) return "authenticated"
      
      return "anonymous";
    }, [
      authQuery.isPending,
      loginMutation.isPending,
      logoutMutation.isPending,
      principal
    ]);

    const authError = isUnauthorizedError(authQuery.error)
      ? null
      : authQuery.error

    const error = loginMutation.error ?? logoutMutation.error ?? authError ?? null;

    const value = useMemo<AuthContext>(() => ({
      principal,
      status,
      isChecking: status === "checking",
      isAuthenticated: status === "authenticated",
      error,
      login,
      logout,
      refresh
    }));

    return <AuthCtx.Provider value={value}>{children}</AuthCtx.Provider>
  }
