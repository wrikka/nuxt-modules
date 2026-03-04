import { readonly, ref } from 'vue';
import type {
  PaymentMethod,
  PaymentResult,
  UsePaymentMethodVaultReturn,
} from '#wpayment/types';

export function usePaymentMethodVault(): UsePaymentMethodVaultReturn {
  const paymentMethods = ref<PaymentMethod[]>([]);
  const loading = ref(false);
  const error = ref<string | null>(null);

  const loadPaymentMethods = async (customerId: string): Promise<void> => {
    loading.value = true;
    error.value = null;

    try {
      const result = await $fetch<PaymentMethod[]>('/api/payment-methods', {
        query: { customerId },
      });
      paymentMethods.value = result;
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to load payment methods';
    } finally {
      loading.value = false;
    }
  };

  const setDefaultPaymentMethod = async (paymentMethodId: string): Promise<PaymentResult> => {
    loading.value = true;
    error.value = null;

    try {
      await $fetch('/api/payment-methods/default', {
        method: 'POST',
        body: { paymentMethodId },
      });

      paymentMethods.value = paymentMethods.value.map(pm => ({
        ...pm,
        isDefault: pm.id === paymentMethodId,
      }));

      return { success: true };
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to set default payment method';
      error.value = message;
      return { success: false, error: { code: 'set_default_failed', message, retryable: false } };
    } finally {
      loading.value = false;
    }
  };

  const removePaymentMethod = async (paymentMethodId: string): Promise<PaymentResult> => {
    loading.value = true;
    error.value = null;

    try {
      await $fetch(`/api/payment-methods/${paymentMethodId}`, {
        method: 'DELETE',
      });

      paymentMethods.value = paymentMethods.value.filter(pm => pm.id !== paymentMethodId);

      return { success: true };
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to remove payment method';
      error.value = message;
      return { success: false, error: { code: 'remove_failed', message, retryable: false } };
    } finally {
      loading.value = false;
    }
  };

  const attachPaymentMethod = async (
    customerId: string,
    paymentMethodId: string,
  ): Promise<PaymentResult> => {
    loading.value = true;
    error.value = null;

    try {
      const result = await $fetch<PaymentMethod>('/api/payment-methods/attach', {
        method: 'POST',
        body: { customerId, paymentMethodId },
      });

      paymentMethods.value.push(result);

      return { success: true };
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to attach payment method';
      error.value = message;
      return { success: false, error: { code: 'attach_failed', message, retryable: false } };
    } finally {
      loading.value = false;
    }
  };

  const detachPaymentMethod = async (paymentMethodId: string): Promise<PaymentResult> => {
    return removePaymentMethod(paymentMethodId);
  };

  return {
    paymentMethods: readonly(paymentMethods),
    loading: readonly(loading),
    error: readonly(error),
    loadPaymentMethods,
    setDefaultPaymentMethod,
    removePaymentMethod,
    attachPaymentMethod,
    detachPaymentMethod,
  };
}
