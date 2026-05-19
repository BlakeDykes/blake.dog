import { Hono } from "hono";
import { AppEnv } from "./types/app";
import { getDb } from "./middleware/db";
import { cors } from "hono/cors";
import { contactRoutes } from "./routes/public/contact.routes";
import { mediaRoutes } from "./routes/public/media.routes";
import { postsRoutes } from "./routes/public/posts.routes";
import { adminPostsRoutes } from "./routes/admin/posts.admin.routes";
import { authRoutes } from "./routes/public/auth.routes";

const app = new Hono<AppEnv>().basePath("/api");

app.get("/", (c) => {
  return c.json({
    ok: true,
    service: "blake-dog-backend",
  });
});

app.use("*", async (c, next) => {
  const dbUrl = c.env.DATABASE_URL;
  if (!dbUrl) {
    return c.json(
      {
        error: "DATABASE_URL is not configured",
      },
      500
    );
  }

  c.set("db", getDb(c.env.DATABASE_URL));
  await next();
});

app.use(
  "*",
  cors({
    origin: (origin, c) => {
      const allowedOrigin = c.env.PUBLIC_APP_ORIGIN;

      if (!origin || origin === allowedOrigin) {
        return origin;
      }

      return allowedOrigin;
    },
    allowMethods: ["GET", "POST", "PATCH", "DELETE", "OPTIONS"],
    allowHeaders: ["Content-Type", "Authorization"],
  })
);

app.get("/health", (c) => {
  return c.json({
    ok: true,
    service: "blake-dog-backend",
  });
});

app.route("/auth", authRoutes);
app.route("/posts", postsRoutes);
app.route("/contact", contactRoutes);
app.route("/media", mediaRoutes);

app.route("/admin/posts", adminPostsRoutes);

app.notFound((c) => {
  return c.json({ error: "Not found" }, 404);
});

app.onError((err, c) => {
  console.error(err);
  return c.json({ error: "Internal server error" }, 500);
});

export default app;
