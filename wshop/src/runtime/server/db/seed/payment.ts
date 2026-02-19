import { db } from "~~/server/db"
import { paymentMethods } from "~~/server/db/schemas"

export async function seedPaymentMethods() {
	const methods = [
		{
			id: "cash",
			name: "เงินสด",
			type: "cash",
			icon: "dollar-sign",
			enabled: true,
		},
		{
			id: "card",
			name: "บัตรเครดิต/เดบิต",
			type: "card",
			icon: "credit-card",
			enabled: true,
			config: {
				provider: "stripe",
				merchantId: "merchant_123",
			},
		},
		{
			id: "promptpay",
			name: "PromptPay",
			type: "qr",
			icon: "smartphone",
			enabled: true,
			config: {
				provider: "promptpay",
				merchantId: "merchant_123",
			},
		},
		{
			id: "truewallet",
			name: "TrueMoney Wallet",
			type: "qr",
			icon: "smartphone",
			enabled: true,
			config: {
				provider: "truewallet",
				merchantId: "merchant_123",
			},
		},
		{
			id: "linepay",
			name: "LINE Pay",
			type: "qr",
			icon: "smartphone",
			enabled: true,
			config: {
				provider: "linepay",
				merchantId: "merchant_123",
			},
		},
		{
			id: "transfer",
			name: "โอนเงินผ่านธนาคาร",
			type: "transfer",
			icon: "wallet",
			enabled: true,
		},
	]

	for (const method of methods) {
		await db.insert(paymentMethods).values(method).onConflictDoNothing()
	}

	console.log("✓ Payment methods seeded successfully")
}
