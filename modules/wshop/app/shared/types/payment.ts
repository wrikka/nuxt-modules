import { z } from "zod"

export const PaymentMethodSchema = z.object({
	id: z.string(),
	name: z.string(),
	type: z.enum(["cash", "card", "qr", "transfer"]),
	icon: z.string(),
	enabled: z.boolean(),
	config: z.object({
		provider: z.string().optional(),
		merchantId: z.string().optional(),
		apiKey: z.string().optional(),
	}).optional(),
})
export type PaymentMethod = z.infer<typeof PaymentMethodSchema>

export const PaymentTransactionSchema = z.object({
	id: z.string(),
	orderId: z.string(),
	amount: z.number(),
	method: PaymentMethodSchema.shape.type,
	status: z.enum(["pending", "completed", "failed", "refunded"]),
	reference: z.string().optional(),
	metadata: z.record(z.any()).optional(),
	createdAt: z.date(),
	updatedAt: z.date(),
})
export type PaymentTransaction = z.infer<typeof PaymentTransactionSchema>

export const QRCodePaymentSchema = z.object({
	id: z.string(),
	amount: z.number(),
	qrCode: z.string(),
	expiresAt: z.date(),
	status: z.enum(["generated", "scanned", "paid", "expired"]),
	provider: z.enum(["promptpay", "truewallet", "linepay"]),
})
export type QRCodePayment = z.infer<typeof QRCodePaymentSchema>

export const CardPaymentSchema = z.object({
	id: z.string(),
	amount: z.number(),
	cardNumber: z.string(),
	cardType: z.enum(["visa", "mastercard", "jcb"]),
	expiryMonth: z.string(),
	expiryYear: z.string(),
	cvv: z.string(),
	orderId: z.string(),
	approvalCode: z.string().optional(),
	status: z.enum(["processing", "approved", "declined"]),
})
export type CardPayment = z.infer<typeof CardPaymentSchema>

export const CashPaymentSchema = z.object({
	id: z.string(),
	amount: z.number(),
	cashReceived: z.number(),
	change: z.number(),
	status: z.enum(["paid", "partial"]),
})
export type CashPayment = z.infer<typeof CashPaymentSchema>
