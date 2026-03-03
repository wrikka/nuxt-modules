// Stripe Configuration Types
export interface StripeConfig {
  publishableKey: string;
  apiVersion?: string;
  locale?: string;
  elementsOptions?: StripeElementsOptions;
  confirmParams?: StripeConfirmParams;
}

export interface StripeElementsOptions {
  appearance?: StripeAppearance;
  clientSecret?: string;
  fonts?: StripeFont[];
  locale?: string;
  mode?: 'payment' | 'subscription' | 'setup';
  amount?: number;
  currency?: string;
  paymentMethodCreation?: string;
  paymentMethodTypes?: string[];
}

export interface StripeAppearance {
  theme?: 'stripe' | 'night' | 'flat' | 'none';
  variables?: Record<string, any>;
  rules?: Record<string, any>;
  labels?: 'above' | 'floating' | 'hidden';
}

export interface StripeFont {
  family?: string;
  src?: string;
  weight?: string | number;
  style?: string;
  display?: string;
}

export interface StripeConfirmParams {
  return_url?: string;
  payment_method_data?: {
    billing_details?: StripeBillingDetails;
  };
  save_payment_method?: boolean;
  setup_future_usage?: 'off_session' | 'on_session';
}

export interface StripeBillingDetails {
  email?: string;
  phone?: string;
  address?: StripeAddress;
  name?: string;
}

export interface StripeAddress {
  city?: string;
  country?: string;
  line1?: string;
  line2?: string;
  postal_code?: string;
  state?: string;
}

export interface StripeShipping {
  address: StripeAddress;
  name: string;
  phone?: string;
  tracking?: {
    number: string;
    carrier: string;
    url: string;
  };
}

export interface StripeTransferData {
  destination: string;
  amount?: number;
}
