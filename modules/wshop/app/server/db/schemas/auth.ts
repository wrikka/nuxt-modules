// d:/wshop/server/db/schemas/auth.ts

import { relations } from "drizzle-orm"
import { pgTable, text, timestamp } from "drizzle-orm/pg-core"
import { staffAccounts } from "./staff"

// --- Lucia Auth Tables ---

export const sessions = pgTable("sessions", {
	id: text("id").primaryKey(),
	userId: text("user_id").notNull().references(() => staffAccounts.id, { onDelete: "cascade" }),
	expiresAt: timestamp("expires_at", { withTimezone: true, mode: "date" }).notNull(),
})

export const sessionsRelations = relations(sessions, ({ one }) => ({
	user: one(staffAccounts, {
		fields: [sessions.userId],
		references: [staffAccounts.id],
	}),
}))
