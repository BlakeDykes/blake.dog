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
