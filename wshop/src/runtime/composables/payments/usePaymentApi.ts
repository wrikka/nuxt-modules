import type {
	CardPayment,
	CashPayment,
	PaymentMethod,
	PaymentTransaction,
	QRCodePayment,
} from "#shared/types"
import type { PaymentError } from "./types"

export function usePaymentApi() {
	const handleApiError = (err: unknown, defaultMessage: string) => {
		const error = err as PaymentError
		const message = error.data?.message || (err instanceof Error ? err.message : defaultMessage)
		console.error(defaultMessage, err)
		return message
	}

	const fetchPaymentMethods = async () => {
		try {
			return await $fetch<PaymentMethod[]>("/api/payment/methods")
		} catch (err) {
			throw new Error(handleApiError(err, "Failed to load payment methods"))
		}
	}

	const processCashPayment = async (
		payment: { amount: number; cashReceived: number; orderId: string },
	) => {
		try {
			return await $fetch<CashPayment>("/api/payment/cash", {
				method: "POST",
				body: payment,
			})
		} catch (err) {
			throw new Error(handleApiError(err, "Failed to process cash payment"))
		}
	}

	const processCardPayment = async (
		payment: {
			amount: number
			cardNumber: string
			expiryMonth: string
			expiryYear: string
			cvv: string
			orderId: string
		},
	) => {
		try {
			return await $fetch<CardPayment>("/api/payment/card", {
				method: "POST",
				body: payment,
			})
		} catch (err) {
			throw new Error(handleApiError(err, "Failed to process card payment"))
		}
	}

	const generateQRPayment = async (
		payment: { amount: number; provider: "promptpay" | "truewallet" | "linepay"; orderId: string },
	) => {
		try {
			return await $fetch<QRCodePayment>("/api/payment/qr", {
				method: "POST",
				body: payment,
			})
		} catch (err) {
			throw new Error(handleApiError(err, "Failed to generate QR payment"))
		}
	}

	const checkQRPaymentStatus = async (qrId: string) => {
		try {
			return await $fetch<QRCodePayment>(`/api/payment/qr/${qrId}/status`)
		} catch (err) {
			throw new Error(handleApiError(err, "Failed to check QR payment status"))
		}
	}

	const processBankTransfer = async (
		payment: {
			amount: number
			bankName: string
			accountNumber: string
			accountName: string
			transferTime: Date
			slipImage?: string
			orderId: string
		},
	) => {
		try {
			return await $fetch<PaymentTransaction>("/api/payment/transfer", {
				method: "POST",
				body: payment,
			})
		} catch (err) {
			throw new Error(handleApiError(err, "Failed to process bank transfer"))
		}
	}

	const refundPayment = async (transactionId: string, amount?: number) => {
		try {
			return await $fetch<PaymentTransaction>(`/api/payment/${transactionId}/refund`, {
				method: "POST",
				body: { amount },
			})
		} catch (err) {
			throw new Error(handleApiError(err, "Failed to refund payment"))
		}
	}

	const fetchPaymentHistory = async (
		filters?: { startDate?: Date; endDate?: Date; method?: string; status?: string },
	) => {
		try {
			return await $fetch<PaymentTransaction[]>("/api/payment/history", { query: filters })
		} catch (err) {
			throw new Error(handleApiError(err, "Failed to get payment history"))
		}
	}

	return {
		fetchPaymentMethods,
		processCashPayment,
		processCardPayment,
		generateQRPayment,
		checkQRPaymentStatus,
		processBankTransfer,
		refundPayment,
		fetchPaymentHistory,
	}
}
