import { relations } from "drizzle-orm"
import {
	boolean,
	decimal,
	integer,
	jsonb,
	pgTable,
	primaryKey,
	text,
	timestamp,
} from "drizzle-orm/pg-core"
import { customers } from "./customers"
import { orders } from "./orders"

// Loyalty Programs Table
export const loyaltyPrograms = pgTable("loyalty_programs", {
	id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
	name: text("name").notNull(),
	pointsPerCurrency: decimal("points_per_currency", { precision: 10, scale: 2 }).notNull(),
	currencyPerPoint: decimal("currency_per_point", { precision: 10, scale: 2 }).notNull(),
	minimumPoints: integer("minimum_points").notNull().default(0),
	isActive: boolean("is_active").notNull().default(true),
})

// Loyalty Program Tiers Table
export const loyaltyTiers = pgTable("loyalty_tiers", {
	id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
	programId: text("program_id").notNull().references(() => loyaltyPrograms.id, {
		onDelete: "cascade",
	}),
	name: text("name").notNull(),
	minPoints: integer("min_points").notNull(),
	benefits: jsonb("benefits").$type<string[]>(),
	color: text("color"),
})

// Customer Loyalty Table (tracks customer's status in a program)
export const customerLoyalty = pgTable("customer_loyalty", {
	customerId: text("customer_id").notNull().references(() => customers.id, { onDelete: "cascade" }),
	programId: text("program_id").notNull().references(() => loyaltyPrograms.id, {
		onDelete: "cascade",
	}),
	currentPoints: integer("current_points").notNull().default(0),
	tierId: text("tier_id").references(() => loyaltyTiers.id, { onDelete: "set null" }),
	totalEarned: integer("total_earned").notNull().default(0),
	totalRedeemed: integer("total_redeemed").notNull().default(0),
	joinDate: timestamp("join_date").defaultNow().notNull(),
	lastActivity: timestamp("last_activity").defaultNow().notNull(),
}, (t) => ({
	pk: primaryKey({ columns: [t.customerId, t.programId] }),
}))

// Loyalty Transactions Table
export const loyaltyTransactions = pgTable("loyalty_transactions", {
	id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
	customerId: text("customer_id").notNull().references(() => customers.id, { onDelete: "cascade" }),
	orderId: text("order_id").references(() => orders.id, { onDelete: "set null" }),
	type: text("type").notNull(), // 'earned', 'redeemed', 'expired', 'adjusted'
	points: integer("points").notNull(),
	description: text("description"),
	balance: integer("balance").notNull(), // The balance after this transaction
	createdAt: timestamp("created_at").defaultNow().notNull(),
	expiresAt: timestamp("expires_at"),
})

// --- RELATIONS ---

export const loyaltyProgramsRelations = relations(loyaltyPrograms, ({ many }) => ({
	tiers: many(loyaltyTiers),
	customerLoyalty: many(customerLoyalty),
}))

export const loyaltyTiersRelations = relations(loyaltyTiers, ({ one, many }) => ({
	program: one(loyaltyPrograms, {
		fields: [loyaltyTiers.programId],
		references: [loyaltyPrograms.id],
	}),
	customerLoyalty: many(customerLoyalty),
}))

export const customerLoyaltyRelations = relations(customerLoyalty, ({ one }) => ({
	customer: one(customers, {
		fields: [customerLoyalty.customerId],
		references: [customers.id],
	}),
	program: one(loyaltyPrograms, {
		fields: [customerLoyalty.programId],
		references: [loyaltyPrograms.id],
	}),
	tier: one(loyaltyTiers, {
		fields: [customerLoyalty.tierId],
		references: [loyaltyTiers.id],
	}),
}))

export const loyaltyTransactionsRelations = relations(loyaltyTransactions, ({ one }) => ({
	customer: one(customers, {
		fields: [loyaltyTransactions.customerId],
		references: [customers.id],
	}),
	order: one(orders, {
		fields: [loyaltyTransactions.orderId],
		references: [orders.id],
	}),
}))
