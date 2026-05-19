import { Context, Next } from "hono";
import { AppEnv } from "../types/app";

const MUTATE_METHODS = new Set(["POST", "PUT", "PATCH", "DELETE"]);

export const requireAdminOrigin = async (c: Context<AppEnv>, next: Next) => {
  if (!MUTATE_METHODS.has(c.req.method)) {
    await next();
    return;
  }

  const origin = c.req.header("origin");

  if (origin && origin !== c.env.PUBLIC_APP_ORIGIN) {
    return c.json({ error: "Invalid request origin" }, 403);
  }

  await next();
};
