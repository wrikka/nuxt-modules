import { z } from "zod";
export const SplitTypeSchema = z.enum([
  "equal",
  // แบ่งเท่าๆ กัน
  "by_item",
  // แบ่งตามรายการอาหาร
  "by_amount",
  // แบ่งตามจำนวนเงิน
  "by_percentage",
  // แบ่งตามเปอร์เซ็นต์
  "custom"
  // กำหนดเอง
]);
export const SplitPaymentSchema = z.object({
  id: z.string(),
  splitId: z.string(),
  amount: z.number(),
  method: z.string(),
  reference: z.string().optional(),
  status: z.enum(["pending", "completed", "failed"]),
  createdAt: z.date()
});
export const SplitItemSchema = z.object({
  id: z.string(),
  orderId: z.string(),
  productId: z.string(),
  productName: z.string(),
  quantity: z.number(),
  unitPrice: z.number(),
  totalPrice: z.number(),
  splitQuantity: z.number(),
  splitPrice: z.number()
});
export const BillSplitSchema = z.object({
  id: z.string(),
  splitBillId: z.string(),
  customerName: z.string().optional(),
  items: z.array(SplitItemSchema),
  subtotal: z.number(),
  tax: z.number(),
  serviceCharge: z.number(),
  discount: z.number(),
  total: z.number(),
  paidAmount: z.number(),
  status: z.enum(["unpaid", "partial", "paid"]),
  payments: z.array(SplitPaymentSchema)
});
export const SplitBillSchema = z.object({
  id: z.string(),
  orderId: z.string(),
  type: SplitTypeSchema,
  splits: z.array(BillSplitSchema),
  status: z.enum(["pending", "partial", "completed"]),
  totalAmount: z.number(),
  remainingAmount: z.number(),
  createdBy: z.string(),
  createdAt: z.date(),
  completedAt: z.date().optional()
});
export const SplitSettingsSchema = z.object({
  includeTax: z.boolean(),
  includeServiceCharge: z.boolean(),
  roundAmount: z.boolean(),
  minSplitAmount: z.number(),
  maxSplits: z.number()
});
export const SplitTemplateSchema = z.object({
  id: z.string(),
  name: z.string(),
  type: SplitTypeSchema,
  description: z.string(),
  isDefault: z.boolean(),
  settings: SplitSettingsSchema
});
