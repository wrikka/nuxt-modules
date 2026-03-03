// d:/wshop/app/composables/useCurrency.ts

import { useState } from "#imports"

export const useCurrency = () => {
	const currency = useState("currency", () => "THB")
	const exchangeRates = useState("exchangeRates", () => ({
		THB: 1,
		USD: 0.028,
		EUR: 0.026,
		GBP: 0.022,
	}))

	const formatPrice = (price: number, _fromCurrency: string = "THB") => {
		const rate = exchangeRates.value[currency.value as keyof typeof exchangeRates.value] || 1
		const convertedPrice = price * rate

		return new Intl.NumberFormat("en-US", {
			style: "currency",
			currency: currency.value,
			minimumFractionDigits: 2,
		}).format(convertedPrice)
	}

	const convertPrice = (price: number, _fromCurrency: string = "THB") => {
		const rate = exchangeRates.value[currency.value as keyof typeof exchangeRates.value] || 1
		return price * rate
	}

	const setCurrency = (newCurrency: string) => {
		currency.value = newCurrency
	}

	return {
		currency,
		exchangeRates,
		formatPrice,
		convertPrice,
		setCurrency,
	}
}
