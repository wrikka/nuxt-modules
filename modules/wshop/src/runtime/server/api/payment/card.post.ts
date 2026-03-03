import Stripe from "stripe"
import { z } from "zod"
import { db } from "~~/server/db"
import { paymentTransactions } from "~~/server/db/schemas"

const createPaymentIntentSchema = z.object({
	amount: z.number().positive("Amount must be positive"),
	orderId: z.string(),
})

export default defineEventHandler(async (event) => {
	const runtimeConfig = useRuntimeConfig()
	const stripe = new Stripe(runtimeConfig.stripeSecretKey as string, {
		apiVersion: "2025-12-15.clover",
	})

	const body = await readBody(event)
	const validation = createPaymentIntentSchema.safeParse(body)

	if (!validation.success) {
		throw createError({
			statusCode: 400,
			statusMessage: "Invalid request data",
			data: validation.error.flatten(),
		})
	}

	const { amount, orderId } = validation.data

	try {
		// Create a PaymentIntent with the order amount and currency
		const paymentIntent = await stripe.paymentIntents.create({
			amount: Math.round(amount * 100), // Amount in cents
			currency: "thb",
			metadata: { orderId },
		})

		// Log the transaction attempt in the database
		await db.insert(paymentTransactions).values({
			orderId,
			amount: String(amount),
			method: "card",
			status: "pending",
			reference: paymentIntent.id,
			metadata: { clientSecret: paymentIntent.client_secret },
		})

		return {
			clientSecret: paymentIntent.client_secret,
		}
	} catch (error: unknown) {
		const errorMessage = error instanceof Error ? error.message : "An unknown error occurred"
		console.error("Error creating Payment Intent:", error)
		throw createError({
			statusCode: 500,
			statusMessage: `Failed to create payment intent: ${errorMessage}`,
		})
	}
})
