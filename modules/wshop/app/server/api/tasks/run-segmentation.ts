import { and, eq } from "drizzle-orm"
import { customers, customersToCustomerSegments, db } from "~~/server/db"

interface Rule {
	field: keyof typeof customers.$inferSelect
	operator: "gte" | "lte" | "eq" | "neq"
	value: string | number
}

// A simple rule engine for demonstration purposes
const checkRule = (customer: typeof customers.$inferSelect, rule: Rule): boolean => {
	const { field, operator, value } = rule
	const customerValue = customer[field]

	if (customerValue === undefined || customerValue === null) return false

	const numCustomerValue = Number(customerValue)
	const numValue = Number(value)

	switch (operator) {
		case "gte":
			return numCustomerValue >= numValue
		case "lte":
			return numCustomerValue <= numValue
		case "eq":
			return numCustomerValue === numValue
		case "neq":
			return numCustomerValue !== numValue
		default:
			return false
	}
}

export default defineEventHandler(async (event) => {
	const secret = getHeader(event, "x-cron-secret")
	if (secret !== process.env.CRON_SECRET) {
		throw createError({ statusCode: 401, statusMessage: "Unauthorized" })
	}

	console.log("Starting customer segmentation task...")

	try {
		const allSegments = await db.query.customerSegments.findMany({ with: { rules: true } })
		const allCustomers = await db.query.customers.findMany()

		let assignments = 0
		let removals = 0

		for (const segment of allSegments) {
			if (!segment || !segment.rules || segment.rules.length === 0) continue

			const segmentRules = segment.rules as Rule[]

			for (const customer of allCustomers) {
				const matchesAllRules = segmentRules.every(rule => checkRule(customer, rule))

				const existingRelation = await db.query.customersToCustomerSegments.findFirst({
					where: and(
						eq(customersToCustomerSegments.customerId, customer.id),
						eq(customersToCustomerSegments.segmentId, segment.id),
					),
				})

				if (matchesAllRules && !existingRelation) {
					// Add customer to segment
					await db.insert(customersToCustomerSegments).values({
						customerId: customer.id,
						segmentId: segment.id,
					})
					assignments++
				} else if (!matchesAllRules && existingRelation) {
					// Remove customer from segment
					await db.delete(customersToCustomerSegments).where(
						and(
							eq(customersToCustomerSegments.customerId, customer.id),
							eq(customersToCustomerSegments.segmentId, segment.id),
						),
					)
					removals++
				}
			}
		}

		const message =
			`Segmentation task complete. Assignments: ${assignments}, Removals: ${removals}.`
		console.log(message)
		return { success: true, message }
	} catch (error: unknown) {
		const errorMessage = error instanceof Error ? error.message : "An unknown error occurred"
		console.error("Error during segmentation task:", error)
		throw createError({
			statusCode: 500,
			statusMessage: `Segmentation task failed: ${errorMessage}`,
		})
	}
})
