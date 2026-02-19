import { z } from "zod"

export const StationDisplaySettingsSchema = z.object({
	showPreparationTime: z.boolean(),
	showModifications: z.boolean(),
	showCustomerName: z.boolean(),
	autoRefresh: z.boolean(),
	refreshInterval: z.number(),
	colorScheme: z.enum(["light", "dark"]),
})
export type StationDisplaySettings = z.infer<typeof StationDisplaySettingsSchema>

export const KitchenStationSchema = z.object({
	id: z.string(),
	name: z.string(),
	description: z.string(),
	isActive: z.boolean(),
	order: z.number(),
	displaySettings: StationDisplaySettingsSchema,
})
export type KitchenStation = z.infer<typeof KitchenStationSchema>

export const KitchenOrderItemSchema = z.object({
	id: z.string(),
	productId: z.string(),
	name: z.string(),
	quantity: z.number(),
	modifications: z.array(z.string()),
	status: z.enum(["pending", "preparing", "ready", "cancelled"]),
	station: KitchenStationSchema.optional(),
	estimatedTime: z.number(),
	actualTime: z.number().optional(),
	notes: z.string().optional(),
})
export type KitchenOrderItem = z.infer<typeof KitchenOrderItemSchema>

export const KitchenOrderSchema = z.object({
	id: z.string(),
	orderId: z.string(),
	tableId: z.string().optional(),
	items: z.array(KitchenOrderItemSchema),
	status: z.enum(["pending", "preparing", "ready", "served", "cancelled"]),
	priority: z.enum(["low", "normal", "high", "urgent"]),
	estimatedTime: z.number(),
	actualTime: z.number().optional(),
	notes: z.string().optional(),
	createdBy: z.string(),
	assignedTo: z.string().optional(),
	createdAt: z.date(),
	startedAt: z.date().optional(),
	completedAt: z.date().optional(),
})
export type KitchenOrder = z.infer<typeof KitchenOrderSchema>

export const KitchenDisplaySettingsSchema = z.object({
	autoAcceptOrders: z.boolean(),
	soundEnabled: z.boolean(),
	soundVolume: z.number(),
	showCompletedOrders: z.boolean(),
	completedOrdersDuration: z.number(),
	fontSize: z.enum(["small", "medium", "large"]),
	layout: z.enum(["list", "grid", "card"]),
})
export type KitchenDisplaySettings = z.infer<typeof KitchenDisplaySettingsSchema>

export const KitchenDisplaySchema = z.object({
	id: z.string(),
	stationId: z.string(),
	ipAddress: z.string(),
	isActive: z.boolean(),
	lastHeartbeat: z.date().optional(),
	settings: KitchenDisplaySettingsSchema,
})
export type KitchenDisplay = z.infer<typeof KitchenDisplaySchema>
