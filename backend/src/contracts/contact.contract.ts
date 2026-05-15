import { z } from "zod";
import { contactStatusSchema } from "../@types/enum";

// -------------------------------------------------------------------------
// ContactRequest
// ---
// use for validating internal DB-shaped data
// ---- i.e. const dbRow = contactRequestSchema.parse(row);
export const contactRequestSchema = z.object({
  id: z.uuid(),
  name: z.string().min(1).max(120),
  email: z.string().min(1).max(200),
  subject: z.string().max(200).nullable(),
  message: z.string(),
  sourcePage: z.string().nullable(),
  ipHash: z.string().nullable(),
  userAgent: z.string().nullable(),
  status: contactStatusSchema,
  createdAt: z.date(),
});
export type ContactRequest = z.infer<typeof contactRequestSchema>;

// -------------------------------------------------------------------------
// ContactRequestResponse
// ---
// use for validating serialized API output
// ---- i.e. const response = contactRequestResponseSchema.parse({ ...row, createdAt: row.createdAt.toISOString() })
export const contactRequestResponseSchema = z.object({
  id: z.uuid(),
  name: z.string(),
  email: z.email(),
  subject: z.string().nullable(),
  message: z.string(),
  sourcePage: z.string().nullable(),
  ipHash: z.string().nullable(),
  userAgent: z.string().nullable(),
  status: contactStatusSchema,
  createdAt: z.iso.datetime(),
});
export type ContactRequestResponse = z.infer<
  typeof contactRequestResponseSchema
>;

// -------------------------------------------------------------------------
// CreateContactRequest
// ---
// use for validating input
// ---- i.e. const input = createContactRequestSchema.parse(req.body);
export const createContactRequestSchema = z.object({
  name: z.string().trim().min(1, "Name is required").max(120),
  email: z.string().trim().max(320),
  subject: z.string().trim().max(200).optional().nullable(),
  message: z.string().trim().min(1, "Message is required").max(5000),
  sourcePage: z.string().trim().max(500).optional().nullable(),
});
export type CreateContactRequest = z.infer<typeof createContactRequestSchema>;
// -------------------------------------------------------------------------

// -------------------------------------------------------------------------
// ListContactRequestQuery
export const listContactRequestsQuerySchema = z.object({
  status: contactStatusSchema.optional(),

  limit: z.coerce.number().int().min(1).max(100).default(25),

  offset: z.coerce.number().int().min(0).default(0),
});
export type ListContactRequestsQuery = z.infer<
  typeof listContactRequestsQuerySchema
>;
// -------------------------------------------------------------------------

// -------------------------------------------------------------------------
// ContactRequestParams
export const contactRequestParamsSchema = z.object({
  id: z.uuid(),
});
export type ContactRequestParams = z.infer<typeof contactRequestParamsSchema>;
// -------------------------------------------------------------------------
