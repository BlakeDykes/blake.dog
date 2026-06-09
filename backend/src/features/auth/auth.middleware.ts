import { Context, Next } from "hono";
import { AppEnv } from "../../lib/app.types";
import { getCookie } from "hono/cookie";
import { AUTH_COOKIE_NAME } from "./auth.cookies";
import { createMiddleware } from "hono/factory";
import { HTTPException } from "hono/http-exception";
import { createAdminPrincipal, verifyAdminJwt } from "./auth.jwt";

export const requireAdmin = createMiddleware<AppEnv>(
  async (c: Context<AppEnv>, next: Next) => {
    const token = getCookie(c, AUTH_COOKIE_NAME);

    if (!token) {
      throw new HTTPException(401, {
        message: "Unauthorized",
      });
    }

    try {
      const payload = await verifyAdminJwt({
        token,
        secret: c.env.JWT_SECRET,
      });

      if (!payload) {
        throw new HTTPException(401, {
          message: "Unauthorized",
        });
      }

      c.set("adminJWT", payload);
      c.set("admin", createAdminPrincipal(payload.username));

      await next();
    } catch {
      throw new HTTPException(401, {
        message: "Unauthorized",
      });
    }
  }
);

const MUTATE_METHODS = new Set(["POST", "PUT", "PATCH", "DELETE"]);

export const requireAdminOrigin = createMiddleware<AppEnv>(
  async (c: Context<AppEnv>, next: Next) => {
    if (!MUTATE_METHODS.has(c.req.method)) {
      await next();
      return;
    }

    const origin = c.req.header("origin");

    if (origin && origin !== c.env.PUBLIC_APP_ORIGIN) {
      return c.json({ error: "Invalid request origin" }, 403);
    }

    await next();
  }
);
