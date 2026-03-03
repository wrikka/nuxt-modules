// d:/wshop/server/utils/payments/stripe.ts

import Stripe from "stripe"
import type { PaymentIntentResult, PaymentProvider } from "./provider"

class StripePaymentProvider implements PaymentProvider {
	private stripe: Stripe

	constructor() {
		const config = useRuntimeConfig()
		if (!config.stripeSecretKey) {
			throw new Error("Stripe secret key is not configured.")
		}
		this.stripe = new Stripe(config.stripeSecretKey as string, { apiVersion: "2025-12-15.clover" })
	}

	async createPaymentIntent(
		amount: number,
		currency: string,
		metadata?: Record<string, any>,
	): Promise<PaymentIntentResult> {
		const paymentIntent = await this.stripe.paymentIntents.create({
			amount,
			currency,
			metadata,
			automatic_payment_methods: { enabled: true },
		})

		return {
			clientSecret: paymentIntent.client_secret!,
			paymentIntentId: paymentIntent.id,
		}
	}

	async getPaymentStatus(
		paymentIntentId: string,
	): Promise<"succeeded" | "processing" | "requires_payment_method"> {
		const paymentIntent = await this.stripe.paymentIntents.retrieve(paymentIntentId)
		const status = paymentIntent.status

		switch (status) {
			case "succeeded":
			case "processing":
			case "requires_payment_method":
				return status
			case "requires_action":
			case "requires_capture":
			case "requires_confirmation":
				return "processing"
			case "canceled":
				throw new Error("Payment has been canceled.")
			default:
				throw new Error(`Unhandled payment intent status: ${status}`)
		}
	}

	async updatePaymentIntent(
		paymentIntentId: string,
		params: Stripe.PaymentIntentUpdateParams,
	): Promise<Stripe.PaymentIntent> {
		try {
			const paymentIntent = await this.stripe.paymentIntents.update(paymentIntentId, params)
			return paymentIntent
		} catch (error: unknown) {
			const errorMessage = error instanceof Error ? error.message : "An unknown error occurred"
			console.error(`Failed to update Payment Intent ${paymentIntentId}:`, errorMessage)
			throw createError({ statusCode: 500, statusMessage: `Stripe API Error: ${errorMessage}` })
		}
	}

	async cancelPaymentIntent(
		paymentIntentId: string,
		reason: Stripe.PaymentIntentCancelParams.CancellationReason,
	): Promise<Stripe.PaymentIntent> {
		try {
			const paymentIntent = await this.stripe.paymentIntents.cancel(paymentIntentId, {
				cancellation_reason: reason,
			})
			return paymentIntent
		} catch (error: unknown) {
			const errorMessage = error instanceof Error ? error.message : "An unknown error occurred"
			console.error(`Failed to cancel Payment Intent ${paymentIntentId}:`, errorMessage)
			throw createError({ statusCode: 500, statusMessage: `Stripe API Error: ${errorMessage}` })
		}
	}
}

export const stripePaymentProvider = new StripePaymentProvider()
