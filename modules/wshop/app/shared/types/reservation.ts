import { z } from "zod"

export const ReservationSchema = z.object({
	id: z.string(),
	customerId: z.string(),
	productId: z.string(),
	quantity: z.number(),
	reservedPrice: z.number(),
	depositAmount: z.number(),
	status: z.enum(["pending", "confirmed", "fulfilled", "cancelled", "expired"]),
	reserveDate: z.date(),
	expiryDate: z.date(),
	fulfillmentDate: z.date().optional(),
	notes: z.string().optional(),
	createdBy: z.string(),
	createdAt: z.date(),
	updatedAt: z.date(),
})
export type Reservation = z.infer<typeof ReservationSchema>

export const ReservationSettingsSchema = z.object({
	enabled: z.boolean(),
	defaultExpiryHours: z.number(),
	requireDeposit: z.boolean(),
	depositPercentage: z.number(),
	maxReservationsPerCustomer: z.number(),
	allowPartialFulfillment: z.boolean(),
})
export type ReservationSettings = z.infer<typeof ReservationSettingsSchema>

export const ReservationNotificationSchema = z.object({
	id: z.string(),
	reservationId: z.string(),
	type: z.enum(["reminder", "expiry", "fulfillment", "cancellation"]),
	message: z.string(),
	sentAt: z.date(),
	method: z.enum(["email", "sms", "push"]),
	status: z.enum(["pending", "sent", "failed"]),
})
export type ReservationNotification = z.infer<typeof ReservationNotificationSchema>
