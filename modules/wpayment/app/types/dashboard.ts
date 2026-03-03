// Dashboard Types
export interface DashboardMetrics {
  totalRevenue: number;
  revenueChange: number;
  totalTransactions: number;
  transactionsChange: number;
  activeSubscriptions: number;
  subscriptionsChange: number;
  failedPayments: number;
  failedPaymentsChange: number;
}

export interface RevenueData {
  date: string;
  revenue: number;
  subscriptions: number;
  oneTime: number;
}

export interface TransactionSummary {
  id: string;
  amount: number;
  currency: string;
  status: 'succeeded' | 'pending' | 'failed';
  customerEmail?: string;
  createdAt: number;
  paymentMethodType?: string;
}

export interface SubscriptionSummary {
  id: string;
  status: 'active' | 'canceled' | 'past_due' | 'unpaid' | 'trialing';
  customerEmail?: string;
  planName?: string;
  amount: number;
  currency: string;
  interval: 'day' | 'week' | 'month' | 'year';
  currentPeriodEnd: number;
}

export interface DashboardFilter {
  dateRange: '7d' | '30d' | '90d' | '1y' | 'custom';
  customStartDate?: string;
  customEndDate?: string;
  currency?: string;
}

export interface ChartDataPoint {
  label: string;
  value: number;
  color?: string;
}

export interface DashboardChartConfig {
  type: 'line' | 'bar' | 'pie' | 'area';
  title: string;
  data: ChartDataPoint[];
  xAxisLabel?: string;
  yAxisLabel?: string;
  showLegend?: boolean;
  showGrid?: boolean;
}
