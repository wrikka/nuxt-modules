// d:/wshop/server/api/channels/index.ts

import { createInsertSchema } from "drizzle-zod"
import { db } from "~~/server/db"
import { channels } from "~~/server/db/schemas"

const createChannelSchema = createInsertSchema(channels)

export default defineEventHandler(async (event) => {
	const method = getMethod(event)

	// GET: List all channels
	if (method === "GET") {
		try {
			const allChannels = await db.query.channels.findMany({
				orderBy: (channels, { desc }) => [desc(channels.createdAt)],
			})
			return allChannels
		} catch (error: unknown) {
			const errorMessage = error instanceof Error ? error.message : "An unknown error occurred"
			console.error("Error fetching channels:", error)
			throw createError({
				statusCode: 500,
				statusMessage: `Failed to fetch channels: ${errorMessage}`,
			})
		}
	}

	// POST: Create a new channel
	if (method === "POST") {
		const body = await readBody(event)
		const validation = createChannelSchema.safeParse(body)

		if (!validation.success) {
			throw createError({
				statusCode: 400,
				statusMessage: "Invalid channel data",
				data: validation.error.flatten(),
			})
		}

		try {
			const newChannel = await db.insert(channels).values(validation.data).returning()
			return newChannel[0]
		} catch (error: unknown) {
			const errorMessage = error instanceof Error ? error.message : "An unknown error occurred"
			console.error("Error creating channel:", error)
			throw createError({
				statusCode: 500,
				statusMessage: `Failed to create channel: ${errorMessage}`,
			})
		}
	}

	throw createError({ statusCode: 405, statusMessage: "Method Not Allowed" })
})
