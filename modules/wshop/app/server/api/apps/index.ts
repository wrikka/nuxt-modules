// d:/wshop/server/api/apps/index.ts

import { z } from "zod"
import { db } from "~~/server/db"
import { installedApps } from "~~/server/db/schemas"

const installAppSchema = z.object({
	appId: z.string(),
	config: z.record(z.any()).optional(),
})

export default defineEventHandler(async (event) => {
	const method = getMethod(event)

	// GET: List all apps
	if (method === "GET") {
		try {
			const allApps = await db.query.apps.findMany({
				orderBy: (apps, { desc }) => [desc(apps.updatedAt)],
			})
			return allApps
		} catch (error: unknown) {
			const errorMessage = error instanceof Error ? error.message : "An unknown error occurred"
			console.error("Error fetching apps:", error)
			throw createError({ statusCode: 500, statusMessage: `Failed to fetch apps: ${errorMessage}` })
		}
	}

	// POST: Install an app
	if (method === "POST") {
		const body = await readBody(event)
		const validation = installAppSchema.safeParse(body)

		if (!validation.success) {
			throw createError({
				statusCode: 400,
				statusMessage: "Invalid app data",
				data: validation.error.flatten(),
			})
		}

		try {
			const newInstalledApp = await db.insert(installedApps).values(validation.data).returning()
			return newInstalledApp[0]
		} catch (error: unknown) {
			const errorMessage = error instanceof Error ? error.message : "An unknown error occurred"
			console.error("Error installing app:", error)
			throw createError({
				statusCode: 500,
				statusMessage: `Failed to install app: ${errorMessage}`,
			})
		}
	}

	throw createError({ statusCode: 405, statusMessage: "Method Not Allowed" })
})
