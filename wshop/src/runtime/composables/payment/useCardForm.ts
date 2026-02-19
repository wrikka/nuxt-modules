export interface CardFormData {
	cardNumber: string
	expiryMonth: string
	expiryYear: string
	cvv: string
	cardHolderName: string
}

export const useCardForm = () => {
	// Form state
	const cardNumber = ref("")
	const expiryMonth = ref("")
	const expiryYear = ref("")
	const cvv = ref("")
	const cardHolderName = ref("")

	// Refs for auto-focus
	const expiryMonthRef = ref<HTMLInputElement>()
	const expiryYearRef = ref<HTMLInputElement>()
	const cvvRef = ref<HTMLInputElement>()

	// Formatters
	const formatCardNumber = (value: string): string => {
		const cleaned = value.replace(/\s/g, "")
		const chunks = cleaned.match(/.{1,4}/g) || []
		return chunks.join(" ")
	}

	const getCardType = (number: string): "visa" | "mastercard" | "jcb" => {
		const cleaned = number.replace(/\s/g, "")

		if (cleaned.startsWith("4")) return "visa"
		if (cleaned.startsWith("5") || cleaned.startsWith("2")) return "mastercard"
		if (cleaned.startsWith("35")) return "jcb"

		return "visa" // default
	}

	// Input handlers
	const handleCardNumberInput = (event: Event) => {
		const target = event.target as HTMLInputElement
		cardNumber.value = formatCardNumber(target.value.replace(/\D/g, ""))
	}

	const handleExpiryMonthInput = (event: Event) => {
		const target = event.target as HTMLInputElement
		let value = target.value.replace(/\D/g, "")
		if (value.length > 2) value = value.slice(0, 2)
		if (parseInt(value) > 12) value = "12"
		expiryMonth.value = value
	}

	const handleExpiryYearInput = (event: Event) => {
		const target = event.target as HTMLInputElement
		let value = target.value.replace(/\D/g, "")
		if (value.length > 2) value = value.slice(0, 2)
		expiryYear.value = value
	}

	const handleCvvInput = (event: Event) => {
		const target = event.target as HTMLInputElement
		cvv.value = target.value.replace(/\D/g, "").slice(0, 3)
	}

	// Validation
	const isFormValid = computed(() => {
		const cleanedCardNumber = cardNumber.value.replace(/\s/g, "")
		return (
			cleanedCardNumber.length >= 13
			&& cleanedCardNumber.length <= 19
			&& expiryMonth.value.length === 2
			&& expiryYear.value.length === 2
			&& cvv.value.length === 3
			&& cardHolderName.value.trim().length > 0
		)
	})

	// Auto-focus logic
	watch(cardNumber, (newValue) => {
		if (newValue.replace(/\s/g, "").length === 16) {
			expiryMonthRef.value?.focus()
		}
	})

	watch(expiryMonth, (newValue) => {
		if (newValue.length === 2) {
			expiryYearRef.value?.focus()
		}
	})

	watch(expiryYear, (newValue) => {
		if (newValue.length === 2) {
			cvvRef.value?.focus()
		}
	})

	// Reset form
	const resetForm = () => {
		cardNumber.value = ""
		expiryMonth.value = ""
		expiryYear.value = ""
		cvv.value = ""
		cardHolderName.value = ""
	}

	// Get form data
	const getFormData = (): CardFormData => ({
		cardNumber: cardNumber.value.replace(/\s/g, ""),
		expiryMonth: expiryMonth.value,
		expiryYear: expiryYear.value,
		cvv: cvv.value,
		cardHolderName: cardHolderName.value.trim(),
	})

	return {
		// State
		cardNumber: readonly(cardNumber),
		expiryMonth: readonly(expiryMonth),
		expiryYear: readonly(expiryYear),
		cvv: readonly(cvv),
		cardHolderName: readonly(cardHolderName),

		// Refs
		expiryMonthRef,
		expiryYearRef,
		cvvRef,

		// Computed
		isFormValid: readonly(isFormValid),
		cardType: computed(() => getCardType(cardNumber.value)),

		// Methods
		handleCardNumberInput,
		handleExpiryMonthInput,
		handleExpiryYearInput,
		handleCvvInput,
		resetForm,
		getFormData,

		// Setters for v-model
		setCardNumber: (value: string) => cardNumber.value = value,
		setExpiryMonth: (value: string) => expiryMonth.value = value,
		setExpiryYear: (value: string) => expiryYear.value = value,
		setCvv: (value: string) => cvv.value = value,
		setCardHolderName: (value: string) => cardHolderName.value = value,
	}
}
