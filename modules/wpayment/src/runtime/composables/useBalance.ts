import { readonly, ref } from 'vue';
import type { Balance, BalanceTransaction, UseBalanceReturn } from '#wpayment/types';

export function useBalance(): UseBalanceReturn {
  const balance = ref<Balance | null>(null);
  const transactions = ref<BalanceTransaction[]>([]);
  const loading = ref(false);
  const error = ref<string | null>(null);

  const retrieveBalance = async (): Promise<Balance> => {
    loading.value = true;
    try {
      const result = await $fetch<Balance>('/api/stripe/balance');
      balance.value = result;
      return result;
    } finally {
      loading.value = false;
    }
  };

  const listTransactions = async (params?: any): Promise<BalanceTransaction[]> => {
    loading.value = true;
    try {
      const result = await $fetch<BalanceTransaction[]>('/api/stripe/balance/transactions', { query: params });
      transactions.value = result;
      return result;
    } finally {
      loading.value = false;
    }
  };

  const retrieveTransaction = async (transactionId: string): Promise<BalanceTransaction> => {
    loading.value = true;
    try {
      return await $fetch<BalanceTransaction>(`/api/stripe/balance/transaction/${transactionId}`);
    } finally {
      loading.value = false;
    }
  };

  return {
    balance: readonly(balance),
    transactions: readonly(transactions),
    loading: readonly(loading),
    error: readonly(error),
    retrieveBalance,
    listTransactions,
    retrieveTransaction,
  };
}
