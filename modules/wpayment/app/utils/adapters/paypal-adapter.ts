import type {
  PaymentGatewayAdapter,
  CreatePaymentParams,
  PaymentResult,
  UnifiedPaymentIntent,
  UnifiedCustomer,
  PaymentMethod,
  RefundParams,
} from '../types/gateway-adapter';

interface PayPalConfig {
  clientId: string;
  clientSecret: string;
  environment?: 'sandbox' | 'production';
}

export class PayPalGatewayAdapter implements PaymentGatewayAdapter {
  readonly gateway = 'paypal';
  private config: PayPalConfig;
  private baseUrl: string;
  private accessToken: string | null = null;

  constructor(config?: PayPalConfig) {
    if (!config?.clientId || !config?.clientSecret) {
      throw new Error('PayPal clientId and clientSecret are required');
    }
    this.config = config;
    this.baseUrl = config.environment === 'production'
      ? 'https://api-m.paypal.com'
      : 'https://api-m.sandbox.paypal.com';
  }

  private async getAccessToken(): Promise<string> {
    if (this.accessToken) return this.accessToken;

    const auth = Buffer.from(`${this.config.clientId}:${this.config.clientSecret}`).toString('base64');
    const response = await fetch(`${this.baseUrl}/v1/oauth2/token`, {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${auth}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: 'grant_type=client_credentials',
    });

    if (!response.ok) {
      throw new Error('Failed to get PayPal access token');
    }

    const data = await response.json() as { access_token: string };
    this.accessToken = data.access_token;
    return this.accessToken;
  }

  private async apiRequest<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const token = await this.getAccessToken();
    const url = `${this.baseUrl}${endpoint}`;

