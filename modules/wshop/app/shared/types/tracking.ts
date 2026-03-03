import { z } from "zod"

export const TrackingSchema = z.object({
	id: z.number(),
	orderId: z.number(),
	trackingNumber: z.string().min(1, "Tracking number is required"),
	carrier: z.string().min(1, "Carrier is required"),
	status: z.enum([
		"pending",
		"picked_up",
		"in_transit",
		"out_for_delivery",
		"delivered",
		"failed",
		"returned",
	]),
	estimatedDelivery: z.string().optional(),
	actualDelivery: z.string().nullable(),
	weight: z.number().nonnegative(),
	dimensions: z.object({
		length: z.number(),
		width: z.number(),
		height: z.number(),
	}).optional(),
	createdAt: z.string(),
	updatedAt: z.string(),
})

export type Tracking = z.infer<typeof TrackingSchema>

export const TrackingEventSchema = z.object({
	id: z.number(),
	trackingId: z.number(),
	status: z.string(),
	location: z.string(),
	description: z.string(),
	timestamp: z.string(),
})

export type TrackingEvent = z.infer<typeof TrackingEventSchema>

export const CarrierSchema = z.object({
	id: z.number(),
	name: z.string(),
	code: z.string(),
	trackingUrl: z.string(),
	isActive: z.boolean(),
	apiKey: z.string(),
})
export type Carrier = z.infer<typeof CarrierSchema>
