// d:/wshop/server/api/apps/installed/index.ts

import { db } from "~~/server/db"
import { apps, installedApps } from "~~/server/db/schemas"

export default defineEventHandler(async (event) => {
	const method = getMethod(event)

	// GET: List installed apps
	if (method === "GET") {
		try {
			const installed = await db.query.installedApps.findMany({
				with: {
					app: true,
				},
			})
			return installed
		} catch (error: unknown) {
			const errorMessage = error instanceof Error ? error.message : "An unknown error occurred"
			console.error("Error fetching installed apps:", error)
			throw createError({
				statusCode: 500,
				statusMessage: `Failed to fetch installed apps: ${errorMessage}`,
			})
		}
	}

	throw createError({ statusCode: 405, statusMessage: "Method Not Allowed" })
})
