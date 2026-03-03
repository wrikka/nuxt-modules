import type { Ref } from 'vue';

// Payment Scheduler
export interface ScheduledPayment {
  id: string;
  object: 'scheduled_payment';
  customer: string;
  amount: number;
  currency: string;
  scheduledAt: number;
  status: ScheduledPaymentStatus;
  paymentIntent?: string;
  retryAttempts?: number;
  lastAttemptAt?: number;
  nextAttemptAt?: number;
  metadata?: Record<string, string>;
  createdAt: number;
  updatedAt: number;
}

export type ScheduledPaymentStatus =
  | 'scheduled'
  | 'processing'
  | 'succeeded'
  | 'failed'
  | 'canceled'
  | 'paused';

// Create Scheduled Payment Params
export interface CreateScheduledPaymentParams {
  customer: string;
  amount: number;
  currency: string;
  scheduledAt: number;
  paymentMethod?: string;
  description?: string;
  metadata?: Record<string, string>;
  retryConfig?: {
    maxRetries?: number;
    retryInterval?: number;
  };
  notificationConfig?: {
    sendReminder?: boolean;
    reminderDaysBefore?: number;
    reminderEmail?: string;
  };
}

// Update Scheduled Payment Params
export interface UpdateScheduledPaymentParams {
  scheduledPaymentId: string;
  scheduledAt?: number;
  amount?: number;
  currency?: string;
  paymentMethod?: string;
  description?: string;
  metadata?: Record<string, string>;
  status?: ScheduledPaymentStatus;
}

// Split Payment
export interface SplitPayment {
  id: string;
  object: 'split_payment';
  totalAmount: number;
  currency: string;
  splits: SplitPaymentDestination[];
  status: SplitPaymentStatus;
  charge?: string;
  paymentIntent?: string;
  createdAt: number;
  metadata?: Record<string, string>;
}

export type SplitPaymentStatus =
  | 'pending'
  | 'processing'
  | 'completed'
  | 'failed'
  | 'reversed';

export interface SplitPaymentDestination {
  account: string;
  amount: number;
  currency: string;
  status: 'pending' | 'transferred' | 'failed';
  transfer?: string;
  fee?: number;
  feePercent?: number;
}

// Create Split Payment Params
export interface CreateSplitPaymentParams {
  charge: string;
  splits: Array<{
    account: string;
    amount?: number;
    amountPercent?: number;
    fee?: number;
    feePercent?: number;
  }>;
  transferGroup?: string;
  metadata?: Record<string, string>;
  onBehalfOf?: string;
  sourceTransaction?: string;
}

// BNPL (Buy Now Pay Later)
export type BNPLProvider = 'klarna' | 'afterpay_clearpay' | 'affirm';

export interface BNPLPayment {
  provider: BNPLProvider;
  available: boolean;
  estimatedPayments?: number;
  estimatedPaymentAmount?: number;
  interestFree?: boolean;
  apr?: number;
  termsUrl?: string;
}

export interface BNPLConfig {
  enabled: boolean;
  providers: BNPLProvider[];
  minAmount?: number;
  maxAmount?: number;
  supportedCurrencies?: string[];
  supportedCountries?: string[];
}

// BNPL Payment Request
export interface BNPLPaymentRequest {
  provider: BNPLProvider;
  amount: number;
  currency: string;
  customer?: string;
  description?: string;
  metadata?: Record<string, string>;
  returnUrl: string;
  cancelUrl?: string;
}

// BNPL Payment Result
export interface BNPLPaymentResult {
  success: boolean;
  redirectUrl?: string;
  paymentIntent?: string;
  checkoutSession?: string;
  error?: string;
}

// Composable Return Types
export interface UseScheduledPaymentReturn {
  scheduledPayment: Readonly<Ref<ScheduledPayment | null>>;
  loading: Readonly<Ref<boolean>>;
  error: Readonly<Ref<string | null>>;
  create: (params: CreateScheduledPaymentParams) => Promise<ScheduledPayment>;
  retrieve: (id: string) => Promise<ScheduledPayment>;
  update: (params: UpdateScheduledPaymentParams) => Promise<ScheduledPayment>;
  cancel: (id: string) => Promise<ScheduledPayment>;
  pause: (id: string) => Promise<ScheduledPayment>;
  resume: (id: string) => Promise<ScheduledPayment>;
  list: (customerId?: string) => Promise<ScheduledPayment[]>;
  processNow: (id: string) => Promise<ScheduledPayment>;
}

export interface UseSplitPaymentReturn {
  splitPayment: Readonly<Ref<SplitPayment | null>>;
  loading: Readonly<Ref<boolean>>;
  error: Readonly<Ref<string | null>>;
  create: (params: CreateSplitPaymentParams) => Promise<SplitPayment>;
  retrieve: (id: string) => Promise<SplitPayment>;
  reverse: (id: string, params?: ReverseSplitParams) => Promise<SplitPayment>;
  list: (params?: ListSplitPaymentsParams) => Promise<SplitPayment[]>;
}

export interface ReverseSplitParams {
  reverseType: 'full' | 'partial';
  amounts?: Array<{
    account: string;
    amount: number;
  }>;
}

export interface ListSplitPaymentsParams {
  charge?: string;
  paymentIntent?: string;
  limit?: number;
}

export interface UseBNPLReturn {
  availableProviders: Readonly<Ref<BNPLPayment[]>>;
  loading: Readonly<Ref<boolean>>;
  error: Readonly<Ref<string | null>>;
  checkAvailability: (amount: number, currency: string) => Promise<BNPLPayment[]>;
  createPayment: (request: BNPLPaymentRequest) => Promise<BNPLPaymentResult>;
  getPaymentDetails: (paymentIntentId: string) => Promise<BNPLPayment>;
  getConfig: () => BNPLConfig;
}
