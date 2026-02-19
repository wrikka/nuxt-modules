import type { Ref } from 'vue';

// Payment Link
export interface PaymentLink {
  id: string;
  object: 'payment_link';
  active: boolean;
  after_completion?: PaymentLinkAfterCompletion;
  allow_promotion_codes?: boolean;
  application_fee_amount?: number;
  application_fee_percent?: number;
  automatic_tax?: PaymentLinkAutomaticTax;
  billing_address_collection?: 'auto' | 'required';
  consent_collection?: PaymentLinkConsentCollection;
  currency?: string;
  custom_fields?: PaymentLinkCustomField[];
  custom_text?: PaymentLinkCustomText;
  customer_creation?: 'always' | 'if_required';
  default_price_data?: PaymentLinkDefaultPriceData;
  discounts?: PaymentLinkDiscount[];
  invoice_creation?: PaymentLinkInvoiceCreation;
  line_items?: PaymentLinkLineItem[];
  livemode: boolean;
  metadata?: Record<string, string>;
  mobile_only?: boolean;
  on_behalf_of?: string;
  payment_intent_data?: PaymentLinkPaymentIntentData;
  payment_method_collection?: 'always' | 'if_required';
  payment_method_options?: PaymentLinkPaymentMethodOptions;
  payment_method_types?: string[];
  phone_number_collection?: PaymentLinkPhoneNumberCollection;
  restrictions?: PaymentLinkRestrictions;
  shipping_address_collection?: PaymentLinkShippingAddressCollection;
  shipping_options?: PaymentLinkShippingOption[];
  submit_type?: 'auto' | 'book' | 'donate' | 'pay';
  subscription_data?: PaymentLinkSubscriptionData;
  tax_id_collection?: PaymentLinkTaxIdCollection;
  tax_rates?: string[];
  transfer_data?: PaymentLinkTransferData;
  url: string;
}

export interface PaymentLinkAfterCompletion {
  hosted_confirmation?: {
    custom_message?: string;
  };
  redirect?: {
    url: string;
  };
  type: 'hosted_confirmation' | 'redirect';
}

export interface PaymentLinkAutomaticTax {
  enabled: boolean;
  liability?: PaymentLinkLiability;
}

export interface PaymentLinkLiability {
  type: 'account' | 'self';
}

export interface PaymentLinkConsentCollection {
  payment_method_terms_agreement?: {
    position?: 'auto' | 'hidden';
  };
  promotions?: 'auto' | 'hidden' | 'always_show';
  terms_of_service?: 'auto' | 'hidden' | 'required';
}

export interface PaymentLinkCustomField {
  key: string;
  label: {
    custom?: string;
    type: 'custom' | 'preset';
  };
  optional?: boolean;
  type: 'dropdown' | 'email' | 'numeric' | 'phone' | 'text';
  dropdown?: {
    options: Array<{ label: string; value: string; }>;
  };
  numeric?: {
    default_value?: string;
    maximum_length?: number;
    minimum_length?: number;
  };
  text?: {
    default_value?: string;
    maximum_length?: number;
    minimum_length?: number;
  };
}

export interface PaymentLinkCustomText {
  after_submit?: {
    message?: string;
  };
  submit?: {
    message?: string;
  };
  terms_of_service_acceptance?: {
    message?: string;
  };
}

export interface PaymentLinkDefaultPriceData {
  currency?: string;
  product?: string;
  recurring?: {
    interval: 'day' | 'month' | 'week' | 'year';
    interval_count?: number;
  };
  tax_behavior?: 'inclusive' | 'exclusive' | 'unspecified';
  unit_amount?: number;
  unit_amount_decimal?: string;
}

export interface PaymentLinkDiscount {
  coupon?: string;
  promotion_code?: string;
}

export interface PaymentLinkInvoiceCreation {
  enabled: boolean;
  invoice_data?: {
    account_tax_ids?: string[];
    custom_fields?: Array<{ name: string; value: string; }>;
    description?: string;
    footer?: string;
    issuer?: {
      type: 'self' | 'account';
    };
    metadata?: Record<string, string>;
    rendering_options?: {
      amount_tax_display?: 'exclude_tax' | 'include_tax';
    };
  };
}

export interface PaymentLinkLineItem {
  adjustable_quantity?: {
    enabled: boolean;
    maximum?: number;
    minimum?: number;
  };
  dynamic?: {
    enabled?: boolean;
  };
  price: string;
  quantity: number;
}

export interface PaymentLinkPaymentIntentData {
  capture_method?: 'automatic' | 'manual';
  description?: string;
  metadata?: Record<string, string>;
  receipt_email?: string;
  setup_future_usage?: 'off_session' | 'on_session';
  statement_descriptor?: string;
  statement_descriptor_suffix?: string;
  transfer_data?: {
    amount?: number;
    destination: string;
  };
}

export interface PaymentLinkPaymentMethodOptions {
  card?: {
    request_three_d_secure?: 'any' | 'automatic';
  };
  us_bank_account?: {
    verification_method?: 'automatic' | 'instant' | 'microdeposits';
  };
}

export interface PaymentLinkPhoneNumberCollection {
  enabled: boolean;
}

export interface PaymentLinkRestrictions {
  completed_sessions?: {
    limit?: number;
  };
}

export interface PaymentLinkShippingAddressCollection {
  allowed_countries: string[];
}

