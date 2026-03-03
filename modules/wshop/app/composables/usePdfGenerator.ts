import type { POSSession } from "#shared/types"
import { ref } from "vue"
import { ReceiptPDFGenerator } from "~/utils/pdf/receiptGenerator"

export function usePdfGenerator() {
	const loading = ref(false)
	const error = ref<string | null>(null)

	const generatePDFReceipt = async (session: POSSession) => {
		loading.value = true
		error.value = null
		try {
			const generator = new ReceiptPDFGenerator()
			const pdf = generator.generate(session)

			// Open in new window or download
			const pdfBlob = pdf.output("blob")
			const pdfUrl = URL.createObjectURL(pdfBlob)
			window.open(pdfUrl, "_blank")

			return pdf
		} catch (err) {
			error.value = err instanceof Error ? err.message : "Failed to generate PDF"
			throw err
		} finally {
			loading.value = false
		}
	}

	const generatePDFAndDownload = async (session: POSSession, filename?: string) => {
		loading.value = true
		error.value = null
		try {
			const generator = new ReceiptPDFGenerator()
			const pdf = generator.generate(session)

			const defaultFilename = `receipt-${session.sessionId}-${Date.now()}.pdf`
			pdf.save(filename || defaultFilename)

			return pdf
		} catch (err) {
			error.value = err instanceof Error ? err.message : "Failed to generate PDF"
			throw err
		} finally {
			loading.value = false
		}
	}

	return {
		loading,
		error,
		generatePDFReceipt,
		generatePDFAndDownload,
	}
}
