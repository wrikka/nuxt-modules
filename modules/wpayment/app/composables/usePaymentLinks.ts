import { readonly, ref } from 'vue';
import type {
  CreatePaymentLinkParams,
  PaymentLink,
  PaymentLinkStats,
  PaymentResult,
  UsePaymentLinksReturn,
} from '#wpayment/types';

export function usePaymentLinks(): UsePaymentLinksReturn {
  const links = ref<PaymentLink[]>([]);
  const loading = ref(false);

  const createLink = async (params: CreatePaymentLinkParams): Promise<PaymentResult<PaymentLink>> => {
    loading.value = true;

    try {
      const result = await $fetch<PaymentLink>('/api/payment-links', {
        method: 'POST',
        body: {
          ...params,
          expiresAt: params.expiresAt?.toISOString(),
        },
      });

      links.value = [result, ...links.value];

      return { success: true, data: result };
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to create payment link';
      return { success: false, error: { code: 'create_failed', message, retryable: false } };
    } finally {
      loading.value = false;
    }
  };

  const deactivateLink = async (linkId: string): Promise<PaymentResult> => {
    loading.value = true;

    try {
      await $fetch(`/api/payment-links/${linkId}/deactivate`, {
        method: 'POST',
      });

      links.value = links.value.map(link =>
        link.id === linkId ? { ...link, active: false } : link,
      );

      return { success: true };
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to deactivate link';
      return { success: false, error: { code: 'deactivate_failed', message, retryable: false } };
    } finally {
      loading.value = false;
    }
  };

  const updateLink = async (
    linkId: string,
    params: Partial<CreatePaymentLinkParams>,
  ): Promise<PaymentResult<PaymentLink>> => {
    loading.value = true;

    try {
      const result = await $fetch<PaymentLink>(`/api/payment-links/${linkId}`, {
        method: 'PATCH',
        body: {
          ...params,
          expiresAt: params.expiresAt?.toISOString(),
        },
      });

      links.value = links.value.map(link => (link.id === linkId ? result : link));

      return { success: true, data: result };
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to update link';
      return { success: false, error: { code: 'update_failed', message, retryable: false } };
    } finally {
      loading.value = false;
    }
  };

  const getLinkStats = async (linkId: string): Promise<PaymentLinkStats> => {
    const result = await $fetch<PaymentLinkStats>(`/api/payment-links/${linkId}/stats`);
    return result;
  };

  return {
    links: readonly(links),
    loading: readonly(loading),
    createLink,
    deactivateLink,
    updateLink,
    getLinkStats,
  };
}
