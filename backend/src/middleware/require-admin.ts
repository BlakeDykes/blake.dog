import { Context, Next } from "hono";
import { AppEnv } from "../types/app";
import { getCookie } from "hono/cookie";
import { AUTH_COOKIE_NAME, verifyAdminAccessToken } from "../auth/tokens.";

const getBearerToken = (authorizationHeader: string | undefined) => {
  if (!authorizationHeader) return null;

  const [scheme, token] = authorizationHeader.split(" ");

  if (scheme !== "Bearer" || !token) {
    return null;
  }

  return token;
};

export const requireAdmin = async (c: Context<AppEnv>, next: Next) => {
  const cookieToken = getCookie(c, AUTH_COOKIE_NAME);
  const bearerToken = getBearerToken(c.req.header("Authorization"));

  const token = cookieToken ?? bearerToken;

  if (!token) {
    return c.json({ error: "Unauthorized" }, 401);
  }

  try {
    const payload = await verifyAdminAccessToken({
      token,
      secret: c.env.AUTH_JWT_SECRET,
    });

    c.set("admin", {
      id: "admin",
      username: payload.username,
      role: "admin",
    });

    await next();
  } catch {
    return c.json({ error: "Unauthorized" }, 401);
  }
};
