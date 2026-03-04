import { readonly, ref } from 'vue';
import type {
  PaymentResult,
  WebhookTestEvent,
  UseWebhookTestingReturn,
} from '#wpayment/types';

export function useWebhookTesting(): UseWebhookTestingReturn {
  const events = ref<WebhookTestEvent[]>([]);
  const loading = ref(false);

  const sendTestEvent = async (
    eventType: string,
    payload?: Record<string, unknown>,
  ): Promise<PaymentResult> => {
    loading.value = true;

    try {
      const result = await $fetch<WebhookTestEvent>('/api/webhooks/test', {
        method: 'POST',
        body: { eventType, payload },
      });

      events.value = [result, ...events.value];

      return { success: true };
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to send test event';
      return { success: false, error: { code: 'test_failed', message, retryable: true } };
    } finally {
      loading.value = false;
    }
  };

  const replayEvent = async (eventId: string): Promise<PaymentResult> => {
    loading.value = true;

    try {
      await $fetch(`/api/webhooks/replay/${eventId}`, {
        method: 'POST',
      });

      return { success: true };
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to replay event';
      return { success: false, error: { code: 'replay_failed', message, retryable: true } };
    } finally {
      loading.value = false;
    }
  };

  const inspectPayload = async (eventType: string): Promise<Record<string, unknown>> => {
    const result = await $fetch<Record<string, unknown>>('/api/webhooks/payload', {
      query: { eventType },
    });

    return result;
  };

  const validateEndpoint = async (url: string): Promise<PaymentResult<boolean>> => {
    try {
      const result = await $fetch<{ valid: boolean }>('/api/webhooks/validate', {
        method: 'POST',
        body: { url },
      });

      return { success: true, data: result.valid };
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to validate endpoint';
      return { success: false, error: { code: 'validation_failed', message, retryable: true } };
    }
  };

  return {
    events: readonly(events),
    loading: readonly(loading),
    sendTestEvent,
    replayEvent,
    inspectPayload,
    validateEndpoint,
  };
}
