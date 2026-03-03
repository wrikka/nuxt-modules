import Stripe from "stripe"

let stripeClient: Stripe | null = null

export const getStripeClient = (): Stripe => {
	if (!stripeClient) {
		const config = useRuntimeConfig()
		if (!config.stripeSecretKey) {
			throw new Error("Stripe secret key is not configured.")
		}
		stripeClient = new Stripe(config.stripeSecretKey as string, {
			apiVersion: "2025-12-15.clover",
		})
	}
	return stripeClient
}
