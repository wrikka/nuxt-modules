import { z } from "zod";
export const DiscountSchema = z.object({
  id: z.string(),
  code: z.string(),
  description: z.string().nullable(),
  type: z.enum(["percentage", "fixed_amount"]),
  value: z.string(),
  usageLimit: z.number().nullable(),
  usageCount: z.number(),
  isActive: z.boolean(),
  createdAt: z.string(),
  updatedAt: z.string()
});
