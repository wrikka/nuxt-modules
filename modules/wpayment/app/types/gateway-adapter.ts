import type {
  CreatePaymentParams,
  PaymentResult,
  UnifiedPaymentIntent,
  UnifiedSubscription,
  UnifiedInvoice,
  UnifiedCustomer,
  PaymentMethod,
  CreateSubscriptionParams,
  RefundParams,
} from '../types/unified-payment';

export interface PaymentGatewayAdapter {
  readonly gateway: string;

  // Payment Operations
  createPayment(params: CreatePaymentParams): Promise<PaymentResult<UnifiedPaymentIntent>>;
  confirmPayment(paymentId: string, params?: unknown): Promise<PaymentResult<UnifiedPaymentIntent>>;
  retrievePayment(paymentId: string): Promise<PaymentResult<UnifiedPaymentIntent>>;
  refundPayment(params: RefundParams): Promise<PaymentResult<UnifiedPaymentIntent>>;

  // Subscription Operations
  createSubscription?(params: CreateSubscriptionParams): Promise<PaymentResult<UnifiedSubscription>>;
  retrieveSubscription?(subscriptionId: string): Promise<PaymentResult<UnifiedSubscription>>;
  cancelSubscription?(subscriptionId: string, params?: unknown): Promise<PaymentResult<UnifiedSubscription>>;
  updateSubscription?(subscriptionId: string, params: unknown): Promise<PaymentResult<UnifiedSubscription>>;

  // Customer Operations
  createCustomer?(params: { email: string; name?: string; metadata?: Record<string, string> }): Promise<PaymentResult<UnifiedCustomer>>;
  retrieveCustomer?(customerId: string): Promise<PaymentResult<UnifiedCustomer>>;

  // Payment Method Operations
  listPaymentMethods?(customerId: string): Promise<PaymentResult<PaymentMethod[]>>;
  attachPaymentMethod?(paymentMethodId: string, customerId: string): Promise<PaymentResult>;
  detachPaymentMethod?(paymentMethodId: string): Promise<PaymentResult>;

  // Invoice Operations
  createInvoice?(params: unknown): Promise<PaymentResult<UnifiedInvoice>>;
  retrieveInvoice?(invoiceId: string): Promise<PaymentResult<UnifiedInvoice>>;

  // Webhook Handling
  verifyWebhook?(payload: string | Buffer, signature: string, secret: string): Promise<unknown>;

  // Gateway Capabilities
  supportsSubscriptions(): boolean;
  supportsInvoices(): boolean;
  supportsPaymentMethods(): boolean;
  supportsRefunds(): boolean;
  isMerchantOfRecord(): boolean;
}

export interface GatewayConfig {
  stripe?: {
    publishableKey: string;
    secretKey: string;
    webhookSecret?: string;
  };
  paypal?: {
    clientId: string;
    clientSecret: string;
    environment?: 'sandbox' | 'production';
  };
  lemonsqueezy?: {
    apiKey: string;
    storeId?: string;
  };
  paddle?: {
    vendorId: string;
    vendorAuthCode: string;
    environment?: 'sandbox' | 'production';
  };
}
