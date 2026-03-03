import { useState } from "#imports"
import type { Address, CartItem } from "#shared/types"
import type { Ref } from "vue"

interface TaxBreakdown {
	amount: number
	taxability_reason: string
	taxable_amount: number
	tax_rate_details: {
		display_name: string
		percentage_decimal: string
		tax_type: string
	}
}

export const useTaxCalculator = (cartItems: Ref<CartItem[]>) => {
	const taxAmount = useState<number>("taxAmount", () => 0)
	const taxBreakdown = useState<TaxBreakdown[]>("taxBreakdown", () => [])

	const calculateTaxes = async (shippingAddress: Address) => {
		if (!cartItems.value || cartItems.value.length === 0 || !shippingAddress) {
			taxAmount.value = 0
			taxBreakdown.value = []
			return
		}

		try {
			const lineItems = cartItems.value.map((item: CartItem) => ({
				id: item.variantId,
				quantity: item.quantity,
				price: Number(item.price),
				taxCode: "txcd_99999999", // Placeholder: This should come from the product data
			}))

			const response = await $fetch<{ taxAmount: number; taxBreakdown: TaxBreakdown[] }>(
				"/api/stripe/tax/calculate",
				{
					method: "POST",
					body: {
						lineItems,
						shippingAddress,
						currency: "thb",
					},
				},
			)

			taxAmount.value = response.taxAmount
			taxBreakdown.value = response.taxBreakdown
		} catch (error) {
			console.error("Failed to calculate taxes:", error)
			taxAmount.value = 0
			taxBreakdown.value = []
		}
	}

	return {
		taxAmount,
		taxBreakdown,
		calculateTaxes,
	}
}
