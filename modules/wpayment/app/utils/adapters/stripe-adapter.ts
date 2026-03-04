import type {
  PaymentGatewayAdapter,
  CreatePaymentParams,
  PaymentResult,
  UnifiedPaymentIntent,
  UnifiedSubscription,
  UnifiedCustomer,
  PaymentMethod,
  CreateSubscriptionParams,
  RefundParams,
} from '../types/gateway-adapter';
import {
  createPaymentIntent,
  confirmPaymentIntent,
  retrievePaymentIntent,
  refundPaymentIntent,
  createSubscription,
  retrieveSubscription,
  cancelSubscription,
  updateSubscription,
  createCustomer,
  retrieveCustomer,
  listPaymentMethods,
  attachPaymentMethod,
  detachPaymentMethod,
  toUnifiedPaymentIntent,
  toUnifiedSubscription,
  toUnifiedCustomer,
  toUnifiedPaymentMethod,
} from './stripe-server';

export class StripeGatewayAdapter implements PaymentGatewayAdapter {
  readonly gateway = 'stripe';
  private config?: { publishableKey: string; secretKey: string; webhookSecret?: string };

  constructor(config?: { publishableKey: string; secretKey: string; webhookSecret?: string }) {
    this.config = config;
  }

  async createPayment(params: CreatePaymentParams): Promise<PaymentResult<UnifiedPaymentIntent>> {
    try {
      // Create customer if needed
      let customer = params.customerId;
      if (!customer && params.customerEmail) {
        const newCustomer = await createCustomer({ email: params.customerEmail });
        customer = newCustomer.id;
      }

      const paymentIntent = await createPaymentIntent({
        amount: params.amount,
        currency: params.currency.toLowerCase(),
        customer,
        payment_method: params.paymentMethodId,
        metadata: params.metadata,
      });

      if (params.confirm && params.paymentMethodId) {
        await confirmPaymentIntent(paymentIntent.id);
      }

      const retrieved = await retrievePaymentIntent(paymentIntent.id);
      return { success: true, data: toUnifiedPaymentIntent(retrieved) };
    } catch (err) {
      return {
        success: false,
        error: {
          code: 'payment_failed',
          message: err instanceof Error ? err.message : 'Failed to create payment',
          retryable: true,
        },
      };
    }
  }

  async confirmPayment(
    paymentId: string,
    params?: { paymentMethodId?: string; receiptEmail?: string; returnUrl?: string; offSession?: boolean },
  ): Promise<PaymentResult<UnifiedPaymentIntent>> {
    try {
      await confirmPaymentIntent(paymentId, {
        payment_method: params?.paymentMethodId,
        receipt_email: params?.receiptEmail,
        return_url: params?.returnUrl,
        off_session: params?.offSession,
      });

      const paymentIntent = await retrievePaymentIntent(paymentId);
      return { success: true, data: toUnifiedPaymentIntent(paymentIntent) };
    } catch (err) {
      return {
        success: false,
        error: {
          code: 'confirm_failed',
          message: err instanceof Error ? err.message : 'Failed to confirm payment',
          retryable: true,
        },
      };
    }
  }

  async retrievePayment(paymentId: string): Promise<PaymentResult<UnifiedPaymentIntent>> {
    try {
      const paymentIntent = await retrievePaymentIntent(paymentId);
      return { success: true, data: toUnifiedPaymentIntent(paymentIntent) };
    } catch (err) {
      return {
        success: false,
        error: {
          code: 'retrieve_failed',
          message: err instanceof Error ? err.message : 'Failed to retrieve payment',
          retryable: false,
        },
      };
    }
  }

  async refundPayment(params: RefundParams): Promise<PaymentResult<UnifiedPaymentIntent>> {
    try {
      await refundPaymentIntent(params.paymentIntentId, {
        amount: params.amount,
        reason: params.reason,
        metadata: params.metadata,
      });

      const paymentIntent = await retrievePaymentIntent(params.paymentIntentId);
      return { success: true, data: toUnifiedPaymentIntent(paymentIntent) };
    } catch (err) {
      return {
        success: false,
        error: {
          code: 'refund_failed',
          message: err instanceof Error ? err.message : 'Failed to process refund',
          retryable: false,
        },
      };
    }
  }

  async createSubscription(params: CreateSubscriptionParams): Promise<PaymentResult<UnifiedSubscription>> {
    try {
      const subscription = await createSubscription({
        customer: params.customerId,
        price: params.priceId,
        quantity: params.quantity,
        trial_period_days: params.trialDays,
        default_payment_method: params.defaultPaymentMethodId,
        metadata: params.metadata,
        cancel_at_period_end: params.cancelAtPeriodEnd,
        proration_behavior: params.prorationBehavior,
      });

      return { success: true, data: toUnifiedSubscription(subscription) };
    } catch (err) {
      return {
        success: false,
        error: {
          code: 'subscription_failed',
          message: err instanceof Error ? err.message : 'Failed to create subscription',
          retryable: false,
        },
      };
    }
  }

