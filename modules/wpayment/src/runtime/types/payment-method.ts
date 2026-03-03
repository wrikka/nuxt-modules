import type { Ref } from 'vue';

// Payment Method Types (extended from existing)
export interface PaymentMethodDetails {
  id: string;
  object: 'payment_method';
  billing_details?: import('./index').StripeBillingDetails;
  card?: PaymentMethodCard;
  cashapp?: PaymentMethodCashApp;
  customer?: string;
  created?: number;
  livemode?: boolean;
  metadata?: Record<string, string>;
  sepa_debit?: PaymentMethodSepaDebit;
  us_bank_account?: PaymentMethodUsBankAccount;
  type: PaymentMethodTypeExtended;
}

export type PaymentMethodTypeExtended =
  | 'acss_debit'
  | 'affirm'
  | 'afterpay_clearpay'
  | 'alipay'
  | 'au_becs_debit'
  | 'bacs_debit'
  | 'bancontact'
  | 'blik'
  | 'boleto'
  | 'card'
  | 'card_present'
  | 'cashapp'
  | 'customer_balance'
  | 'eps'
  | 'fpx'
  | 'giropay'
  | 'grabpay'
  | 'ideal'
  | 'interac_present'
  | 'klarna'
  | 'konbini'
  | 'link'
  | 'mobilepay'
  | 'multibanco'
  | 'oxxo'
  | 'p24'
  | 'paynow'
  | 'paypal'
  | 'pix'
  | 'promptpay'
  | 'revolut_pay'
  | 'sepa_debit'
  | 'sofort'
  | 'swish'
  | 'twint'
  | 'us_bank_account'
  | 'wechat_pay'
  | 'zip';

export interface PaymentMethodCard {
  brand: PaymentMethodCardBrand;
  checks?: PaymentMethodCardChecks;
  country?: string;
  display_brand?: string;
  exp_month: number;
  exp_year: number;
  fingerprint?: string;
  funding?: 'credit' | 'debit' | 'prepaid' | 'unknown';
  generated_from?: PaymentMethodCardGeneratedFrom;
  last4: string;
  mandates?: PaymentMethodCardMandate[];
  network?: PaymentMethodCardNetwork;
  networks?: PaymentMethodCardNetworks;
  regulated_status?: 'regulated' | 'unregulated';
  three_d_secure_usage?: PaymentMethodThreeDSecureUsage;
  wallet?: PaymentMethodCardWallet;
}

export type PaymentMethodCardBrand =
  | 'amex'
  | 'diners'
  | 'discover'
  | 'jcb'
  | 'mastercard'
  | 'unionpay'
  | 'visa'
  | 'unknown';

export type PaymentMethodCardNetwork =
  | 'amex'
  | 'cartes_bancaires'
  | 'diners'
  | 'discover'
  | 'eftpos_au'
  | 'interac'
  | 'jcb'
  | 'mastercard'
  | 'unionpay'
  | 'visa'
  | 'unknown';

export interface PaymentMethodCardChecks {
  address_line1_check?: 'pass' | 'fail' | 'unavailable' | 'unchecked';
  address_postal_code_check?: 'pass' | 'fail' | 'unavailable' | 'unchecked';
  cvc_check?: 'pass' | 'fail' | 'unavailable' | 'unchecked';
}

export interface PaymentMethodCardGeneratedFrom {
  charge?: string;
  payment_method?: string;
}

export interface PaymentMethodCardMandate {
  id: string;
  next_transaction_at?: number;
  reference?: string;
  reference_status?: 'pending' | 'approved' | 'rejected';
  type?: 'single_use' | 'multi_use';
}

export interface PaymentMethodCardNetworks {
  available?: PaymentMethodCardNetwork[];
  preferred?: PaymentMethodCardNetwork;
}

export interface PaymentMethodThreeDSecureUsage {
  supported?: boolean;
}

export interface PaymentMethodCardWallet {
  apple_pay?: PaymentMethodWalletApplePay;
  google_pay?: PaymentMethodWalletGooglePay;
  link?: PaymentMethodWalletLink;
  samsung_pay?: PaymentMethodWalletSamsungPay;
  type?: PaymentMethodWalletType;
}

