import type { Ref } from 'vue';

export type PaymentGateway = 'stripe' | 'paypal' | 'lemonsqueezy' | 'paddle';

export type PaymentStatus =
  | 'pending'
  | 'processing'
  | 'completed'
  | 'failed'
  | 'refunded'
  | 'canceled'
  | 'disputed'
  | 'requires_action';

export type SubscriptionStatus =
  | 'incomplete'
  | 'incomplete_expired'
  | 'trialing'
  | 'active'
  | 'past_due'
  | 'canceled'
  | 'unpaid'
  | 'paused';

export interface PaymentMethod {
  id: string;
  type: 'card' | 'paypal' | 'bank_transfer' | 'digital_wallet';
  gateway: PaymentGateway;
  last4?: string;
  brand?: string;
  expiryMonth?: number;
  expiryYear?: number;
  isDefault: boolean;
  billingDetails?: BillingDetails;
  createdAt: string;
}

export interface BillingDetails {
  name?: string;
  email?: string;
  phone?: string;
  address?: Address;
}

export interface Address {
  line1?: string;
  line2?: string;
  city?: string;
  state?: string;
  postalCode?: string;
  country: string;
}

export interface UnifiedPaymentIntent {
  id: string;
  gateway: PaymentGateway;
  amount: number;
  currency: string;
  status: PaymentStatus;
  customerId?: string;
  customerEmail?: string;
  description?: string;
  metadata?: Record<string, string>;
  clientSecret?: string;
  paymentMethodId?: string;
  subscriptionId?: string;
  invoiceId?: string;
  receiptUrl?: string;
  refundedAmount?: number;
  failureMessage?: string;
  createdAt: string;
  updatedAt: string;
}

export interface UnifiedSubscription {
  id: string;
  gateway: PaymentGateway;
  customerId: string;
  status: SubscriptionStatus;
  planId: string;
  planName: string;
  quantity: number;
  currentPeriodStart: string;
  currentPeriodEnd: string;
  trialStart?: string;
  trialEnd?: string;
  cancelAtPeriodEnd: boolean;
  canceledAt?: string;
  defaultPaymentMethodId?: string;
  latestInvoiceId?: string;
  metadata?: Record<string, string>;
  createdAt: string;
}

export interface UnifiedInvoice {
  id: string;
  gateway: PaymentGateway;
  customerId: string;
  subscriptionId?: string;
  status: 'draft' | 'open' | 'paid' | 'uncollectible' | 'void';
  amountDue: number;
  amountPaid: number;
  amountRemaining: number;
  currency: string;
  lines: InvoiceLineItem[];
  pdfUrl?: string;
  hostedInvoiceUrl?: string;
  dueDate?: string;
  paidAt?: string;
  createdAt: string;
}

export interface InvoiceLineItem {
  id: string;
  description: string;
  amount: number;
  currency: string;
  quantity: number;
  periodStart?: string;
  periodEnd?: string;
  proration: boolean;
}

export interface UnifiedCustomer {
  id: string;
  gateway: PaymentGateway;
  email: string;
  name?: string;
  phone?: string;
  balance: number;
  currency?: string;
  defaultPaymentMethodId?: string;
  address?: Address;
  metadata?: Record<string, string>;
  createdAt: string;
}

export interface CreatePaymentParams {
  gateway?: PaymentGateway;
  amount: number;
  currency: string;
  customerId?: string;
  customerEmail?: string;
  description?: string;
  metadata?: Record<string, string>;
  paymentMethodId?: string;
  savePaymentMethod?: boolean;
  confirm?: boolean;
  returnUrl?: string;
  receiptEmail?: string;
}

export interface CreateSubscriptionParams {
  gateway?: PaymentGateway;
  customerId: string;
  priceId: string;
  quantity?: number;
  trialDays?: number;
  defaultPaymentMethodId?: string;
  metadata?: Record<string, string>;
  cancelAtPeriodEnd?: boolean;
  prorationBehavior?: 'create_prorations' | 'none' | 'always_invoice';
}

export interface RefundParams {
  gateway?: PaymentGateway;
  paymentIntentId: string;
  amount?: number;
  reason?: 'duplicate' | 'fraudulent' | 'requested_by_customer' | 'other';
  metadata?: Record<string, string>;
}

export interface PaymentResult<T = unknown> {
  success: boolean;
  data?: T;
  error?: PaymentError;
}

export interface PaymentError {
  code: string;
  message: string;
  declineCode?: string;
  gatewayErrorCode?: string;
  retryable: boolean;
}

