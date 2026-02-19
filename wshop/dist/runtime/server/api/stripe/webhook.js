import Stripe from "stripe";
import { db } from "~~/server/db";
import { OrderService } from "~~/server/lib/orderService";
export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig();
  const signature = getHeader(event, "stripe-signature");
  const body = await readRawBody(event);
  if (!signature) {
    throw createError({ statusCode: 400, statusMessage: "Stripe signature is missing." });
  }
  if (!body) {
    throw createError({ statusCode: 400, statusMessage: "Request body is missing." });
  }
  if (!config.stripeSecretKey || !config.stripeWebhookSecret) {
    throw createError({ statusCode: 500, statusMessage: "Stripe keys are not configured." });
  }
  const stripe = new Stripe(config.stripeSecretKey, { apiVersion: "2025-12-15.clover" });
  let stripeEvent;
  try {
    stripeEvent = stripe.webhooks.constructEvent(
      body,
      signature,
      config.stripeWebhookSecret
    );
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : "An unknown error occurred";
    console.error(`Webhook signature verification failed.`, errorMessage);
    throw createError({ statusCode: 400, statusMessage: `Webhook Error: ${errorMessage}` });
  }
  switch (stripeEvent.type) {
    case "payment_intent.succeeded":
      const paymentIntent = stripeEvent.data.object;
      console.log(`PaymentIntent for ${paymentIntent.amount} was successful!`);
      const cartId = paymentIntent.metadata.cartId;
      if (!cartId) {
        console.error("Webhook received payment_intent.succeeded without a cartId in metadata.");
        break;
      }
      try {
        const orderService = new OrderService(db);
        await orderService.createOrderFromCart(cartId, paymentIntent.id, paymentIntent.amount);
        console.log(`Order created successfully for cartId: ${cartId}`);
      } catch (orderError) {
        const errorMessage = orderError instanceof Error ? orderError.message : "An unknown error occurred";
        console.error(`Failed to create order for cartId: ${cartId}`, errorMessage);
      }
      break;
    // ... handle other event types
    default:
      console.log(`Unhandled event type ${stripeEvent.type}`);
  }
  return { received: true };
});
