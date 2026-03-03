// d:/wshop/server/api/staff/[id].delete.ts

import { eq } from "drizzle-orm"
import { db, staffAccounts } from "~~/server/db"

export default defineEventHandler(async (event) => {
	const staffId = event.context.params?.id as string

	if (!staffId) {
		throw createError({ statusCode: 400, statusMessage: "Staff ID is required" })
	}

	const deletedStaff = await db.delete(staffAccounts).where(eq(staffAccounts.id, staffId))
		.returning()

	if (deletedStaff.length === 0) {
		throw createError({ statusCode: 404, statusMessage: "Staff account not found" })
	}

	return { success: true, message: `Staff account ${staffId} deleted` }
})
