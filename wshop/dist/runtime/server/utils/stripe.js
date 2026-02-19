import Stripe from "stripe";
let stripeClient = null;
export const getStripeClient = () => {
  if (!stripeClient) {
    const config = useRuntimeConfig();
    if (!config.stripeSecretKey) {
      throw new Error("Stripe secret key is not configured.");
    }
    stripeClient = new Stripe(config.stripeSecretKey, {
      apiVersion: "2025-12-15.clover"
    });
  }
  return stripeClient;
};
