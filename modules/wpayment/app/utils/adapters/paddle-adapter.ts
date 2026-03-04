import type {
  PaymentGatewayAdapter,
  CreatePaymentParams,
  PaymentResult,
  UnifiedPaymentIntent,
  UnifiedSubscription,
  UnifiedCustomer,
  CreateSubscriptionParams,
  RefundParams,
} from '../types/gateway-adapter';

interface PaddleConfig {
  vendorId: string;
  vendorAuthCode: string;
  environment?: 'sandbox' | 'production';
}

export class PaddleGatewayAdapter implements PaymentGatewayAdapter {
  readonly gateway = 'paddle';
  private config: PaddleConfig;
  private baseUrl: string;

  constructor(config?: PaddleConfig) {
    if (!config?.vendorId || !config?.vendorAuthCode) {
      throw new Error('Paddle vendorId and vendorAuthCode are required');
    }
    this.config = config;
    this.baseUrl = config.environment === 'production'
      ? 'https://vendors.paddle.com/api/2.0'
      : 'https://sandbox-vendors.paddle.com/api/2.0';
  }

  private async apiRequest<T>(endpoint: string, data: Record<string, unknown>): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;

    const formData = new URLSearchParams();
    formData.append('vendor_id', this.config.vendorId);
    formData.append('vendor_auth_code', this.config.vendorAuthCode);

