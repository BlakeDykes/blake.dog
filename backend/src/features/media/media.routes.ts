import { Hono } from "hono";
import { AppEnv } from "@/lib/app.types";

export const mediaRoutes = new Hono<AppEnv>();
