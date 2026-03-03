import { z } from "zod"
import { db } from "~~/server/db"
import { customerSegmentRules, customerSegments } from "~~/server/db/schemas"

const segmentRuleSchema = z.object({
	field: z.string(),
	operator: z.enum(["gte", "lte", "eq", "neq"]),
	value: z.union([z.string(), z.number()]),
})

const createSegmentSchema = z.object({
	name: z.string().min(1),
	description: z.string().optional(),
	rules: z.array(segmentRuleSchema).min(1),
})

export default defineEventHandler(async (event) => {
	const method = getMethod(event)

	// GET: List all segments with their rules
	if (method === "GET") {
		const segments = await db.query.customerSegments.findMany({
			with: {
				rules: true,
			},
		})
		return segments
	}

	// POST: Create a new segment and its rules
	if (method === "POST") {
		const body = await readBody(event)
		const validation = createSegmentSchema.safeParse(body)

		if (!validation.success) {
			throw createError({
				statusCode: 400,
				statusMessage: "Invalid segment data",
				data: validation.error.flatten(),
			})
		}

		const { name, description, rules } = validation.data

		const newSegment = await db.transaction(async (tx) => {
			const [segment] = await tx.insert(customerSegments).values({ name, description }).returning()

			if (!segment) {
				throw new Error("Failed to create segment.")
			}

			const rulesToInsert = rules.map(rule => ({
				segmentId: segment.id,
				field: rule.field,
				operator: rule.operator,
				value: String(rule.value), // Ensure value is a string
			}))

			await tx.insert(customerSegmentRules).values(rulesToInsert)

			return segment
		})

		return { success: true, segment: newSegment }
	}

	throw createError({ statusCode: 405, statusMessage: "Method Not Allowed" })
})
