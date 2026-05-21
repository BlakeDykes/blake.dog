import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import * as schema from "@/db/schema";
import { createMiddleware } from "hono/factory";

export const getDb = (databaseUrl: string) => {
  const sql = neon(databaseUrl);

  return drizzle(sql, {
    schema,
  });
};

export const withDb = createMiddleware(async (c, next) => {
  const dbUrl = c.env.DATABASE_URL;
  if (!dbUrl) {
    return c.json(
      {
        error: "DATABASE_URL is not configured",
      },
      500
    );
  }

  c.set("db", getDb(dbUrl));
  await next();
});
