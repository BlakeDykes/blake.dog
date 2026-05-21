import { zValidator } from "@hono/zod-validator";
import type { ValidationTargets } from "hono";
import type { z } from "zod";

import type { AppEnv } from "./app.types";

export const appZValidator = <
  TTarget extends keyof ValidationTargets,
  TSchema extends z.ZodSchema,
  TPath extends string = string,
>(
  target: TTarget,
  schema: TSchema
) => {
  return zValidator<TSchema, TTarget, AppEnv, TPath>(target, schema);
};
