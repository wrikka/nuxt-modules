import { cartService } from "~~/server/services/cart.service";
export default defineEventHandler(async (event) => {
  const cartItemId = event.context.params?.id;
  return cartService.removeItem(cartItemId);
});