export type PaymentMethodWalletType =
  | 'apple_pay'
  | 'google_pay'
  | 'link'
  | 'samsung_pay'
  | 'masterpass'
  | 'amex_express_checkout'
  | 'visa_checkout';

export interface PaymentMethodWalletApplePay {}
export interface PaymentMethodWalletGooglePay {}
export interface PaymentMethodWalletLink {}
export interface PaymentMethodWalletSamsungPay {}

export interface PaymentMethodCashApp {
  cashtag?: string;
}

export interface PaymentMethodSepaDebit {
  bank?: string;
  branch?: string;
  country?: string;
  fingerprint?: string;
  last4?: string;
  mandate?: string;
}

export interface PaymentMethodUsBankAccount {
  account_holder_type?: 'individual' | 'company';
  account_type?: 'checking' | 'savings';
  bank_name?: string;
  financial_connections_account?: string;
  fingerprint?: string;
  last4?: string;
  networks?: PaymentMethodUsBankAccountNetworks;
  routing_number?: string;
}

export interface PaymentMethodUsBankAccountNetworks {
  preferred?: 'ach' | 'us_domestic_wire';
  supported?: ('ach' | 'us_domestic_wire')[];
}

// Create Payment Method Params
export interface CreatePaymentMethodParams {
  type: PaymentMethodTypeExtended;
  billing_details?: import('./index').StripeBillingDetails;
  card?: {
    number: string;
    exp_month: number;
    exp_year: number;
    cvc: string;
  };
  sepa_debit?: {
    iban: string;
  };
  us_bank_account?: {
    account_number: string;
    routing_number: string;
    account_holder_type?: 'individual' | 'company';
    account_type?: 'checking' | 'savings';
  };
  metadata?: Record<string, string>;
}

// Attach Payment Method Params
export interface AttachPaymentMethodParams {
  paymentMethodId: string;
  customerId: string;
}

// Detach Payment Method Params
export interface DetachPaymentMethodParams {
  paymentMethodId: string;
}

// Update Payment Method Params
export interface UpdatePaymentMethodParams {
  paymentMethodId: string;
  billing_details?: import('./index').StripeBillingDetails;
  card?: {
    exp_month?: number;
    exp_year?: number;
  };
  metadata?: Record<string, string>;
}

// Composable Return Types
export interface UsePaymentMethodReturn {
  paymentMethod: Readonly<Ref<PaymentMethodDetails | null>>;
  loading: Readonly<Ref<boolean>>;
  error: Readonly<Ref<string | null>>;
  create: (params: CreatePaymentMethodParams) => Promise<PaymentMethodDetails>;
  retrieve: (paymentMethodId: string) => Promise<PaymentMethodDetails>;
  update: (params: UpdatePaymentMethodParams) => Promise<PaymentMethodDetails>;
  attach: (params: AttachPaymentMethodParams) => Promise<PaymentMethodDetails>;
  detach: (params: DetachPaymentMethodParams) => Promise<PaymentMethodDetails>;
  list: (customerId: string) => Promise<PaymentMethodDetails[]>;
  setDefault: (customerId: string, paymentMethodId: string) => Promise<import('./index').Customer>;
}

// Card Brand Display Names
export const CARD_BRAND_DISPLAY_NAMES: Record<PaymentMethodCardBrand, string> = {
  amex: 'American Express',
  diners: 'Diners Club',
  discover: 'Discover',
  jcb: 'JCB',
  mastercard: 'Mastercard',
  unionpay: 'UnionPay',
  visa: 'Visa',
  unknown: 'Unknown',
};

// Card Brand Icons (CSS class or icon name)
export const CARD_BRAND_ICONS: Record<PaymentMethodCardBrand, string> = {
  amex: 'cc-amex',
  diners: 'cc-diners-club',
  discover: 'cc-discover',
  jcb: 'cc-jcb',
  mastercard: 'cc-mastercard',
  unionpay: 'cc-visa',
  visa: 'cc-visa',
  unknown: 'credit-card',
};
