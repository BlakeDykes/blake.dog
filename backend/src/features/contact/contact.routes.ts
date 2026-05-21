import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { AppEnv } from "@/lib/app.types";
import { contactRequests } from "@/db/schema";
import {
  contactRequestParamsSchema,
  contactRequestResponseSchema,
  createContactRequestSchema,
  listContactRequestsQuerySchema,
  type ContactRequestResponse,
} from "@/features/contact/contact.contract";
import { hashIpAddress, normalizeNullableString } from "@/utils";
import { desc, eq, count } from "drizzle-orm";

export const contactRoutes = new Hono<AppEnv>();

const toContactRequestResponse = (
  row: typeof contactRequests.$inferInsert
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

contactRoutes.get(
  "/",
  zValidator("query", listContactRequestsQuerySchema),
  async (c) => {
    const db = c.get("db");
    const query = c.req.valid("query");

    const whereClause = query.status
      ? eq(contactRequests.status, query.status)
      : undefined;

    const rows = await db
      .select()
      .from(contactRequests)
      .where(whereClause)
      .orderBy(desc(contactRequests.createdAt))
      .limit(query.limit)
      .offset(query.offset);

    const [{ total }] = await db
      .select({
        total: count(),
      })
      .from(contactRequests)
      .where(whereClause);

    return c.json({
      contactRequests: rows.map(toContactRequestResponse),
      pagination: {
        total,
        limit: query.limit,
        offset: query.offset,
      },
    });
  }
);

contactRoutes.get(
  "/:id",
  zValidator("param", contactRequestParamsSchema),
  async (c) => {
    const db = c.get("db");
    const { id } = c.req.valid("param");

    const [row] = await db
      .select()
      .from(contactRequests)
      .where(eq(contactRequests.id, id))
      .limit(1);

    if (!row) {
      return c.json(
        {
          error: "Contact request not found",
        },
        404
      );
    }

    return c.json({
      contactRequest: toContactRequestResponse(row),
    });
  }
);