  async retrieveSubscription(subscriptionId: string): Promise<PaymentResult<UnifiedSubscription>> {
    try {
      const subscription = await retrieveSubscription(subscriptionId);
      return { success: true, data: toUnifiedSubscription(subscription) };
    } catch (err) {
      return {
        success: false,
        error: {
          code: 'retrieve_failed',
          message: err instanceof Error ? err.message : 'Failed to retrieve subscription',
          retryable: false,
        },
      };
    }
  }

  async cancelSubscription(
    subscriptionId: string,
    params?: { invoiceNow?: boolean; prorate?: boolean },
  ): Promise<PaymentResult<UnifiedSubscription>> {
    try {
      const subscription = await cancelSubscription(subscriptionId, {
        invoice_now: params?.invoiceNow,
        prorate: params?.prorate,
      });
      return { success: true, data: toUnifiedSubscription(subscription) };
    } catch (err) {
      return {
        success: false,
        error: {
          code: 'cancel_failed',
          message: err instanceof Error ? err.message : 'Failed to cancel subscription',
          retryable: false,
        },
      };
    }
  }

  async updateSubscription(
    subscriptionId: string,
    params: { items?: unknown[]; metadata?: Record<string, string>; cancelAtPeriodEnd?: boolean },
  ): Promise<PaymentResult<UnifiedSubscription>> {
    try {
      const subscription = await updateSubscription(subscriptionId, {
        metadata: params.metadata,
        cancel_at_period_end: params.cancelAtPeriodEnd,
      });
      return { success: true, data: toUnifiedSubscription(subscription) };
    } catch (err) {
      return {
        success: false,
        error: {
          code: 'update_failed',
          message: err instanceof Error ? err.message : 'Failed to update subscription',
          retryable: false,
        },
      };
    }
  }

  async createCustomer(params: {
    email: string;
    name?: string;
    metadata?: Record<string, string>;
  }): Promise<PaymentResult<UnifiedCustomer>> {
    try {
      const customer = await createCustomer(params);
      return { success: true, data: toUnifiedCustomer(customer) };
    } catch (err) {
      return {
        success: false,
        error: {
          code: 'customer_failed',
          message: err instanceof Error ? err.message : 'Failed to create customer',
          retryable: false,
        },
      };
    }
  }

  async retrieveCustomer(customerId: string): Promise<PaymentResult<UnifiedCustomer>> {
    try {
      const customer = await retrieveCustomer(customerId);
      if (customer.deleted) {
        return {
          success: false,
          error: {
            code: 'customer_deleted',
            message: 'Customer has been deleted',
            retryable: false,
          },
        };
      }
      return { success: true, data: toUnifiedCustomer(customer as import('stripe').Stripe.Customer) };
    } catch (err) {
      return {
        success: false,
        error: {
          code: 'retrieve_failed',
          message: err instanceof Error ? err.message : 'Failed to retrieve customer',
          retryable: false,
        },
      };
    }
  }

  async listPaymentMethods(customerId: string): Promise<PaymentResult<PaymentMethod[]>> {
    try {
      const methods = await listPaymentMethods({
        customer: customerId,
        type: 'card',
        limit: 100,
      });

      const customer = await retrieveCustomer(customerId);
      const defaultPaymentMethodId = (customer as import('stripe').Stripe.Customer).invoice_settings
        ?.default_payment_method as string | undefined;

      return {
        success: true,
        data: methods.data.map(pm => ({
          ...toUnifiedPaymentMethod(pm),
          isDefault: pm.id === defaultPaymentMethodId,
        })),
      };
    } catch (err) {
      return {
        success: false,
        error: {
          code: 'list_failed',
          message: err instanceof Error ? err.message : 'Failed to list payment methods',
          retryable: false,
        },
      };
    }
  }

  async attachPaymentMethod(paymentMethodId: string, customerId: string): Promise<PaymentResult> {
    try {
      await attachPaymentMethod(paymentMethodId, customerId);
      return { success: true };
    } catch (err) {
      return {
        success: false,
        error: {
          code: 'attach_failed',
          message: err instanceof Error ? err.message : 'Failed to attach payment method',
          retryable: false,
        },
      };
    }
  }

  async detachPaymentMethod(paymentMethodId: string): Promise<PaymentResult> {
    try {
      await detachPaymentMethod(paymentMethodId);
      return { success: true };
    } catch (err) {
      return {
        success: false,
        error: {
          code: 'detach_failed',
          message: err instanceof Error ? err.message : 'Failed to detach payment method',
          retryable: false,
        },
      };
    }
  }

  supportsSubscriptions(): boolean {
    return true;
  }

  supportsInvoices(): boolean {
    return true;
  }

  supportsPaymentMethods(): boolean {
    return true;
  }

  supportsRefunds(): boolean {
    return true;
  }

  isMerchantOfRecord(): boolean {
    return false;
  }
}
