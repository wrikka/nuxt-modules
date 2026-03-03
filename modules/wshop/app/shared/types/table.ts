import { z } from "zod"

export const TablePositionSchema = z.object({
	x: z.number(),
	y: z.number(),
	width: z.number(),
	height: z.number(),
	rotation: z.number(),
})
export type TablePosition = z.infer<typeof TablePositionSchema>

export const TableFeatureSchema = z.object({
	id: z.string(),
	name: z.string(),
	icon: z.string(),
	description: z.string(),
})
export type TableFeature = z.infer<typeof TableFeatureSchema>

export const TableSchema = z.object({
	id: z.string(),
	number: z.string(),
	name: z.string().optional(),
	capacity: z.number(),
	section: z.string(),
	status: z.enum(["available", "occupied", "reserved", "cleaning", "maintenance"]),
	position: TablePositionSchema,
	shape: z.enum(["round", "square", "rectangle", "oval"]),
	features: z.array(TableFeatureSchema),
	qrCode: z.string().optional(),
	isActive: z.boolean(),
	createdAt: z.date(),
	updatedAt: z.date(),
})
export type Table = z.infer<typeof TableSchema>

export const TableReservationSchema = z.object({
	id: z.string(),
	tableId: z.string(),
	customerId: z.string(),
	customerName: z.string(),
	customerPhone: z.string(),
	partySize: z.number(),
	date: z.date(),
	duration: z.number(),
	status: z.enum(["pending", "confirmed", "seated", "completed", "cancelled", "no_show"]),
	specialRequests: z.string().optional(),
	depositAmount: z.number().optional(),
	notes: z.string().optional(),
	createdBy: z.string(),
	createdAt: z.date(),
	updatedAt: z.date(),
})
export type TableReservation = z.infer<typeof TableReservationSchema>

export const TableSessionSchema = z.object({
	id: z.string(),
	tableId: z.string(),
	orderId: z.string().optional(),
	customerId: z.string().optional(),
	customerName: z.string().optional(),
	partySize: z.number(),
	startTime: z.date(),
	endTime: z.date().optional(),
	status: z.enum(["active", "completed", "transferred"]),
	totalAmount: z.number().optional(),
	serverId: z.string(),
	notes: z.string().optional(),
})
export type TableSession = z.infer<typeof TableSessionSchema>

export const TableSectionSchema = z.object({
	id: z.string(),
	name: z.string(),
	description: z.string(),
	color: z.string(),
	order: z.number(),
	isActive: z.boolean(),
	tables: z.array(z.string()),
})
export type TableSection = z.infer<typeof TableSectionSchema>

export const TableLayoutSchema = z.object({
	id: z.string(),
	name: z.string(),
	sections: z.array(TableSectionSchema),
	tables: z.array(TableSchema),
	background: z.string(),
	scale: z.number(),
	isActive: z.boolean(),
	createdAt: z.date(),
	updatedAt: z.date(),
})
export type TableLayout = z.infer<typeof TableLayoutSchema>
