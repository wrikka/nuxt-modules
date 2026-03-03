import type { Ref } from 'vue';

// Currency
export interface Currency {
  code: string;
  name: string;
  symbol: string;
  decimalDigits: number;
  zeroDecimal: boolean;
}

// Supported Currencies
export const SUPPORTED_CURRENCIES: Currency[] = [
  { code: 'USD', name: 'US Dollar', symbol: '$', decimalDigits: 2, zeroDecimal: false },
  { code: 'EUR', name: 'Euro', symbol: '€', decimalDigits: 2, zeroDecimal: false },
  { code: 'GBP', name: 'British Pound', symbol: '£', decimalDigits: 2, zeroDecimal: false },
  { code: 'JPY', name: 'Japanese Yen', symbol: '¥', decimalDigits: 0, zeroDecimal: true },
  { code: 'CAD', name: 'Canadian Dollar', symbol: 'C$', decimalDigits: 2, zeroDecimal: false },
  { code: 'AUD', name: 'Australian Dollar', symbol: 'A$', decimalDigits: 2, zeroDecimal: false },
  { code: 'CHF', name: 'Swiss Franc', symbol: 'CHF', decimalDigits: 2, zeroDecimal: false },
  { code: 'CNY', name: 'Chinese Yuan', symbol: '¥', decimalDigits: 2, zeroDecimal: false },
  { code: 'SGD', name: 'Singapore Dollar', symbol: 'S$', decimalDigits: 2, zeroDecimal: false },
  { code: 'HKD', name: 'Hong Kong Dollar', symbol: 'HK$', decimalDigits: 2, zeroDecimal: false },
  { code: 'KRW', name: 'South Korean Won', symbol: '₩', decimalDigits: 0, zeroDecimal: true },
  { code: 'INR', name: 'Indian Rupee', symbol: '₹', decimalDigits: 2, zeroDecimal: false },
  { code: 'MXN', name: 'Mexican Peso', symbol: 'MX$', decimalDigits: 2, zeroDecimal: false },
  { code: 'BRL', name: 'Brazilian Real', symbol: 'R$', decimalDigits: 2, zeroDecimal: false },
  { code: 'THB', name: 'Thai Baht', symbol: '฿', decimalDigits: 2, zeroDecimal: false },
  { code: 'VND', name: 'Vietnamese Dong', symbol: '₫', decimalDigits: 0, zeroDecimal: true },
  { code: 'MYR', name: 'Malaysian Ringgit', symbol: 'RM', decimalDigits: 2, zeroDecimal: false },
  { code: 'PHP', name: 'Philippine Peso', symbol: '₱', decimalDigits: 2, zeroDecimal: false },
  { code: 'IDR', name: 'Indonesian Rupiah', symbol: 'Rp', decimalDigits: 0, zeroDecimal: true },
  { code: 'NZD', name: 'New Zealand Dollar', symbol: 'NZ$', decimalDigits: 2, zeroDecimal: false },
];

// Exchange Rate
export interface ExchangeRate {
  id: string;
  object: 'exchange_rate';
  livemode: boolean;
  rates: Record<string, number>;
  updated: number;
}

// Currency Conversion Result
export interface CurrencyConversionResult {
  from: string;
  to: string;
  amount: number;
  convertedAmount: number;
  rate: number;
  fee?: number;
}

// Multi-Currency Price
export interface MultiCurrencyPrice {
  defaultCurrency: string;
  defaultAmount: number;
  prices: Record<string, number>;
}

// Create Multi-Currency Price Params
export interface CreateMultiCurrencyPriceParams {
  defaultCurrency: string;
  defaultAmount: number;
  currencies: string[];
  autoConvert?: boolean;
  exchangeRateSource?: 'stripe' | 'manual';
  manualRates?: Record<string, number>;
}

// Composable Return Types
export interface UseCurrencyReturn {
  currentCurrency: Readonly<Ref<string>>;
  exchangeRates: Readonly<Ref<Record<string, number>>>;
  loading: Readonly<Ref<boolean>>;
  error: Readonly<Ref<string | null>>;
  setCurrency: (currency: string) => void;
  getCurrency: (code: string) => Currency | undefined;
  formatAmount: (amount: number, currency: string) => string;
  parseAmount: (formatted: string, currency: string) => number;
  convertAmount: (amount: number, from: string, to: string) => Promise<CurrencyConversionResult>;
  fetchExchangeRates: (base?: string) => Promise<Record<string, number>>;
  getSupportedCurrencies: () => Currency[];
  createMultiCurrencyPrice: (params: CreateMultiCurrencyPriceParams) => MultiCurrencyPrice;
}

// Currency Selector Props
export interface CurrencySelectorProps {
  modelValue?: string;
  currencies?: string[];
  showSymbol?: boolean;
  showName?: boolean;
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
}

// Currency Display Props
export interface CurrencyDisplayProps {
  amount: number;
  currency: string;
  showCode?: boolean;
  showSymbol?: boolean;
  locale?: string;
  format?: 'standard' | 'compact' | 'accounting';
}
