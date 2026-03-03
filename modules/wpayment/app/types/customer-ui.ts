// Customer Management UI Types
export interface CustomerFormData {
  email: string;
  name?: string;
  phone?: string;
  address?: CustomerAddress;
  shipping?: CustomerShipping;
  taxExempt?: 'none' | 'exempt' | 'reverse';
  metadata?: Record<string, string>;
}

export interface CustomerAddress {
  line1?: string;
  line2?: string;
  city?: string;
  state?: string;
  postal_code?: string;
  country?: string;
}

export interface CustomerShipping {
  name?: string;
  phone?: string;
  address?: CustomerAddress;
}

export interface CustomerSummary {
  id: string;
  email: string;
  name?: string;
  phone?: string;
  created: number;
  balance: number;
  currency?: string;
  delinquent: boolean;
  defaultPaymentMethod?: string;
  subscriptionCount: number;
  totalSpent: number;
  lastPurchaseAt?: number;
}

export interface CustomerDetail extends CustomerSummary {
  address?: CustomerAddress;
  shipping?: CustomerShipping;
  taxExempt: 'none' | 'exempt' | 'reverse';
  metadata: Record<string, string>;
  subscriptions: CustomerSubscription[];
  paymentMethods: CustomerPaymentMethod[];
  invoices: CustomerInvoice[];
}

export interface CustomerSubscription {
  id: string;
  status: string;
  planName?: string;
  amount: number;
  currency: string;
  interval: string;
  currentPeriodEnd: number;
}

export interface CustomerPaymentMethod {
  id: string;
  type: string;
  last4?: string;
  brand?: string;
  expMonth?: number;
  expYear?: number;
  isDefault: boolean;
}

export interface CustomerInvoice {
  id: string;
  number: string;
  amount: number;
  currency: string;
  status: string;
  createdAt: number;
  dueDate?: number;
}

export interface CustomerFilter {
  search?: string;
  hasSubscription?: boolean;
  delinquent?: boolean;
  createdAfter?: string;
  createdBefore?: string;
}

export interface CustomerSort {
  field: 'created' | 'name' | 'email' | 'totalSpent' | 'lastPurchase';
  direction: 'asc' | 'desc';
}

export interface CustomerStats {
  totalCustomers: number;
  activeSubscribers: number;
  delinquentCustomers: number;
  averageLifetimeValue: number;
  newCustomersThisMonth: number;
  churnedCustomersThisMonth: number;
}
