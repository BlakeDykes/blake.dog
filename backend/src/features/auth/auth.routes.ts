import {
  authResponseSchema,
  loginSchema,
  lougoutResponseSchema,
} from "@/features/auth/auth.contracts";
import { AppEnv } from "@/lib/app.types";
import { appZValidator } from "@/lib/validation";
import { Hono } from "hono";
import { deleteCookie, setCookie } from "hono/cookie";
import { HTTPException } from "hono/http-exception";
import {
  AUTH_COOKIE_NAME,
  AUTH_COOKIE_OPTIONS,
  DELETE_AUTH_COOKIE_OPTIONS,
} from "./auth.cookies";
import { createAdminJwt, createAdminPrincipal } from "./auth.jwt";
import { requireAdmin } from "./auth.middleware";
import { verifyPassword } from "./auth.utils";

export const authRoutes = new Hono<AppEnv>();

authRoutes.post("/login", appZValidator("json", loginSchema), async (c) => {
  const input = c.req.valid("json");
  const usernameMatches = input.username === c.env.ADMIN_USERNAME;

  if (!usernameMatches) {
    throw new HTTPException(401, {
      message: "Invalid Username",
    });
  }

  const passwordMatches = await verifyPassword({
    password: input.password,
    storedHash: c.env.ADMIN_PASSWORD_HASH,
  });

  if (!passwordMatches) {
    throw new HTTPException(401, {
      message: "Invalid Password",
    });
  }

  const principal = await createAdminPrincipal(input.username);
  const token = await createAdminJwt({
    username: input.username,
    secret: c.env.JWT_SECRET,
  });

  setCookie(c, AUTH_COOKIE_NAME, token, AUTH_COOKIE_OPTIONS);

  return c.json(
    authResponseSchema.parse({
      data: principal,
    })
  );
});

authRoutes.get("/user", requireAdmin, async (c) => {
  return c.json(
    authResponseSchema.parse({
      data: c.get("admin"),
    })
  );
});

authRoutes.post("/logout", async (c) => {
  deleteCookie(c, AUTH_COOKIE_NAME, DELETE_AUTH_COOKIE_OPTIONS);

  return c.json(
    lougoutResponseSchema.parse({
      ok: true,
    })
  );
});
