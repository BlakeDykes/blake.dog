import { sign, verify } from "hono/jwt";
import {
  adminJwtSchema,
  type AdminJwtPayload,
} from "../contracts/auth.contracts";

export const AUTH_COOKIE_NAME = "bd_admin_token";
export const ACCESS_TOKEN_TTL_SECONDS = 60 * 30;

export const createAdminAccessToken = async ({
  secret,
  username,
}: {
  secret: string;
  username: string;
}) => {
  const now = Math.floor(Date.now() / 1000);

  const payload: AdminJwtPayload = {
    sub: "admin",
    username,
    role: "admin",
    type: "access",

    iss: "blake-dog-api",
    aud: "blake-dog-admin",

    iat: now,
    exp: now + ACCESS_TOKEN_TTL_SECONDS,
  };

  return sign(payload, secret, "HS256");
};

export const verifyAdminAccessToken = async ({
  token,
  secret,
}: {
  token: string;
  secret: string;
}): Promise<AdminJwtPayload> => {
  const payload = await verify(token, secret, "HS256");

  return adminJwtSchema.parse(payload);
};
