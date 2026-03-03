// d:/wshop/server/api/staff/[id].put.ts

import bcrypt from "bcrypt"
import { eq } from "drizzle-orm"
import { z } from "zod"
import { db, staffAccounts } from "~~/server/db"

const updateStaffSchema = z.object({
	name: z.string().min(1, "Name is required").optional(),
	email: z.string().email("Invalid email address").optional(),
	password: z.string().min(8, "Password must be at least 8 characters long").optional(),
	roleId: z.string().optional(),
})

export default defineEventHandler(async (event) => {
	const staffId = event.context.params?.id as string

	if (!staffId) {
		throw createError({ statusCode: 400, statusMessage: "Staff ID is required" })
	}

	const body = await readBody(event)
	const validation = updateStaffSchema.safeParse(body)

	if (!validation.success) {
		throw createError({
			statusCode: 400,
			statusMessage: "Invalid data",
			data: validation.error.flatten(),
		})
	}

	const { password, ...updateData } = validation.data
	let passwordHash: string | undefined

	if (password) {
		const saltRounds = 10
		passwordHash = await bcrypt.hash(password, saltRounds)
	}

	const finalUpdateData = { ...updateData, ...(passwordHash && { passwordHash }) }

	const updatedStaff = await db
		.update(staffAccounts)
		.set(finalUpdateData)
		.where(eq(staffAccounts.id, staffId))
		.returning({ id: staffAccounts.id, name: staffAccounts.name, email: staffAccounts.email })

	if (updatedStaff.length === 0) {
		throw createError({ statusCode: 404, statusMessage: "Staff account not found" })
	}
	return updatedStaff[0]
})
