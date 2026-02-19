import { z } from "zod";
export const PromotionSchema = z.object({
  id: z.number(),
  name: z.string().min(1, "Promotion name is required"),
  description: z.string().optional(),
  code: z.string().optional(),
  type: z.enum(["percentage", "fixed", "buy_x_get_y", "free_shipping", "bundle"]),
  value: z.number().optional(),
  discountValue: z.number(),
  startDate: z.string(),
  endDate: z.string(),
  status: z.enum(["active", "scheduled", "inactive"]),
  maxUsage: z.number().nullable(),
  usageLimit: z.number().nullable(),
  maxUsagePerCustomer: z.number().nullable(),
  usageCount: z.number(),
  minimumAmount: z.number().nullable(),
  conditions: z.object({
    minPurchase: z.number().nullable(),
    minQuantity: z.number().nullable(),
    customerTypes: z.array(z.string()),
    productCategories: z.array(z.string())
  }).optional(),
  createdAt: z.string(),
  updatedAt: z.string()
});
export const AppliedDiscountSchema = z.object({
  id: z.number(),
  orderId: z.number(),
  promotionId: z.number(),
  amount: z.number(),
  type: z.enum(["percentage", "fixed"]),
  description: z.string()
});
