import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import { eq, and, desc, asc, inArray } from "drizzle-orm";
import type { AppEnv } from "@/types/app";
import {
  contactRequests,
  mediaAssets,
  postMedia,
  posts,
  postTags,
  tags,
} from "@/db/schema";

import {
  createPostSchema,
  UpdatePostInput,
  updatePostSchema,
} from "@/contracts/posts.contract";
import { requireAdmin } from "@/middleware/require-admin";
import { requireAdminOrigin } from "@/middleware/require-admin-origin";
import { copyDefinedFields, normalizeTags, slugify } from "@/utils";
import { DIRECT_POST_UPDATE_FIELDS } from "@/types/updateFields";

export const adminPostsRoutes = new Hono<AppEnv>();

adminPostsRoutes.use("*", requireAdmin);
adminPostsRoutes.use("*", requireAdminOrigin);

const setInlineMediaForPost = async ({
  db,
  postId,
  inlineMedia,
}: {
  db: AppEnv["Variables"]["db"];
  postId: string;
  inlineMedia: Array<{
    mediaId: string;
    embedKey?: string;
    sortOrder?: number;
  }>;
}) => {
  await db
    .delete(postMedia)
    .where(
      and(eq(postMedia.postId, postId), eq(postMedia.usageType, "inline"))
    );

  if (!inlineMedia.length) return;

  await db.insert(postMedia).values(
    inlineMedia.map((media, index) => ({
      postId,
      mediaId: media.mediaId,
      usageType: "inline" as const,
      embedKey: media.embedKey,
      sortOrder: media.sortOrder ?? index,
    }))
  );
};

const setTagsForPost = async ({
  db,
  postId,
  tagNames,
}: {
  db: AppEnv["Variables"]["db"];
  postId: string;
  tagNames: string[];
}) => {
  await db.delete(postTags).where(eq(postTags.postId, postId));

  const normalizedTags = normalizeTags(tagNames);

  for (const normalizedTag of normalizedTags) {
    const [tag] = await db
      .insert(tags)
      .values({
        name: normalizedTag.name,
        slug: normalizedTag.slug,
      })
      .onConflictDoUpdate({
        target: tags.slug,
        set: {
          name: normalizedTag.name,
        },
      })
      .returning({
        id: tags.id,
      });

    await db
      .insert(postTags)
      .values({
        postId,
        tagId: tag.id,
      })
      .onConflictDoNothing();
  }
};

adminPostsRoutes.get("/", async (c) => {
  const db = c.get("db");

  const results = await db
    .select({
      id: posts.id,
      type: posts.type,
      status: posts.status,
      title: posts.title,
      slug: posts.slug,
      excerpt: posts.excerpt,
      publishedAt: posts.publishedAt,
      createdAt: posts.createdAt,
      updatedAt: posts.updatedAt,

      coverMediaId: mediaAssets.id,
      coverMediaUrl: mediaAssets.publicUrl,
      coverMediaMimeType: mediaAssets.mimeType,
      coverMediaAltText: mediaAssets.altText,
      coverMediaWidth: mediaAssets.width,
      coverMediaHeight: mediaAssets.height,
    })
    .from(posts)
    .leftJoin(mediaAssets, eq(posts.coverMediaId, mediaAssets.id))
    .orderBy(desc(posts.updatedAt));

  const data = results.map((row) => ({
    id: row.id,
    type: row.type,
    status: row.status,
    title: row.title,
    slug: row.slug,
    excerpt: row.excerpt,
    publishedAt: row.publishedAt,
    createdAt: row.createdAt,
    updatedAt: row.updatedAt,

    coverMedia: row.coverMediaId
      ? {
          id: row.coverMediaId,
          url: row.coverMediaUrl,
          mimeType: row.coverMediaMimeType,
          altText: row.coverMediaAltText,
          width: row.coverMediaWidth,
          height: row.coverMediaHeight,
        }
      : null,
  }));

  return c.json({ data }, 200);
});

