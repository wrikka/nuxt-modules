import { readonly, ref } from 'vue';
import { GatewayFactory } from '../utils/gateway-factory';
import type { MerchantOfRecordAdapter, MoRPaymentParams, MoRSubscriptionParams } from '../utils/adapters/mor-adapter';
import type { PaymentResult, UnifiedPaymentIntent, UnifiedSubscription } from '../types/unified-payment';

export interface UseMerchantOfRecordReturn {
  loading: Readonly<Ref<boolean>>;
  error: Readonly<Ref<string | null>>;
  currentGateway: Readonly<Ref<string | null>>;

  // Gateway selection
  setGateway: (gateway: string) => void;
  getAvailableGateways: () => string[];

  // Payment operations
  createPayment: (params: MoRPaymentParams) => Promise<PaymentResult<UnifiedPaymentIntent>>;
  confirmPayment: (paymentId: string, params?: unknown) => Promise<PaymentResult<UnifiedPaymentIntent>>;
  retrievePayment: (paymentId: string) => Promise<PaymentResult<UnifiedPaymentIntent>>;
  refundPayment: (params: { paymentIntentId: string; amount?: number; reason?: string }) => Promise<PaymentResult<UnifiedPaymentIntent>>;

  // Subscription operations
  createSubscription: (params: MoRSubscriptionParams) => Promise<PaymentResult<UnifiedSubscription>>;
  cancelSubscription: (subscriptionId: string) => Promise<PaymentResult<UnifiedSubscription>>;

  // Tax operations
  calculateTax: (params: {
    amount: number;
    currency: string;
    customerCountry: string;
    customerPostalCode?: string;
  }) => Promise<{ taxAmount: number; taxRate: number; totalAmount: number }>;

  // Payout operations
  getPayoutInfo: () => Promise<{
    balance: number;
    currency: string;
    nextPayoutDate?: string;
  }>;

  // Compliance
  getTaxReport: (params: { year: number; quarter?: number }) => Promise<{ reportUrl: string }>;

  // Features check
  supportsFeature: (feature: 'tax' | 'subscriptions' | 'refunds' | 'payouts' | 'disputes') => boolean;
  supportsCountry: (countryCode: string) => boolean;
}

