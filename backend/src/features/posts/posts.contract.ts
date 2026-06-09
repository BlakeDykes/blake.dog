import { PostType, postTypeSchema } from "@/lib/enum";
import {
  inlineMediaSummarySchema,
  mediaSummarySchema,
  postInlineMediaInputSchema,
} from "../media/media.contract";
import { z } from "zod";

// -------------------------------------------------------------------------
// PublicPostSummary
export const publicPostSummarySchema = z.object({
  id: z.uuid(),
  type: postTypeSchema,
  title: z.string(),
  slug: z.string(),
  excerpt: z.string().nullable(),
  publishedAt: z.date().or(z.string()).nullable(),

  coverMedia: mediaSummarySchema.nullable(),
  previewMedia: mediaSummarySchema.nullable(),
});
export type PublicPostSummary = z.infer<typeof publicPostSummarySchema>;
// -------------------------------------------------------------------------

// -------------------------------------------------------------------------
// PublicPostDetail
export const publicPostDetailSchema = publicPostSummarySchema.extend({
  contentMarkdown: z.string(),
  seoTitle: z.string().nullable(),
  seoDescription: z.string().nullable(),
  metadata: z.record(z.string(), z.unknown()).nullable(),
  inlineMedia: z.array(inlineMediaSummarySchema),
});
export type PublicPostDetail = z.infer<typeof publicPostDetailSchema>;
// -------------------------------------------------------------------------

// -------------------------------------------------------------------------
// CreatePostInput
export const createPostSchema = z.object({
  type: postTypeSchema,
  title: z.string().min(1).max(200),
  slug: z.string().min(1).max(240).optional(),

  excerpt: z.string().max(500).optional(),
  contentMarkdown: z.string(),
  coverMediaId: z.uuid().nullable().optional(),
  previewMediaId: z.uuid().nullable().optional(),

  inlineMedia: z.array(postInlineMediaInputSchema).optional(),

  tags: z.array(z.string().min(1).max(80)).optional(),
  seoTitle: z.string().max(200).optional(),
  seoDescription: z.string().max(500).optional(),

  metadata: z.record(z.string(), z.unknown()).optional(),
});
export type CreatePostInput = z.infer<typeof createPostSchema>;
// -------------------------------------------------------------------------

// -------------------------------------------------------------------------
// UpdatePostInput
export const updatePostSchema = z
  .object({
    type: postTypeSchema.optional(),

    title: z.string().min(1).max(200).optional(),
    slug: z.string().min(1).max(240).optional(),

    excerpt: z.string().max(500).nullable().optional(),
    contentMarkdown: z.string().min(1).optional(),

    coverMediaId: z.uuid().nullable().optional(),
    previewMediaId: z.uuid().nullable().optional(),

    inlineMedia: z.array(postInlineMediaInputSchema).optional(),

    tags: z.array(z.string().min(1).max(80)).optional(),

    seoTitle: z.string().max(200).nullable().optional(),
    seoDescription: z.string().max(300).nullable().optional(),

    metadata: z.record(z.string(), z.unknown()).optional(),
  })
  .refine((value) => Object.keys(value).length > 0, {
    message: "At least one field is required.",
  });
export type UpdatePostInput = z.infer<typeof updatePostSchema>;
// -------------------------------------------------------------------------