adminPostsRoutes.get("/:id", async (c) => {
  const db = c.get("db");
  const id = c.req.param("id");

  const [post] = await db.select().from(posts).where(eq(posts.id, id)).limit(1);

  if (!post) {
    return c.json({ error: "Post not found" }, 404);
  }

  const inlineMedia = await db
    .select({
      id: mediaAssets.id,
      url: mediaAssets.publicUrl,
      mimeType: mediaAssets.mimeType,
      altText: mediaAssets.altText,
      caption: mediaAssets.caption,
      width: mediaAssets.width,
      height: mediaAssets.height,
      embedKey: postMedia.embedKey,
      sortOrder: postMedia.sortOrder,
    })
    .from(postMedia)
    .innerJoin(mediaAssets, eq(postMedia.mediaId, mediaAssets.id))
    .where(and(eq(postMedia.postId, id), eq(postMedia.usageType, "inline")))
    .orderBy(asc(postMedia.sortOrder));

  const postTagRows = await db
    .select({
      id: tags.id,
      name: tags.name,
      slug: tags.slug,
    })
    .from(postTags)
    .innerJoin(tags, eq(postTags.tagId, tags.id))
    .where(eq(postTags.postId, id))
    .orderBy(asc(tags.name));

  return c.json(
    {
      data: {
        ...post,
        inlineMedia,
        tags: postTagRows,
      },
    },
    200
  );
});

adminPostsRoutes.post("/", zValidator("json", createPostSchema), async (c) => {
  const db = c.get("db");
  const admin = c.get("admin");
  const input = c.req.valid("json");

  const slug = slugify(input.slug ?? input.title);

  if (!slug) {
    return c.json({ error: "A valid slug could not be generated" }, 400);
  }

  const [createdPost] = await db
    .insert(posts)
    .values({
      type: input.type,
      title: input.title,
      slug,
      excerpt: input.excerpt,
      contentMarkdown: input.contentMarkdown,
      coverMediaId: input.coverMediaId,
      previewMediaId: input.previewMediaId,
      seoTitle: input.seoTitle,
      seoDescription: input.seoDescription,
      metadata: {
        ...(input.metadata ?? {}),
        lastEditedBy: admin.username,
      },
    })
    .returning();

  if (input.inlineMedia !== undefined) {
    await setInlineMediaForPost({
      db,
      postId: createdPost.id,
      inlineMedia: input.inlineMedia,
    });
  }

  if (input.tags !== undefined) {
    await setTagsForPost({
      db,
      postId: createdPost.id,
      tagNames: input.tags,
    });
  }

  return c.json({ data: createdPost }, 201);
});

const DIRECT_POST_UPDATE_FIELDS = [
  "type",
  "title",
  "excerpt",
  "contentMarkdown",
  "coverMediaId",
  "previewMediaId",
  "seoTitle",
  "seoDescription",
] as const satisfies readonly (keyof UpdatePostInput)[];

adminPostsRoutes.patch(
  "/:id",
  zValidator("json", updatePostSchema),
  async (c) => {
    const db = c.get("db");
    const admin = c.get("admin");
    const id = c.req.param("id");
    const input = c.req.valid("json");

    const inputUpdate = copyDefinedFields(input, DIRECT_POST_UPDATE_FIELDS);

    const updateValues: Partial<typeof posts.$inferInsert> = {
      ...inputUpdate,
      updatedAt: new Date(),
    };

    if (input.slug !== undefined) {
      const slug = slugify(input.slug);

      if (!slug) {
        return c.json({ error: "Invalid slug." }, 400);
      }

      updateValues.slug = slug;
    }

    if (input.metadata !== undefined) {
      updateValues.metadata = {
        ...input.metadata,
        lastEditedBy: admin.username,
      };
    }

    const [updatedPost] = await db
      .update(posts)
      .set(updateValues)
      .where(eq(posts.id, id))
      .returning();

    if (!updatedPost) {
      return c.json({ error: "Post not found" }, 404);
    }

    if (input.inlineMedia !== undefined) {
      await setInlineMediaForPost({
        db,
        postId: id,
        inlineMedia: input.inlineMedia,
      });
    }

    if (input.tags !== undefined) {
      await setTagsForPost({
        db,
        postId: id,
        tagNames: input.tags,
      });
    }

    return c.json({ data: updatedPost }, 200);
  }
);

adminPostsRoutes.delete("/:id", async (c) => {
  const db = c.get("db");
  const id = c.req.param("id");

  const [deletedPost] = await db
    .delete(posts)
    .where(eq(posts.id, id))
    .returning({
      id: posts.id,
    });

  if (!deletedPost) {
    return c.json({ error: "Post not found" }, 404);
  }

  return c.json({ data: deletedPost }, 200);
});
