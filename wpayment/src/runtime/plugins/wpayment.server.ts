import { defineNuxtPlugin } from '#app';
import Stripe from 'stripe';

export default defineNuxtPlugin({
  name: 'wpayment:server',
  dependsOn: [],
  setup() {
    const config = useRuntimeConfig();

    // Initialize Stripe on server-side
    let stripeInstance: Stripe | null = null;

    const getStripeInstance = (): Stripe => {
      if (!stripeInstance) {
        const secretKey = config.private?.wpaymentSecretKey || process.env.STRIPE_SECRET_KEY;

        if (!secretKey) {
          throw new Error(
            'Stripe secret key is not configured. Set STRIPE_SECRET_KEY environment variable or stripe.secretKey in module options.',
          );
        }

        stripeInstance = new Stripe(secretKey, {
          apiVersion: '2024-11-20.acacia',
          typescript: true,
        });
      }

      return stripeInstance;
    };

    // Provide Stripe instance to server-side
    provide('wpayment:server', getStripeInstance);

    // Log initialization
    console.log('[@wrikka/wpayment] Server-side Stripe initialized');
  },
});
