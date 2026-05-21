import type { CookieOptions } from "hono/utils/cookie";

export const AUTH_COOKIE_NAME = "__Host-bd_admin_session";
export const AUTH_SESSION_TTL_SECONDS = 60 * 30;

export const AUTH_COOKIE_OPTIONS = {
  httpOnly: true,
  secure: true,
  sameSite: "Lax",
  path: "/",
  maxAge: AUTH_SESSION_TTL_SECONDS,
} satisfies CookieOptions;

export const DELETE_AUTH_COOKIE_OPTIONS = {
  secure: true,
  path: "/",
} satisfies CookieOptions;
