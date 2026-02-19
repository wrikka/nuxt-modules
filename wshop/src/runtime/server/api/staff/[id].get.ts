// d:/wshop/server/api/staff/[id].get.ts

import { eq } from "drizzle-orm"
import { db, staffAccounts } from "~~/server/db"

export default defineEventHandler(async (event) => {
	const staffId = event.context.params?.id as string

	if (!staffId) {
		throw createError({ statusCode: 400, statusMessage: "Staff ID is required" })
	}

	const staff = await db.query.staffAccounts.findFirst({
		where: eq(staffAccounts.id, staffId),
		columns: { passwordHash: false },
		with: { role: true },
	})

	if (!staff) {
		throw createError({ statusCode: 404, statusMessage: "Staff account not found" })
	}

	return staff
})
