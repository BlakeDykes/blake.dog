import type { getDb } from "../db/client";

export type Bindings = {
  DATABASE_URL: string;
  ADMIN_SECRET: string;
  PUBLIC_APP_ORIGIN: string;
  MEDIA_BUCKET: R2Bucket;
};

export type Variables = {
  db: ReturnType<typeof getDb>;
};

export type AppEnv = {
  Bindings: Bindings;
  Variables: Variables;
};
