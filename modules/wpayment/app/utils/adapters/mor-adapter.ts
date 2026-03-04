import type {
  PaymentGatewayAdapter,
  CreatePaymentParams,
  PaymentResult,
  UnifiedPaymentIntent,
  UnifiedSubscription,
  CreateSubscriptionParams,
  RefundParams,
} from '../types/gateway-adapter';

export interface MerchantOfRecordFeatures {
  // Tax handling
  handlesTaxCollection: boolean;
  handlesTaxRemittance: boolean;
  supportedCountries: string[];

  // Compliance
  handlesVat: boolean;
  handlesSalesTax: boolean;
  handlesGst: boolean;
  providesTaxReports: boolean;

  // Payout options
  payoutMethods: string[];
  payoutSchedule: 'daily' | 'weekly' | 'monthly' | 'on_demand';

  // Refund handling
  handlesRefundProcessing: boolean;
  refundTimeframe: string;

  // Dispute handling
  handlesChargebacks: boolean;
  providesDisputeManagement: boolean;
}

export interface MoRPaymentParams extends CreatePaymentParams {
  taxData?: {
    customerCountry: string;
    customerPostalCode?: string;
    taxId?: string;
  };
  affiliateId?: string;
}

export interface MoRSubscriptionParams extends CreateSubscriptionParams {
  taxData?: {
    customerCountry: string;
    customerPostalCode?: string;
  };
}

export abstract class MerchantOfRecordAdapter implements PaymentGatewayAdapter {
  abstract readonly gateway: string;
  abstract readonly features: MerchantOfRecordFeatures;

  // Abstract methods that must be implemented
  abstract createPayment(params: MoRPaymentParams): Promise<PaymentResult<UnifiedPaymentIntent>>;
  abstract confirmPayment(paymentId: string, params?: unknown): Promise<PaymentResult<UnifiedPaymentIntent>>;
  abstract retrievePayment(paymentId: string): Promise<PaymentResult<UnifiedPaymentIntent>>;
  abstract refundPayment(params: RefundParams): Promise<PaymentResult<UnifiedPaymentIntent>>;

  // MoR-specific methods
  abstract getTaxCalculation(params: {
    amount: number;
    currency: string;
    customerCountry: string;
    customerPostalCode?: string;
    productCategory?: string;
  }): Promise<{
    taxAmount: number;
    taxRate: number;
    totalAmount: number;
    taxName: string;
  }>;

  abstract getPayoutInfo(): Promise<{
    balance: number;
    currency: string;
    nextPayoutDate?: string;
    lastPayoutAmount?: number;
    lastPayoutDate?: string;
  }>;

  abstract requestPayout(params?: {
    amount?: number;
    method?: string;
  }): Promise<PaymentResult<{ payoutId: string; status: string }>>;

  abstract getTaxReport(params: {
    year: number;
    quarter?: number;
    country?: string;
  }): Promise<{
    reportUrl: string;
    reportFormat: 'csv' | 'pdf' | 'json';
    generatedAt: string;
  }>;

  abstract isMerchantOfRecord(): boolean {
    return true;
  }

  abstract supportsSubscriptions(): boolean;
  abstract supportsInvoices(): boolean;
  abstract supportsPaymentMethods(): boolean;
  abstract supportsRefunds(): boolean;

  // Convenience method to check if a country is supported
  supportsCountry(countryCode: string): boolean {
    return this.features.supportedCountries.includes(countryCode);
  }

  // Get applicable tax rate for a country
  async getTaxRate(countryCode: string, productCategory?: string): Promise<number> {
    const calc = await this.getTaxCalculation({
      amount: 10000, // 100.00 in cents
      currency: 'USD',
      customerCountry: countryCode,
      productCategory,
    });
    return calc.taxRate;
  }
}
