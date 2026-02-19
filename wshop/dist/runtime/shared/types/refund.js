import { z } from "zod";
export const RefundItemSchema = z.object({
  id: z.string(),
  productId: z.string(),
  quantity: z.number(),
  unitPrice: z.number(),
  totalAmount: z.number(),
  restocked: z.boolean(),
  condition: z.enum(["good", "damaged", "used"])
});
export const RefundReasonSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string(),
  requiresApproval: z.boolean(),
  restockItem: z.boolean(),
  isActive: z.boolean()
});
export const RefundSchema = z.object({
  id: z.string(),
  orderId: z.string(),
  originalTransactionId: z.string(),
  items: z.array(RefundItemSchema),
  totalAmount: z.number(),
  reason: RefundReasonSchema,
  status: z.enum(["pending", "approved", "rejected", "processed"]),
  refundMethod: z.string(),
  processedBy: z.string(),
  approvedBy: z.string().optional(),
  notes: z.string().optional(),
  createdAt: z.date(),
  processedAt: z.date().optional()
});
export const RefundPolicySchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string(),
  timeLimit: z.number(),
  // days
  conditionRequired: z.boolean(),
  restockFee: z.number(),
  // percentage
  requiresReceipt: z.boolean(),
  autoApproval: z.boolean(),
  isActive: z.boolean()
});
