import { readonly, ref } from 'vue';
import type {
  CancelSubscriptionParams,
  CreateSubscriptionParams,
  PauseSubscriptionParams,
  ResumeSubscriptionParams,
  Subscription,
  UpdateSubscriptionParams,
  UseSubscriptionReturn,
} from '#wpayment/types';

export function useSubscription(): UseSubscriptionReturn {
  const subscription = ref<Subscription | null>(null);
  const loading = ref(false);
  const error = ref<string | null>(null);

  const create = async (params: CreateSubscriptionParams): Promise<Subscription> => {
    loading.value = true;
    error.value = null;

    try {
      const result = await $fetch<Subscription>('/api/stripe/subscription', {
        method: 'POST',
        body: params,
      });

      subscription.value = result;
      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to create subscription';
      error.value = errorMessage;
      throw new Error(errorMessage);
    } finally {
      loading.value = false;
    }
  };

  const retrieve = async (subscriptionId: string): Promise<Subscription> => {
    loading.value = true;
    error.value = null;

    try {
      const result = await $fetch<Subscription>(`/api/stripe/subscription/${subscriptionId}`);
      subscription.value = result;
      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to retrieve subscription';
      error.value = errorMessage;
      throw new Error(errorMessage);
    } finally {
      loading.value = false;
    }
  };

  const update = async (
    subscriptionId: string,
    params: UpdateSubscriptionParams,
  ): Promise<Subscription> => {
    loading.value = true;
    error.value = null;

    try {
      const result = await $fetch<Subscription>(`/api/stripe/subscription/${subscriptionId}`, {
        method: 'PATCH',
        body: params,
      });

      subscription.value = result;
      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update subscription';
      error.value = errorMessage;
      throw new Error(errorMessage);
    } finally {
      loading.value = false;
    }
  };

  const cancel = async (
    subscriptionId: string,
    params?: CancelSubscriptionParams,
  ): Promise<Subscription> => {
    loading.value = true;
    error.value = null;

    try {
      const result = await $fetch<Subscription>(
        `/api/stripe/subscription/${subscriptionId}/cancel`,
        {
          method: 'POST',
          body: params,
        },
      );

      subscription.value = result;
      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to cancel subscription';
      error.value = errorMessage;
      throw new Error(errorMessage);
    } finally {
      loading.value = false;
    }
  };

  const pause = async (
    subscriptionId: string,
    params: PauseSubscriptionParams,
  ): Promise<Subscription> => {
    loading.value = true;
    error.value = null;

    try {
      const result = await $fetch<Subscription>(
        `/api/stripe/subscription/${subscriptionId}/pause`,
        {
          method: 'POST',
          body: params,
        },
      );

      subscription.value = result;
      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to pause subscription';
      error.value = errorMessage;
      throw new Error(errorMessage);
    } finally {
      loading.value = false;
    }
  };

  const resume = async (
    subscriptionId: string,
    params?: ResumeSubscriptionParams,
  ): Promise<Subscription> => {
    loading.value = true;
    error.value = null;

    try {
      const result = await $fetch<Subscription>(
        `/api/stripe/subscription/${subscriptionId}/resume`,
        {
          method: 'POST',
          body: params,
        },
      );

      subscription.value = result;
      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to resume subscription';
      error.value = errorMessage;
      throw new Error(errorMessage);
    } finally {
      loading.value = false;
    }
  };

  const list = async (customerId: string): Promise<Subscription[]> => {
    loading.value = true;
    error.value = null;

    try {
      const result = await $fetch<Subscription[]>('/api/stripe/subscriptions', {
        query: { customer: customerId },
      });

      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to list subscriptions';
      error.value = errorMessage;
      throw new Error(errorMessage);
    } finally {
      loading.value = false;
    }
  };

  return {
    subscription: readonly(subscription),
    loading: readonly(loading),
    error: readonly(error),
    create,
    retrieve,
    update,
    cancel,
    pause,
    resume,
    list,
  };
}