    for (const [key, value] of Object.entries(data)) {
      if (value !== undefined && value !== null) {
        formData.append(key, String(value));
      }
    }

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: formData.toString(),
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Paddle API error: ${error}`);
    }

    const result = await response.json() as { success: boolean; error?: { message: string }; response?: T };

    if (!result.success) {
      throw new Error(result.error?.message || 'Paddle API request failed');
    }

    return result.response as T;
  }

  async createPayment(params: CreatePaymentParams): Promise<PaymentResult<UnifiedPaymentIntent>> {
    try {
      // Paddle uses product/generate_pay_link for one-time payments
      const response = await this.apiRequest<{
        url: string;
        id?: string;
      }>('/product/generate_pay_link', {
        product_id: params.metadata?.productId,
        title: params.description || 'One-time payment',
        prices: [{
          currency: params.currency.toUpperCase(),
          price: (params.amount / 100).toFixed(2),
        }],
        customer_email: params.customerEmail,
        customer_id: params.customerId,
        return_url: params.metadata?.returnUrl,
        webhook_url: params.metadata?.webhookUrl,
        passthrough: JSON.stringify(params.metadata || {}),
      });

      return {
        success: true,
        data: {
          id: response.id || '',
          gateway: 'paddle',
          amount: params.amount,
          currency: params.currency.toUpperCase(),
          status: 'pending',
          customerId: params.customerId,
          customerEmail: params.customerEmail,
          description: params.description,
          metadata: params.metadata,
          clientSecret: response.url, // Payment URL
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
      };
    } catch (err) {
      return {
        success: false,
        error: {
          code: 'payment_failed',
          message: err instanceof Error ? err.message : 'Failed to create Paddle payment link',
          retryable: true,
        },
      };
    }
  }

  async createSubscription(params: CreateSubscriptionParams): Promise<PaymentResult<UnifiedSubscription>> {
    try {
      // Paddle uses subscription/users/create for subscriptions
      const response = await this.apiRequest<{
        subscription_id: string;
        user_id: string;
        plan_id: string;
        signup_url?: string;
      }>('/subscription/users/create', {
        plan_id: params.priceId,
        subscription_id: params.metadata?.subscriptionId,
        user_id: params.customerId,
        passthrough: JSON.stringify(params.metadata || {}),
        prorated_charges: params.prorationBehavior === 'always_invoice' ? 1 : 0,
      });

      return {
        success: true,
        data: {
          id: response.subscription_id,
          gateway: 'paddle',
          customerId: response.user_id,
          status: 'incomplete',
          planId: response.plan_id,
          planName: '',
          quantity: params.quantity || 1,
          currentPeriodStart: new Date().toISOString(),
          currentPeriodEnd: '',
          trialStart: params.trialDays
            ? new Date().toISOString()
            : undefined,
          trialEnd: params.trialDays
            ? new Date(Date.now() + params.trialDays * 86400000).toISOString()
            : undefined,
          cancelAtPeriodEnd: params.cancelAtPeriodEnd || false,
          metadata: params.metadata || {},
          createdAt: new Date().toISOString(),
        },
      };
    } catch (err) {
      return {
        success: false,
        error: {
          code: 'subscription_failed',
          message: err instanceof Error ? err.message : 'Failed to create Paddle subscription',
          retryable: false,
        },
      };
    }
  }

  async cancelSubscription(subscriptionId: string): Promise<PaymentResult<UnifiedSubscription>> {
    try {
      await this.apiRequest<void>('/subscription/users_cancel', {
        subscription_id: subscriptionId,
      });

      return {
        success: true,
        data: {
          id: subscriptionId,
          gateway: 'paddle',
          customerId: '',
          status: 'canceled',
          planId: '',
          planName: '',
          quantity: 1,
          currentPeriodStart: '',
          currentPeriodEnd: '',
          cancelAtPeriodEnd: true,
          canceledAt: new Date().toISOString(),
          metadata: {},
          createdAt: new Date().toISOString(),
        },
      };
    } catch (err) {
      return {
        success: false,
        error: {
          code: 'cancel_failed',
          message: err instanceof Error ? err.message : 'Failed to cancel Paddle subscription',
          retryable: false,
        },
      };
    }
  }

  async updateSubscription(
    subscriptionId: string,
    params: { planId?: string; quantity?: number; prorationBehavior?: string },
  ): Promise<PaymentResult<UnifiedSubscription>> {
    try {
      await this.apiRequest<void>('/subscription/users/update', {
        subscription_id: subscriptionId,
        plan_id: params.planId,
        quantity: params.quantity,
        prorated_charges: params.prorationBehavior === 'always_invoice' ? 1 : 0,
      });

      return {
        success: true,
        data: {
          id: subscriptionId,
          gateway: 'paddle',
          customerId: '',
          status: 'active',
          planId: params.planId || '',
          planName: '',
          quantity: params.quantity || 1,
          currentPeriodStart: '',
          currentPeriodEnd: '',
          cancelAtPeriodEnd: false,
          metadata: {},
          createdAt: new Date().toISOString(),
        },
      };
    } catch (err) {
      return {
        success: false,
        error: {
          code: 'update_failed',
          message: err instanceof Error ? err.message : 'Failed to update Paddle subscription',
          retryable: false,
        },
      };
    }
  }

  async createCustomer(params: {
    email: string;
    name?: string;
  }): Promise<PaymentResult<UnifiedCustomer>> {
    try {
      // Paddle creates customers implicitly through purchases
      // We'll return a placeholder customer
      return {
        success: true,
        data: {
          id: `cus_${Date.now()}`,
          gateway: 'paddle',
          email: params.email,
          name: params.name,
          balance: 0,
          metadata: {},
          createdAt: new Date().toISOString(),
        },
      };
    } catch (err) {
      return {
        success: false,
        error: {
          code: 'customer_failed',
          message: err instanceof Error ? err.message : 'Failed to create Paddle customer',
          retryable: false,
        },
      };
    }
  }

  async confirmPayment(): Promise<PaymentResult<UnifiedPaymentIntent>> {
    return {
      success: false,
      error: {
        code: 'not_supported',
        message: 'Paddle uses webhooks for payment confirmation',
        retryable: false,
      },
    };
  }

  async retrievePayment(): Promise<PaymentResult<UnifiedPaymentIntent>> {
    return {
      success: false,
      error: {
        code: 'not_supported',
        message: 'Use Paddle webhooks or dashboard for payment retrieval',
        retryable: false,
      },
    };
  }

  async refundPayment(params: RefundParams): Promise<PaymentResult<UnifiedPaymentIntent>> {
    try {
      // Paddle refunds via payments/refund
      const response = await this.apiRequest<{
        refund_id: string;
      }>('/payments/refund', {
        order_id: params.paymentIntentId,
        amount: params.amount ? (params.amount / 100).toFixed(2) : undefined,
        reason: params.reason,
      });

      return {
        success: true,
        data: {
          id: response.refund_id,
          gateway: 'paddle',
          amount: params.amount || 0,
          currency: 'USD',
          status: 'refunded',
          metadata: params.metadata || {},
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
      };
    } catch (err) {
      return {
        success: false,
        error: {
          code: 'refund_failed',
          message: err instanceof Error ? err.message : 'Failed to process Paddle refund',
          retryable: false,
        },
      };
    }
  }

  async retrieveCustomer(): Promise<PaymentResult<UnifiedCustomer>> {
    return {
      success: false,
      error: {
        code: 'not_supported',
        message: 'Paddle customer retrieval is limited - use webhook data',
        retryable: false,
      },
    };
  }

  supportsSubscriptions(): boolean {
    return true;
  }

  supportsInvoices(): boolean {
    return false;
  }

  supportsPaymentMethods(): boolean {
    return false;
  }

  supportsRefunds(): boolean {
    return true;
  }

  isMerchantOfRecord(): boolean {
    return true; // Paddle is a Merchant of Record
  }
}
