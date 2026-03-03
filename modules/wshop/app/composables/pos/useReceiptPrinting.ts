import { computed, ref } from "vue"
import type { POSSession } from "../../../shared/types/pos"
import { generateReceiptData } from "../../utils/receipt"
import { useHtmlRenderer } from "../useHtmlRenderer"
import { usePdfGenerator } from "../usePdfGenerator"

export function useReceiptPrinting() {
	const pdfGenerator = usePdfGenerator()
	const htmlRenderer = useHtmlRenderer()
	const localError = ref<string | null>(null)

	const loading = computed(() => pdfGenerator.loading.value || htmlRenderer.loading.value)
	const error = computed(() =>
		localError.value || pdfGenerator.error.value || htmlRenderer.error.value
	)

	const emailReceipt = async (session: POSSession, customerEmail: string) => {
		try {
			localError.value = null
			const receipt = generateReceiptData(session)
			const emailData = {
				to: customerEmail,
				subject: `ใบเสร็จจากร้านค้า WShop - ${receipt.receiptNumber}`,
				template: "receipt",
				data: {
					receiptNumber: receipt.receiptNumber,
					date: receipt.createdAt,
					items: receipt.items,
					totals: receipt.totals,
					customer: receipt.customer,
				},
			}
			console.log("Sending receipt email:", emailData)
			await new Promise(resolve => setTimeout(resolve, 1000)) // Mock API call
			return { success: true, message: "Receipt sent successfully" }
		} catch (err) {
			localError.value = err instanceof Error ? err.message : "Failed to send receipt email"
			throw err
		}
	}

	return {
		loading,
		error,
		generateReceiptData,
		printReceipt: htmlRenderer.printElement,
		generatePDFReceipt: pdfGenerator.generatePDFReceipt,
		generateImageReceipt: htmlRenderer.generateImage,
		generateTaxInvoice: pdfGenerator.generateTaxInvoice,
		emailReceipt,
	}
}
