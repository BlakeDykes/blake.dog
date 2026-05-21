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
