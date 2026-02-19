import { z } from "zod"

export const TimeSeriesDataSchema = z.object({
	date: z.string(),
	value: z.number(),
})
export type TimeSeriesData = z.infer<typeof TimeSeriesDataSchema>

export const TopProductDataSchema = z.object({
	productId: z.string(),
	name: z.string(),
	sales: z.number(),
})
export type TopProductData = z.infer<typeof TopProductDataSchema>

export const ConversionFunnelDataSchema = z.object({
	step: z.string(),
	count: z.number(),
})
export type ConversionFunnelData = z.infer<typeof ConversionFunnelDataSchema>
