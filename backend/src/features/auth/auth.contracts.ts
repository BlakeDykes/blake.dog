import { z } from "zod";
import { JWT_AUDIENCE, JWT_ISSUER } from "./auth.jwt";

export const loginSchema = z.object({
  username: z.string().min(1).max(120),
  password: z.string().min(1).max(120),
});
export type LoginInput = z.infer<typeof loginSchema>;

export const authPrincipalSchema = z.object({
  id: z.literal("admin"),
  username: z.string(),
  role: z.literal("admin"),
});
export type AuthPrincipal = z.infer<typeof authPrincipalSchema>;

export const authResponseSchema = z.object({
  data: authPrincipalSchema,
});
export type AuthResponse = z.infer<typeof authResponseSchema>;

export const lougoutResponseSchema = z.object({
  ok: z.literal(true),
});
export type LogoutResponse = z.infer<typeof lougoutResponseSchema>;

export const adminJwtSchema = z.object({
  sub: z.literal("admin"),
  username: z.string(),
  role: z.literal("admin"),
  type: z.literal("access"),

  iss: z.literal(JWT_ISSUER),
  aud: z.literal(JWT_AUDIENCE),

  iat: z.number(),
  exp: z.number(),
});
export type AdminJwtPayload = z.infer<typeof adminJwtSchema>;
