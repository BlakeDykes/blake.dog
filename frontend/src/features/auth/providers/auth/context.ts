import { createStrictContext } from "@/utils/provider";
import { type AuthContext } from "../../auth.types";

export const [AuthCtx, useAuth] =
  createStrictContext<AuthContext>("AuthContext");
