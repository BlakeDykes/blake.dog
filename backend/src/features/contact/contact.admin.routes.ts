import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { count, desc, eq } from "drizzle-orm";

import { AppEnv } from "@/lib/app.types";
import { contactRequests } from "@/db/schema";
import {
  contactRequestParamsSchema,
  listContactRequestsQuerySchema,
} from "@/features/contact/contact.contract";
import { toContactRequestResponse } from "@/features/contact/contact.routes";

export const adminContactRoutes = new Hono<AppEnv>();

adminContactRoutes.get(
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

adminContactRoutes.get(
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
