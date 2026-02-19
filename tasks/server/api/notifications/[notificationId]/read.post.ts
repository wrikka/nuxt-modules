import { defineEventHandler, readBody } from "h3"

export default defineEventHandler(async (event) => {
	const body = await readBody(event)
	const { notificationId } = event.context.params as { notificationId: string }

	// In production: update database
	// await db.notifications.update({ where: { id: notificationId }, data: { read: true } })

	return { success: true, notificationId }
})
