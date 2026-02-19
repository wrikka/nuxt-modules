import type { POSSession } from "#shared/types"
import jsPDF from "jspdf"
import { RECEIPT_CONFIG, STORE_INFO } from "~/constants/store"
import { generateReceiptData } from "~/utils/receipt"

export class ReceiptPDFGenerator {
	private pdf: jsPDF
	private yPosition: number = 50

	constructor() {
		this.pdf = new jsPDF({
			orientation: "portrait",
			unit: "mm",
			format: [RECEIPT_CONFIG.width, RECEIPT_CONFIG.height],
		})
		this.pdf.setFont(RECEIPT_CONFIG.font)
	}

	private addHeader() {
		this.pdf.setFontSize(16)
		this.pdf.text(STORE_INFO.name, 40, 20, { align: "center" })

		this.pdf.setFontSize(10)
		this.pdf.text(STORE_INFO.address, 40, 28, { align: "center" })
		this.pdf.text(STORE_INFO.city, 40, 33, { align: "center" })
		this.pdf.text(`โทร: ${STORE_INFO.phone}`, 40, 36, { align: "center" })
	}

	private addReceiptDetails(receipt: any) {
		this.pdf.setFontSize(9)
		this.pdf.text(`เลขที่: ${receipt.receiptNumber}`, 10, this.yPosition)
		this.yPosition += 5
		this.pdf.text(`วันที่: ${new Date(receipt.createdAt).toLocaleString("th-TH")}`, 10, this.yPosition)
		this.yPosition += 5
		this.pdf.text(`พนักงาน: ${receipt.staff.name}`, 10, this.yPosition)
		this.yPosition += 5
		if (receipt.customer && receipt.customer.name !== "ลูกค้าทั่วไป") {
			this.pdf.text(`ลูกค้า: ${receipt.customer.name}`, 10, this.yPosition)
			this.yPosition += 5
		}
	}

	private addItems(items: any[]) {
		this.yPosition += 10

		// Table headers
		this.pdf.text("รายการ", 10, this.yPosition)
		this.pdf.text("จำนวน", 60, this.yPosition)
		this.pdf.text("ราคา", 80, this.yPosition)
		this.pdf.text("รวม", 100, this.yPosition)
		this.yPosition += 5

		// Items
		items.forEach(item => {
			const name = item.name.length > 25 ? item.name.substring(0, 25) + "..." : item.name
			this.pdf.text(name, 10, this.yPosition)
			this.pdf.text(item.quantity.toString(), 60, this.yPosition)
			this.pdf.text(item.price.toFixed(2), 80, this.yPosition)
			this.pdf.text(item.subtotal.toFixed(2), 100, this.yPosition)
			this.yPosition += 5
		})
	}

	private addTotals(totals: any) {
		this.yPosition += 10

		this.pdf.text("ยอดรวม:", 80, this.yPosition)
		this.pdf.text(totals.subtotal.toFixed(2), 100, this.yPosition)
		this.yPosition += 5

		if (totals.discount > 0) {
			this.pdf.text("ส่วนลด:", 80, this.yPosition)
			this.pdf.text(`-${totals.discount.toFixed(2)}`, 100, this.yPosition)
			this.yPosition += 5
		}

		this.pdf.text("ภาษี 7%:", 80, this.yPosition)
		this.pdf.text(totals.tax.toFixed(2), 100, this.yPosition)
		this.yPosition += 5

		this.pdf.setFontSize(12)
		this.pdf.text("รวมทั้งหมด:", 70, this.yPosition)
		this.pdf.text(totals.total.toFixed(2), 100, this.yPosition)
	}

	private addFooter() {
		this.yPosition += 15
		this.pdf.setFontSize(9)
		this.pdf.text("ขอบคุณที่ใช้บริการ", 40, this.yPosition, { align: "center" })
		this.yPosition += 5
		this.pdf.text("สินค้าที่ซื้อแล้วไม่สามารถคืนได้", 40, this.yPosition, { align: "center" })
	}

	generate(session: POSSession) {
		const receipt = generateReceiptData(session)

		this.addHeader()
		this.addReceiptDetails(receipt)
		this.addItems(receipt.items)
		this.addTotals(receipt.totals)
		this.addFooter()

		return this.pdf
	}
}
