import type { ApiError } from "@/api/ApiError";
import type { ApiMutationVariables } from "@/api/types";
import type { UseMutateAsyncFunction } from "@tanstack/react-query";

export type AuthRole = "admin";

export type AuthPrincipal = {
  id: "admin";
  username: string;
  role: AuthRole;
};

export type LoginInput = {
  username: AuthPrincipal["username"];
  password: string;
};

export type AuthResponse = {
  data: AuthPrincipal;
};

export type LogoutResponse = {
  ok: true;
};

export type AuthStatus =
  | "checking"
  | "anonymous"
  | "authenticated"
  | "authenticating"
  | "logging-out";

export type LoginMutateAsync = UseMutateAsyncFunction<
  AuthResponse,
  ApiError,
  ApiMutationVariables<LoginInput>,
  unknown
>;

export type LogoutMutateAsync = UseMutateAsyncFunction<
  LogoutResponse,
  ApiError,
  ApiMutationVariables<never>,
  unknown
>;

export type AuthContext = {
  principal: AuthPrincipal;
  status: AuthStatus;
  isChecking: boolean;
  isAuthenticated: boolean;
  error: unknown;
  login: (input: LoginInput) => Promise<AuthPrincipal>;
  logout: () => Promise<void>;
  refresh: () => Promise<AuthPrincipal>;
};
