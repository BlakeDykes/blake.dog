import { Hono } from "hono";
import { AppEnv } from "../@types/app";
import { mediaAssets, postMedia, posts } from "../db/schema";
import { and, asc, desc, eq } from "drizzle-orm";
import { alias } from "drizzle-orm/pg-core";
import { PublicPostDetail } from "../contracts/posts.contract";

export const postsRoutes = new Hono<AppEnv>();

const coverMedia = alias(mediaAssets, "cover_media");
const previewMedia = alias(mediaAssets, "preview_media");
const inlineMediaAsset = alias(mediaAssets, "inline_media_asset");

postsRoutes.get("/", async (c) => {
  const db = c.get("db");

  const results = await db
    .select({
      id: posts.id,
      type: posts.type,
      title: posts.title,
      slug: posts.slug,
      excerpt: posts.excerpt,
      publishedAt: posts.publishedAt,

      coverMediaId: coverMedia.id,
      coverMediaUrl: coverMedia.publicUrl,
      coverMediaMimeType: coverMedia.mimeType,
      coverMediaAltText: coverMedia.altText,
      coverMediaWidth: coverMedia.width,
      coverMediaHeight: coverMedia.height,

      previewMediaId: previewMedia.id,
      previewMediaUrl: previewMedia.publicUrl,
      previewMediaMimeType: previewMedia.mimeType,
      previewMediaAltText: previewMedia.altText,
      previewMediaWidth: previewMedia.width,
      previewMediaHeight: previewMedia.height,
    })
    .from(posts)
    .leftJoin(coverMedia, eq(posts.coverMediaId, coverMedia.id))
    .leftJoin(previewMedia, eq(posts.previewMediaId, previewMedia.id))
    .where(eq(posts.status, "published"))
    .orderBy(desc(posts.publishedAt));

  const data = results.map((row) => ({
    id: row.id,
    type: row.type,
    title: row.title,
    slug: row.slug,
    excerpt: row.excerpt,
    publishedAt: row.publishedAt,

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

    previewMedia: row.previewMediaId
      ? {
          id: row.previewMediaId,
          url: row.previewMediaUrl,
          mimeType: row.previewMediaMimeType,
          altText: row.previewMediaAltText,
          width: row.previewMediaWidth,
          height: row.previewMediaHeight,
        }
      : null,
  }));

  return c.json({ data: data }, 200);
});

postsRoutes.get("/:slug", async (c) => {
  const db = c.get("db");
  const slug = c.req.param("slug");

  const [post] = await db
    .select({
      id: posts.id,
      type: posts.type,
      title: posts.title,
      slug: posts.slug,
      excerpt: posts.excerpt,
      contentMarkdown: posts.contentMarkdown,
      publishedAt: posts.publishedAt,
      seoTitle: posts.seoTitle,
      seoDescription: posts.seoDescription,
      metadata: posts.metadata,

      coverMediaId: coverMedia.id,
      coverMediaUrl: coverMedia.publicUrl,
      coverMediaMimeType: coverMedia.mimeType,
      coverMediaAltText: coverMedia.altText,
      coverMediaWidth: coverMedia.width,
      coverMediaHeight: coverMedia.height,

      previewMediaId: previewMedia.id,
      previewMediaUrl: previewMedia.publicUrl,
      previewMediaMimeType: previewMedia.mimeType,
      previewMediaAltText: previewMedia.altText,
      previewMediaWidth: previewMedia.width,
      previewMediaHeight: previewMedia.height,
    })
    .from(posts)
    .leftJoin(coverMedia, eq(posts.coverMediaId, coverMedia.id))
    .leftJoin(previewMedia, eq(posts.previewMediaId, previewMedia.id))
    .where(and(eq(posts.slug, slug), eq(posts.status, "published")))
    .limit(1);

  if (!post) {
    return c.json({ error: "Post not found" }, 404);
  }

  const inlineMedia = await db
    .select({
      id: inlineMediaAsset.id,
      url: inlineMediaAsset.publicUrl,
      mimeType: inlineMediaAsset.mimeType,
      altText: inlineMediaAsset.altText,
      caption: inlineMediaAsset.caption,
      width: inlineMediaAsset.width,
      height: inlineMediaAsset.height,
      embedKey: postMedia.embedKey,
      sortOrder: postMedia.sortOrder,
    })
    .from(postMedia)
    .innerJoin(inlineMediaAsset, eq(postMedia.mediaId, inlineMediaAsset.id))
    .where(
      and(eq(postMedia.postId, post.id), eq(postMedia.usageType, "inline"))
    )
    .orderBy(asc(postMedia.sortOrder));

  const data: PublicPostDetail = {
    id: post.id,
    type: post.type,
    title: post.title,
    slug: post.slug,
    excerpt: post.excerpt,
    publishedAt: post.publishedAt,
    contentMarkdown: post.contentMarkdown,
    seoTitle: post.seoTitle,
    seoDescription: post.seoDescription,
    metadata: post.metadata,

    coverMedia: post.coverMediaId
      ? {
          id: post.coverMediaId,
          url: post.coverMediaUrl,
          mimeType: post.coverMediaMimeType,
          altText: post.coverMediaAltText,
          width: post.coverMediaWidth,
          height: post.coverMediaHeight,
        }
      : null,

    previewMedia: post.previewMediaId
      ? {
          id: post.previewMediaId,
          url: post.previewMediaUrl,
          mimeType: post.previewMediaMimeType,
          altText: post.previewMediaAltText,
          width: post.previewMediaWidth,
          height: post.previewMediaHeight,
        }
      : null,

    inlineMedia,
  };

  return c.json({ data }, 200);
});
