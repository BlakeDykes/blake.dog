import { Hono } from "hono";
import { AppEnv } from "../@types/app";

export const mediaRoutes = new Hono<AppEnv>();
