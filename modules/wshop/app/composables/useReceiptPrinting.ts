import type { POSSession } from "#shared/types"
import { ref } from "vue"

export function useReceiptPrinting() {
	const printing = ref(false)
	const error = ref<string | null>(null)

	const printReceipt = async (session: POSSession) => {
		printing.value = true
		error.value = null
		try {
			// In a real implementation, this would use a printing library
			console.log("Printing receipt for session:", session.id)
			await new Promise(resolve => setTimeout(resolve, 1000))
			return { success: true }
		} catch (err) {
			error.value = err instanceof Error ? err.message : "Failed to print receipt"
			throw err
		} finally {
			printing.value = false
		}
	}

	const generateReceiptData = (session: POSSession) => {
		return {
			sessionId: session.sessionId,
			items: session.items,
			subtotal: session.subtotal,
			tax: session.tax,
			discount: session.discount,
			total: session.total,
			paymentMethod: session.paymentMethod,
			paymentReference: session.paymentDetails?.reference,
			customer: session.customerId,
			staff: session.staffId,
			register: session.registerId,
			createdAt: session.createdAt,
			completedAt: session.completedAt,
		}
	}

	return {
		printing,
		error,
		printReceipt,
		generateReceiptData,
	}
}
