import { z } from "zod"
import { db } from "~~/server/db"
import { paymentTransactions } from "~~/server/db/schemas"

const qrPaymentSchema = z.object({
	amount: z.number().positive(),
	provider: z.enum(["promptpay", "truewallet", "linepay"]),
	orderId: z.string(),
})

export default defineEventHandler(async (event) => {
	const body = await readBody(event)
	const validation = qrPaymentSchema.safeParse(body)

	if (!validation.success) {
		throw createError({
			statusCode: 400,
			statusMessage: "Invalid payment data",
			data: validation.error.flatten(),
		})
	}

	const { amount, provider, orderId } = validation.data

	try {
		const [newTransaction] = await db.insert(paymentTransactions).values({
			orderId,
			amount: String(amount),
			method: "qr",
			status: "pending",
			metadata: { provider },
		}).returning()

		if (!newTransaction) {
			throw createError({ statusCode: 500, statusMessage: "Failed to create payment transaction." })
		}

		// In a real app, this would be a payload from the payment provider, not a generated URL.
		const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${
			encodeURIComponent(
				`payment:${provider}:${amount}:${orderId}:${newTransaction.id}`,
			)
		}`

		return {
			success: true,
			data: {
				transactionId: newTransaction.id,
				qrCodeUrl,
			},
		}
	} catch (error: unknown) {
		const errorMessage = error instanceof Error ? error.message : "An unknown error occurred"
		console.error("Error creating QR payment:", error)
		throw createError({
			statusCode: 500,
			statusMessage: `Failed to create QR payment: ${errorMessage}`,
		})
	}
})
