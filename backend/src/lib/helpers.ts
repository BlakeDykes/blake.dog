import { Hono, MiddlewareHandler } from "hono";
import { AppEnv } from "./app.types";

export const applyMiddleware = (
  app: Hono<AppEnv>,
  middleware: MiddlewareHandler,
  ...paths: readonly string[]
) => {
  for (const path of paths) {
    app.use(path, middleware);
  }
};
