import { relations } from "drizzle-orm"
import { integer, pgTable, text, timestamp } from "drizzle-orm/pg-core"
import { productVariants } from "./products"
import { staffAccounts } from "./staff"

export const inventory = pgTable("inventory", {
	id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
	productVariantId: text("product_variant_id").notNull().references(() => productVariants.id, {
		onDelete: "cascade",
	}),
	quantity: integer("quantity").notNull().default(0),
	reservedQuantity: integer("reserved_quantity").notNull().default(0),
	location: text("location"),
	reorderLevel: integer("reorder_level").notNull().default(10),
	maxLevel: integer("max_level").notNull().default(100),
	lastUpdated: timestamp("last_updated").defaultNow().notNull(),
})

export const inventoryLogs = pgTable("inventory_logs", {
	id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
	inventoryId: text("inventory_id").notNull().references(() => inventory.id, {
		onDelete: "cascade",
	}),
	change: integer("change").notNull(),
	newQuantity: integer("new_quantity").notNull(),
	reason: text("reason").notNull(), // 'sale', 'return', 'adjustment', 'transfer', 'initial'
	source: text("source"), // e.g., 'POS', 'WebApp', 'Manual Adjustment'
	userId: text("user_id").references(() => staffAccounts.id, { onDelete: "set null" }),
	timestamp: timestamp("timestamp").defaultNow().notNull(),
})

export const stockAlerts = pgTable("stock_alerts", {
	id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
	inventoryId: text("inventory_id").notNull().references(() => inventory.id, {
		onDelete: "cascade",
	}),
	type: text("type").notNull(), // 'low_stock', 'out_of_stock', 'overstock'
	severity: text("severity").notNull(), // 'low', 'medium', 'high', 'critical'
	message: text("message").notNull(),
	status: text("status").notNull().default("unread"), // 'unread', 'read', 'dismissed'
	createdAt: timestamp("created_at").defaultNow().notNull(),
})

export const inventoryRelations = relations(inventory, ({ one, many }) => ({
	productVariant: one(productVariants, {
		fields: [inventory.productVariantId],
		references: [productVariants.id],
	}),
	logs: many(inventoryLogs),
	alerts: many(stockAlerts),
}))

export const stockAlertsRelations = relations(stockAlerts, ({ one }) => ({
	inventoryItem: one(inventory, {
		fields: [stockAlerts.inventoryId],
		references: [inventory.id],
	}),
}))

export const inventoryLogsRelations = relations(inventoryLogs, ({ one }) => ({
	inventoryItem: one(inventory, {
		fields: [inventoryLogs.inventoryId],
		references: [inventory.id],
	}),
	user: one(staffAccounts, {
		fields: [inventoryLogs.userId],
		references: [staffAccounts.id],
	}),
}))
