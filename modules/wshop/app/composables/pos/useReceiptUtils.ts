export const useReceiptUtils = () => {
	const formatDate = (dateString?: string): string => {
		if (!dateString) return ""
		const date = new Date(dateString)
		return date.toLocaleDateString("th-TH", {
			year: "numeric",
			month: "2-digit",
			day: "2-digit",
			hour: "2-digit",
			minute: "2-digit",
		})
	}

	const getPaymentMethodName = (method: string): string => {
		const methods: Record<string, string> = {
			cash: "เงินสด",
			card: "บัตรเครดิต",
			mobile: "Mobile Banking",
			store_credit: "เครดิตร้าน",
		}
		return methods[method] || method
	}

	const printReceipt = (receiptElementId: string = "receipt-content") => {
		const printContent = document.getElementById(receiptElementId)
		if (!printContent) return

		const printWindow = window.open("", "_blank")
		if (!printWindow) return

		printWindow.document.write(`
      <html>
        <head>
          <title>ใบเสร็จ</title>
          <style>
            body { font-family: Arial, sans-serif; padding: 20px; }
            @media print { body { padding: 10px; } }
          </style>
        </head>
        <body>
          ${printContent.innerHTML}
        </body>
      </html>
    `)

		printWindow.document.close()
		printWindow.print()
		printWindow.close()
	}

	const emailReceipt = async (customerEmail?: string, customerName?: string): Promise<boolean> => {
		if (!customerEmail) {
			alert("ไม่มีข้อมูลลูกค้าสำหรับส่งอีเมล")
			return false
		}

		try {
			// In real app, this would call API to send email
			console.log("Sending receipt email to:", customerName || customerEmail)
			alert("ส่งใบเสร็จทางอีเมลเรียบร้อย")
			return true
		} catch (error) {
			console.error("Failed to send email:", error)
			alert("ไม่สามารถส่งอีเมลได้")
			return false
		}
	}

	return {
		formatDate,
		getPaymentMethodName,
		printReceipt,
		emailReceipt,
	}
}
