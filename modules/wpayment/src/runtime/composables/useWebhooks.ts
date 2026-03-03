import { type Ref, ref } from 'vue';
import type { WebhookDelivery, WebhookEndpoint, WebhookEvent, WebhookEventFilter } from '#wpayment/types';

export interface UseWebhooksReturn {
  events: Ref<WebhookEvent[]>;
  endpoints: Ref<WebhookEndpoint[]>;
  loading: Ref<boolean>;
  error: Ref<string | null>;
  listEvents: (filter?: WebhookEventFilter) => Promise<WebhookEvent[]>;
  retrieveEvent: (eventId: string) => Promise<WebhookEvent | null>;
  listEndpoints: () => Promise<WebhookEndpoint[]>;
  createEndpoint: (url: string, enabledEvents: string[]) => Promise<WebhookEndpoint | null>;
  updateEndpoint: (endpointId: string, data: Partial<WebhookEndpoint>) => Promise<WebhookEndpoint | null>;
  deleteEndpoint: (endpointId: string) => Promise<boolean>;
  retryEvent: (eventId: string, endpointId: string) => Promise<boolean>;
  listDeliveries: (eventId: string) => Promise<WebhookDelivery[]>;
  sendTestEvent: (endpointId: string, type: string) => Promise<boolean>;
}

export function useWebhooks(): UseWebhooksReturn {
  const events = ref<WebhookEvent[]>([]);
  const endpoints = ref<WebhookEndpoint[]>([]);
  const loading = ref(false);
  const error = ref<string | null>(null);

  const listEvents = async (filter?: WebhookEventFilter): Promise<WebhookEvent[]> => {
    loading.value = true;
    error.value = null;

    try {
      const response = await $fetch('/api/stripe/webhooks/events', {
        query: filter,
      });
      events.value = response as WebhookEvent[];
      return events.value;
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to list events';
      return [];
    } finally {
      loading.value = false;
    }
  };

  const retrieveEvent = async (eventId: string): Promise<WebhookEvent | null> => {
    loading.value = true;
    error.value = null;

    try {
      const response = await $fetch(`/api/stripe/webhooks/events/${eventId}`);
      return response as WebhookEvent;
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to retrieve event';
      return null;
    } finally {
      loading.value = false;
    }
  };

  const listEndpoints = async (): Promise<WebhookEndpoint[]> => {
    loading.value = true;
    error.value = null;

    try {
      const response = await $fetch('/api/stripe/webhooks/endpoints');
      endpoints.value = response as WebhookEndpoint[];
      return endpoints.value;
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to list endpoints';
      return [];
    } finally {
      loading.value = false;
    }
  };

  const createEndpoint = async (url: string, enabledEvents: string[]): Promise<WebhookEndpoint | null> => {
    loading.value = true;
    error.value = null;

    try {
      const response = await $fetch('/api/stripe/webhooks/endpoints', {
        method: 'POST',
        body: { url, enabled_events: enabledEvents },
      });
      const endpoint = response as WebhookEndpoint;
      endpoints.value = [...endpoints.value, endpoint];
      return endpoint;
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to create endpoint';
      return null;
    } finally {
      loading.value = false;
    }
  };

  const updateEndpoint = async (
    endpointId: string,
    data: Partial<WebhookEndpoint>,
  ): Promise<WebhookEndpoint | null> => {
    loading.value = true;
    error.value = null;

    try {
      const response = await $fetch(`/api/stripe/webhooks/endpoints/${endpointId}`, {
        method: 'POST',
        body: data,
      });
      const endpoint = response as WebhookEndpoint;
      const index = endpoints.value.findIndex(e => e.id === endpointId);
      if (index !== -1) {
        endpoints.value[index] = endpoint;
      }
      return endpoint;
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to update endpoint';
      return null;
    } finally {
      loading.value = false;
    }
  };

  const deleteEndpoint = async (endpointId: string): Promise<boolean> => {
    loading.value = true;
    error.value = null;

    try {
      await $fetch(`/api/stripe/webhooks/endpoints/${endpointId}`, {
        method: 'DELETE',
      });
      endpoints.value = endpoints.value.filter(e => e.id !== endpointId);
      return true;
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to delete endpoint';
      return false;
    } finally {
      loading.value = false;
    }
  };

  const retryEvent = async (eventId: string, endpointId: string): Promise<boolean> => {
    loading.value = true;
    error.value = null;

    try {
      await $fetch(`/api/stripe/webhooks/events/${eventId}/retry`, {
        method: 'POST',
        body: { endpoint_id: endpointId },
      });
      return true;
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to retry event';
      return false;
    } finally {
      loading.value = false;
    }
  };

  const listDeliveries = async (eventId: string): Promise<WebhookDelivery[]> => {
    loading.value = true;
    error.value = null;

    try {
      const response = await $fetch(`/api/stripe/webhooks/events/${eventId}/deliveries`);
      return response as WebhookDelivery[];
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to list deliveries';
      return [];
    } finally {
      loading.value = false;
    }
  };

  const sendTestEvent = async (endpointId: string, type: string): Promise<boolean> => {
    loading.value = true;
    error.value = null;

    try {
      await $fetch(`/api/stripe/webhooks/endpoints/${endpointId}/test`, {
        method: 'POST',
        body: { type },
      });
      return true;
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to send test event';
      return false;
    } finally {
      loading.value = false;
    }
  };

  return {
    events,
    endpoints,
    loading,
    error,
    listEvents,
    retrieveEvent,
    listEndpoints,
    createEndpoint,
    updateEndpoint,
    deleteEndpoint,
    retryEvent,
    listDeliveries,
    sendTestEvent,
  };
}
