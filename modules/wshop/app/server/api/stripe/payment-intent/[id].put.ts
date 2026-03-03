import Stripe from "stripe"
import { z } from "zod"
import { stripePaymentProvider } from "~~/server/utils/payments/stripe"

const updateIntentSchema = z.object({
	customer: z.object({
		name: z.string().optional(),
		email: z.string().email().optional(),
	}).optional(),
	shippingAddress: z.object({
		street: z.string(),
		city: z.string(),
		state: z.string(),
		zipCode: z.string(),
		country: z.string(),
	}).optional(),
})

export default defineEventHandler(async (event) => {
	const paymentIntentId = event.context.params?.id as string
	const body = await readBody(event)

	const validation = updateIntentSchema.safeParse(body)
	if (!validation.success) {
		throw createError({
			statusCode: 400,
			statusMessage: "Invalid request body",
			data: validation.error.flatten(),
		})
	}

	const { customer, shippingAddress } = validation.data

	if (!paymentIntentId) {
		throw createError({ statusCode: 400, statusMessage: "Payment Intent ID is required" })
	}

	try {
		const updatePayload: Stripe.PaymentIntentUpdateParams = {}

		if (customer?.email) {
			updatePayload.receipt_email = customer.email
		}

		if (shippingAddress) {
			if (!customer?.name) {
				throw createError({
					statusCode: 400,
					statusMessage: "Customer name is required when providing a shipping address.",
				})
			}
			updatePayload.shipping = {
				name: customer.name,
				address: {
					line1: shippingAddress.street,
					city: shippingAddress.city,
					state: shippingAddress.state,
					postal_code: shippingAddress.zipCode,
					country: shippingAddress.country,
				},
			}
		}

		if (Object.keys(updatePayload).length === 0) {
			return { success: true, message: "No updates needed." }
		}

		const updatedIntent = await stripePaymentProvider.updatePaymentIntent(
			paymentIntentId,
			updatePayload,
		)

		return { success: true, updatedIntent }
	} catch (error: unknown) {
		const errorMessage = error instanceof Error ? error.message : "An unknown error occurred"
		console.error("Error updating Payment Intent:", error)
		throw createError({
			statusCode: 500,
			statusMessage: errorMessage || "Failed to update Payment Intent",
		})
	}
})
