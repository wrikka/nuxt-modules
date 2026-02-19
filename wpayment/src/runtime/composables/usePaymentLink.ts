import { readonly, ref } from 'vue';
import type {
  CreatePaymentLinkParams,
  PaymentLink,
  UpdatePaymentLinkParams,
  UsePaymentLinkReturn,
} from '#wpayment/types';

export function usePaymentLink(): UsePaymentLinkReturn {
  const paymentLink = ref<PaymentLink | null>(null);
  const loading = ref(false);
  const error = ref<string | null>(null);

  const create = async (params: CreatePaymentLinkParams): Promise<PaymentLink> => {
    loading.value = true;
    error.value = null;
    try {
      const result = await $fetch<PaymentLink>('/api/stripe/payment-link', { method: 'POST', body: params });
      paymentLink.value = result;
      return result;
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to create payment link';
      throw new Error(error.value);
    } finally {
      loading.value = false;
    }
  };

  const retrieve = async (paymentLinkId: string): Promise<PaymentLink> => {
    loading.value = true;
    try {
      const result = await $fetch<PaymentLink>(`/api/stripe/payment-link/${paymentLinkId}`);
      paymentLink.value = result;
      return result;
    } finally {
      loading.value = false;
    }
  };

  const update = async (params: UpdatePaymentLinkParams): Promise<PaymentLink> => {
    loading.value = true;
    try {
      const result = await $fetch<PaymentLink>(`/api/stripe/payment-link/${params.paymentLinkId}`, {
        method: 'PATCH',
        body: params,
      });
      paymentLink.value = result;
      return result;
    } finally {
      loading.value = false;
    }
  };

  const list = async (params?: any): Promise<PaymentLink[]> => {
    loading.value = true;
    try {
      return await $fetch<PaymentLink[]>('/api/stripe/payment-links', { query: params });
    } finally {
      loading.value = false;
    }
  };

  const getLinkUrl = (paymentLinkId: string): string => {
    return `https://buy.stripe.com/${paymentLinkId}`;
  };

  const deactivate = async (paymentLinkId: string): Promise<PaymentLink> => {
    loading.value = true;
    try {
      const result = await $fetch<PaymentLink>(`/api/stripe/payment-link/${paymentLinkId}/deactivate`, {
        method: 'POST',
      });
      paymentLink.value = result;
      return result;
    } finally {
      loading.value = false;
    }
  };

  return {
    paymentLink: readonly(paymentLink),
    loading: readonly(loading),
    error: readonly(error),
    create,
    retrieve,
    update,
    list,
    getLinkUrl,
    deactivate,
  };
}
