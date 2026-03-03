import { readonly, ref } from 'vue';
import type {
  AttachPaymentMethodParams,
  CreatePaymentMethodParams,
  Customer,
  DetachPaymentMethodParams,
  PaymentMethodDetails,
  UpdatePaymentMethodParams,
  UsePaymentMethodReturn,
} from '#wpayment/types';

export function usePaymentMethod(): UsePaymentMethodReturn {
  const paymentMethod = ref<PaymentMethodDetails | null>(null);
  const loading = ref(false);
  const error = ref<string | null>(null);

  const create = async (params: CreatePaymentMethodParams): Promise<PaymentMethodDetails> => {
    loading.value = true;
    error.value = null;

    try {
      const result = await $fetch<PaymentMethodDetails>('/api/stripe/payment-method', {
        method: 'POST',
        body: params,
      });

      paymentMethod.value = result;
      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to create payment method';
      error.value = errorMessage;
      throw new Error(errorMessage);
    } finally {
      loading.value = false;
    }
  };

  const retrieve = async (paymentMethodId: string): Promise<PaymentMethodDetails> => {
    loading.value = true;
    error.value = null;

    try {
      const result = await $fetch<PaymentMethodDetails>(
        `/api/stripe/payment-method/${paymentMethodId}`,
      );
      paymentMethod.value = result;
      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to retrieve payment method';
      error.value = errorMessage;
      throw new Error(errorMessage);
    } finally {
      loading.value = false;
    }
  };

  const update = async (params: UpdatePaymentMethodParams): Promise<PaymentMethodDetails> => {
    loading.value = true;
    error.value = null;

    try {
      const result = await $fetch<PaymentMethodDetails>(
        `/api/stripe/payment-method/${params.paymentMethodId}`,
        {
          method: 'PATCH',
          body: params,
        },
      );

      paymentMethod.value = result;
      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update payment method';
      error.value = errorMessage;
      throw new Error(errorMessage);
    } finally {
      loading.value = false;
    }
  };

  const attach = async (params: AttachPaymentMethodParams): Promise<PaymentMethodDetails> => {
    loading.value = true;
    error.value = null;

    try {
      const result = await $fetch<PaymentMethodDetails>(
        `/api/stripe/payment-method/${params.paymentMethodId}/attach`,
        {
          method: 'POST',
          body: { customer: params.customerId },
        },
      );

      paymentMethod.value = result;
      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to attach payment method';
      error.value = errorMessage;
      throw new Error(errorMessage);
    } finally {
      loading.value = false;
    }
  };

  const detach = async (params: DetachPaymentMethodParams): Promise<PaymentMethodDetails> => {
    loading.value = true;
    error.value = null;

    try {
      const result = await $fetch<PaymentMethodDetails>(
        `/api/stripe/payment-method/${params.paymentMethodId}/detach`,
        {
          method: 'POST',
        },
      );

      paymentMethod.value = result;
      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to detach payment method';
      error.value = errorMessage;
      throw new Error(errorMessage);
    } finally {
      loading.value = false;
    }
  };

  const list = async (customerId: string): Promise<PaymentMethodDetails[]> => {
    loading.value = true;
    error.value = null;

    try {
      const result = await $fetch<PaymentMethodDetails[]>('/api/stripe/payment-methods', {
        query: { customer: customerId },
      });

      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to list payment methods';
      error.value = errorMessage;
      throw new Error(errorMessage);
    } finally {
      loading.value = false;
    }
  };

  const setDefault = async (
    customerId: string,
    paymentMethodId: string,
  ): Promise<Customer> => {
    loading.value = true;
    error.value = null;

    try {
      const result = await $fetch<Customer>(
        `/api/stripe/customer/${customerId}/default-payment-method`,
        {
          method: 'POST',
          body: { payment_method: paymentMethodId },
        },
      );

      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to set default payment method';
      error.value = errorMessage;
      throw new Error(errorMessage);
    } finally {
      loading.value = false;
    }
  };

  return {
    paymentMethod: readonly(paymentMethod),
    loading: readonly(loading),
    error: readonly(error),
    create,
    retrieve,
    update,
    attach,
    detach,
    list,
    setDefault,
  };
}
