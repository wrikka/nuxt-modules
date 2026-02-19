import { z } from "zod";
import { CustomerSchema } from "./customer.js";
import { DiscountSchema } from "./discount.js";
import { ProductSchema, ProductVariantSchema } from "./product.js";
export const CartItemSchema = z.object({
  id: z.string(),
  cartId: z.string(),
  productId: z.string(),
  variantId: z.string(),
  quantity: z.number(),
  price: z.string(),
  // Price at the time of adding
  product: ProductSchema.pick({ name: true, images: true }).optional(),
  variant: ProductVariantSchema.pick({ options: true }).optional()
});
export const GiftCardSchema = z.object({
  id: z.string(),
  code: z.string(),
  currentBalance: z.string()
});
export const CartSchema = z.object({
  id: z.string(),
  status: z.enum(["active", "abandoned", "converted"]),
  subtotal: z.string(),
  discountAmount: z.string(),
  giftCardAmountApplied: z.string(),
  itemCount: z.number(),
  createdAt: z.string(),
  // Dates are serialized as strings
  updatedAt: z.string(),
  items: z.array(CartItemSchema),
  discount: DiscountSchema.nullable(),
  giftCard: GiftCardSchema.nullable(),
  customer: CustomerSchema.nullable()
});