    const response = await fetch(url, {
      ...options,
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
        ...options.headers,
      },
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`PayPal API error: ${error}`);
    }

    return response.json() as Promise<T>;
  }

  async createPayment(params: CreatePaymentParams): Promise<PaymentResult<UnifiedPaymentIntent>> {
    try {
      const order = await this.apiRequest<{
        id: string;
        status: string;
        links: Array<{ rel: string; href: string }>;
      }>('/v2/checkout/orders', {
        method: 'POST',
        body: JSON.stringify({
          intent: 'CAPTURE',
          purchase_units: [{
            amount: {
              currency_code: params.currency.toUpperCase(),
              value: (params.amount / 100).toFixed(2),
            },
            description: params.description,
            custom_id: params.metadata?.orderId,
          }],
          payer: params.customerEmail ? {
            email_address: params.customerEmail,
          } : undefined,
        }),
      });

      const approvalLink = order.links.find(l => l.rel === 'approve')?.href;

      return {
        success: true,
        data: {
          id: order.id,
          gateway: 'paypal',
          amount: params.amount,
          currency: params.currency.toUpperCase(),
          status: order.status === 'CREATED' ? 'pending' : 'processing',
          customerId: params.customerId,
          customerEmail: params.customerEmail,
          description: params.description,
          metadata: params.metadata,
          clientSecret: approvalLink, // PayPal uses approval URL instead of clientSecret
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
      };
    } catch (err) {
      return {
        success: false,
        error: {
          code: 'payment_failed',
          message: err instanceof Error ? err.message : 'Failed to create PayPal payment',
          retryable: true,
        },
      };
    }
  }

  async confirmPayment(paymentId: string): Promise<PaymentResult<UnifiedPaymentIntent>> {
    try {
      const capture = await this.apiRequest<{
        id: string;
        status: string;
        purchase_units: Array<{ payments: { captures: Array<{ id: string; status: string }> } }>;
      }>(`/v2/checkout/orders/${paymentId}/capture`, {
        method: 'POST',
      });

      const captureData = capture.purchase_units[0]?.payments?.captures[0];

      return {
        success: true,
        data: {
          id: paymentId,
          gateway: 'paypal',
          amount: 0,
          currency: 'USD',
          status: capture.status === 'COMPLETED' ? 'completed' : 'processing',
          metadata: {},
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
      };
    } catch (err) {
      return {
        success: false,
        error: {
          code: 'confirm_failed',
          message: err instanceof Error ? err.message : 'Failed to capture PayPal payment',
          retryable: true,
        },
      };
    }
  }

  async retrievePayment(paymentId: string): Promise<PaymentResult<UnifiedPaymentIntent>> {
    try {
      const order = await this.apiRequest<{
        id: string;
        status: string;
        purchase_units: Array<{ amount: { value: string; currency_code: string } }>;
      }>(`/v2/checkout/orders/${paymentId}`);

      const amount = parseFloat(order.purchase_units[0]?.amount?.value || '0') * 100;

      return {
        success: true,
        data: {
          id: order.id,
          gateway: 'paypal',
          amount,
          currency: order.purchase_units[0]?.amount?.currency_code || 'USD',
          status: this.mapPayPalStatus(order.status),
          metadata: {},
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
      };
    } catch (err) {
      return {
        success: false,
        error: {
          code: 'retrieve_failed',
          message: err instanceof Error ? err.message : 'Failed to retrieve PayPal payment',
          retryable: false,
        },
      };
    }
  }

  async refundPayment(params: RefundParams): Promise<PaymentResult<UnifiedPaymentIntent>> {
    try {
      // PayPal refunds are done via the captures endpoint
      const refund = await this.apiRequest<{
        id: string;
        status: string;
      }>('/v2/payments/captures/refund', {
        method: 'POST',
        body: JSON.stringify({
          amount: params.amount ? {
            value: (params.amount / 100).toFixed(2),
            currency_code: 'USD',
          } : undefined,
          invoice_id: params.metadata?.invoiceId,
          note_to_payer: params.reason,
        }),
      });

      return {
        success: true,
        data: {
          id: refund.id,
          gateway: 'paypal',
          amount: params.amount || 0,
          currency: 'USD',
          status: refund.status === 'COMPLETED' ? 'refunded' : 'pending',
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
          message: err instanceof Error ? err.message : 'Failed to process PayPal refund',
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
      const customer = await this.apiRequest<{
        id: string;
        email_address: string;
        name?: { given_name?: string; surname?: string };
      }>('/v2/customers', {
        method: 'POST',
        body: JSON.stringify({
          email_address: params.email,
          name: params.name ? {
            given_name: params.name.split(' ')[0],
            surname: params.name.split(' ').slice(1).join(' '),
          } : undefined,
        }),
      });

      return {
        success: true,
        data: {
          id: customer.id,
          gateway: 'paypal',
          email: customer.email_address,
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
          message: err instanceof Error ? err.message : 'Failed to create PayPal customer',
          retryable: false,
        },
      };
    }
  }

  async retrieveCustomer(customerId: string): Promise<PaymentResult<UnifiedCustomer>> {
    try {
      const customer = await this.apiRequest<{
        id: string;
        email_address: string;
        name?: { given_name?: string; surname?: string };
      }>(`/v2/customers/${customerId}`);

      return {
        success: true,
        data: {
          id: customer.id,
          gateway: 'paypal',
          email: customer.email_address,
          name: customer.name ? `${customer.name.given_name || ''} ${customer.name.surname || ''}`.trim() : undefined,
          balance: 0,
          metadata: {},
          createdAt: new Date().toISOString(),
        },
      };
    } catch (err) {
      return {
        success: false,
        error: {
          code: 'retrieve_failed',
          message: err instanceof Error ? err.message : 'Failed to retrieve PayPal customer',
          retryable: false,
        },
      };
    }
  }

  private mapPayPalStatus(status: string): 'pending' | 'processing' | 'completed' | 'failed' | 'refunded' | 'canceled' {
    const statusMap: Record<string, typeof status> = {
      'CREATED': 'pending',
      'SAVED': 'pending',
      'APPROVED': 'processing',
      'VOIDED': 'canceled',
      'COMPLETED': 'completed',
      'PAYER_ACTION_REQUIRED': 'pending',
    };
    return (statusMap[status] || 'pending') as 'pending' | 'processing' | 'completed' | 'failed' | 'refunded' | 'canceled';
  }

  supportsSubscriptions(): boolean {
    return false; // PayPal subscriptions require separate implementation
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
    return false;
  }
}
