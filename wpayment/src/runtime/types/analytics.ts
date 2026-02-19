import type { Ref } from 'vue';

// Payment Analytics
export interface PaymentAnalytics {
  revenue: RevenueAnalytics;
  payments: PaymentAnalyticsSummary;
  subscriptions?: SubscriptionAnalytics;
  customers?: CustomerAnalytics;
  period: AnalyticsPeriod;
}

export interface RevenueAnalytics {
  total: number;
  currency: string;
  growth: number;
  breakdown: RevenueBreakdown[];
  byPeriod: PeriodRevenue[];
}

export interface RevenueBreakdown {
  category: string;
  amount: number;
  percentage: number;
}

export interface PeriodRevenue {
  period: string;
  amount: number;
  currency: string;
  count: number;
}

export interface PaymentAnalyticsSummary {
  total: number;
  successful: number;
  failed: number;
  pending: number;
  refunded: number;
  successRate: number;
  averageAmount: number;
  byPaymentMethod: PaymentMethodAnalytics[];
  byCountry: CountryAnalytics[];
}

export interface PaymentMethodAnalytics {
  type: string;
  count: number;
  amount: number;
  percentage: number;
  successRate: number;
}

export interface CountryAnalytics {
  country: string;
  count: number;
  amount: number;
  percentage: number;
}

export interface SubscriptionAnalytics {
  total: number;
  active: number;
  canceled: number;
  pastDue: number;
  trialing: number;
  mrr: number;
  arr: number;
  churnRate: number;
  retentionRate: number;
  byPlan: PlanAnalytics[];
}

export interface PlanAnalytics {
  planId: string;
  planName: string;
  count: number;
  mrr: number;
  churnRate: number;
}

export interface CustomerAnalytics {
  total: number;
  new: number;
  returning: number;
  lifetimeValue: number;
  acquisitionCost: number;
  bySegment: CustomerSegment[];
}

export interface CustomerSegment {
  segment: string;
  count: number;
  revenue: number;
  percentage: number;
}

export interface AnalyticsPeriod {
  start: number;
  end: number;
  granularity: 'hour' | 'day' | 'week' | 'month' | 'year';
}

// Analytics Query Params
export interface AnalyticsQueryParams {
  startDate: number;
  endDate: number;
  granularity?: 'hour' | 'day' | 'week' | 'month' | 'year';
  currency?: string;
  paymentMethodTypes?: string[];
  includeSubscriptions?: boolean;
  includeCustomers?: boolean;
  groupBy?: 'day' | 'week' | 'month' | 'payment_method' | 'country' | 'product';
}

// Dashboard Stats
export interface DashboardStats {
  revenue: {
    current: number;
    previous: number;
    change: number;
    changePercent: number;
  };
  payments: {
    current: number;
    previous: number;
    change: number;
    changePercent: number;
  };
  customers: {
    current: number;
    previous: number;
    change: number;
    changePercent: number;
  };
  subscriptions?: {
    current: number;
    previous: number;
    change: number;
    changePercent: number;
  };
  refunds?: {
    current: number;
    previous: number;
    change: number;
    changePercent: number;
  };
}

// Chart Data Types
export interface ChartDataPoint {
  label: string;
  value: number;
  previousValue?: number;
  metadata?: Record<string, unknown>;
}

export interface ChartSeries {
  name: string;
  data: ChartDataPoint[];
  type?: 'line' | 'bar' | 'area' | 'pie';
  color?: string;
}

export interface ChartConfig {
  title?: string;
  xAxisLabel?: string;
  yAxisLabel?: string;
  showLegend?: boolean;
  showGrid?: boolean;
  stacked?: boolean;
  format?: 'currency' | 'number' | 'percent';
  currency?: string;
}

// Composable Return Types
export interface UseAnalyticsReturn {
  analytics: Readonly<Ref<PaymentAnalytics | null>>;
  stats: Readonly<Ref<DashboardStats | null>>;
  loading: Readonly<Ref<boolean>>;
  error: Readonly<Ref<string | null>>;
  fetchAnalytics: (params: AnalyticsQueryParams) => Promise<PaymentAnalytics>;
  fetchStats: (period?: 'day' | 'week' | 'month' | 'year') => Promise<DashboardStats>;
  getRevenueChart: (params: AnalyticsQueryParams) => Promise<ChartSeries[]>;
  getPaymentsChart: (params: AnalyticsQueryParams) => Promise<ChartSeries[]>;
  getSubscriptionsChart: (params: AnalyticsQueryParams) => Promise<ChartSeries[]>;
  getCustomersChart: (params: AnalyticsQueryParams) => Promise<ChartSeries[]>;
  exportReport: (params: AnalyticsQueryParams, format: 'csv' | 'pdf' | 'json') => Promise<Blob>;
}

// Balance Transaction
export interface BalanceTransaction {
  id: string;
  object: 'balance_transaction';
  amount: number;
  available_on?: number;
  created: number;
  currency: string;
  description?: string;
  exchange_rate?: number;
  fee?: number;
  fee_details?: BalanceTransactionFeeDetail[];
  net: number;
  reporting_category?: string;
  source?: string;
  status: 'available' | 'pending';
  type: BalanceTransactionType;
}

export type BalanceTransactionType =
  | 'adjustment'
  | 'advance'
  | 'advance_funding'
  | 'anticipation_repayment'
  | 'application_fee'
  | 'application_fee_refund'
  | 'charge'
  | 'connect_collection_transfer'
  | 'connect_redeem'
  | 'contributor_payout'
  | 'issuing_authorization_hold'
  | 'issuing_transaction'
  | 'obligation'
  | 'obligation_reversal'
  | 'payment'
  | 'payment_failure_refund'
  | 'payment_refund'
  | 'payout'
  | 'payout_cancel'
  | 'payout_failure'
  | 'refund'
  | 'refund_failure'
  | 'reserve_transaction'
  | 'reserved_funds'
  | 'stripe_fee'
  | 'stripe_fx_fee'
  | 'tax_fee'
  | 'topup'
  | 'topup_reversal'
  | 'transfer'
  | 'transfer_reversal'
  | 'validation_failure';

export interface BalanceTransactionFeeDetail {
  amount: number;
  application?: string;
  currency: string;
  description?: string;
  type: 'application_fee' | 'stripe_fee' | 'tax';
}

// Balance
export interface Balance {
  object: 'balance';
  available: BalanceAmount[];
  connect_reserved?: BalanceAmount[];
  instant_available?: BalanceAmount[];
  issuing?: BalanceIssuing;
  livemode: boolean;
  pending: BalanceAmount[];
}

export interface BalanceAmount {
  amount: number;
  currency: string;
  source_types?: Record<string, number>;
}

export interface BalanceIssuing {
  available?: BalanceAmount[];
}

// Composable Return Types for Balance
export interface UseBalanceReturn {
  balance: Readonly<Ref<Balance | null>>;
  transactions: Readonly<Ref<BalanceTransaction[]>>;
  loading: Readonly<Ref<boolean>>;
  error: Readonly<Ref<string | null>>;
  retrieveBalance: () => Promise<Balance>;
  listTransactions: (params?: ListBalanceTransactionsParams) => Promise<BalanceTransaction[]>;
  retrieveTransaction: (transactionId: string) => Promise<BalanceTransaction>;
}

export interface ListBalanceTransactionsParams {
  payout?: string;
  type?: BalanceTransactionType;
  created?: {
    gt?: number;
    gte?: number;
    lt?: number;
    lte?: number;
  };
  currency?: string;
  ending_before?: string;
  limit?: number;
  starting_after?: string;
}
