import { z } from "zod";
import { cartService } from "~~/server/services/cart.service";
const addItemSchema = z.object({
  productId: z.string(),
  variantId: z.string(),
  quantity: z.number().int().positive(),
  price: z.string()
});
export default defineEventHandler(async (event) => {
  const { productId, variantId, quantity, price } = await readBody(event).then(
    (body) => addItemSchema.parse(body)
  );
  let anonymousId = getCookie(event, "anonymous-cart-id") || crypto.randomUUID();
  setCookie(event, "anonymous-cart-id", anonymousId, { httpOnly: true, maxAge: 60 * 60 * 24 * 30 });
  const customerId = event.context.customer?.id || null;
  const cart = await cartService.getOrCreateCart(customerId, anonymousId);
  if (!cart || !cart.id) {
    throw createError({ statusCode: 500, statusMessage: "Could not get or create cart." });
  }
  return cartService.addItem(cart.id, productId, variantId, quantity, price);
});
