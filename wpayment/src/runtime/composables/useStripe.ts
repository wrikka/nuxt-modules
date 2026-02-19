import { loadStripe } from '@stripe/stripe-js';
import type { Stripe, StripeElements } from '@stripe/stripe-js';
import { computed, readonly, ref } from 'vue';
import type { PaymentResult, UseStripeReturn } from '#wpayment/types';

export function useStripe(): UseStripeReturn {
  const config = useRuntimeConfig();
  const stripe = ref<Stripe | null>(null);
  const elements = ref<StripeElements | null>(null);
  const loading = ref(false);
  const error = ref<string | null>(null);

  const publishableKey = computed(() => config.public.wpayment?.publishableKey);
  const apiVersion = computed(() => config.public.wpayment?.apiVersion);
  const locale = computed(() => config.public.wpayment?.locale);
  const elementsOptions = computed(() => config.public.wpayment?.elementsOptions);

  const validateConfig = (): boolean => {
    if (!publishableKey.value) {
      error.value = 'Stripe publishable key is not configured';
      return false;
    }
    return true;
  };

  const initialize = async (): Promise<void> => {
    if (!validateConfig()) {
      return;
    }

    loading.value = true;
    error.value = null;

    try {
      stripe.value = await loadStripe(publishableKey.value, {
        apiVersion: apiVersion.value,
        locale: locale.value,
      });
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to load Stripe';
    } finally {
      loading.value = false;
    }
  };

  const createElements = (options?: any) => {
    if (!stripe.value) {
      error.value = 'Stripe is not initialized';
      return;
    }

    elements.value = stripe.value.elements({
      ...elementsOptions.value,
      ...options,
    });
  };

  const confirmPayment = async (
    clientSecret: string,
    elementsInstance?: StripeElements,
    confirmParamsData?: any,
  ): Promise<PaymentResult> => {
    if (!stripe.value) {
      const error: StripeError = {
        type: 'invalid_request_error',
        message: 'Stripe is not initialized',
      };
      error.value = error.message;
      return { error };
    }

    const elementsToUse = elementsInstance || elements.value;
    if (!elementsToUse) {
      const errorMessage = 'Elements are not created';
      error.value = errorMessage;
      return { error: { type: 'invalid_request_error' as const, message: errorMessage } };
    }

    try {
      const result = await stripe.value.confirmPayment({
        elements: elementsToUse,
        clientSecret,
        confirmParams: {
          ...elementsOptions.value,
          ...confirmParamsData,
        },
      });

      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Payment confirmation failed';
      error.value = errorMessage;
      return { error: { type: 'api_error' as const, message: errorMessage } };
    }
  };

  const confirmCardPayment = async (
    clientSecret: string,
    paymentData?: any,
    confirmParamsData?: any,
  ): Promise<PaymentResult> => {
    if (!stripe.value) {
      const error: StripeError = {
        type: 'invalid_request_error',
        message: 'Stripe is not initialized',
      };
      error.value = error.message;
      return { error };
    }

    try {
      const result = await stripe.value.confirmCardPayment(clientSecret, {
        payment_method: paymentData,
        ...confirmParamsData,
      });

      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Card payment confirmation failed';
      error.value = errorMessage;
      return { error: { type: 'api_error' as const, message: errorMessage } };
    }
  };

  const retrievePaymentIntent = async (clientSecret: string): Promise<PaymentResult> => {
    if (!stripe.value) {
      const error: StripeError = {
        type: 'invalid_request_error',
        message: 'Stripe is not initialized',
      };
      error.value = error.message;
      return { error };
    }

    try {
      const result = await stripe.value.retrievePaymentIntent(clientSecret);
      return { paymentIntent: result.paymentIntent };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to retrieve payment intent';
      error.value = errorMessage;
      return { error: { type: 'api_error' as const, message: errorMessage } };
    }
  };

  return {
    stripe: readonly(stripe),
    elements: readonly(elements),
    loading: readonly(loading),
    error: readonly(error),
    initialize,
    createElements,
    confirmPayment,
    confirmCardPayment,
    retrievePaymentIntent,
  };
}
