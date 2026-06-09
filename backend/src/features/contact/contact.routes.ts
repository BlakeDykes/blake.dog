import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { AppEnv } from "@/lib/app.types";
import { contactRequests } from "@/db/schema";
import {
  contactRequestResponseSchema,
  createContactRequestSchema,
  type ContactRequestResponse,
} from "@/features/contact/contact.contract";
import { hashIpAddress, normalizeNullableString } from "@/utils";

export const contactRoutes = new Hono<AppEnv>();

export const toContactRequestResponse = (
  row: typeof contactRequests.$inferSelect
): ContactRequestResponse => {
  return contactRequestResponseSchema.parse({
    ...row,
    createdAt: row.createdAt?.toISOString(),
  });
};

contactRoutes.post(
  "/",
  zValidator("json", createContactRequestSchema),
  async (c) => {
    const db = c.get("db");
    const input = c.req.valid("json");

    const forwardFor = normalizeNullableString(c.req.header("X-Forwarded-For"));
    const cloudflareIp = normalizeNullableString(
      c.req.header("CF-Connecting-IP")
    );

    const ipAddress = cloudflareIp ?? forwardFor?.split(",")[0]?.trim() ?? null;
    const ipHash = await hashIpAddress(ipAddress);

    const userAgent = normalizeNullableString(c.req.header("User-Agent"));

    const [created] = await db
      .insert(contactRequests)
      .values({
        name: input.name,
        email: input.email,
        subject: input.subject ?? null,
        message: input.message,
        sourcePage: input.sourcePage ?? null,
        ipHash,
        userAgent,
      })
      .returning();

    return c.json(
      {
        contactRequest: toContactRequestResponse(created),
      },
      201
    );
  }
);
