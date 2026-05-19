import { z } from "zod";

export const loginSchema = z.object({
  username: z.string().min(1).max(120),
  password: z.string().min(1).max(120),
});
export type LoginInput = z.infer<typeof loginSchema>;

export const adminJwtSchema = z.object({
  sub: z.literal("admin"),
  username: z.string(),
  role: z.literal("admin"),
  type: z.literal("access"),

  iss: z.literal("blake-dog-api"),
  aud: z.literal("blake-dog-admin"),

  iat: z.number(),
  exp: z.number(),
});
export type AdminJwtPayload = z.infer<typeof adminJwtSchema>;

export type AuthRespone = {
  data: {
    id: "admin";
    username: string;
    role: "admin";
  };
};
