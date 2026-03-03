import { relations } from "drizzle-orm"
import { boolean as PgBoolean, decimal, pgTable, text, varchar } from "drizzle-orm/pg-core"
import { orderItems, orders } from "./orders"

// --- Tables ---
export const taxRates = pgTable("tax_rates", {
	id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
	rate: decimal("rate", { precision: 5, scale: 4 }).notNull(), // e.g., 0.0700 for 7%
	name: varchar("name").notNull(), // e.g., 'VAT'
	country: varchar("country", { length: 2 }), // ISO 3166-1 alpha-2
	state: varchar("state"),
	zip: varchar("zip"),
	city: varchar("city"),
	isCompound: PgBoolean("is_compound").notNull().default(false),
})

export const orderTaxes = pgTable("order_taxes", {
	id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
	orderId: text("order_id").notNull().references(() => orders.id, { onDelete: "cascade" }),
	taxRateId: text("tax_rate_id").references(() => taxRates.id, { onDelete: "set null" }),
	amount: decimal("amount", { precision: 10, scale: 2 }).notNull(),
	name: varchar("name").notNull(),
})

export const orderItemTaxes = pgTable("order_item_taxes", {
	id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
	orderItemId: text("order_item_id").notNull().references(() => orderItems.id, {
		onDelete: "cascade",
	}),
	taxRateId: text("tax_rate_id").references(() => taxRates.id, { onDelete: "set null" }),
	amount: decimal("amount", { precision: 10, scale: 2 }).notNull(),
	name: varchar("name").notNull(),
})

// --- Relations ---
export const taxRatesRelations = relations(taxRates, ({ many }) => ({
	orderTaxes: many(orderTaxes),
	orderItemTaxes: many(orderItemTaxes),
}))

export const orderTaxesRelations = relations(orderTaxes, ({ one }) => ({
	order: one(orders, { fields: [orderTaxes.orderId], references: [orders.id] }),
	taxRate: one(taxRates, { fields: [orderTaxes.taxRateId], references: [taxRates.id] }),
}))

export const orderItemTaxesRelations = relations(orderItemTaxes, ({ one }) => ({
	orderItem: one(orderItems, { fields: [orderItemTaxes.orderItemId], references: [orderItems.id] }),
	taxRate: one(taxRates, { fields: [orderItemTaxes.taxRateId], references: [taxRates.id] }),
}))
