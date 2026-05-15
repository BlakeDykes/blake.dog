import z from "zod";

type EnumValues = readonly [string, ...string[]];

// ------------------------------------------------------------------------
// PostValues
export const POST_STATUS_VALUES = [
  "draft",
  "published",
  "archived",
] as const satisfies EnumValues;

export const postStatusSchema = z.enum(POST_STATUS_VALUES);
export type PostStatus = z.infer<typeof postStatusSchema>;
// ------------------------------------------------------------------------

// ------------------------------------------------------------------------
// PostType
export const POST_TYPE_VALUES = [
  "blog",
  "project_overview",
] as const satisfies EnumValues;

export const postTypeSchema = z.enum(POST_TYPE_VALUES);
export type PostType = z.infer<typeof postTypeSchema>;
// ------------------------------------------------------------------------

// ------------------------------------------------------------------------
// ContactStatus
export const CONTACT_STATUS_VALUES = [
  "new",
  "read",
  "replied",
  "spam",
] as const satisfies EnumValues;

export const contactStatusSchema = z.enum(CONTACT_STATUS_VALUES);
export type ContactStatus = z.infer<typeof contactStatusSchema>;
// ------------------------------------------------------------------------

// ------------------------------------------------------------------------
// PostMediaUsageType
export const POST_MEDIA_USAGE_TYPE_VALUES = [
  "inline",
  "gallery",
] as const satisfies EnumValues;

export const postMediaUsageTypeSchema = z.enum(POST_MEDIA_USAGE_TYPE_VALUES);
export type PostMediaUsageType = z.infer<typeof postMediaUsageTypeSchema>;
// ------------------------------------------------------------------------
