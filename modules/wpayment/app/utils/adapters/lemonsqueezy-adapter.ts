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

interface LemonSqueezyConfig {
  apiKey: string;
  storeId?: string;
}

export class LemonSqueezyGatewayAdapter implements PaymentGatewayAdapter {
  readonly gateway = 'lemonsqueezy';
  private config: LemonSqueezyConfig;
  private baseUrl = 'https://api.lemonsqueezy.com/v1';

  constructor(config?: LemonSqueezyConfig) {
    if (!config?.apiKey) {
      throw new Error('Lemon Squeezy API key is required');
    }
    this.config = config;
  }

  private async apiRequest<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;

    const response = await fetch(url, {
      ...options,
      headers: {
        'Accept': 'application/vnd.api+json',
        'Content-Type': 'application/vnd.api+json',
        'Authorization': `Bearer ${this.config.apiKey}`,
        ...options.headers,
      },
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Lemon Squeezy API error: ${error}`);
    }

    return response.json() as Promise<T>;
  }

  async createPayment(params: CreatePaymentParams): Promise<PaymentResult<UnifiedPaymentIntent>> {
    try {
      // Lemon Squeezy uses checkouts for one-time payments
      const checkout = await this.apiRequest<{
        data: {
          id: string;
          attributes: {
            url: string;
            status: string;
          };
        };
      }>('/checkouts', {
        method: 'POST',
        body: JSON.stringify({
          data: {
            type: 'checkouts',
            attributes: {
              custom_price: params.amount,
              product_options: {
                name: params.description || 'One-time payment',
                description: params.description,
              },
              checkout_options: {
                embed: false,
              },
              preview: false,
            },
            relationships: {
              store: {
                data: {
                  type: 'stores',
                  id: this.config.storeId || '',
                },
              },
            },
          },
        }),
      });

      return {
        success: true,
        data: {
          id: checkout.data.id,
          gateway: 'lemonsqueezy',
          amount: params.amount,
          currency: params.currency.toUpperCase(),
          status: 'pending',
          customerId: params.customerId,
          customerEmail: params.customerEmail,
          description: params.description,
          metadata: params.metadata,
          clientSecret: checkout.data.attributes.url, // Checkout URL
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
      };
    } catch (err) {
      return {
        success: false,
        error: {
          code: 'payment_failed',
          message: err instanceof Error ? err.message : 'Failed to create Lemon Squeezy checkout',
          retryable: true,
        },
      };
    }
  }

  async createSubscription(params: CreateSubscriptionParams): Promise<PaymentResult<UnifiedSubscription>> {
    try {
      // Lemon Squeezy uses subscriptions API
      const subscription = await this.apiRequest<{
        data: {
          id: string;
          attributes: {
            status: string;
            trial_ends_at: string | null;
            renews_at: string;
            ends_at: string | null;
            created_at: string;
          };
          relationships: {
            customer: {
              data: { id: string };
            };
            product: {
              data: { id: string };
            };
            variant: {
              data: { id: string };
            };
          };
        };
      }>('/subscriptions', {
        method: 'POST',
        body: JSON.stringify({
          data: {
            type: 'subscriptions',
            attributes: {
              product_id: params.priceId, // In LS, priceId is the variant ID
              variant_id: params.priceId,
              customer_id: params.customerId,
            },
          },
        }),
      });

      return {
        success: true,
        data: {
          id: subscription.data.id,
          gateway: 'lemonsqueezy',
          customerId: subscription.data.relationships.customer.data.id,
          status: this.mapLemonSqueezyStatus(subscription.data.attributes.status),
          planId: subscription.data.relationships.variant.data.id,
          planName: '',
          quantity: params.quantity || 1,
          currentPeriodStart: subscription.data.attributes.created_at,
          currentPeriodEnd: subscription.data.attributes.renews_at,
          trialStart: subscription.data.attributes.trial_ends_at
            ? subscription.data.attributes.created_at
            : undefined,
          trialEnd: subscription.data.attributes.trial_ends_at || undefined,
          cancelAtPeriodEnd: !!subscription.data.attributes.ends_at,
          canceledAt: subscription.data.attributes.ends_at || undefined,
          metadata: params.metadata || {},
          createdAt: subscription.data.attributes.created_at,
        },
      };
    } catch (err) {
      return {
        success: false,
        error: {
          code: 'subscription_failed',
          message: err instanceof Error ? err.message : 'Failed to create Lemon Squeezy subscription',
          retryable: false,
        },
      };
    }
  }

  async cancelSubscription(subscriptionId: string): Promise<PaymentResult<UnifiedSubscription>> {
    try {
      const subscription = await this.apiRequest<{
        data: {
          id: string;
          attributes: {
            status: string;
            ends_at: string;
          };
        };
      }>(`/subscriptions/${subscriptionId}`, {
        method: 'DELETE',
      });

      return {
        success: true,
        data: {
          id: subscription.data.id,
          gateway: 'lemonsqueezy',
          customerId: '',
          status: 'canceled',
          planId: '',
          planName: '',
          quantity: 1,
          currentPeriodStart: '',
          currentPeriodEnd: '',
          cancelAtPeriodEnd: true,
          canceledAt: subscription.data.attributes.ends_at,
          metadata: {},
          createdAt: new Date().toISOString(),
        },
      };
    } catch (err) {
      return {
        success: false,
        error: {
          code: 'cancel_failed',
          message: err instanceof Error ? err.message : 'Failed to cancel Lemon Squeezy subscription',
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
        data: {
          id: string;
          attributes: {
            email: string;
            name: string;
            created_at: string;
          };
        };
      }>('/customers', {
        method: 'POST',
        body: JSON.stringify({
          data: {
            type: 'customers',
            attributes: {
              email: params.email,
              name: params.name || params.email,
            },
          },
        }),
      });

      return {
        success: true,
        data: {
          id: customer.data.id,
          gateway: 'lemonsqueezy',
          email: customer.data.attributes.email,
          name: customer.data.attributes.name,
          balance: 0,
          metadata: {},
          createdAt: customer.data.attributes.created_at,
        },
      };
    } catch (err) {
      return {
        success: false,
        error: {
          code: 'customer_failed',
          message: err instanceof Error ? err.message : 'Failed to create Lemon Squeezy customer',
          retryable: false,
        },
      };
    }
  }

  async retrieveCustomer(customerId: string): Promise<PaymentResult<UnifiedCustomer>> {
    try {
      const customer = await this.apiRequest<{
        data: {
          id: string;
          attributes: {
            email: string;
            name: string;
            created_at: string;
          };
        };
      }>(`/customers/${customerId}`);

      return {
        success: true,
        data: {
          id: customer.data.id,
          gateway: 'lemonsqueezy',
          email: customer.data.attributes.email,
          name: customer.data.attributes.name,
          balance: 0,
          metadata: {},
          createdAt: customer.data.attributes.created_at,
        },
      };
    } catch (err) {
      return {
        success: false,
        error: {
          code: 'retrieve_failed',
          message: err instanceof Error ? err.message : 'Failed to retrieve Lemon Squeezy customer',
          retryable: false,
        },
      };
    }
  }

  async confirmPayment(): Promise<PaymentResult<UnifiedPaymentIntent>> {
    // Lemon Squeezy doesn't have a direct confirm API - payments are confirmed via webhooks
    return {
      success: false,
      error: {
        code: 'not_supported',
        message: 'Lemon Squeezy uses webhooks for payment confirmation',
        retryable: false,
      },
    };
  }

  async retrievePayment(): Promise<PaymentResult<UnifiedPaymentIntent>> {
    return {
      success: false,
      error: {
        code: 'not_supported',
        message: 'Use Lemon Squeezy webhooks or dashboard for payment retrieval',
        retryable: false,
      },
    };
  }

  async refundPayment(): Promise<PaymentResult<UnifiedPaymentIntent>> {
    return {
      success: false,
      error: {
        code: 'not_supported',
        message: 'Refunds must be processed via Lemon Squeezy dashboard',
        retryable: false,
      },
    };
  }

  private mapLemonSqueezyStatus(status: string): 'incomplete' | 'incomplete_expired' | 'trialing' | 'active' | 'past_due' | 'canceled' | 'unpaid' | 'paused' {
    const statusMap: Record<string, typeof status> = {
      'on_trial': 'trialing',
      'active': 'active',
      'paused': 'paused',
      'past_due': 'past_due',
      'unpaid': 'unpaid',
      'cancelled': 'canceled',
      'expired': 'canceled',
    };
    return (statusMap[status] || 'incomplete') as 'incomplete' | 'incomplete_expired' | 'trialing' | 'active' | 'past_due' | 'canceled' | 'unpaid' | 'paused';
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
    return false; // Must be done via dashboard
  }

  isMerchantOfRecord(): boolean {
    return true; // Lemon Squeezy is a Merchant of Record
  }
}
