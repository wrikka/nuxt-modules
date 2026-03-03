import type { PaymentMethod, PaymentTransaction, QRCodePayment } from "#shared/types"
import { readonly, ref } from "vue"
import { usePaymentApi } from "./usePaymentApi"

export const usePayment = () => {
	const paymentMethods = ref<PaymentMethod[]>([])
	const currentTransaction = ref<PaymentTransaction | null>(null)
	const qrPayments = ref<QRCodePayment[]>([])
	const loading = ref(false)
	const error = ref<string | null>(null)

	const api = usePaymentApi()

	const executeAction = async <T>(
		action: () => Promise<T>,
		errorMessage: string,
	): Promise<T | null> => {
		loading.value = true
		error.value = null
		try {
			return await action()
		} catch (err) {
			error.value = err instanceof Error ? err.message : errorMessage
			return null
		} finally {
			loading.value = false
		}
	}

	const startQRStatusCheck = (qrId: string, interval = 3000) => {
		const check = async () => {
			const payment = await executeAction(
				() => api.checkQRPaymentStatus(qrId),
				"Failed to check QR payment status",
			)
			if (payment && (payment.status === "paid" || payment.status === "expired")) {
				const index = qrPayments.value.findIndex(p => p.id === qrId)
				if (index !== -1) qrPayments.value[index] = payment
			} else {
				setTimeout(check, interval)
			}
		}
		check()
	}

	type CashPaymentParams = Parameters<typeof api.processCashPayment>[0]
	type CardPaymentParams = Parameters<typeof api.processCardPayment>[0]
	type QRPaymentParams = Parameters<typeof api.generateQRPayment>[0]
	type BankTransferParams = Parameters<typeof api.processBankTransfer>[0]
	type PaymentHistoryParams = Parameters<typeof api.fetchPaymentHistory>[0]

	return {
		paymentMethods: readonly(paymentMethods),
		currentTransaction: readonly(currentTransaction),
		qrPayments: readonly(qrPayments),
		loading: readonly(loading),
		error: readonly(error),
		loadPaymentMethods: () =>
			executeAction(api.fetchPaymentMethods, "Failed to load payment methods"),
		processCashPayment: (payment: CashPaymentParams) =>
			executeAction(() => api.processCashPayment(payment), "Failed to process cash payment"),
		processCardPayment: (payment: CardPaymentParams) =>
			executeAction(() => api.processCardPayment(payment), "Failed to process card payment"),
		generateQRPayment: (payment: QRPaymentParams) =>
			executeAction(() => api.generateQRPayment(payment), "Failed to generate QR payment"),
		checkQRPaymentStatus: (qrId: string) =>
			executeAction(() => api.checkQRPaymentStatus(qrId), "Failed to check QR payment status"),
		processBankTransfer: (payment: BankTransferParams) =>
			executeAction(() => api.processBankTransfer(payment), "Failed to process bank transfer"),
		refundPayment: (transactionId: string, amount?: number) =>
			executeAction(() => api.refundPayment(transactionId, amount), "Failed to refund payment"),
		getPaymentHistory: (filters?: PaymentHistoryParams) =>
			executeAction(() => api.fetchPaymentHistory(filters), "Failed to get payment history"),
		startQRStatusCheck,
	}
}
