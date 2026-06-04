import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { desc, eq } from "drizzle-orm";
import z from "zod";

import { AppEnv } from "@/lib/app.types";
import { mediaAssets } from "@/db/schema";

export const adminMediaRoutes = new Hono<AppEnv>();

const ALLOWED_MIME_TYPES = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
  "image/svg+xml",
  "video/mp4",
  "video/webm",
]);

const MAX_FILE_BYTES = 10 * 1024 * 1024; // 10 MB

const updateMediaSchema = z
  .object({
    altText: z.string().max(300).nullable().optional(),
    caption: z.string().max(500).nullable().optional(),
  })
  .refine((d) => Object.values(d).some((v) => v !== undefined), {
    message: "At least one field is required",
  });

adminMediaRoutes.get("/", async (c) => {
  const db = c.get("db");
  const limit = Math.min(Number(c.req.query("limit") ?? 50), 100);
  const offset = Number(c.req.query("offset") ?? 0);

  const results = await db
    .select()
    .from(mediaAssets)
    .orderBy(desc(mediaAssets.createdAt))
    .limit(limit)
    .offset(offset);

  return c.json({ data: results }, 200);
});

adminMediaRoutes.post("/", async (c) => {
  const formData = await c.req.formData();
  const file = formData.get("file");

  if (!file || !(file instanceof File)) {
    return c.json({ error: "file field is required" }, 400);
  }

  if (!ALLOWED_MIME_TYPES.has(file.type)) {
    return c.json({ error: "Unsupported file type" }, 400);
  }

  if (file.size > MAX_FILE_BYTES) {
    return c.json({ error: "File exceeds 10 MB limit" }, 400);
  }

  const altText = formData.get("altText")?.toString() ?? null;
  const width = formData.get("width") ? Number(formData.get("width")) : null;
  const height = formData.get("height") ? Number(formData.get("height")) : null;

  const ext = file.name.split(".").pop();
  const r2Key = `uploads/${crypto.randomUUID()}${ext ? `.${ext}` : ""}`;

  await c.env.MEDIA_BUCKET.put(r2Key, await file.arrayBuffer(), {
    httpMetadata: { contentType: file.type },
  });

  const publicMediaUrl = c.env.PUBLIC_MEDIA_URL;
  const publicUrl = publicMediaUrl ? `${publicMediaUrl}/${r2Key}` : null;

  const db = c.get("db");
  const [asset] = await db
    .insert(mediaAssets)
    .values({
      originalFileName: file.name,
      r2Key,
      publicUrl,
      mimeType: file.type,
      fileSizeBytes: file.size,
      width: width && !isNaN(width) ? width : null,
      height: height && !isNaN(height) ? height : null,
      altText,
    })
    .returning();

  return c.json({ data: asset }, 201);
});

adminMediaRoutes.patch(
  "/:id",
  zValidator("json", updateMediaSchema),
  async (c) => {
    const db = c.get("db");
    const id = c.req.param("id");
    const input = c.req.valid("json");

    const [updated] = await db
      .update(mediaAssets)
      .set(input)
      .where(eq(mediaAssets.id, id))
      .returning();

    if (!updated) {
      return c.json({ error: "Not found" }, 404);
    }

    return c.json({ data: updated }, 200);
  }
);

adminMediaRoutes.delete("/:id", async (c) => {
  const db = c.get("db");
  const id = c.req.param("id");

  const [asset] = await db
    .select({ r2Key: mediaAssets.r2Key })
    .from(mediaAssets)
    .where(eq(mediaAssets.id, id))
    .limit(1);

  if (!asset) {
    return c.json({ error: "Not found" }, 404);
  }

  await c.env.MEDIA_BUCKET.delete(asset.r2Key);

  await db.delete(mediaAssets).where(eq(mediaAssets.id, id));

  return c.json({ data: { id } }, 200);
});
