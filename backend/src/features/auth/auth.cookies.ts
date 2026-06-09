import type { CookieOptions } from "hono/utils/cookie";

export const AUTH_COOKIE_NAME = "__Host-bd_admin_session";
export const AUTH_SESSION_TTL_SECONDS = 60 * 30;

// NOTE: `sameSite: "Lax"` assumes the SPA and the API are served from the same
// site (same registrable domain), e.g. app.example.com + api.example.com, or the
// dev Vite proxy. If they are deployed cross-site (e.g. *.pages.dev + *.workers.dev),
// the browser will NOT send this cookie on cross-site fetch() and admin auth breaks.
// In that case switch to `sameSite: "None"` (it is already `secure`) and rely on the
// `requireAdminOrigin` CSRF guard wired up in src/index.ts for mutation protection.
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
