import { z } from "zod";
export const ReturnRequestSchema = z.object({
  id: z.number(),
  orderId: z.number(),
  customerId: z.number(),
  items: z.array(z.object({
    productId: z.number(),
    quantity: z.number().int().positive(),
    reason: z.string(),
    condition: z.string()
  })),
  reason: z.string(),
  status: z.enum(["pending", "approved", "rejected", "processing", "completed"]),
  refundType: z.enum(["refund", "exchange", "store_credit"]),
  refundAmount: z.number().nonnegative(),
  notes: z.string().optional(),
  trackingNumber: z.string().optional(),
  createdAt: z.string(),
  updatedAt: z.string()
});
export const ReturnItemSchema = z.object({
  id: z.number(),
  returnId: z.number(),
  productId: z.number(),
  quantity: z.number(),
  reason: z.string(),
  condition: z.string(),
  approvedQuantity: z.number(),
  refundAmount: z.number()
});
