// d:/wshop/app/utils/receipt.ts

import type { CartItem, POSSession, Receipt, ReceiptItem } from "~~/shared/types"

export const generateReceiptData = (session: POSSession): Receipt => {
	const receiptNumber = `RCP-${Date.now()}`
	const receiptItems: ReceiptItem[] = session.items.map((item: CartItem) => {
		const price = Number(item.price)
		const subtotal = price * item.quantity
		const tax = subtotal * 0.07 // 7% tax
		return {
			productId: item.productId,
			productName: item.product?.name || "Unknown Product",
			quantity: item.quantity,
			unitPrice: price,
			discount: 0, // Placeholder for item-level discount
			subtotal: Number(item.price) * item.quantity,
			tax: tax,
			total: subtotal + tax,
		}
	})

	return {
		id: session.id,
		sessionId: session.sessionId,
		receiptNumber,
		type: "sale" as const,
		items: receiptItems,
		payments: [{
			method: session.paymentMethod,
			amount: session.total,
			reference: session.paymentDetails?.reference,
			cardType: session.paymentDetails?.cardType,
			last4: session.paymentDetails?.last4,
		}],
		totals: {
			subtotal: session.subtotal,
			tax: session.tax,
			discount: 0, // Placeholder for item-level discount
			total: session.total,
			paid: session.paymentDetails?.cashReceived || session.total,
			change: session.paymentDetails?.change || 0,
		},
		customer: {
			id: String(session.customerId) || "",
			name: session.customerId ? "ลูกค้า" : "ลูกค้าทั่วไป",
			email: "",
			phone: "",
		},
		staff: {
			id: session.staffId,
			name: "พนักงาน",
			role: "staff",
		},
		createdAt: session.createdAt,
	}
}

export const getPaymentMethodName = (method: string): string => {
	const methods: Record<string, string> = {
		cash: "เงินสด",
		card: "บัตรเครดิต",
		mobile: "Mobile Banking",
		store_credit: "เครดิตร้าน",
	}
	return methods[method] || method
}
