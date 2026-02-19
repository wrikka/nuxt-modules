import { and, eq } from "drizzle-orm"
import { db } from "~~/server/db/index"
import { digitalProductFiles, orderItems, orders } from "~~/server/db/schemas"

export default defineEventHandler(async (event) => {
	const productId = event.context.params?.productId as string
	const fileId = event.context.params?.fileId as string

	if (!productId || !fileId) {
		throw createError({ statusCode: 400, statusMessage: "Product ID and File ID are required" })
	}

	// --- Authorization ---
	const customerId = event.context.customer?.id

	if (!customerId) {
		throw createError({ statusCode: 401, statusMessage: "Unauthorized" })
	}

	const hasPurchased = await db.query.orders.findFirst({
		where: and(
			eq(orders.paymentStatus, "paid"),
			eq(orders.customerId, customerId),
		),
		with: {
			items: {
				where: eq(orderItems.productId, productId),
			},
		},
	})

	if (!hasPurchased || hasPurchased.items.length === 0) {
		throw createError({
			statusCode: 403,
			statusMessage: "You do not have permission to download this file.",
		})
	}

	// --- Fetch File ---
	const file = await db.query.digitalProductFiles.findFirst({
		where: and(
			eq(digitalProductFiles.id, fileId),
			eq(digitalProductFiles.productId, productId),
		),
	})

	if (!file) {
		throw createError({ statusCode: 404, statusMessage: "File not found" })
	}

	// In a real-world scenario, you would generate a secure, short-lived signed URL here
	// and redirect the user to it. For this example, we'll just return the raw URL.
	return { downloadUrl: file.fileUrl }
})
