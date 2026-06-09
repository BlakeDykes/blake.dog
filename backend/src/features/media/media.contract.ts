import z from "zod";

// -------------------------------------------------------------------------
// MediaSummary
export const mediaSummarySchema = z.object({
  id: z.uuid(),
  url: z.string().nullable(),
  mimeType: z.string().nullable(),
  altText: z.string().nullable(),
  caption: z.string().nullable().optional(),
  width: z.number().nullable(),
  height: z.number().nullable(),
});
export type MediaSummary = z.infer<typeof mediaSummarySchema>;
// -------------------------------------------------------------------------

// -------------------------------------------------------------------------
// InlineMediaSummary
export const inlineMediaSummarySchema = mediaSummarySchema.extend({
  embedKey: z.string().min(1).max(100).optional().nullable(),
  sortOrder: z.number().int().min(0).optional(),
});
export type InlineMediaSummary = z.infer<typeof inlineMediaSummarySchema>;
// -------------------------------------------------------------------------

// -------------------------------------------------------------------------
// PostInlineMediaInput
export const postInlineMediaInputSchema = z.object({
  mediaId: z.uuid(),
  embedKey: z.string().min(1).max(100).optional(),
  sortOrder: z.number().int().min(0).optional(),
});
export type PostInlineMediaInput = z.infer<typeof postInlineMediaInputSchema>;
// -------------------------------------------------------------------------

export const uploadMediaInputSchema = z.object({
  altText: z.string().max(300).optional(),
  width: z.coerce.number().int().positive().optional(),
  height: z.coerce.number().int().positive().optional(),
});
export type UploadMediaInput = z.infer<typeof uploadMediaInputSchema>;

export const updateMediaSchema = z
  .object({
    altText: z.string().max(300).nullable().optional(),
    caption: z.string().max(500).nullable().optional(),
  })
  .refine((d) => Object.values(d).some((v) => v !== undefined), {
    message: "At least one value is required",
  });
export type UpdateMediaSchema = z.infer<typeof updateMediaSchema>;

export const listMediaQuerySchema = z.object({
  limit: z.coerce.number().int().min(1).max(100).default(50),
  offset: z.coerce.number().int().min(0).default(0),
});
export type ListMediaQuery = z.infer<typeof listMediaQuerySchema>;
