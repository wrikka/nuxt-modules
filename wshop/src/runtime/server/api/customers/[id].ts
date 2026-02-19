// d:/wshop/app/server/api/customers/[id].ts

import { eq } from "drizzle-orm"
import { z } from "zod"
import { db } from "~~/server/db"
import * as schema from "~~/server/db/schemas"

const { customers } = schema

const updateCustomerSchema = z.object({
	email: z.string().email().optional(),
	name: z.string().optional(),
	phone: z.string().optional(),
})

export default defineEventHandler(async (event) => {
	const method = getMethod(event)
	const customerId = event.context.params?.id as string

	if (!customerId) {
		throw createError({ statusCode: 400, statusMessage: "Customer ID is required" })
	}

	// GET: Fetch a single customer by ID
	if (method === "GET") {
		try {
			const customer = await db.query.customers.findFirst({
				where: eq(customers.id, customerId),
				with: {
					orders: {
						orderBy: (orders, { desc }) => [desc(orders.createdAt)],
					},
				},
			})

			if (!customer) {
				throw createError({ statusCode: 404, statusMessage: "Customer not found" })
			}
			return customer
		} catch (error: unknown) {
			const errorMessage = error instanceof Error ? error.message : "An unknown error occurred"
			console.error(`Error fetching customer ${customerId}:`, error)
			throw createError({
				statusCode: 500,
				statusMessage: `Failed to fetch customer: ${errorMessage}`,
			})
		}
	}

	// PUT: Update a customer
	if (method === "PUT") {
		const body = await readBody(event)
		const validation = updateCustomerSchema.safeParse(body)

		if (!validation.success) {
			throw createError({
				statusCode: 400,
				statusMessage: "Invalid customer data",
				data: validation.error.flatten(),
			})
		}

		try {
			const updatedCustomer = await db
				.update(customers)
				.set({ ...validation.data, updatedAt: new Date() })
				.where(eq(customers.id, customerId))
				.returning()

			if (updatedCustomer.length === 0) {
				throw createError({ statusCode: 404, statusMessage: "Customer not found" })
			}
			return updatedCustomer[0]
		} catch (error: unknown) {
			const errorMessage = error instanceof Error ? error.message : "An unknown error occurred"
			console.error(`Error updating customer ${customerId}:`, error)
			if (errorMessage.includes("duplicate key value violates unique constraint")) {
				throw createError({
					statusCode: 409,
					statusMessage: "A customer with this email already exists.",
				})
			}
			throw createError({
				statusCode: 500,
				statusMessage: `Failed to update customer: ${errorMessage}`,
			})
		}
	}

	// DELETE: Delete a customer
	if (method === "DELETE") {
		try {
			const deletedCustomer = await db.delete(customers).where(eq(customers.id, customerId))
				.returning()

			if (deletedCustomer.length === 0) {
				throw createError({ statusCode: 404, statusMessage: "Customer not found" })
			}

			return { success: true, message: `Customer ${customerId} deleted` }
		} catch (error: unknown) {
			const errorMessage = error instanceof Error ? error.message : "An unknown error occurred"
			console.error(`Error deleting customer ${customerId}:`, error)
			throw createError({
				statusCode: 500,
				statusMessage: `Failed to delete customer: ${errorMessage}`,
			})
		}
	}

	throw createError({ statusCode: 405, statusMessage: "Method Not Allowed" })
})
