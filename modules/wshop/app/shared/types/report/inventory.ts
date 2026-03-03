import { z } from "zod"

export const LowStockItemSchema = z.object({
	productId: z.number(),
	productName: z.string(),
	currentStock: z.number(),
	minStock: z.number(),
	reorderPoint: z.number(),
	lastRestocked: z.string(),
})
export type LowStockItem = z.infer<typeof LowStockItemSchema>

export const StockMovementSchema = z.object({
	id: z.string(),
	productId: z.number(),
	productName: z.string(),
	type: z.enum(["in", "out", "adjustment"]),
	quantity: z.number(),
	reason: z.string(),
	timestamp: z.string(),
	userId: z.string(),
})
export type StockMovement = z.infer<typeof StockMovementSchema>

export const InventoryReportSchema = z.object({
	totalProducts: z.number(),
	totalValue: z.number(),
	lowStockItems: z.array(LowStockItemSchema),
	recentMovements: z.array(StockMovementSchema),
	categories: z.array(z.object({
		name: z.string(),
		productCount: z.number(),
		totalValue: z.number(),
	})),
})
export type InventoryReport = z.infer<typeof InventoryReportSchema>
