import { apiFetch } from "@/api/client";
import type { AuthResponse, LoginInput } from "./auth.types";

export const loginRequest = async (input: LoginInput): Promise<AuthResponse> =>
  apiFetch<AuthResponse>("/auth/login", {
    method: "POST",
    body: input,
  });
