import { relations } from "drizzle-orm";
import { jsonb, pgTable, text, timestamp, uniqueIndex, varchar } from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { pageStatusEnum } from "../enums.js";
export const pages = pgTable("pages", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
  title: text("title").notNull(),
  slug: varchar("slug").notNull(),
  locale: varchar("locale", { length: 8 }).notNull().default("en"),
  content: jsonb("content").$type(),
  // JSON array of blocks
  status: pageStatusEnum("status").notNull().default("draft"),
  metaTitle: text("meta_title"),
  metaDescription: text("meta_description")
}, (table) => {
  return {
    slugLocaleIdx: uniqueIndex("slug_locale_idx").on(table.slug, table.locale)
  };
});
export const pagesRelations = relations(pages, (_) => ({}));
export const insertPageSchema = createInsertSchema(pages);
export const selectPageSchema = createSelectSchema(pages);
