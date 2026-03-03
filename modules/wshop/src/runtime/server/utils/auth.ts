// d:/wshop/server/utils/auth.ts

import { DrizzlePostgreSQLAdapter } from "@lucia-auth/adapter-drizzle"
import { Lucia } from "lucia"
import { db } from "~~/server/db"
import { sessions, staffAccounts } from "~~/server/db/schemas"

const adapter = new DrizzlePostgreSQLAdapter(db, sessions, staffAccounts)

export const lucia = new Lucia(adapter, {
	sessionCookie: {
		attributes: {
			// set to `true` when using HTTPS
			secure: !import.meta.dev,
		},
	},
	getUserAttributes: (attributes) => {
		return {
			name: attributes.name,
			email: attributes.email,
			roleId: attributes.roleId,
		}
	},
})

declare module "lucia" {
	interface Register {
		Lucia: typeof lucia
		DatabaseUserAttributes: {
			name: string
			email: string
			roleId: string | null
		}
	}
}
