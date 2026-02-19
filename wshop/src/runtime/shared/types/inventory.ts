import { z } from "zod"

export const InventorySchema = z.object({
	id: z.string(),
	productId: z.string(),
	quantity: z.number().int().nonnegative(),
	reservedQuantity: z.number().int().nonnegative(),
	availableQuantity: z.number().int().nonnegative(),
	reorderLevel: z.number().int().nonnegative(),
	maxLevel: z.number().int().nonnegative(),
	location: z.string().optional(),
	lastUpdated: z.string(),
	updatedBy: z.number(),
})

export type Inventory = z.infer<typeof InventorySchema>

export const InventoryLogSchema = z.object({
	id: z.string(),
	productId: z.string(),
	variantId: z.string().optional(),
	change: z.number(),
	newQuantity: z.number(),
	reason: z.enum(["sale", "return", "adjustment", "transfer", "initial"]),
	source: z.string(), // e.g., 'POS', 'WebApp', 'Manual Adjustment'
	timestamp: z.date(),
})

export type InventoryLog = z.infer<typeof InventoryLogSchema>