export function useMerchantOfRecord(): UseMerchantOfRecordReturn {
  const loading = ref(false);
  const error = ref<string | null>(null);
  const currentGateway = ref<string | null>(null);
  const adapter = ref<MerchantOfRecordAdapter | null>(null);

  const config = useRuntimeConfig();
  const gatewayConfig = {
    stripe: config.private?.stripeSecretKey ? {
      publishableKey: config.public?.stripePublishableKey as string,
      secretKey: config.private?.stripeSecretKey as string,
    } : undefined,
    lemonsqueezy: config.private?.lemonsqueezyApiKey ? {
      apiKey: config.private?.lemonsqueezyApiKey as string,
      storeId: config.public?.lemonsqueezyStoreId as string,
    } : undefined,
    paddle: config.private?.paddleVendorId ? {
      vendorId: config.private?.paddleVendorId as string,
      vendorAuthCode: config.private?.paddleVendorAuthCode as string,
    } : undefined,
  };

  const setGateway = (gateway: string): void => {
    try {
      const newAdapter = GatewayFactory.getAdapter(gateway, gatewayConfig);
      if (!newAdapter.isMerchantOfRecord()) {
        error.value = `${gateway} is not a Merchant of Record provider`;
        return;
      }
      adapter.value = newAdapter as MerchantOfRecordAdapter;
      currentGateway.value = gateway;
      error.value = null;
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to set gateway';
    }
  };

  const getAvailableGateways = (): string[] => {
    return GatewayFactory.getAvailableGateways(gatewayConfig).filter(g => {
      try {
        const a = GatewayFactory.getAdapter(g, gatewayConfig);
        return a.isMerchantOfRecord();
      } catch {
        return false;
      }
    });
  };

  const getAdapter = (): MerchantOfRecordAdapter => {
    if (!adapter.value) {
      const available = getAvailableGateways();
      if (available.length === 0) {
        throw new Error('No Merchant of Record gateways configured');
      }
      setGateway(available[0]);
    }
    return adapter.value!;
  };

  const createPayment = async (params: MoRPaymentParams): Promise<PaymentResult<UnifiedPaymentIntent>> => {
    loading.value = true;
    error.value = null;

    try {
      const result = await getAdapter().createPayment(params);
      return result;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to create payment';
      error.value = message;
      return { success: false, error: { code: 'payment_failed', message, retryable: true } };
    } finally {
      loading.value = false;
    }
  };

  const confirmPayment = async (paymentId: string, params?: unknown): Promise<PaymentResult<UnifiedPaymentIntent>> => {
    loading.value = true;
    error.value = null;

    try {
      const result = await getAdapter().confirmPayment(paymentId, params);
      return result;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to confirm payment';
      error.value = message;
      return { success: false, error: { code: 'confirm_failed', message, retryable: true } };
    } finally {
      loading.value = false;
    }
  };

  const retrievePayment = async (paymentId: string): Promise<PaymentResult<UnifiedPaymentIntent>> => {
    loading.value = true;
    error.value = null;

    try {
      const result = await getAdapter().retrievePayment(paymentId);
      return result;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to retrieve payment';
      error.value = message;
      return { success: false, error: { code: 'retrieve_failed', message, retryable: false } };
    } finally {
      loading.value = false;
    }
  };

  const refundPayment = async (params: {
    paymentIntentId: string;
    amount?: number;
    reason?: string;
  }): Promise<PaymentResult<UnifiedPaymentIntent>> => {
    loading.value = true;
    error.value = null;

    try {
      const result = await getAdapter().refundPayment({
        gateway: currentGateway.value || 'lemonsqueezy',
        paymentIntentId: params.paymentIntentId,
        amount: params.amount,
        reason: params.reason as 'duplicate' | 'fraudulent' | 'requested_by_customer' | 'other',
      });
      return result;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to process refund';
      error.value = message;
      return { success: false, error: { code: 'refund_failed', message, retryable: false } };
    } finally {
      loading.value = false;
    }
  };

  const createSubscription = async (params: MoRSubscriptionParams): Promise<PaymentResult<UnifiedSubscription>> => {
    loading.value = true;
    error.value = null;

    try {
      const result = await getAdapter().createSubscription({
        gateway: currentGateway.value || 'lemonsqueezy',
        customerId: params.customerId,
        priceId: params.priceId,
        quantity: params.quantity,
        trialDays: params.trialDays,
        metadata: params.metadata,
      });
      return result;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to create subscription';
      error.value = message;
      return { success: false, error: { code: 'subscription_failed', message, retryable: false } };
    } finally {
      loading.value = false;
    }
  };

  const cancelSubscription = async (subscriptionId: string): Promise<PaymentResult<UnifiedSubscription>> => {
    loading.value = true;
    error.value = null;

    try {
      const result = await getAdapter().cancelSubscription!(subscriptionId);
      return result;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to cancel subscription';
      error.value = message;
      return { success: false, error: { code: 'cancel_failed', message, retryable: false } };
    } finally {
      loading.value = false;
    }
  };

  const calculateTax = async (params: {
    amount: number;
    currency: string;
    customerCountry: string;
    customerPostalCode?: string;
  }): Promise<{ taxAmount: number; taxRate: number; totalAmount: number }> => {
    try {
      const result = await getAdapter().getTaxCalculation(params);
      return {
        taxAmount: result.taxAmount,
        taxRate: result.taxRate,
        totalAmount: result.totalAmount,
      };
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to calculate tax';
      error.value = message;
      return { taxAmount: 0, taxRate: 0, totalAmount: params.amount };
    }
  };

  const getPayoutInfo = async (): Promise<{ balance: number; currency: string; nextPayoutDate?: string }> => {
    try {
      const result = await getAdapter().getPayoutInfo();
      return result;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to get payout info';
      error.value = message;
      return { balance: 0, currency: 'USD' };
    }
  };

  const getTaxReport = async (params: { year: number; quarter?: number }): Promise<{ reportUrl: string }> => {
    try {
      const result = await getAdapter().getTaxReport(params);
      return { reportUrl: result.reportUrl };
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to get tax report';
      error.value = message;
      return { reportUrl: '' };
    }
  };

  const supportsFeature = (feature: 'tax' | 'subscriptions' | 'refunds' | 'payouts' | 'disputes'): boolean => {
    try {
      const a = getAdapter();
      switch (feature) {
        case 'tax':
          return a.features.handlesTaxCollection;
        case 'subscriptions':
          return a.supportsSubscriptions();
        case 'refunds':
          return a.supportsRefunds();
        case 'payouts':
          return a.features.payoutMethods.length > 0;
        case 'disputes':
          return a.features.handlesChargebacks;
        default:
          return false;
      }
    } catch {
      return false;
    }
  };

  const supportsCountry = (countryCode: string): boolean => {
    try {
      return getAdapter().supportsCountry(countryCode);
    } catch {
      return false;
    }
  };

  return {
    loading: readonly(loading),
    error: readonly(error),
    currentGateway: readonly(currentGateway),
    setGateway,
    getAvailableGateways,
    createPayment,
    confirmPayment,
    retrievePayment,
    refundPayment,
    createSubscription,
    cancelSubscription,
    calculateTax,
    getPayoutInfo,
    getTaxReport,
    supportsFeature,
    supportsCountry,
  };
}
