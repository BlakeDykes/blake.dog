import { Hono } from "hono";
import { AppEnv } from "./@types/app";
import { getDb } from "./db/client";
import { cors } from "hono/cors";
import { contactRoutes } from "./routes/contact.routes";
import { mediaRoutes } from "./routes/media.routes";
import { postsRoutes } from "./routes/posts.routes";

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

app.route("/posts", postsRoutes);
app.route("/contact", contactRoutes);
app.route("/media", mediaRoutes);

app.notFound((c) => {
  return c.json({ error: "Not found" }, 404);
});

app.onError((err, c) => {
  console.error(err);
  return c.json({ error: "Internal server error" }, 500);
});

export default app;
