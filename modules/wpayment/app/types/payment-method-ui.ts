// Payment Method Manager UI Types
export interface PaymentMethodFormData {
  type: PaymentMethodTypeOption;
  card?: CardFormData;
  sepaDebit?: SepaFormData;
  billingDetails?: BillingDetailsFormData;
  metadata?: Record<string, string>;
}

export type PaymentMethodTypeOption = 'card' | 'sepa_debit' | 'us_bank_account' | 'ideal' | 'bancontact' | 'sofort';

export interface CardFormData {
  number: string;
  expMonth: number;
  expYear: number;
  cvc: string;
}

export interface SepaFormData {
  iban: string;
  accountHolderName?: string;
}

export interface BillingDetailsFormData {
  name?: string;
  email?: string;
  phone?: string;
  address?: BillingAddressFormData;
}

export interface BillingAddressFormData {
  line1?: string;
  line2?: string;
  city?: string;
  state?: string;
  postal_code?: string;
  country?: string;
}

export interface PaymentMethodCard {
  brand: string;
  last4: string;
  expMonth: number;
  expYear: number;
  funding: 'credit' | 'debit' | 'prepaid' | 'unknown';
  country?: string;
}

export interface PaymentMethodSummary {
  id: string;
  type: string;
  card?: PaymentMethodCard;
  sepaDebit?: {
    bank: string;
    country: string;
    last4: string;
  };
  usBankAccount?: {
    bankName: string;
    last4: string;
    accountType: 'checking' | 'savings';
  };
  billingDetails?: BillingDetailsFormData;
  isDefault: boolean;
  createdAt: number;
}

export interface PaymentMethodFilter {
  type?: PaymentMethodTypeOption[];
  customerId?: string;
}

export interface PaymentMethodAction {
  type: 'set_default' | 'detach' | 'update';
  paymentMethodId: string;
  data?: Record<string, any>;
}

export interface PaymentMethodValidation {
  isValid: boolean;
  errors: Record<string, string>;
}