export interface RetryConfig {
  maxRetries: number;
  retryDelay: number;
  exponentialBackoff: boolean;
  maxDelay: number;
  retryableErrors: string[];
}

export interface PaymentRetryState {
  attempt: number;
  lastError?: PaymentError;
  nextRetryAt?: Date;
  canRetry: boolean;
}

export interface UseUnifiedPaymentReturn {
  loading: Readonly<Ref<boolean>>;
  error: Readonly<Ref<PaymentError | null>>;
  createPayment: (params: CreatePaymentParams) => Promise<PaymentResult<UnifiedPaymentIntent>>;
  confirmPayment: (paymentIntentId: string, params?: ConfirmPaymentParams) => Promise<PaymentResult<UnifiedPaymentIntent>>;
  retrievePayment: (paymentIntentId: string, gateway?: PaymentGateway) => Promise<PaymentResult<UnifiedPaymentIntent>>;
  refundPayment: (params: RefundParams) => Promise<PaymentResult<UnifiedPaymentIntent>>;
}

export interface ConfirmPaymentParams {
  paymentMethodId?: string;
  returnUrl?: string;
  receiptEmail?: string;
  offSession?: boolean;
}

export interface UsePaymentRetryReturn {
  state: Readonly<Ref<PaymentRetryState>>;
  execute: <T>(
    operation: () => Promise<PaymentResult<T>>,
    config?: Partial<RetryConfig>
  ) => Promise<PaymentResult<T>>;
  reset: () => void;
  canRetry: Readonly<Ref<boolean>>;
}

export interface UsePaymentMethodVaultReturn {
  paymentMethods: Readonly<Ref<PaymentMethod[]>>;
  loading: Readonly<Ref<boolean>>;
  error: Readonly<Ref<string | null>>;
  loadPaymentMethods: (customerId: string) => Promise<void>;
  setDefaultPaymentMethod: (paymentMethodId: string) => Promise<PaymentResult>;
  removePaymentMethod: (paymentMethodId: string) => Promise<PaymentResult>;
  attachPaymentMethod: (customerId: string, paymentMethodId: string) => Promise<PaymentResult>;
  detachPaymentMethod: (paymentMethodId: string) => Promise<PaymentResult>;
}

export interface UseDunningManagementReturn {
  failedPayments: Readonly<Ref<UnifiedPaymentIntent[]>>;
  loading: Readonly<Ref<boolean>>;
  loadFailedPayments: (customerId: string) => Promise<void>;
  retryPayment: (paymentIntentId: string, paymentMethodId?: string) => Promise<PaymentResult>;
  cancelSubscription: (subscriptionId: string) => Promise<PaymentResult>;
  updatePaymentMethod: (subscriptionId: string, paymentMethodId: string) => Promise<PaymentResult>;
  sendDunningEmail: (customerId: string, paymentIntentId: string) => Promise<PaymentResult>;
  getDunningStats: (customerId: string) => Promise<DunningStats>;
}

export interface DunningStats {
  totalFailed: number;
  totalRetried: number;
  totalRecovered: number;
  recoveryRate: number;
  totalLost: number;
}

export interface UseFraudDetectionReturn {
  riskScore: Readonly<Ref<number>>;
  riskLevel: Readonly<Ref<'low' | 'medium' | 'high' | 'unknown'>>;
  loading: Readonly<Ref<boolean>>;
  evaluateRisk: (params: RiskEvaluationParams) => Promise<RiskEvaluationResult>;
  blockPayment: (paymentIntentId: string, reason: string) => Promise<PaymentResult>;
  allowPayment: (paymentIntentId: string) => Promise<PaymentResult>;
  reviewPayment: (paymentIntentId: string) => Promise<PaymentResult>;
  getRiskRules: () => Promise<RiskRule[]>;
}

export interface RiskEvaluationParams {
  paymentIntentId: string;
  customerId?: string;
  ipAddress?: string;
  userAgent?: string;
  billingAddress?: Address;
  shippingAddress?: Address;
  amount: number;
  currency: string;
}

export interface RiskEvaluationResult {
  score: number;
  level: 'low' | 'medium' | 'high' | 'unknown';
  reasons: string[];
  recommendations: string[];
}

export interface RiskRule {
  id: string;
  name: string;
  description: string;
  action: 'block' | 'review' | 'allow';
  enabled: boolean;
  priority: number;
}

export interface UseOneClickCheckoutReturn {
  isReady: Readonly<Ref<boolean>>;
  loading: Readonly<Ref<boolean>>;
  setup: (customerId: string) => Promise<void>;
  checkout: (params: OneClickCheckoutParams) => Promise<PaymentResult<UnifiedPaymentIntent>>;
  getSavedPaymentMethods: () => PaymentMethod[];
}

