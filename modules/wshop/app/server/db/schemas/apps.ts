import { relations } from "drizzle-orm"
import { boolean, jsonb, pgTable, text, timestamp } from "drizzle-orm/pg-core"

export const apps = pgTable("apps", {
	id: text("id").primaryKey(),
	name: text("name").notNull(),
	description: text("description"),
	version: text("version").notNull(),
	author: text("author"),
	category: text("category"),
	icon: text("icon"),
	screenshots: jsonb("screenshots").$type<string[]>().default([]),
	features: jsonb("features").$type<string[]>().default([]),
	pricing: jsonb("pricing").$type<{ type: "free" | "paid" | "freemium"; price?: number }>(),
	rating: jsonb("rating").$type<{ average: number; count: number }>(),
	downloads: text("downloads").default("0"),
	updatedAt: timestamp("updated_at").defaultNow(),
})

export const installedApps = pgTable("installed_apps", {
	id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
	appId: text("app_id").notNull().references(() => apps.id, { onDelete: "cascade" }),
	installedAt: timestamp("installed_at").defaultNow(),
	enabled: boolean("enabled").default(true),
	config: jsonb("config").$type<Record<string, any>>(),
})

// --- RELATIONS ---

export const appsRelations = relations(apps, ({ many }) => ({
	installedApps: many(installedApps),
}))

export const installedAppsRelations = relations(installedApps, ({ one }) => ({
	app: one(apps, {
		fields: [installedApps.appId],
		references: [apps.id],
	}),
}))
