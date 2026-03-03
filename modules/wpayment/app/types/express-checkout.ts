import type { Ref } from 'vue';

// Express Checkout Type
export type ExpressCheckoutType = 'apple_pay' | 'google_pay' | 'link' | 'paypal';

// Express Checkout Payment Method
export interface ExpressCheckoutPaymentMethod {
  type: ExpressCheckoutType;
  enabled: boolean;
  available: boolean;
  label?: string;
  icon?: string;
}

// Apple Pay Configuration
export interface ApplePayConfig {
  merchantIdentifier: string;
  merchantName: string;
  supportedNetworks?: ApplePayNetwork[];
  capabilities?: ApplePayCapability[];
  countryCode: string;
  currencyCode: string;
  supportedCountries?: string[];
}

export type ApplePayNetwork =
  | 'amex'
  | 'cartesBancaires'
  | 'chinaUnionPay'
  | 'discover'
  | 'eftpos'
  | 'electron'
  | 'elo'
  | 'idCredit'
  | 'interac'
  | 'jcb'
  | 'mada'
  | 'maestro'
  | 'masterCard'
  | 'privateLabel'
  | 'quicPay'
  | 'visa'
  | 'vPay';

export type ApplePayCapability = 'supportsCredit' | 'supportsDebit' | 'supportsEMV';

// Apple Pay Payment Request
export interface ApplePayPaymentRequest {
  countryCode: string;
  currencyCode: string;
  supportedNetworks?: ApplePayNetwork[];
  merchantCapabilities?: ApplePayCapability[];
  total: {
    label: string;
    amount: string;
    type?: 'final' | 'pending';
  };
  lineItems?: Array<{
    label: string;
    amount: string;
    type?: 'final' | 'pending';
  }>;
  shippingMethods?: Array<{
    identifier: string;
    label: string;
    detail?: string;
    amount: string;
  }>;
  shippingType?: 'shipping' | 'delivery' | 'storePickup' | 'servicePickup';
  shippingContact?: ApplePayContact;
  billingContact?: ApplePayContact;
  requiredBillingContactFields?: ApplePayContactField[];
  requiredShippingContactFields?: ApplePayContactField[];
  applicationData?: string;
}

export interface ApplePayContact {
  emailAddress?: string;
  familyName?: string;
  givenName?: string;
  phoneNumber?: string;
  phoneticFamilyName?: string;
  phoneticGivenName?: string;
  addressLines?: string[];
  locality?: string;
  country?: string;
  countryCode?: string;
  postalCode?: string;
  subLocality?: string;
  administrativeArea?: string;
}

export type ApplePayContactField = 'email' | 'name' | 'phone' | 'postalAddress';

// Apple Pay Result
export interface ApplePayResult {
  success: boolean;
  token?: {
    paymentData: string;
    paymentMethod: {
      displayName?: string;
      network?: string;
      type: 'debit' | 'credit' | 'prepaid' | 'store';
    };
    transactionIdentifier: string;
  };
  billingContact?: ApplePayContact;
  shippingContact?: ApplePayContact;
  shippingMethod?: {
    identifier: string;
    label: string;
    detail?: string;
    amount: string;
  };
  error?: string;
}

// Google Pay Configuration
export interface GooglePayConfig {
  merchantId: string;
  merchantName: string;
  environment?: 'TEST' | 'PRODUCTION';
  allowedAuthMethods?: GooglePayAuthMethod[];
  allowedCardNetworks?: GooglePayCardNetwork[];
  countryCode: string;
  currencyCode: string;
  billingAddressRequired?: boolean;
  billingAddressFormat?: 'MIN' | 'FULL';
  shippingAddressRequired?: boolean;
  shippingAddressParameters?: GooglePayShippingAddressParameters;
}

export type GooglePayAuthMethod = 'PAN_ONLY' | 'CRYPTOGRAM_3DS';

export type GooglePayCardNetwork = 'AMEX' | 'DISCOVER' | 'INTERAC' | 'JCB' | 'MASTERCARD' | 'VISA';

export interface GooglePayShippingAddressParameters {
  allowedCountryCodes?: string[];
  phoneNumberRequired?: boolean;
}

