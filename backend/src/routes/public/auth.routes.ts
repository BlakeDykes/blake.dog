import { Hono } from "hono";
import { AppEnv } from "@/types/app";
import { zValidator } from "@hono/zod-validator";
import { loginSchema } from "@/contracts/auth.contracts";
import { verifyPassword } from "@/auth/password";
import {
  ACCESS_TOKEN_TTL_SECONDS,
  AUTH_COOKIE_NAME,
  createAdminAccessToken,
  verifyAdminAccessToken,
} from "../../auth/tokens.";
import { deleteCookie, getCookie, setCookie } from "hono/cookie";
import { isSecureRequest } from "@/utils";

export const authRoutes = new Hono<AppEnv>();

authRoutes.post("/login", zValidator("json", loginSchema), async (c) => {
  const input = c.req.valid("json");
  const usernameMatches = input.username === c.env.ADMIN_USERNAME;

  const passwordMatches = await verifyPassword({
    password: input.password,
    storedHash: c.env.ADMIN_PASSWORD_HASH,
  });

  if (!usernameMatches || !passwordMatches) {
    return c.json({ error: "Invalid username or password" }, 401);
  }

  const token = await createAdminAccessToken({
    secret: c.env.AUTH_JWT_SECRET,
    username: c.env.ADMIN_USERNAME,
  });

  setCookie(c, AUTH_COOKIE_NAME, token, {
    httpOnly: true,
    secure: isSecureRequest(c.req.url),
    sameSite: "Strict",
    path: "/api",
    maxAge: ACCESS_TOKEN_TTL_SECONDS,
  });

  return c.json({
    data: {
      id: "admin",
      username: c.env.ADMIN_USERNAME,
      role: "admin",
    },
  });
});

authRoutes.get("/user", async (c) => {
  const token = getCookie(c, AUTH_COOKIE_NAME);

  if (!token) {
    return c.json({ data: null }, 200);
  }

  try {
    const payload = await verifyAdminAccessToken({
      token,
      secret: c.env.AUTH_JWT_SECRET,
    });

    return c.json({
      data: {
        id: "admin",
        username: payload.username,
        role: "admin",
      },
    });
  } catch {
    return c.json({ data: null }, 200);
  }
});

authRoutes.post("/logout", async (c) => {
  deleteCookie(c, AUTH_COOKIE_NAME, {
    path: "/api",
  });

  return c.json({ ok: true });
});
