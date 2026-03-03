import { relations } from "drizzle-orm"
import { integer, jsonb, pgTable, text, timestamp } from "drizzle-orm/pg-core"
import { orders } from "./orders"

export const fraudAlerts = pgTable("fraud_alerts", {
	id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
	orderId: text("order_id").notNull().references(() => orders.id, { onDelete: "cascade" }),
	riskScore: integer("risk_score").notNull(),
	riskLevel: text("risk_level").notNull(), // 'low', 'medium', 'high'
	reasons: jsonb("reasons").$type<string[]>(),
	createdAt: timestamp("created_at").defaultNow().notNull(),
})

export const fraudAlertsRelations = relations(fraudAlerts, ({ one }) => ({
	order: one(orders, {
		fields: [fraudAlerts.orderId],
		references: [orders.id],
	}),
}))
