import type { Ref } from 'vue';

// Customer Portal Configuration
export interface CustomerPortalConfiguration {
  id: string;
  object: 'billing_portal.configuration';
  active: boolean;
  application?: string;
  business_profile?: CustomerPortalBusinessProfile;
  default_return_url?: string;
  features: CustomerPortalFeatures;
  is_default?: boolean;
  livemode: boolean;
  login_page?: CustomerPortalLoginPage;
  metadata?: Record<string, string>;
  updated: number;
}

export interface CustomerPortalBusinessProfile {
  headline?: string;
  privacy_policy_url?: string;
  terms_of_service_url?: string;
}

export interface CustomerPortalFeatures {
  customer_update?: CustomerPortalCustomerUpdate;
  invoice_history?: CustomerPortalInvoiceHistory;
  payment_method_update?: CustomerPortalPaymentMethodUpdate;
  subscription_cancel?: CustomerPortalSubscriptionCancel;
  subscription_pause?: CustomerPortalSubscriptionPause;
  subscription_update?: CustomerPortalSubscriptionUpdate;
}

export interface CustomerPortalCustomerUpdate {
  allowed_updates?: ('address' | 'email' | 'name' | 'phone' | 'shipping' | 'tax_id')[];
  enabled: boolean;
}

export interface CustomerPortalInvoiceHistory {
  enabled: boolean;
}

export interface CustomerPortalPaymentMethodUpdate {
  enabled: boolean;
}

export interface CustomerPortalSubscriptionCancel {
  cancellation_reason?: CustomerPortalCancellationReason;
  enabled: boolean;
  mode: 'at_period_end' | 'immediately';
}

export interface CustomerPortalCancellationReason {
  enabled: boolean;
  options?: (
    | 'customer_service'
    | 'low_quality'
    | 'missing_features'
    | 'other'
    | 'switched_service'
    | 'too_complex'
    | 'too_expensive'
    | 'unused'
  )[];
}

export interface CustomerPortalSubscriptionPause {
  enabled: boolean;
}

export interface CustomerPortalSubscriptionUpdate {
  default_allowed_updates?: ('price' | 'promotion_code' | 'quantity')[];
  enabled: boolean;
  products?: CustomerPortalSubscriptionUpdateProduct[];
  proration_behavior?: 'always_invoice' | 'create_prorations' | 'none';
}

export interface CustomerPortalSubscriptionUpdateProduct {
  prices?: string[];
  product: string;
}

export interface CustomerPortalLoginPage {
  enabled?: boolean;
  url?: string;
}

// Create Portal Configuration Params
export interface CreatePortalConfigurationParams {
  business_profile?: {
    headline?: string;
    privacy_policy_url?: string;
    terms_of_service_url?: string;
  };
  default_return_url?: string;
  features?: {
    customer_update?: {
      allowed_updates?: ('address' | 'email' | 'name' | 'phone' | 'shipping' | 'tax_id')[];
      enabled: boolean;
    };
    invoice_history?: {
      enabled: boolean;
    };
    payment_method_update?: {
      enabled: boolean;
    };
    subscription_cancel?: {
      cancellation_reason?: {
        enabled: boolean;
        options?: (
          | 'customer_service'
          | 'low_quality'
          | 'missing_features'
          | 'other'
          | 'switched_service'
          | 'too_complex'
          | 'too_expensive'
          | 'unused'
        )[];
      };
      enabled: boolean;
      mode: 'at_period_end' | 'immediately';
    };
    subscription_pause?: {
      enabled: boolean;
    };
    subscription_update?: {
      default_allowed_updates?: ('price' | 'promotion_code' | 'quantity')[];
      enabled: boolean;
      products?: Array<{
        prices?: string[];
        product: string;
      }>;
      proration_behavior?: 'always_invoice' | 'create_prorations' | 'none';
    };
  };
  metadata?: Record<string, string>;
}

