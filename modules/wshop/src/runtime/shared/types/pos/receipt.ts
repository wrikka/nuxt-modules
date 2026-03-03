import { z } from "zod"

export const ReceiptItemSchema = z.object({
	productId: z.string(),
	productName: z.string(),
	quantity: z.number(),
	unitPrice: z.number(),
	discount: z.number(),
	total: z.number(),
})

export type ReceiptItem = z.infer<typeof ReceiptItemSchema>

export const ReceiptSchema = z.object({
	id: z.string(),
	sessionId: z.string(),
	items: z.array(ReceiptItemSchema),
	subtotal: z.number(),
	tax: z.number(),
	discount: z.number(),
	total: z.number(),
	paymentMethod: z.string(),
	paymentDetails: z.record(z.any()).optional(),
	customerInfo: z.object({
		name: z.string().optional(),
		email: z.string().optional(),
		phone: z.string().optional(),
	}).optional(),
	staffInfo: z.object({
		name: z.string(),
		role: z.string(),
	}),
	registerInfo: z.object({
		name: z.string(),
		location: z.string(),
	}),
	issuedAt: z.string(),
})

export type Receipt = z.infer<typeof ReceiptSchema>
