import { ref } from "#imports"
import type { CardPayment, CashPayment, QRCodePayment } from "~~/shared/types"

export function usePayment() {
	const processing = ref(false)
	const error = ref<string | null>(null)

	const processCardPayment = async (payment: CardPayment) => {
		processing.value = true
		error.value = null
		try {
			const result = await $fetch("/api/payment/card", {
				method: "POST",
				body: payment,
			})
			return result
		} catch (err) {
			error.value = err instanceof Error ? err.message : "Payment failed"
			throw err
		} finally {
			processing.value = false
		}
	}

	const processCashPayment = async (payment: CashPayment) => {
		processing.value = true
		error.value = null
		try {
			const result = await $fetch("/api/payment/cash", {
				method: "POST",
				body: payment,
			})
			return result
		} catch (err) {
			error.value = err instanceof Error ? err.message : "Payment failed"
			throw err
		} finally {
			processing.value = false
		}
	}

	const generateQRPayment = async (
		amount: number,
		provider: "promptpay" | "truewallet" | "linepay",
	) => {
		processing.value = true
		error.value = null
		try {
			const result = await $fetch("/api/payment/qr/generate", {
				method: "POST",
				body: { amount, provider },
			}) as { success?: boolean; data?: QRCodePayment } | QRCodePayment
			// Handle API response that wraps data in { success, data }
			const payment = "data" in result ? result.data : result
			if (!payment || typeof payment !== "object") {
				throw new Error("Invalid payment response")
			}
			return {
				...payment,
				expiresAt: new Date((payment as QRCodePayment).expiresAt),
			} as QRCodePayment
		} catch (err) {
			error.value = err instanceof Error ? err.message : "Failed to generate QR payment"
			throw err
		} finally {
			processing.value = false
		}
	}

	const checkQRPaymentStatus = async (paymentId: string) => {
		try {
			const result = await $fetch(`/api/payment/qr/${paymentId}/status`) as {
				success?: boolean
				data?: { status?: string } | string
			} | { status?: string }
			// Handle API response that wraps data in { success, data }
			const status = "data" in result ? result.data : result
			return status
		} catch (err) {
			error.value = err instanceof Error ? err.message : "Failed to check payment status"
			throw err
		}
	}

	const startQRStatusCheck = (paymentId: string, callback: (status: string) => void) => {
		const interval = setInterval(async () => {
			try {
				const result = await checkQRPaymentStatus(paymentId)
				const status = typeof result === "string" ? result : (result as { status?: string }).status
				callback(status)
				if (status === "paid" || status === "expired") {
					clearInterval(interval)
				}
			} catch (err) {
				console.error("Failed to check QR payment status:", err)
			}
		}, 2000)

		return interval
	}

	return {
		processing,
		error,
		processCardPayment,
		processCashPayment,
		generateQRPayment,
		checkQRPaymentStatus,
		startQRStatusCheck,
	}
}
