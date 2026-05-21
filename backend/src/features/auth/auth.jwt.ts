import { sign, verify } from "hono/jwt";

import {
  AdminJwtPayload,
  adminJwtSchema,
  AuthPrincipal,
} from "./auth.contracts";

import { AUTH_SESSION_TTL_SECONDS } from "./auth.cookies";
import { SignatureAlgorithm } from "hono/utils/jwt/jwa";

export const JWT_ISSUER = "blake-dog-api" as const;
export const JWT_AUDIENCE = "blake-dog-admin" as const;
export const JWT_ALGORITHM = "HS256" satisfies SignatureAlgorithm;

export const createAdminPrincipal = (username: string): AuthPrincipal => ({
  id: "admin",
  username,
  role: "admin",
});

export const createAdminJwtPayload = (username: string): AdminJwtPayload => {
  const now = Math.floor(Date.now() / 1000);

  return {
    sub: "admin",
    username,
    role: "admin",
    type: "access",
    iss: JWT_ISSUER,
    aud: JWT_AUDIENCE,

    iat: now,
    exp: now + AUTH_SESSION_TTL_SECONDS,
  };
};

export const createAdminJwt = async ({
  username,
  secret,
}: {
  username: string;
  secret: string;
}): Promise<string> => {
  const payload = createAdminJwtPayload(username);
  return sign(payload, secret, JWT_ALGORITHM);
};

export const verifyAdminJwt = async ({
  token,
  secret,
}: {
  token: string;
  secret: string;
}): Promise<AdminJwtPayload | null> => {
  try {
    const payload = await verify(token, secret, JWT_ALGORITHM);

    return adminJwtSchema.parse(payload);
  } catch {
    return null;
  }
};
