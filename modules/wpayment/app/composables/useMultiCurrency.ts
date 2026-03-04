import { readonly, ref } from 'vue';
import type {
  CurrencyInfo,
  UseMultiCurrencyReturn,
} from '#wpayment/types';

const supportedCurrencies: CurrencyInfo[] = [
  { code: 'USD', name: 'US Dollar', symbol: '$', decimals: 2, supported: true },
  { code: 'EUR', name: 'Euro', symbol: '€', decimals: 2, supported: true },
  { code: 'GBP', name: 'British Pound', symbol: '£', decimals: 2, supported: true },
  { code: 'JPY', name: 'Japanese Yen', symbol: '¥', decimals: 0, supported: true },
  { code: 'AUD', name: 'Australian Dollar', symbol: 'A$', decimals: 2, supported: true },
  { code: 'CAD', name: 'Canadian Dollar', symbol: 'C$', decimals: 2, supported: true },
  { code: 'CHF', name: 'Swiss Franc', symbol: 'Fr', decimals: 2, supported: true },
  { code: 'CNY', name: 'Chinese Yuan', symbol: '¥', decimals: 2, supported: true },
  { code: 'HKD', name: 'Hong Kong Dollar', symbol: 'HK$', decimals: 2, supported: true },
  { code: 'NZD', name: 'New Zealand Dollar', symbol: 'NZ$', decimals: 2, supported: true },
  { code: 'SEK', name: 'Swedish Krona', symbol: 'kr', decimals: 2, supported: true },
  { code: 'SGD', name: 'Singapore Dollar', symbol: 'S$', decimals: 2, supported: true },
  { code: 'KRW', name: 'South Korean Won', symbol: '₩', decimals: 0, supported: true },
  { code: 'INR', name: 'Indian Rupee', symbol: '₹', decimals: 2, supported: true },
  { code: 'BRL', name: 'Brazilian Real', symbol: 'R$', decimals: 2, supported: true },
  { code: 'THB', name: 'Thai Baht', symbol: '฿', decimals: 2, supported: true },
];

const minimumAmounts: Record<string, number> = {
  USD: 0.5,
  EUR: 0.5,
  GBP: 0.3,
  JPY: 50,
  AUD: 0.5,
  CAD: 0.5,
  CHF: 0.5,
  CNY: 3,
  HKD: 4,
  NZD: 0.5,
  SEK: 3,
  SGD: 0.5,
  KRW: 500,
  INR: 35,
  BRL: 2,
  THB: 15,
};

export function useMultiCurrency(): UseMultiCurrencyReturn {
  const currentCurrency = ref('USD');
  const exchangeRates = ref<Record<string, number>>({});
  const loading = ref(false);

  const convert = async (amount: number, from: string, to: string): Promise<number> => {
    if (from === to) return amount;

    const rates = await $fetch<Record<string, number>>('/api/currency/rates');
    exchangeRates.value = rates;

    const fromRate = rates[from] || 1;
    const toRate = rates[to] || 1;

    return (amount / fromRate) * toRate;
  };

  const format = (amount: number, currency: string, locale = 'en-US'): string => {
    const currencyInfo = supportedCurrencies.find(c => c.code === currency);
    const decimals = currencyInfo?.decimals ?? 2;

    return new Intl.NumberFormat(locale, {
      style: 'currency',
      currency,
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
    }).format(amount / 100);
  };

  const setCurrency = (currency: string): void => {
    if (supportedCurrencies.some(c => c.code === currency)) {
      currentCurrency.value = currency;
    }
  };

  const getMinimumAmount = (currency: string): number => {
    return minimumAmounts[currency] || 0.5;
  };

  const refreshRates = async (): Promise<void> => {
    loading.value = true;

    try {
      const rates = await $fetch<Record<string, number>>('/api/currency/rates');
      exchangeRates.value = rates;
    } finally {
      loading.value = false;
    }
  };

  return {
    supportedCurrencies: readonly(supportedCurrencies),
    currentCurrency: readonly(currentCurrency),
    exchangeRates: readonly(exchangeRates),
    loading: readonly(loading),
    convert,
    format,
    setCurrency,
    getMinimumAmount,
    refreshRates,
  };
}
