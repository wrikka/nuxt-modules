import type { QRCodePayment } from "#shared/types"

export interface QRPaymentFormData {
	selectedProvider: "promptpay" | "truewallet" | "linepay"
	qrPayment: QRCodePayment | null
	timeRemaining: string
}

export const useQRPaymentForm = () => {
	// Form state
	const selectedProvider = ref<"promptpay" | "truewallet" | "linepay">("promptpay")
	const qrPayment = ref<QRCodePayment | null>(null)
	const timeRemaining = ref("")
	const statusCheckInterval = ref<NodeJS.Timeout | null>(null)

	// Providers data
	const providers = [
		{ id: "promptpay", name: "PromptPay", icon: "💰" },
		{ id: "truewallet", name: "TrueMoney Wallet", icon: "💳" },
		{ id: "linepay", name: "LINE Pay", icon: "💚" },
	]

	// Utility functions
	const formatTimeRemaining = (expiresAt: Date): string => {
		const now = new Date()
		const remaining = expiresAt.getTime() - now.getTime()

		if (remaining <= 0) return "หมดอายุ"

		const minutes = Math.floor(remaining / 60000)
		const seconds = Math.floor((remaining % 60000) / 1000)

		return `${minutes}:${seconds.toString().padStart(2, "0")}`
	}

	const updateTimer = () => {
		if (qrPayment.value) {
			timeRemaining.value = formatTimeRemaining(new Date(qrPayment.value.expiresAt))
		}
	}

	// Lifecycle
	onMounted(() => {
		setInterval(updateTimer, 1000)
	})

	onUnmounted(() => {
		if (statusCheckInterval.value) {
			clearInterval(statusCheckInterval.value)
		}
	})

	// Form methods
	const setSelectedProvider = (provider: "promptpay" | "truewallet" | "linepay") => {
		selectedProvider.value = provider
	}

	const setQRPayment = (payment: QRCodePayment | null) => {
		qrPayment.value = payment
	}

	const setStatusCheckInterval = (interval: NodeJS.Timeout | null) => {
		statusCheckInterval.value = interval
	}

	const resetForm = () => {
		selectedProvider.value = "promptpay"
		qrPayment.value = null
		timeRemaining.value = ""
		if (statusCheckInterval.value) {
			clearInterval(statusCheckInterval.value)
			statusCheckInterval.value = null
		}
	}

	// Get form data
	const getFormData = (): QRPaymentFormData => ({
		selectedProvider: selectedProvider.value,
		qrPayment: qrPayment.value,
		timeRemaining: timeRemaining.value,
	})

	return {
		// State
		selectedProvider: readonly(selectedProvider),
		qrPayment: readonly(qrPayment),
		timeRemaining: readonly(timeRemaining),
		statusCheckInterval: readonly(statusCheckInterval),

		// Data
		providers,

		// Methods
		setSelectedProvider,
		setQRPayment,
		setStatusCheckInterval,
		resetForm,
		getFormData,
		formatTimeRemaining,
	}
}
