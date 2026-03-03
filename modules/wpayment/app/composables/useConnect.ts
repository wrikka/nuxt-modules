import { type Ref, ref } from 'vue';
import type { ConnectAccount, ConnectAccountSummary, ConnectOnboardingLink, ConnectTransfer } from '#wpayment/types';

export interface UseConnectReturn {
  account: Ref<ConnectAccount | null>;
  loading: Ref<boolean>;
  error: Ref<string | null>;
  createAccount: (
    type: 'standard' | 'express' | 'custom',
    data?: Record<string, any>,
  ) => Promise<ConnectAccount | null>;
  retrieveAccount: (accountId: string) => Promise<ConnectAccount | null>;
  updateAccount: (accountId: string, data: Record<string, any>) => Promise<ConnectAccount | null>;
  createOnboardingLink: (
    accountId: string,
    refreshUrl: string,
    returnUrl: string,
  ) => Promise<ConnectOnboardingLink | null>;
  createLoginLink: (accountId: string) => Promise<{ url: string; } | null>;
  deleteAccount: (accountId: string) => Promise<boolean>;
  getAccountSummary: (accountId: string) => Promise<ConnectAccountSummary | null>;
  createTransfer: (data: { destination: string; amount: number; currency: string; }) => Promise<ConnectTransfer | null>;
}

export function useConnect(): UseConnectReturn {
  const account = ref<ConnectAccount | null>(null);
  const loading = ref(false);
  const error = ref<string | null>(null);

  const createAccount = async (
    type: 'standard' | 'express' | 'custom',
    data?: Record<string, any>,
  ): Promise<ConnectAccount | null> => {
    loading.value = true;
    error.value = null;

    try {
      const response = await $fetch('/api/stripe/connect/accounts', {
        method: 'POST',
        body: { type, ...data },
      });
      account.value = response as ConnectAccount;
      return account.value;
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to create account';
      return null;
    } finally {
      loading.value = false;
    }
  };

  const retrieveAccount = async (accountId: string): Promise<ConnectAccount | null> => {
    loading.value = true;
    error.value = null;

    try {
      const response = await $fetch(`/api/stripe/connect/accounts/${accountId}`);
      account.value = response as ConnectAccount;
      return account.value;
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to retrieve account';
      return null;
    } finally {
      loading.value = false;
    }
  };

  const updateAccount = async (accountId: string, data: Record<string, any>): Promise<ConnectAccount | null> => {
    loading.value = true;
    error.value = null;

    try {
      const response = await $fetch(`/api/stripe/connect/accounts/${accountId}`, {
        method: 'POST',
        body: data,
      });
      account.value = response as ConnectAccount;
      return account.value;
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to update account';
      return null;
    } finally {
      loading.value = false;
    }
  };

  const createOnboardingLink = async (
    accountId: string,
    refreshUrl: string,
    returnUrl: string,
  ): Promise<ConnectOnboardingLink | null> => {
    loading.value = true;
    error.value = null;

    try {
      const response = await $fetch('/api/stripe/connect/account-links', {
        method: 'POST',
        body: { account: accountId, refresh_url: refreshUrl, return_url: returnUrl },
      });
      return response as ConnectOnboardingLink;
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to create onboarding link';
      return null;
    } finally {
      loading.value = false;
    }
  };

  const createLoginLink = async (accountId: string): Promise<{ url: string; } | null> => {
    loading.value = true;
    error.value = null;

    try {
      const response = await $fetch(`/api/stripe/connect/accounts/${accountId}/login_links`, {
        method: 'POST',
      });
      return response as { url: string; };
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to create login link';
      return null;
    } finally {
      loading.value = false;
    }
  };

  const deleteAccount = async (accountId: string): Promise<boolean> => {
    loading.value = true;
    error.value = null;

    try {
      await $fetch(`/api/stripe/connect/accounts/${accountId}`, {
        method: 'DELETE',
      });
      account.value = null;
      return true;
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to delete account';
      return false;
    } finally {
      loading.value = false;
    }
  };

  const getAccountSummary = async (accountId: string): Promise<ConnectAccountSummary | null> => {
    loading.value = true;
    error.value = null;

    try {
      const response = await $fetch(`/api/stripe/connect/accounts/${accountId}/summary`);
      return response as ConnectAccountSummary;
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to get account summary';
      return null;
    } finally {
      loading.value = false;
    }
  };

  const createTransfer = async (
    data: { destination: string; amount: number; currency: string; },
  ): Promise<ConnectTransfer | null> => {
    loading.value = true;
    error.value = null;

    try {
      const response = await $fetch('/api/stripe/connect/transfers', {
        method: 'POST',
        body: data,
      });
      return response as ConnectTransfer;
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to create transfer';
      return null;
    } finally {
      loading.value = false;
    }
  };

  return {
    account,
    loading,
    error,
    createAccount,
    retrieveAccount,
    updateAccount,
    createOnboardingLink,
    createLoginLink,
    deleteAccount,
    getAccountSummary,
    createTransfer,
  };
}