export interface OneClickCheckoutParams {
  amount: number;
  currency: string;
  description?: string;
  paymentMethodId?: string;
  metadata?: Record<string, string>;
}

export interface UseBNPLReturn {
  providers: Readonly<Ref<BNPLProvider[]>>;
  loading: Readonly<Ref<boolean>>;
  getAvailableProviders: (amount: number, currency: string, country: string) => Promise<BNPLProvider[]>;
  createPaymentSession: (provider: string, params: CreatePaymentParams) => Promise<PaymentResult<string>>;
  confirmPaymentSession: (provider: string, sessionId: string) => Promise<PaymentResult<UnifiedPaymentIntent>>;
}

export interface BNPLProvider {
  id: string;
  name: string;
  logoUrl: string;
  minAmount: number;
  maxAmount: number;
  currencies: string[];
  countries: string[];
  installments: number[];
}

export interface UseMobilePaymentReturn {
  availableMethods: Readonly<Ref<MobilePaymentMethod[]>>;
  loading: Readonly<Ref<boolean>>;
  checkAvailability: () => Promise<void>;
  createPaymentRequest: (method: string, params: CreatePaymentParams) => Promise<PaymentResult<string>>;
  abortPayment: (requestId: string) => Promise<void>;
}

export interface MobilePaymentMethod {
  id: string;
  name: string;
  type: 'apple_pay' | 'google_pay' | 'samsung_pay';
  logoUrl: string;
  available: boolean;
  requiresTokenization: boolean;
}

export interface UsePaymentAnalyticsReturn {
  stats: Readonly<Ref<PaymentStats>>;
  loading: Readonly<Ref<boolean>>;
  dateRange: Readonly<Ref<DateRange>>;
  loadStats: (range?: DateRange) => Promise<void>;
  getRevenueTrend: (days: number) => Promise<RevenueTrend[]>;
  getPaymentMethodBreakdown: () => Promise<PaymentMethodBreakdown[]>;
  getFailedPaymentAnalysis: () => Promise<FailedPaymentAnalysis>;
  exportReport: (format: 'csv' | 'json', dateRange: DateRange) => Promise<string>;
}

export interface PaymentStats {
  totalRevenue: number;
  totalTransactions: number;
  successfulTransactions: number;
  failedTransactions: number;
  refundedAmount: number;
  averageTransactionValue: number;
  conversionRate: number;
  mrr: number;
  arr: number;
}

export interface DateRange {
  start: Date;
  end: Date;
}

export interface RevenueTrend {
  date: string;
  revenue: number;
  transactions: number;
}

export interface PaymentMethodBreakdown {
  method: string;
  count: number;
  amount: number;
  percentage: number;
}

export interface FailedPaymentAnalysis {
  totalFailed: number;
  byReason: Record<string, number>;
  recoveryRate: number;
  topDeclineCodes: Array<{ code: string; count: number }>;
}

export interface UseTransactionSearchReturn {
  results: Readonly<Ref<UnifiedPaymentIntent[]>>;
  loading: Readonly<Ref<boolean>>;
  hasMore: Readonly<Ref<boolean>>;
  search: (params: TransactionSearchParams) => Promise<void>;
  loadMore: () => Promise<void>;
  exportResults: (format: 'csv' | 'json') => Promise<string>;
}

export interface TransactionSearchParams {
  query?: string;
  gateway?: PaymentGateway;
  status?: PaymentStatus;
  customerId?: string;
  dateFrom?: Date;
  dateTo?: Date;
  amountMin?: number;
  amountMax?: number;
  currency?: string;
  limit?: number;
  cursor?: string;
}

export interface UsePaymentReceiptsReturn {
  loading: Readonly<Ref<boolean>>;
  error: Readonly<Ref<string | null>>;
  sendReceipt: (paymentIntentId: string, email?: string) => Promise<PaymentResult>;
  resendReceipt: (receiptId: string) => Promise<PaymentResult>;
  getReceipt: (receiptId: string) => Promise<PaymentResult<string>>;
  previewReceipt: (paymentIntentId: string) => Promise<PaymentResult<string>>;
  configureTemplate: (template: ReceiptTemplate) => Promise<PaymentResult>;
}

export interface ReceiptTemplate {
  headerHtml?: string;
  footerHtml?: string;
  logoUrl?: string;
  primaryColor?: string;
  includeQrCode: boolean;
  language: string;
}

