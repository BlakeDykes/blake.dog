import type { getDb } from "../middleware/db";

export type AdminPrincipal = {
  id: "admin";
  username: string;
  role: "admin";
};

export type Bindings = {
  DATABASE_URL: string;

  ADMIN_USERNAME: string;
  ADMIN_PASSWORD_HASH: string;
  AUTH_JWT_SECRET: string;

  PUBLIC_APP_ORIGIN: string;

  MEDIA_BUCKET: R2Bucket;
};

export type Variables = {
  db: ReturnType<typeof getDb>;
  admin: AdminPrincipal;
};

export type AppEnv = {
  Bindings: Bindings;
  Variables: Variables;
};
