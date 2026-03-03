// d:/wshop/server/plugins/index.ts

import { eq } from "drizzle-orm"
import { db } from "~~/server/db"
import { apps, installedApps } from "~~/server/db/schemas"

export default defineNitroPlugin(async (nitroApp) => {
	try {
		const installed = await db.select().from(installedApps).where(eq(installedApps.enabled, true))

		for (const item of installed) {
			const app = await db.query.apps.findFirst({ where: eq(apps.id, item.appId) })
			if (!app) continue

			try {
				// Load plugin from the app's entry point
				// This is a simplified version - in production, you'd need proper sandboxing
				const pluginPath = `~/plugins/apps/${app.id}`

				try {
					const plugin = await import(pluginPath)
					if (plugin.default && typeof plugin.default === "function") {
						await plugin.default(nitroApp, item.config)
					}
				} catch (error) {
					console.warn(`Failed to load plugin ${app.id}:`, error)
				}
			} catch (error) {
				console.error(`Error loading plugin ${app.id}:`, error)
			}
		}
	} catch (error) {
		console.error("Error loading plugins:", error)
	}
})