export interface UseWebhookTestingReturn {
  events: Readonly<Ref<WebhookTestEvent[]>>;
  loading: Readonly<Ref<boolean>>;
  sendTestEvent: (eventType: string, payload?: Record<string, unknown>) => Promise<PaymentResult>;
  replayEvent: (eventId: string) => Promise<PaymentResult>;
  inspectPayload: (eventType: string) => Promise<Record<string, unknown>>;
  validateEndpoint: (url: string) => Promise<PaymentResult<boolean>>;
}

export interface WebhookTestEvent {
  id: string;
  type: string;
  status: 'pending' | 'sent' | 'delivered' | 'failed';
  payload: Record<string, unknown>;
  sentAt?: string;
  responseStatus?: number;
  responseBody?: string;
}

export interface UsePaymentLinksReturn {
  links: Readonly<Ref<PaymentLink[]>>;
  loading: Readonly<Ref<boolean>>;
  createLink: (params: CreatePaymentLinkParams) => Promise<PaymentResult<PaymentLink>>;
  deactivateLink: (linkId: string) => Promise<PaymentResult>;
  updateLink: (linkId: string, params: Partial<CreatePaymentLinkParams>) => Promise<PaymentResult<PaymentLink>>;
  getLinkStats: (linkId: string) => Promise<PaymentLinkStats>;
}

export interface PaymentLink {
  id: string;
  url: string;
  amount: number;
  currency: string;
  description?: string;
  active: boolean;
  expiresAt?: string;
  maxPayments?: number;
  paymentCount: number;
  createdAt: string;
}

export interface CreatePaymentLinkParams {
  amount: number;
  currency: string;
  description?: string;
  expiresAt?: Date;
  maxPayments?: number;
  metadata?: Record<string, string>;
  allowMultipleAmounts?: boolean;
  allowedPaymentMethods?: string[];
  successUrl?: string;
  cancelUrl?: string;
}

export interface PaymentLinkStats {
  views: number;
  uniqueViews: number;
  payments: number;
  conversionRate: number;
  totalRevenue: number;
}

export interface PaymentEventHooks {
  beforePayment: (params: CreatePaymentParams) => Promise<void | { cancel: boolean; reason?: string }>;
  afterPayment: (result: PaymentResult<UnifiedPaymentIntent>) => Promise<void>;
  onPaymentSuccess: (payment: UnifiedPaymentIntent) => Promise<void>;
  onPaymentFailure: (error: PaymentError, params: CreatePaymentParams) => Promise<void>;
  onPaymentRetry: (attempt: number, error: PaymentError) => Promise<void>;
}

export interface UsePaymentHooksReturn {
  register: <K extends keyof PaymentEventHooks>(
    event: K,
    handler: PaymentEventHooks[K]
  ) => () => void;
  unregister: <K extends keyof PaymentEventHooks>(event: K, handler: PaymentEventHooks[K]) => void;
  emit: <K extends keyof PaymentEventHooks>(
    event: K,
    ...args: Parameters<PaymentEventHooks[K]>
  ) => Promise<void>;
}

export interface UseSandboxModeReturn {
  isSandbox: Readonly<Ref<boolean>>;
  testCards: TestCard[];
  testScenarios: TestScenario[];
  enable: () => void;
  disable: () => void;
  toggle: () => void;
  simulateScenario: (scenarioId: string) => Promise<PaymentResult>;
  resetTestData: () => Promise<void>;
}

export interface TestCard {
  brand: string;
  number: string;
  cvc: string;
  expiry: string;
  description: string;
}

export interface TestScenario {
  id: string;
  name: string;
  description: string;
  expectedResult: 'success' | 'failure' | '3ds_required' | 'review';
}

export interface UseComplianceReportingReturn {
  reports: Readonly<Ref<ComplianceReport[]>>;
  loading: Readonly<Ref<boolean>>;
  generateReport: (type: ComplianceReportType, dateRange: DateRange) => Promise<PaymentResult<string>>;
  getReportStatus: (reportId: string) => Promise<ComplianceReportStatus>;
  downloadReport: (reportId: string) => Promise<string>;
  scheduleReport: (config: ScheduledReportConfig) => Promise<PaymentResult>;
}

export type ComplianceReportType = 'tax' | 'revenue' | 'refund' | 'dispute' | 'full';

export interface ComplianceReport {
  id: string;
  type: ComplianceReportType;
  status: 'generating' | 'ready' | 'failed';
  createdAt: string;
  completedAt?: string;
  downloadUrl?: string;
  expiresAt?: string;
}

export interface ComplianceReportStatus {
  status: 'generating' | 'ready' | 'failed';
  progress?: number;
  error?: string;
}

