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

export type LogoutResponse = {
  ok: true;
};

export type LoginResponse = {
  data: AuthPrincipal;
};

export type AuthResponse = LoginResponse | LogoutResponse | undefined;

export type AuthStatus =
  | "checking"
  | "anonymous"
  | "authenticated"
  | "authenticating"
  | "logging-out";

// export type LoginMutateAsync = UseMutateAsyncFunction<
//   AuthResponse,
//   ApiError,
//   ApiMutationVariables<LoginInput>,
//   unknown
// >;

// export type LogoutMutateAsync = UseMutateAsyncFunction<
//   LogoutResponse,
//   ApiError,
//   ApiMutationVariables<never>,
//   unknown
// >;

export type AuthContext = {
  principal: AuthPrincipal | null;
  status: AuthStatus;
  isChecking: boolean;
  isAuthenticated: boolean;
  error: unknown;
  login: (input: LoginInput) => Promise<AuthResponse>;
  logout: () => Promise<void>;
  refresh: () => Promise<void>;
};
