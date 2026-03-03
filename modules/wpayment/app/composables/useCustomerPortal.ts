import { readonly, ref } from 'vue';
import type {
  CreatePortalConfigurationParams,
  CreatePortalSessionParams,
  CustomerPortalConfiguration,
  CustomerPortalSession,
  UpdatePortalConfigurationParams,
  UseCustomerPortalReturn,
} from '#wpayment/types';

export function useCustomerPortal(): UseCustomerPortalReturn {
  const configuration = ref<CustomerPortalConfiguration | null>(null);
  const session = ref<CustomerPortalSession | null>(null);
  const loading = ref(false);
  const error = ref<string | null>(null);

  const createConfiguration = async (params: CreatePortalConfigurationParams): Promise<CustomerPortalConfiguration> => {
    loading.value = true;
    error.value = null;
    try {
      const result = await $fetch<CustomerPortalConfiguration>('/api/stripe/portal/configuration', {
        method: 'POST',
        body: params,
      });
      configuration.value = result;
      return result;
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to create portal configuration';
      throw new Error(error.value);
    } finally {
      loading.value = false;
    }
  };

  const retrieveConfiguration = async (configurationId: string): Promise<CustomerPortalConfiguration> => {
    loading.value = true;
    try {
      const result = await $fetch<CustomerPortalConfiguration>(`/api/stripe/portal/configuration/${configurationId}`);
      configuration.value = result;
      return result;
    } finally {
      loading.value = false;
    }
  };

  const updateConfiguration = async (params: UpdatePortalConfigurationParams): Promise<CustomerPortalConfiguration> => {
    loading.value = true;
    try {
      const result = await $fetch<CustomerPortalConfiguration>(
        `/api/stripe/portal/configuration/${params.configurationId}`,
        { method: 'PATCH', body: params },
      );
      configuration.value = result;
      return result;
    } finally {
      loading.value = false;
    }
  };

  const listConfigurations = async (): Promise<CustomerPortalConfiguration[]> => {
    loading.value = true;
    try {
      return await $fetch<CustomerPortalConfiguration[]>('/api/stripe/portal/configurations');
    } finally {
      loading.value = false;
    }
  };

  const createSession = async (params: CreatePortalSessionParams): Promise<CustomerPortalSession> => {
    loading.value = true;
    error.value = null;
    try {
      const result = await $fetch<CustomerPortalSession>('/api/stripe/portal/session', {
        method: 'POST',
        body: params,
      });
      session.value = result;
      return result;
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to create portal session';
      throw new Error(error.value);
    } finally {
      loading.value = false;
    }
  };

  const getPortalUrl = async (customerId: string, returnUrl?: string): Promise<string> => {
    const result = await createSession({ customer: customerId, return_url: returnUrl });
    return result.url;
  };

  return {
    configuration: readonly(configuration),
    session: readonly(session),
    loading: readonly(loading),
    error: readonly(error),
    createConfiguration,
    retrieveConfiguration,
    updateConfiguration,
    listConfigurations,
    createSession,
    getPortalUrl,
  };
}