export interface ScheduledReportConfig {
  type: ComplianceReportType;
  frequency: 'daily' | 'weekly' | 'monthly' | 'quarterly';
  emailRecipients: string[];
  format: 'csv' | 'pdf' | 'json';
}

export interface UseMultiCurrencyReturn {
  supportedCurrencies: Readonly<Ref<CurrencyInfo[]>>;
  currentCurrency: Readonly<Ref<string>>;
  exchangeRates: Readonly<Ref<Record<string, number>>>;
  loading: Readonly<Ref<boolean>>;
  convert: (amount: number, from: string, to: string) => Promise<number>;
  format: (amount: number, currency: string, locale?: string) => string;
  setCurrency: (currency: string) => void;
  getMinimumAmount: (currency: string) => number;
  refreshRates: () => Promise<void>;
}

export interface CurrencyInfo {
  code: string;
  name: string;
  symbol: string;
  decimals: number;
  supported: boolean;
}

export interface UseDiscountCouponReturn {
  coupons: Readonly<Ref<Coupon[]>>;
  loading: Readonly<Ref<boolean>>;
  validateCoupon: (code: string, amount: number, currency: string) => Promise<CouponValidationResult>;
  applyCoupon: (code: string, paymentIntentId: string) => Promise<PaymentResult<UnifiedPaymentIntent>>;
  removeCoupon: (paymentIntentId: string) => Promise<PaymentResult<UnifiedPaymentIntent>>;
  calculateDiscount: (code: string, amount: number, currency: string) => Promise<number>;
  createCoupon: (params: CreateCouponParams) => Promise<PaymentResult<Coupon>>;
  deactivateCoupon: (couponId: string) => Promise<PaymentResult>;
}

export interface Coupon {
  id: string;
  code: string;
  name: string;
  type: 'percentage' | 'fixed_amount';
  value: number;
  currency?: string;
  validFrom?: string;
  validUntil?: string;
  maxRedemptions?: number;
  redemptionCount: number;
  active: boolean;
  appliesTo: {
    products?: string[];
    categories?: string[];
  };
}

export interface CouponValidationResult {
  valid: boolean;
  coupon?: Coupon;
  discountAmount: number;
  finalAmount: number;
  error?: string;
}

export interface CreateCouponParams {
  code: string;
  name: string;
  type: 'percentage' | 'fixed_amount';
  value: number;
  currency?: string;
  validFrom?: Date;
  validUntil?: Date;
  maxRedemptions?: number;
  appliesTo?: {
    products?: string[];
    categories?: string[];
  };
}

export interface UseInvoiceGenerationReturn {
  loading: Readonly<Ref<boolean>>;
  error: Readonly<Ref<string | null>>;
  generate: (params: GenerateInvoiceParams) => Promise<PaymentResult<UnifiedInvoice>>;
  send: (invoiceId: string, email?: string) => Promise<PaymentResult>;
  void: (invoiceId: string) => Promise<PaymentResult>;
  finalize: (invoiceId: string) => Promise<PaymentResult<UnifiedInvoice>>;
  getPdf: (invoiceId: string) => Promise<string>;
  customizeTemplate: (template: InvoiceTemplate) => Promise<PaymentResult>;
}

export interface GenerateInvoiceParams {
  customerId: string;
  items: InvoiceItemParams[];
  description?: string;
  dueDays?: number;
  autoAdvance?: boolean;
  defaultTaxRates?: string[];
  metadata?: Record<string, string>;
}

export interface InvoiceItemParams {
  description: string;
  amount: number;
  currency: string;
  quantity?: number;
  taxRates?: string[];
}

export interface InvoiceTemplate {
  logoUrl?: string;
  brandColor?: string;
  footerText?: string;
  termsAndConditions?: string;
  showQrCode: boolean;
}

export interface UseRefundManagementReturn {
  loading: Readonly<Ref<boolean>>;
  error: Readonly<Ref<string | null>>;
  processRefund: (params: RefundParams) => Promise<PaymentResult<UnifiedPaymentIntent>>;
  getRefundStatus: (refundId: string) => Promise<PaymentResult>;
  cancelRefund: (refundId: string) => Promise<PaymentResult>;
  getRefundHistory: (paymentIntentId: string) => Promise<RefundHistoryItem[]>;
  canRefund: (paymentIntentId: string, amount?: number) => Promise<boolean>;
}

export interface RefundHistoryItem {
  id: string;
  amount: number;
  status: 'pending' | 'succeeded' | 'failed' | 'canceled';
  reason?: string;
  createdAt: string;
}