export interface PaymentLinkShippingOption {
  shipping_rate?: string;
  shipping_rate_data?: {
    fixed_amount?: {
      currency: string;
      amount: number;
    };
    type: 'fixed_amount';
    delivery_estimate?: {
      maximum?: {
        unit: 'business_day' | 'day' | 'hour' | 'month' | 'week';
        value: number;
      };
      minimum?: {
        unit: 'business_day' | 'day' | 'hour' | 'month' | 'week';
        value: number;
      };
    };
    display_name?: string;
    metadata?: Record<string, string>;
    tax_behavior?: 'inclusive' | 'exclusive' | 'unspecified';
    tax_code?: string;
  };
}

export interface PaymentLinkSubscriptionData {
  description?: string;
  invoice_settings?: {
    issuer?: {
      type: 'self' | 'account';
    };
  };
  metadata?: Record<string, string>;
  trial_end?: number;
  trial_period_days?: number;
  trial_settings?: {
    end_behavior?: {
      missing_payment_method?: 'cancel' | 'create_invoice' | 'pause';
    };
  };
}

export interface PaymentLinkTaxIdCollection {
  enabled: boolean;
}

export interface PaymentLinkTransferData {
  amount?: number;
  destination: string;
}

// Create Payment Link Params
export interface CreatePaymentLinkParams {
  line_items: Array<{
    price: string;
    quantity: number;
    adjustable_quantity?: {
      enabled: boolean;
      maximum?: number;
      minimum?: number;
    };
  }>;
  active?: boolean;
  after_completion?: {
    hosted_confirmation?: {
      custom_message?: string;
    };
    redirect?: {
      url: string;
    };
    type: 'hosted_confirmation' | 'redirect';
  };
  allow_promotion_codes?: boolean;
  application_fee_amount?: number;
  application_fee_percent?: number;
  automatic_tax?: {
    enabled: boolean;
    liability?: {
      type: 'account' | 'self';
    };
  };
  billing_address_collection?: 'auto' | 'required';
  consent_collection?: {
    promotions?: 'auto' | 'hidden' | 'always_show';
    terms_of_service?: 'auto' | 'hidden' | 'required';
  };
  currency?: string;
  custom_fields?: PaymentLinkCustomField[];
  custom_text?: PaymentLinkCustomText;
  customer_creation?: 'always' | 'if_required';
  discounts?: Array<{
    coupon?: string;
    promotion_code?: string;
  }>;
  invoice_creation?: {
    enabled: boolean;
    invoice_data?: {
      account_tax_ids?: string[];
      custom_fields?: Array<{ name: string; value: string; }>;
      description?: string;
      footer?: string;
      metadata?: Record<string, string>;
    };
  };
  metadata?: Record<string, string>;
  on_behalf_of?: string;
  payment_intent_data?: {
    capture_method?: 'automatic' | 'manual';
    description?: string;
    metadata?: Record<string, string>;
    receipt_email?: string;
    setup_future_usage?: 'off_session' | 'on_session';
  };
  payment_method_collection?: 'always' | 'if_required';
  payment_method_options?: {
    card?: {
      request_three_d_secure?: 'any' | 'automatic';
    };
  };
  payment_method_types?: string[];
  phone_number_collection?: {
    enabled: boolean;
  };
  restrictions?: {
    completed_sessions?: {
      limit?: number;
    };
  };
  shipping_address_collection?: {
    allowed_countries: string[];
  };
  shipping_options?: Array<{
    shipping_rate?: string;
  }>;
  submit_type?: 'auto' | 'book' | 'donate' | 'pay';
  subscription_data?: {
    description?: string;
    metadata?: Record<string, string>;
    trial_end?: number;
    trial_period_days?: number;
  };
  tax_id_collection?: {
    enabled: boolean;
  };
  tax_rates?: string[];
  transfer_data?: {
    destination: string;
    amount?: number;
  };
}

// Update Payment Link Params
export interface UpdatePaymentLinkParams {
  paymentLinkId: string;
  active?: boolean;
  after_completion?: PaymentLinkAfterCompletion;
  allow_promotion_codes?: boolean;
  billing_address_collection?: 'auto' | 'required';
  custom_fields?: PaymentLinkCustomField[];
  custom_text?: PaymentLinkCustomText;
  discounts?: PaymentLinkDiscount[];
  line_items?: PaymentLinkLineItem[];
  metadata?: Record<string, string>;
  payment_method_options?: PaymentLinkPaymentMethodOptions;
  restrictions?: PaymentLinkRestrictions;
  shipping_options?: PaymentLinkShippingOption[];
  subscription_data?: PaymentLinkSubscriptionData;
}

// Composable Return Types
export interface UsePaymentLinkReturn {
  paymentLink: Readonly<Ref<PaymentLink | null>>;
  loading: Readonly<Ref<boolean>>;
  error: Readonly<Ref<string | null>>;
  create: (params: CreatePaymentLinkParams) => Promise<PaymentLink>;
  retrieve: (paymentLinkId: string) => Promise<PaymentLink>;
  update: (params: UpdatePaymentLinkParams) => Promise<PaymentLink>;
  list: (params?: ListPaymentLinksParams) => Promise<PaymentLink[]>;
  getLinkUrl: (paymentLinkId: string) => string;
  deactivate: (paymentLinkId: string) => Promise<PaymentLink>;
}

export interface ListPaymentLinksParams {
  active?: boolean;
  ending_before?: string;
  limit?: number;
  starting_after?: string;
}
