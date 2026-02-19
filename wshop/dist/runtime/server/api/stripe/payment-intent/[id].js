import Stripe from "stripe";
export default defineEventHandler(async (event) => {
  const paymentIntentId = event.context.params?.id;
  const config = useRuntimeConfig();
  if (!paymentIntentId || typeof paymentIntentId !== "string") {
    throw createError({ statusCode: 400, statusMessage: "Payment Intent ID is required." });
  }
  if (!config.stripeSecretKey) {
    throw createError({ statusCode: 500, statusMessage: "Stripe secret key is not configured." });
  }
  const stripe = new Stripe(config.stripeSecretKey, { apiVersion: "2025-12-15.clover" });
  try {
    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);
    if (!paymentIntent) {
      throw createError({ statusCode: 404, statusMessage: "Payment Intent not found." });
    }
    return {
      id: paymentIntent.id,
      amount: paymentIntent.amount,
      currency: paymentIntent.currency,
      status: paymentIntent.status
    };
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : "An unknown error occurred";
    console.error(`Failed to retrieve Payment Intent ${paymentIntentId}:`, errorMessage);
    throw createError({ statusCode: 500, statusMessage: `Stripe API Error: ${errorMessage}` });
  }
});
