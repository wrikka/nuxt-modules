import { z } from "zod";
import { AddressSchema } from "./address.js";
import { CustomerSchema } from "./customer.js";
import { ProductSchema } from "./product.js";
export const OrderItemSchema = z.object({
  product: ProductSchema.pick({ id: true, name: true, images: true }),
  quantity: z.number(),
  price: z.number()
});
export const OrderSchema = z.object({
  id: z.string(),
  customer: CustomerSchema,
  items: z.array(OrderItemSchema),
  status: z.enum(["Pending", "Processing", "Shipped", "Delivered", "Cancelled"]),
  total: z.number(),
  orderDate: z.string(),
  paymentIntentId: z.string().optional(),
  subtotal: z.number(),
  shippingCost: z.number(),
  taxAmount: z.number(),
  paymentStatus: z.enum(["Pending", "Paid", "Failed", "Refunded"]),
  shippingAddress: AddressSchema
});
