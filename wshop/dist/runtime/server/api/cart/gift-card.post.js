import { z } from "zod";
import { cartService } from "~~/server/services/cart.service";
const applyGiftCardSchema = z.object({
  code: z.string().min(1)
});
export default defineEventHandler(async (event) => {
  const { code } = await readBody(event).then((body) => applyGiftCardSchema.parse(body));
  let anonymousId = getCookie(event, "anonymous-cart-id");
  const customerId = event.context.customer?.id || null;
  const cart = await cartService.findActiveCart(customerId, anonymousId);
  if (!cart) {
    throw createError({ statusCode: 404, statusMessage: "Cart not found" });
  }
  return cartService.applyGiftCard(cart.id, code);
});
