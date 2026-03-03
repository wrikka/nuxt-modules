// d:/wshop/server/api/apps/[id].delete.ts

import { eq } from "drizzle-orm"
import { db } from "~~/server/db"
import { installedApps } from "~~/server/db/schemas"

export default defineEventHandler(async (event) => {
	const installedAppId = event.context.params?.id as string

	if (!installedAppId) {
		throw createError({ statusCode: 400, statusMessage: "Installed App ID is required" })
	}

	try {
		await db.delete(installedApps).where(eq(installedApps.id, installedAppId))
		return { success: true }
	} catch (error: unknown) {
		const errorMessage = error instanceof Error ? error.message : "An unknown error occurred"
		console.error("Error uninstalling app:", error)
		throw createError({
			statusCode: 500,
			statusMessage: `Failed to uninstall app: ${errorMessage}`,
		})
	}
})
