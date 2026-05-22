import { createStrictContext } from "../utils";
import { type AuthContext } from "../../features/auth/auth.types";

export const [AuthCtx, useAuth] =
  createStrictContext<AuthContext>("AuthContext");
