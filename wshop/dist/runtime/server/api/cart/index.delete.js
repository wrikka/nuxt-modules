import { cartService } from "~~/server/services/cart.service";
export default defineEventHandler(async (event) => {
  const anonymousId = getCookie(event, "anonymous-cart-id");
  const customerId = event.context.customer?.id || null;
  if (!anonymousId && !customerId) {
    return { success: true, message: "Cart is already empty." };
  }
  try {
    const cart = await cartService.findActiveCart(customerId, anonymousId);
    if (!cart) {
      return { success: true, message: "Cart is already empty." };
    }
    return cartService.clearCart(cart.id);
  } catch (error) {
    if (error.statusCode === 404) {
      return { success: true, message: "Cart is already empty." };
    }
    throw error;
  }
});
