import { z } from "zod";
export const StockAlertSchema = z.object({
  id: z.string(),
  productId: z.string(),
  productName: z.string(),
  currentStock: z.number(),
  minStock: z.number(),
  maxStock: z.number(),
  alertType: z.enum(["low_stock", "out_of_stock", "overstock"]),
  severity: z.enum(["low", "medium", "high", "critical"]),
  message: z.string(),
  isRead: z.boolean(),
  createdAt: z.date()
});
export const StockMovementSchema = z.object({
  id: z.string(),
  variantId: z.string().optional(),
  productId: z.string(),
  type: z.enum(["in", "out", "adjust", "transfer"]),
  quantity: z.number(),
  reason: z.string(),
  reference: z.string().optional(),
  userId: z.string(),
  createdAt: z.date()
});
export const StockTransferSchema = z.object({
  id: z.string(),
  productId: z.string(),
  fromStoreId: z.string(),
  toStoreId: z.string(),
  quantity: z.number(),
  status: z.enum(["pending", "approved", "transit", "completed", "cancelled"]),
  requestedBy: z.string(),
  approvedBy: z.string().optional(),
  createdAt: z.date(),
  completedAt: z.date().optional()
});
export const StockAdjustmentSchema = z.object({
  id: z.string(),
  productId: z.string(),
  previousStock: z.number(),
  newStock: z.number(),
  adjustment: z.number(),
  reason: z.enum(["damage", "lost", "found", "count", "other"]),
  description: z.string(),
  userId: z.string(),
  approvedBy: z.string().optional(),
  createdAt: z.date()
});
export const StockCountSchema = z.object({
  id: z.string(),
  productId: z.string(),
  systemStock: z.number(),
  countedStock: z.number(),
  variance: z.number(),
  status: z.enum(["pending", "completed", "approved"]),
  countedBy: z.string(),
  approvedBy: z.string().optional(),
  countedAt: z.date(),
  approvedAt: z.date().optional()
});
