// d:/wshop/server/api/backups/index.ts

import { createBackup, deleteBackup, listBackups, restoreBackup } from "~~/server/backup/system"

export default defineEventHandler(async (event) => {
	const method = getMethod(event)

	// GET: List all backups
	if (method === "GET") {
		try {
			const backups = await listBackups()
			return backups
		} catch (error: unknown) {
			const errorMessage = error instanceof Error ? error.message : "An unknown error occurred"
			console.error("Error listing backups:", error)
			throw createError({
				statusCode: 500,
				statusMessage: `Failed to list backups: ${errorMessage}`,
			})
		}
	}

	// POST: Create a new backup
	if (method === "POST") {
		try {
			const result = await createBackup()
			return result
		} catch (error: unknown) {
			const errorMessage = error instanceof Error ? error.message : "An unknown error occurred"
			console.error("Error creating backup:", error)
			throw createError({
				statusCode: 500,
				statusMessage: `Failed to create backup: ${errorMessage}`,
			})
		}
	}

	throw createError({ statusCode: 405, statusMessage: "Method Not Allowed" })
})
