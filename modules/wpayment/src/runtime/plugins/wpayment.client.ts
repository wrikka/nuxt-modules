import { defineNuxtPlugin } from '#app';

export default defineNuxtPlugin({
  name: 'wpayment:client',
  dependsOn: [],
  async setup() {
    const config = useRuntimeConfig();

    // Validate Stripe configuration
    if (!config.public.wpayment?.publishableKey) {
      console.warn('[@wrikka/wpayment] Stripe publishable key is not configured');
      return;
    }

    // Provide global Stripe state
    const stripeState = reactive({
      initialized: false,
      loading: false,
      error: null as string | null,
    });

    // Provide to app
    provide('wpayment:state', stripeState);
    provide('wpayment:config', config.public.wpayment);

    // Auto-initialize if needed
    if (process.client) {
      try {
        const { loadStripe } = await import('@stripe/stripe-js');
        stripeState.loading = true;

        const stripe = await loadStripe(config.public.wpayment.publishableKey, {
          apiVersion: config.public.wpayment.apiVersion,
          locale: config.public.wpayment.locale,
        });

        if (stripe) {
          stripeState.initialized = true;
          provide('wpayment:instance', stripe);
        }
      } catch (error) {
        stripeState.error = error instanceof Error ? error.message : 'Failed to initialize Stripe';
        console.error('[@wrikka/wpayment] Failed to initialize Stripe:', error);
      } finally {
        stripeState.loading = false;
      }
    }
  },
});
