import { Hono } from "hono";
import { cors } from "hono/cors";

import { AppEnv } from "./lib/app.types";

import { contactRoutes } from "./features/contact/contact.routes";
import { mediaRoutes } from "./features/media/media.routes";
import { postsRoutes } from "./features/posts/posts.routes";
import { adminPostsRoutes } from "./features/posts/posts.admin.routes";
import { authRoutes } from "./features/auth/auth.routes";
import { withDb } from "./db/db.middleware";
import { applyMiddleware } from "./lib/helpers";

const app = new Hono<AppEnv>();

app.use(
  "*",
  cors({
    origin: (origin, c) => {
      const allowedOrigin = c.env.PUBLIC_APP_ORIGIN;

      if (!origin || origin === allowedOrigin) {
        return origin;
      }

      return null;
    },
    credentials: true,
    allowMethods: ["GET", "POST", "PATCH", "DELETE", "OPTIONS"],
    allowHeaders: ["Content-Type"],
  })
);

app.get("/", (c) => {
  return c.json({
    ok: true,
    service: "blake-dog-backend",
  });
});

app.get("/health", (c) => {
  return c.json({
    ok: true,
    service: "blake-dog-backend",
  });
});

app.route("/auth", authRoutes);

applyMiddleware(app, withDb, "/posts/*", "/contact/*", "/media/*", "/admin/*");

// public routes
app.route("/posts", postsRoutes);
app.route("/contact", contactRoutes);
app.route("/media", mediaRoutes);

// adminRoutes
app.route("/admin/posts", adminPostsRoutes);

app.notFound((c) => {
  return c.json({ error: "Not found" }, 404);
});

app.onError((err, c) => {
  console.error(err);
  return c.json({ error: "Internal server error" }, 500);
});

export default app;
