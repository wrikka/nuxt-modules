import { z } from "zod";
import { cartService } from "~~/server/services/cart.service";
import { AddressSchema } from "~~/shared/types";
import { stripePaymentProvider } from "../../utils/payments/stripe.js";
const createPaymentIntentSchema = z.object({
  cartId: z.string(),
  shippingAddress: AddressSchema.optional(),
  customer: z.object({
    name: z.string().optional(),
    email: z.string().email().optional()
  }).optional()
});
export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  const validation = createPaymentIntentSchema.safeParse(body);
  if (!validation.success) {
    throw createError({ statusCode: 400, statusMessage: "Invalid request body" });
  }
  const { cartId, customer } = validation.data;
  const cart = await cartService.recalculateAndUpdateCart(cartId);
  if (!cart) {
    throw createError({ statusCode: 404, statusMessage: "Cart not found" });
  }
  const subtotal = Number(cart.subtotal);
  const discount = Number(cart.discountAmount);
  const giftCard = Number(cart.giftCardAmountApplied);
  const total = subtotal - discount - giftCard;
  if (total <= 0) {
    throw createError({
      statusCode: 400,
      statusMessage: "Cannot process payment for a zero or negative amount."
    });
  }
  const amountInCents = Math.round(total * 100);
  try {
    const metadata = {
      cartId: cart.id,
      customerName: customer?.name,
      customerEmail: customer?.email
    };
    const paymentIntent = await stripePaymentProvider.createPaymentIntent(
      amountInCents,
      "thb",
      metadata
    );
    return {
      clientSecret: paymentIntent.clientSecret
    };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "An unknown error occurred";
    console.error("Stripe Error:", errorMessage);
    throw createError({
      statusCode: 500,
      statusMessage: `Failed to create Payment Intent: ${errorMessage}`
    });
  }
});
