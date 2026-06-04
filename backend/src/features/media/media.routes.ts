import { Hono } from "hono";
import { AppEnv } from "@/lib/app.types";
import { mediaAssets } from "@/db/schema";
import { eq } from "drizzle-orm";

export const mediaRoutes = new Hono<AppEnv>();

mediaRoutes.get("/:id", async (c) => {
  const db = c.get("db");
  const id = c.req.param("id");

  const [asset] = await db
    .select()
    .from(mediaAssets)
    .where(eq(mediaAssets.id, id))
    .limit(1);

  if (!asset) {
    return c.json({ error: "Not found" }, 404);
  }

  return c.json({ data: asset }, 200);
});