// Update Portal Configuration Params
export interface UpdatePortalConfigurationParams {
  configurationId: string;
  active?: boolean;
  business_profile?: {
    headline?: string;
    privacy_policy_url?: string;
    terms_of_service_url?: string;
  };
  default_return_url?: string;
  features?: {
    customer_update?: {
      allowed_updates?: ('address' | 'email' | 'name' | 'phone' | 'shipping' | 'tax_id')[];
      enabled: boolean;
    };
    invoice_history?: {
      enabled: boolean;
    };
    payment_method_update?: {
      enabled: boolean;
    };
    subscription_cancel?: {
      cancellation_reason?: {
        enabled: boolean;
        options?: (
          | 'customer_service'
          | 'low_quality'
          | 'missing_features'
          | 'other'
          | 'switched_service'
          | 'too_complex'
          | 'too_expensive'
          | 'unused'
        )[];
      };
      enabled: boolean;
      mode: 'at_period_end' | 'immediately';
    };
    subscription_pause?: {
      enabled: boolean;
    };
    subscription_update?: {
      default_allowed_updates?: ('price' | 'promotion_code' | 'quantity')[];
      enabled: boolean;
      products?: Array<{
        prices?: string[];
        product: string;
      }>;
      proration_behavior?: 'always_invoice' | 'create_prorations' | 'none';
    };
  };
  metadata?: Record<string, string>;
}

// Customer Portal Session
export interface CustomerPortalSession {
  id: string;
  object: 'billing_portal.session';
  configuration?: string;
  created: number;
  customer: string;
  flow?: CustomerPortalFlow;
  livemode: boolean;
  on_behalf_of?: string;
  return_url?: string;
  url: string;
}

export interface CustomerPortalFlow {
  after_completed?: CustomerPortalFlowAfterCompleted;
  subscription_cancel?: CustomerPortalFlowSubscriptionCancel;
  subscription_update?: CustomerPortalFlowSubscriptionUpdate;
}

export interface CustomerPortalFlowAfterCompleted {
  hosted_confirmation?: {
    custom_text?: string;
  };
  redirect_to_url?: {
    url: string;
  };
  type: 'hosted_confirmation' | 'redirect_to_url';
}

export interface CustomerPortalFlowSubscriptionCancel {
  subscription: string;
}

export interface CustomerPortalFlowSubscriptionUpdate {
  subscription: string;
}

// Create Portal Session Params
export interface CreatePortalSessionParams {
  customer: string;
  configuration?: string;
  flow_data?: {
    after_completed?: {
      hosted_confirmation?: {
        custom_text?: string;
      };
      redirect_to_url?: {
        url: string;
      };
      type: 'hosted_confirmation' | 'redirect_to_url';
    };
    subscription_cancel?: {
      subscription: string;
    };
    subscription_update?: {
      subscription: string;
    };
    type: 'subscription_cancel' | 'subscription_update';
  };
  locale?: string;
  on_behalf_of?: string;
  return_url?: string;
}

// Composable Return Types
export interface UseCustomerPortalReturn {
  configuration: Readonly<Ref<CustomerPortalConfiguration | null>>;
  session: Readonly<Ref<CustomerPortalSession | null>>;
  loading: Readonly<Ref<boolean>>;
  error: Readonly<Ref<string | null>>;
  createConfiguration: (params: CreatePortalConfigurationParams) => Promise<CustomerPortalConfiguration>;
  retrieveConfiguration: (configurationId: string) => Promise<CustomerPortalConfiguration>;
  updateConfiguration: (params: UpdatePortalConfigurationParams) => Promise<CustomerPortalConfiguration>;
  listConfigurations: () => Promise<CustomerPortalConfiguration[]>;
  createSession: (params: CreatePortalSessionParams) => Promise<CustomerPortalSession>;
  getPortalUrl: (customerId: string, returnUrl?: string) => Promise<string>;
}
