import { DbType } from "@/db/db.types";
import { AdminJwtPayload, AuthPrincipal } from "@/features/auth/auth.contracts";

export type AdminPrincipal = {
  id: "admin";
  username: string;
  role: "admin";
};

export type Bindings = {
  DATABASE_URL: string;

  ADMIN_USERNAME: string;
  ADMIN_PASSWORD_HASH: string;
  JWT_SECRET: string;

  PUBLIC_APP_ORIGIN: string;
  PUBLIC_MEDIA_URL?: string;

  MEDIA_BUCKET: R2Bucket;
};

export type Variables = {
  db: DbType;
  admin: AuthPrincipal;
  adminJWT: AdminJwtPayload;
};

export type AppEnv = {
  Bindings: Bindings;
  Variables: Variables;
};