// Google Pay Payment Request
export interface GooglePayPaymentRequest {
  merchantInfo: {
    merchantId?: string;
    merchantName: string;
    merchantOrigin?: string;
  };
  allowedPaymentMethods: Array<{
    type: 'CARD' | 'PAYPAL';
    parameters: {
      allowedAuthMethods?: GooglePayAuthMethod[];
      allowedCardNetworks?: GooglePayCardNetwork[];
      allowCreditCard?: boolean;
      allowPrepaidCards?: boolean;
      billingAddressRequired?: boolean;
      billingAddressFormat?: 'MIN' | 'FULL';
    };
    tokenizationSpecification: {
      type: 'PAYMENT_GATEWAY' | 'DIRECT';
      parameters: Record<string, string>;
    };
  }>;
  transactionInfo: {
    totalPriceStatus: 'NOT_CURRENTLY_KNOWN' | 'ESTIMATED' | 'FINAL';
    totalPrice: string;
    currencyCode: string;
    countryCode?: string;
    totalPriceLabel?: string;
    checkoutOption?: 'DEFAULT' | 'COMPLETE_IMMEDIATE_PURCHASE';
  };
  emailRequired?: boolean;
  shippingAddressRequired?: boolean;
  shippingAddressParameters?: GooglePayShippingAddressParameters;
  shippingOptionRequired?: boolean;
  shippingOptionParameters?: {
    defaultSelectedOptionId?: string;
    shippingOptions: Array<{
      id: string;
      label: string;
      description?: string;
    }>;
  };
  callbackIntents?: ('PAYMENT_AUTHORIZATION' | 'SHIPPING_ADDRESS' | 'SHIPPING_OPTION')[];
}

// Google Pay Result
export interface GooglePayResult {
  success: boolean;
  paymentMethodData?: {
    type: string;
    description: string;
    info: {
      cardNetwork: string;
      cardDetails: string;
      billingAddress?: {
        name?: string;
        postalCode?: string;
        countryCode?: string;
        phoneNumber?: string;
        address1?: string;
        address2?: string;
        address3?: string;
        locality?: string;
        administrativeArea?: string;
        sortingCode?: string;
      };
    };
    tokenizationData: {
      type: string;
      token: string;
    };
  };
  shippingAddress?: {
    name?: string;
    postalCode?: string;
    countryCode?: string;
    phoneNumber?: string;
    address1?: string;
    address2?: string;
    address3?: string;
    locality?: string;
    administrativeArea?: string;
    sortingCode?: string;
  };
  shippingOptionData?: {
    id: string;
    label?: string;
    description?: string;
  };
  email?: string;
  error?: string;
}

// Link Configuration
export interface LinkConfig {
  enabled: boolean;
  persistentToken?: string;
}

// Composable Return Types
export interface UseExpressCheckoutReturn {
  availableMethods: Readonly<Ref<ExpressCheckoutPaymentMethod[]>>;
  loading: Readonly<Ref<boolean>>;
  error: Readonly<Ref<string | null>>;
  checkAvailability: () => Promise<ExpressCheckoutPaymentMethod[]>;
  initApplePay: (config: ApplePayConfig) => Promise<boolean>;
  initGooglePay: (config: GooglePayConfig) => Promise<boolean>;
  showApplePay: (request: ApplePayPaymentRequest) => Promise<ApplePayResult>;
  showGooglePay: (request: GooglePayPaymentRequest) => Promise<GooglePayResult>;
  createPaymentWithExpress: (
    type: ExpressCheckoutType,
    clientSecret: string,
    result: ApplePayResult | GooglePayResult,
  ) => Promise<{ success: boolean; error?: string; }>;
}

// Express Checkout Button Props
export interface ExpressCheckoutButtonProps {
  type: ExpressCheckoutType;
  amount: number;
  currency: string;
  label?: string;
  clientSecret?: string;
  onSuccess?: (result: ApplePayResult | GooglePayResult) => void;
  onError?: (error: string) => void;
  onCancel?: () => void;
  disabled?: boolean;
  theme?: 'dark' | 'light' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  width?: string;
  height?: string;
  borderRadius?: string;
}
