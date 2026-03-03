import { readonly, ref } from 'vue';
import type { Currency, CurrencyConversionResult, MultiCurrencyPrice, UseCurrencyReturn } from '#wpayment/types';
import { SUPPORTED_CURRENCIES } from '#wpayment/types';

export function useCurrency(): UseCurrencyReturn {
  const currentCurrency = ref<string>('USD');
  const exchangeRates = ref<Record<string, number>>({});
  const loading = ref(false);
  const error = ref<string | null>(null);

  const setCurrency = (currency: string): void => {
    currentCurrency.value = currency;
  };

  const getCurrency = (code: string): Currency | undefined => {
    return SUPPORTED_CURRENCIES.find(c => c.code === code);
  };

  const formatAmount = (amount: number, currency: string): string => {
    const curr = getCurrency(currency);
    const formatter = new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency,
      minimumFractionDigits: curr?.decimalDigits ?? 2,
      maximumFractionDigits: curr?.decimalDigits ?? 2,
    });
    return formatter.format(amount / 100);
  };

  const parseAmount = (formatted: string, currency: string): number => {
    const curr = getCurrency(currency);
    const cleaned = formatted.replace(/[^0-9.-]/g, '');
    const amount = parseFloat(cleaned);
    return Math.round(amount * Math.pow(10, curr?.decimalDigits ?? 2));
  };

  const convertAmount = async (amount: number, from: string, to: string): Promise<CurrencyConversionResult> => {
    loading.value = true;
    try {
      const result = await $fetch<CurrencyConversionResult>('/api/stripe/currency/convert', {
        method: 'POST',
        body: { amount, from, to },
      });
      return result;
    } finally {
      loading.value = false;
    }
  };

  const fetchExchangeRates = async (base?: string): Promise<Record<string, number>> => {
    loading.value = true;
    try {
      const result = await $fetch<Record<string, number>>('/api/stripe/currency/rates', {
        query: { base: base || currentCurrency.value },
      });
      exchangeRates.value = result;
      return result;
    } finally {
      loading.value = false;
    }
  };

  const getSupportedCurrencies = (): Currency[] => {
    return SUPPORTED_CURRENCIES;
  };

  const createMultiCurrencyPrice = (params: any): MultiCurrencyPrice => {
    const prices: Record<string, number> = {};
    for (const currency of params.currencies) {
      if (params.autoConvert && exchangeRates.value[currency]) {
        prices[currency] = Math.round(params.defaultAmount * exchangeRates.value[currency]);
      } else if (params.manualRates?.[currency]) {
        prices[currency] = Math.round(params.defaultAmount * params.manualRates[currency]);
      }
    }
    prices[params.defaultCurrency] = params.defaultAmount;
    return { defaultCurrency: params.defaultCurrency, defaultAmount: params.defaultAmount, prices };
  };

  return {
    currentCurrency: readonly(currentCurrency),
    exchangeRates: readonly(exchangeRates),
    loading: readonly(loading),
    error: readonly(error),
    setCurrency,
    getCurrency,
    formatAmount,
    parseAmount,
    convertAmount,
    fetchExchangeRates,
    getSupportedCurrencies,
    createMultiCurrencyPrice,
  };
}
