import { relations } from "drizzle-orm"
import {
	boolean as PgBoolean,
	decimal,
	integer,
	jsonb,
	pgTable,
	text,
	timestamp,
	varchar,
} from "drizzle-orm/pg-core"
import { pluginStatusEnum } from "../enums"
import { customers } from "./customers"

// --- Tables ---

// Main table for storing plugin information
export const plugins = pgTable("plugins", {
	id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
	name: varchar("name").notNull().unique(),
	description: text("description"),
	author: varchar("author").notNull(),
	version: varchar("version").notNull(),
	status: pluginStatusEnum("status").notNull().default("pending_approval"),
	tags: jsonb("tags").$type<string[]>(), // e.g., ['marketing', 'seo', 'shipping']
	iconUrl: text("icon_url"),
	repositoryUrl: text("repository_url"),
	averageRating: decimal("average_rating", { precision: 2, scale: 1 }).default("0.0"),
	reviewCount: integer("review_count").default(0),
	createdAt: timestamp("created_at").defaultNow().notNull(),
	updatedAt: timestamp("updated_at").defaultNow().notNull(),
})

// Tracks which plugins are installed in the store
export const pluginInstallations = pgTable("plugin_installations", {
	id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
	pluginId: text("plugin_id").notNull().references(() => plugins.id, { onDelete: "cascade" }),
	isInstalled: PgBoolean("is_installed").notNull().default(true),
	settings: jsonb("settings").$type<Record<string, unknown>>(),
	installedAt: timestamp("installed_at").defaultNow().notNull(),
	updatedAt: timestamp("updated_at").defaultNow().notNull(),
})

// Stores user reviews and ratings for plugins
export const pluginReviews = pgTable("plugin_reviews", {
	id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
	pluginId: text("plugin_id").notNull().references(() => plugins.id, { onDelete: "cascade" }),
	customerId: text("customer_id").notNull().references(() => customers.id, { onDelete: "cascade" }),
	rating: integer("rating").notNull(), // e.g., 1 to 5
	title: varchar("title"),
	comment: text("comment"),
	createdAt: timestamp("created_at").defaultNow().notNull(),
})

// --- Relations ---

export const pluginsRelations = relations(plugins, ({ many }) => ({
	installations: many(pluginInstallations),
	reviews: many(pluginReviews),
}))

export const pluginInstallationsRelations = relations(pluginInstallations, ({ one }) => ({
	plugin: one(plugins, {
		fields: [pluginInstallations.pluginId],
		references: [plugins.id],
	}),
}))

export const pluginReviewsRelations = relations(pluginReviews, ({ one }) => ({
	plugin: one(plugins, {
		fields: [pluginReviews.pluginId],
		references: [plugins.id],
	}),
	customer: one(customers, {
		fields: [pluginReviews.customerId],
		references: [customers.id],
	}),
}))
