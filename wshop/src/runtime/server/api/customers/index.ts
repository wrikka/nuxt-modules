// d:/wshop/app/server/api/customers/index.ts

import { z } from "zod"
import { db } from "~~/server/db"
import * as schema from "~~/server/db/schemas"

const { customers } = schema

const createCustomerSchema = z.object({
	email: z.string().email(),
	name: z.string().optional(),
	phone: z.string().optional(),
})

export default defineEventHandler(async (event) => {
	const method = getMethod(event)

	// GET: Fetch all customers
	if (method === "GET") {
		try {
			const allCustomers = await db.query.customers.findMany({
				orderBy: (customers, { desc }) => [desc(customers.createdAt)],
			})
			return allCustomers
		} catch (error: unknown) {
			const errorMessage = error instanceof Error ? error.message : "An unknown error occurred"
			console.error("Error fetching customers:", error)
			throw createError({
				statusCode: 500,
				statusMessage: `Failed to fetch customers: ${errorMessage}`,
			})
		}
	}

	// POST: Create a new customer
	if (method === "POST") {
		const body = await readBody(event)
		const validation = createCustomerSchema.safeParse(body)

		if (!validation.success) {
			throw createError({
				statusCode: 400,
				statusMessage: "Invalid customer data",
				data: validation.error.flatten(),
			})
		}

		try {
			const newCustomer = await db.insert(customers).values(validation.data).returning()
			return newCustomer[0]
		} catch (error: unknown) {
			const errorMessage = error instanceof Error ? error.message : "An unknown error occurred"
			console.error("Error creating customer:", error)
			if (errorMessage.includes("duplicate key value violates unique constraint")) {
				throw createError({
					statusCode: 409,
					statusMessage: "A customer with this email already exists.",
				})
			}
			throw createError({
				statusCode: 500,
				statusMessage: `Failed to create customer: ${errorMessage}`,
			})
		}
	}

	throw createError({ statusCode: 405, statusMessage: "Method Not Allowed" })
})
