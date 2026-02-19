import { z } from "zod";
import { cartService } from "~~/server/services/cart.service";
const updateItemSchema = z.object({
  quantity: z.number().int().min(0)
});
export default defineEventHandler(async (event) => {
  const cartItemId = event.context.params?.id;
  const { quantity } = await readBody(event).then((body) => updateItemSchema.parse(body));
  return cartService.updateItem(cartItemId, quantity);
});
