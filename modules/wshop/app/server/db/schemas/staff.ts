import { relations } from "drizzle-orm"
import { pgTable, primaryKey, text, timestamp, varchar } from "drizzle-orm/pg-core"
import { sessions } from "./auth"

export const staffRoles = pgTable("staff_roles", {
	id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
	name: text("name").notNull().unique(),
})

export const staffPermissions = pgTable("staff_permissions", {
	id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
	action: varchar("action").notNull().unique(),
	description: text("description"),
})

export const staffRolesToPermissions = pgTable("staff_roles_to_permissions", {
	roleId: text("role_id").notNull().references(() => staffRoles.id, { onDelete: "cascade" }),
	permissionId: text("permission_id").notNull().references(() => staffPermissions.id, {
		onDelete: "cascade",
	}),
}, t => ({
	pk: primaryKey({ columns: [t.roleId, t.permissionId] }),
}))

export const staffAccounts = pgTable("staff_accounts", {
	id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
	name: text("name").notNull(),
	email: varchar("email").notNull().unique(),
	passwordHash: text("password_hash").notNull(),
	roleId: text("role_id").references(() => staffRoles.id, { onDelete: "set null" }),
	createdAt: timestamp("created_at").defaultNow().notNull(),
	updatedAt: timestamp("updated_at").defaultNow().notNull(),
})

export const staffRolesRelations = relations(staffRoles, ({ many }) => ({
	staffAccounts: many(staffAccounts),
	staffRolesToPermissions: many(staffRolesToPermissions),
}))

export const staffPermissionsRelations = relations(staffPermissions, ({ many }) => ({
	staffRolesToPermissions: many(staffRolesToPermissions),
}))

export const staffRolesToPermissionsRelations = relations(
	staffRolesToPermissions,
	({ one }) => ({
		role: one(staffRoles, {
			fields: [staffRolesToPermissions.roleId],
			references: [staffRoles.id],
		}),
		permission: one(staffPermissions, {
			fields: [staffRolesToPermissions.permissionId],
			references: [staffPermissions.id],
		}),
	}),
)

export const staffAccountsRelations = relations(staffAccounts, ({ one, many }) => ({
	role: one(staffRoles, {
		fields: [staffAccounts.roleId],
		references: [staffRoles.id],
	}),
	sessions: many(sessions),
}))
