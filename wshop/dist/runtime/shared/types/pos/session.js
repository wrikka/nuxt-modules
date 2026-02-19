import { z } from "zod";
import { CartItemSchema } from "../cart.js";
export const POSSessionSchema = z.object({
  id: z.number(),
  sessionId: z.string(),
  status: z.enum(["active", "completed", "voided"]),
  items: z.array(CartItemSchema),
  subtotal: z.number().nonnegative(),
  tax: z.number().nonnegative(),
  discount: z.number().nonnegative(),
  total: z.number().nonnegative(),
  paymentMethod: z.enum(["cash", "card", "mobile", "store_credit"]),
  paymentDetails: z.record(z.any()).optional(),
  customerId: z.number().nullable(),
  staffId: z.number(),
  registerId: z.number(),
  createdAt: z.string(),
  completedAt: z.string().nullable()
});
