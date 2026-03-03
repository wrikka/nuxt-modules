import { z } from "zod"
import { AddressSchema } from "./address"

export const DayHoursSchema = z.object({
	isOpen: z.boolean(),
	openTime: z.string().optional(),
	closeTime: z.string().optional(),
	breakStart: z.string().optional(),
	breakEnd: z.string().optional(),
})
export type DayHours = z.infer<typeof DayHoursSchema>

export const OperatingHoursSchema = z.object({
	monday: DayHoursSchema,
	tuesday: DayHoursSchema,
	wednesday: DayHoursSchema,
	thursday: DayHoursSchema,
	friday: DayHoursSchema,
	saturday: DayHoursSchema,
	sunday: DayHoursSchema,
})
export type OperatingHours = z.infer<typeof OperatingHoursSchema>

export const StoreSettingsSchema = z.object({
	allowOnlineOrders: z.boolean(),
	allowInStorePickup: z.boolean(),
	allowDelivery: z.boolean(),
	deliveryRadius: z.number(),
	minimumOrderAmount: z.number(),
	taxIncluded: z.boolean(),
	currencySymbol: z.string(),
	dateFormat: z.string(),
	timeFormat: z.enum(["12h", "24h"]),
})
export type StoreSettings = z.infer<typeof StoreSettingsSchema>

export const StoreSchema = z.object({
	id: z.string(),
	name: z.string(),
	url: z.string(),
	currency: z.string(),
	address: AddressSchema,
	phone: z.string(),
	email: z.string(),
	managerId: z.string(),
	isActive: z.boolean(),
	timezone: z.string(),
	taxRate: z.number(),
	operatingHours: OperatingHoursSchema,
	settings: StoreSettingsSchema,
	createdAt: z.string(),
	updatedAt: z.string(),
})
export type Store = z.infer<typeof StoreSchema>

export const TransferItemSchema = z.object({
	productId: z.string(),
	quantity: z.number(),
	unitCost: z.number(),
	totalCost: z.number(),
	condition: z.enum(["new", "good", "damaged"]),
})
export type TransferItem = z.infer<typeof TransferItemSchema>

export const StoreTransferSchema = z.object({
	id: z.string(),
	fromStoreId: z.string(),
	toStoreId: z.string(),
	items: z.array(TransferItemSchema),
	status: z.enum(["pending", "approved", "transit", "received", "cancelled"]),
	requestedBy: z.string(),
	approvedBy: z.string().optional(),
	receivedBy: z.string().optional(),
	notes: z.string().optional(),
	createdAt: z.date(),
	approvedAt: z.date().optional(),
	receivedAt: z.date().optional(),
})
export type StoreTransfer = z.infer<typeof StoreTransferSchema>
