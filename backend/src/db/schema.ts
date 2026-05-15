import {
  index,
  integer,
  jsonb,
  pgEnum,
  pgTable,
  primaryKey,
  text,
  timestamp,
  uniqueIndex,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";

export const postType = pgEnum("post_type", ["blog", "project_overview"]);

export const postStatus = pgEnum("post_status", [
  "draft",
  "published",
  "archived",
]);

export const contactStatus = pgEnum("contact_status", [
  "new",
  "read",
  "replied",
  "spam",
]);

export const mediaAssets = pgTable("media_assets", {
  id: uuid("id").defaultRandom().primaryKey(),

  originalFileName: text("original_filename").notNull(),
  r2Key: text("r2_key").notNull().unique(),
  publicUrl: text("public_url"),

  mimeType: varchar("mime_type", { length: 100 }).notNull(),
  fileSizeBytes: integer("file_size_bytes").notNull(),

  width: integer("width"),
  height: integer("height"),

  altText: text("alt_text"),
  caption: text("caption"),

  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
});

export const posts = pgTable(
  "posts",
  {
    id: uuid("id").defaultRandom().primaryKey(),

    type: postType("type").notNull(),

    title: text("title").notNull(),
    slug: text("slug").notNull(),
    excerpt: text("excerpt"),

    contentMarkdown: text("content_markdown").notNull(),
    status: postStatus("status").default("draft").notNull(),

    coverMediaId: uuid("cover_media_id").references(() => mediaAssets.id, {
      onDelete: "set null",
    }),
    previewMediaId: uuid("preview_media_id").references(() => mediaAssets.id, {
      onDelete: "set null",
    }),

    publishedAt: timestamp("published_at", { withTimezone: true }),
    createdAt: timestamp("created_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .defaultNow()
      .notNull(),

    seoTitle: text("seo_title"),
    seoDescription: text("seo_description"),

    metadata: jsonb("metadata").$type<Record<string, unknown>>().default({}),
  },
  (table) => [
    uniqueIndex("posts_slug_idx").on(table.slug),
    index("posts_status_idx").on(table.status),
    index("posts_type_idx").on(table.type),
    index("posts_published_at_idx").on(table.publishedAt),
  ]
);

export const postRevisions = pgTable("post_revisions", {
  id: uuid("id").defaultRandom().primaryKey(),

  postId: uuid("post_id")
    .notNull()
    .references(() => posts.id, { onDelete: "cascade" }),

  title: text("title").notNull(),
  contentMarkdown: text("content_markdown").notNull(),

  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
});

export const tags = pgTable(
  "tags",
  {
    id: uuid("id").defaultRandom().primaryKey(),

    name: text("name").notNull(),
    slug: text("slug").notNull(),
  },
  (table) => [
    uniqueIndex("tags_name_idx").on(table.name),
    uniqueIndex("tags_slug_idx").on(table.slug),
  ]
);

export const postTags = pgTable(
  "post_tags",
  {
    postId: uuid("post_id")
      .notNull()
      .references(() => posts.id, { onDelete: "cascade" }),

    tagId: uuid("tag_id")
      .notNull()
      .references(() => tags.id, { onDelete: "cascade" }),
  },
  (table) => [primaryKey({ columns: [table.postId, table.tagId] })]
);

export const postMedia = pgTable(
  "post_media",
  {
    postId: uuid("post_id")
      .notNull()
      .references(() => posts.id, { onDelete: "cascade" }),

    mediaId: uuid("media_id")
      .notNull()
      .references(() => mediaAssets.id, { onDelete: "cascade" }),

    usageType: varchar("usage_type", { length: 32 }).notNull(),
  },
  (table) => [primaryKey({ columns: [table.postId, table.mediaId] })]
);

export const contactRequests = pgTable(
  "contact_requests",
  {
    id: uuid("id").defaultRandom().primaryKey(),

    name: text("name").notNull(),
    email: text("email").notNull(),
    subject: text("subject"),
    message: text("message").notNull(),

    sourcePage: text("source_page"),
    ipHash: text("ip_hash"),
    userAgent: text("user_agent"),

    status: contactStatus("status").default("new").notNull(),

    createdAt: timestamp("created_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
  },
  (table) => [
    index("contact_requests_status_idx").on(table.status),
    index("contact_requests_created_at_idx").on(table.createdAt),
  ]
);
