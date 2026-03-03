import { relations } from "drizzle-orm"
import { jsonb, pgTable, primaryKey, text, timestamp, varchar } from "drizzle-orm/pg-core"
import { createInsertSchema, createSelectSchema } from "drizzle-zod"
import type { PageBlock } from "../../../../shared/types/page"
import { pageStatusEnum } from "../enums" // Re-using this enum for draft/published status
import { staffAccounts } from "./staff"

// Blog Posts Table
export const posts = pgTable("posts", {
	id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
	title: text("title").notNull(),
	slug: varchar("slug").notNull().unique(),
	content: jsonb("content").$type<PageBlock[]>(),
	excerpt: text("excerpt"),
	featuredImage: text("featured_image"),
	status: pageStatusEnum("status").notNull().default("draft"),
	authorId: text("author_id").references(() => staffAccounts.id, { onDelete: "set null" }),
	publishedAt: timestamp("published_at"),
	createdAt: timestamp("created_at").defaultNow().notNull(),
	updatedAt: timestamp("updated_at").defaultNow().notNull(),
})

// Blog Post Tags Table
export const postTags = pgTable("post_tags", {
	id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
	name: varchar("name").notNull().unique(),
	slug: varchar("slug").notNull().unique(),
})

// Posts to Tags (Many-to-Many Join Table)
export const postsToPostTags = pgTable("posts_to_post_tags", {
	postId: text("post_id").notNull().references(() => posts.id, { onDelete: "cascade" }),
	tagId: text("tag_id").notNull().references(() => postTags.id, { onDelete: "cascade" }),
}, (t) => ({
	pk: primaryKey({ columns: [t.postId, t.tagId] }),
}))

// --- RELATIONS ---

export const postsRelations = relations(posts, ({ one, many }) => ({
	author: one(staffAccounts, {
		fields: [posts.authorId],
		references: [staffAccounts.id],
	}),
	postsToPostTags: many(postsToPostTags),
}))

export const postTagsRelations = relations(postTags, ({ many }) => ({
	postsToPostTags: many(postsToPostTags),
}))

export const postsToPostTagsRelations = relations(postsToPostTags, ({ one }) => ({
	post: one(posts, {
		fields: [postsToPostTags.postId],
		references: [posts.id],
	}),
	tag: one(postTags, {
		fields: [postsToPostTags.tagId],
		references: [postTags.id],
	}),
}))

// --- ZOD SCHEMAS ---

export const insertPostSchema = createInsertSchema(posts)
export const selectPostSchema = createSelectSchema(posts)
