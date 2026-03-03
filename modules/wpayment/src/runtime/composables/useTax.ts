import { readonly, ref } from 'vue';
import type { TaxCalculation, TaxRate, TaxTransaction, UseTaxReturn } from '#wpayment/types';

export function useTax(): UseTaxReturn {
  const taxRate = ref<TaxRate | null>(null);
  const calculation = ref<TaxCalculation | null>(null);
  const transaction = ref<TaxTransaction | null>(null);
  const loading = ref(false);
  const error = ref<string | null>(null);

  const createTaxRate = async (params: any): Promise<TaxRate> => {
    loading.value = true;
    try {
      const result = await $fetch<TaxRate>('/api/stripe/tax-rate', { method: 'POST', body: params });
      taxRate.value = result;
      return result;
    } finally {
      loading.value = false;
    }
  };

  const retrieveTaxRate = async (taxRateId: string): Promise<TaxRate> => {
    loading.value = true;
    try {
      return await $fetch<TaxRate>(`/api/stripe/tax-rate/${taxRateId}`);
    } finally {
      loading.value = false;
    }
  };

  const updateTaxRate = async (params: any): Promise<TaxRate> => {
    loading.value = true;
    try {
      return await $fetch<TaxRate>(`/api/stripe/tax-rate/${params.taxRateId}`, { method: 'PATCH', body: params });
    } finally {
      loading.value = false;
    }
  };

  const listTaxRates = async (active?: boolean): Promise<TaxRate[]> => {
    loading.value = true;
    try {
      return await $fetch<TaxRate[]>('/api/stripe/tax-rates', { query: { active } });
    } finally {
      loading.value = false;
    }
  };

  const createCalculation = async (params: any): Promise<TaxCalculation> => {
    loading.value = true;
    try {
      const result = await $fetch<TaxCalculation>('/api/stripe/tax/calculate', { method: 'POST', body: params });
      calculation.value = result;
      return result;
    } finally {
      loading.value = false;
    }
  };

  const retrieveCalculation = async (calculationId: string): Promise<TaxCalculation> => {
    loading.value = true;
    try {
      return await $fetch<TaxCalculation>(`/api/stripe/tax/calculation/${calculationId}`);
    } finally {
      loading.value = false;
    }
  };

  const createTransaction = async (params: any): Promise<TaxTransaction> => {
    loading.value = true;
    try {
      const result = await $fetch<TaxTransaction>('/api/stripe/tax/transaction', { method: 'POST', body: params });
      transaction.value = result;
      return result;
    } finally {
      loading.value = false;
    }
  };

  const retrieveTransaction = async (transactionId: string): Promise<TaxTransaction> => {
    loading.value = true;
    try {
      return await $fetch<TaxTransaction>(`/api/stripe/tax/transaction/${transactionId}`);
    } finally {
      loading.value = false;
    }
  };

  const voidTransaction = async (transactionId: string): Promise<TaxTransaction> => {
    loading.value = true;
    try {
      return await $fetch<TaxTransaction>(`/api/stripe/tax/transaction/${transactionId}/void`, { method: 'POST' });
    } finally {
      loading.value = false;
    }
  };

  const reverseTransaction = async (transactionId: string, params?: any): Promise<TaxTransaction> => {
    loading.value = true;
    try {
      return await $fetch<TaxTransaction>(`/api/stripe/tax/transaction/${transactionId}/reverse`, {
        method: 'POST',
        body: params,
      });
    } finally {
      loading.value = false;
    }
  };

  return {
    taxRate: readonly(taxRate),
    calculation: readonly(calculation),
    transaction: readonly(transaction),
    loading: readonly(loading),
    error: readonly(error),
    createTaxRate,
    retrieveTaxRate,
    updateTaxRate,
    listTaxRates,
    createCalculation,
    retrieveCalculation,
    createTransaction,
    retrieveTransaction,
    voidTransaction,
    reverseTransaction,
  };
}
