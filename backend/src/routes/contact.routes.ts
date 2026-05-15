import { Hono } from "hono";
import { AppEnv } from "../@types/app";

export const contactRoutes = new Hono<AppEnv>();
