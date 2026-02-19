import { z } from "zod";
import { cartService } from "~~/server/services/cart.service";
const applyDiscountSchema = z.object({
  code: z.string().min(1)
});
export default defineEventHandler(async (event) => {
  const { code } = await readBody(event).then((body) => applyDiscountSchema.parse(body));
  let anonymousId = getCookie(event, "anonymous-cart-id");
  const customerId = event.context.customer?.id || null;
  const cart = await cartService.findActiveCart(customerId, anonymousId);
  if (!cart) {
    throw createError({ statusCode: 404, statusMessage: "Cart not found" });
  }
  return cartService.applyDiscount(cart.id, code);
});
