import type { Ref } from 'vue';

// Tax Rate
export interface TaxRate {
  id: string;
  object: 'tax_rate';
  active: boolean;
  country?: string;
  created: number;
  description?: string;
  display_name?: string;
  inclusive: boolean;
  jurisdiction?: string;
  jurisdiction_level?: 'city' | 'country' | 'county' | 'district' | 'state';
  livemode: boolean;
  metadata?: Record<string, string>;
  percentage: number;
  state?: string;
  tax_type?:
    | 'amusement_tax'
    | 'communications_tax'
    | 'gst'
    | 'hst'
    | 'igst'
    | 'jct'
    | 'lease_tax'
    | 'pst'
    | 'qst'
    | 'rst'
    | 'sales_tax'
    | 'service_tax'
    | 'vat';
}

// Create Tax Rate Params
export interface CreateTaxRateParams {
  display_name: string;
  inclusive: boolean;
  percentage: number;
  active?: boolean;
  country?: string;
  description?: string;
  jurisdiction?: string;
  jurisdiction_level?: 'city' | 'country' | 'county' | 'district' | 'state';
  metadata?: Record<string, string>;
  state?: string;
  tax_type?:
    | 'amusement_tax'
    | 'communications_tax'
    | 'gst'
    | 'hst'
    | 'igst'
    | 'jct'
    | 'lease_tax'
    | 'pst'
    | 'qst'
    | 'rst'
    | 'sales_tax'
    | 'service_tax'
    | 'vat';
}

// Update Tax Rate Params
export interface UpdateTaxRateParams {
  taxRateId: string;
  active?: boolean;
  country?: string;
  description?: string;
  display_name?: string;
  jurisdiction?: string;
  jurisdiction_level?: 'city' | 'country' | 'county' | 'district' | 'state';
  metadata?: Record<string, string>;
  state?: string;
  tax_type?:
    | 'amusement_tax'
    | 'communications_tax'
    | 'gst'
    | 'hst'
    | 'igst'
    | 'jct'
    | 'lease_tax'
    | 'pst'
    | 'qst'
    | 'rst'
    | 'sales_tax'
    | 'service_tax'
    | 'vat';
}

// Tax Calculation
export interface TaxCalculation {
  id: string;
  object: 'tax.calculation';
  amount_total: number;
  currency: string;
  customer?: string;
  customer_details?: TaxCustomerDetails;
  expires_at?: number;
  line_items?: TaxCalculationLineItem[];
  livemode: boolean;
  shipping_cost?: TaxShippingCost;
  tax_amount_exclusive?: number;
  tax_amount_inclusive?: number;
  tax_breakdown?: TaxBreakdown[];
  tax_date?: number;
}

export interface TaxCustomerDetails {
  address: TaxAddress;
  address_source?: 'billing' | 'shipping' | 'billing_customer_details' | 'shipping_customer_details';
  ip_address?: string;
  taxability_reason?:
    | 'customer_exempt'
    | 'not_collecting'
    | 'not_subject_to_tax'
    | 'not_supported'
    | 'portion_standard_rated'
    | 'proportionally_rated'
    | 'reverse_charge'
    | 'standard_rated'
    | 'tax_exempt'
    | 'zero_rated';
  taxability_override?: 'customer_exempt' | 'none' | 'reverse_charge';
  tax_ids?: Array<{
    type: string;
    value: string;
  }>;
}

export interface TaxAddress {
  city?: string;
  country?: string;
  line1?: string;
  line2?: string;
  postal_code?: string;
  state?: string;
}

export interface TaxCalculationLineItem {
  amount: number;
  amount_tax?: number;
  id: string;
  product?: string;
  quantity?: number;
  reference?: string;
  tax_behavior?: 'inclusive' | 'exclusive';
  tax_breakdown?: TaxBreakdown[];
  tax_code?: string;
  unit_amount?: number;
}

export interface TaxShippingCost {
  amount?: number;
  amount_tax?: number;
  tax_behavior?: 'inclusive' | 'exclusive';
  tax_breakdown?: TaxBreakdown[];
  tax_code?: string;
}

export interface TaxBreakdown {
  amount?: number;
  jurisdiction?: TaxJurisdiction;
  rate?: number;
  taxability_reason?: string;
  tax_rate?: string;
  taxable_amount?: number;
  type?: string;
}

export interface TaxJurisdiction {
  country?: string;
  display_name?: string;
  level?: 'city' | 'country' | 'county' | 'district' | 'state';
  state?: string;
}

// Create Tax Calculation Params
export interface CreateTaxCalculationParams {
  currency: string;
  line_items: Array<{
    amount: number;
    reference: string;
    quantity?: number;
    tax_behavior?: 'inclusive' | 'exclusive';
    tax_code?: string;
    product?: string;
    unit_amount?: number;
  }>;
  customer_details: {
    address: {
      city?: string;
      country?: string;
      line1?: string;
      line2?: string;
      postal_code?: string;
      state?: string;
    };
    address_source?: 'billing' | 'shipping' | 'billing_customer_details' | 'shipping_customer_details';
    ip_address?: string;
    tax_ids?: Array<{
      type: string;
      value: string;
    }>;
    taxability_override?: 'customer_exempt' | 'none' | 'reverse_charge';
  };
  customer?: string;
  shipping?: {
    address: {
      city?: string;
      country?: string;
      line1?: string;
      line2?: string;
      postal_code?: string;
      state?: string;
    };
    delivery_type?: 'shipment' | 'self_pickup' | 'in_store_pickup';
  };
  tax_date?: number;
}

// Tax Transaction
export interface TaxTransaction {
  id: string;
  object: 'tax.transaction';
  amount_reverse?: number;
  created?: number;
  currency?: string;
  customer?: string;
  customer_details?: TaxCustomerDetails;
  line_items?: TaxTransactionLineItem[];
  livemode?: boolean;
  metadata?: Record<string, string>;
  posted_at?: number;
  reference?: string;
  shipping_cost?: TaxShippingCost;
  source?: string;
  status?: 'posted' | 'voided' | 'reversed';
  tax_amount_exclusive?: number;
  tax_amount_inclusive?: number;
  tax_breakdown?: TaxBreakdown[];
  tax_date?: number;
  type?: 'automatic' | 'manual';
}

export interface TaxTransactionLineItem {
  amount?: number;
  amount_tax?: number;
  id?: string;
  product?: string;
  quantity?: number;
  reference?: string;
  reverse?: boolean;
  tax_behavior?: 'inclusive' | 'exclusive';
  tax_breakdown?: TaxBreakdown[];
  tax_code?: string;
  unit_amount?: number;
}

// Create Tax Transaction Params
export interface CreateTaxTransactionParams {
  calculation: string;
  customer?: string;
  description?: string;
  metadata?: Record<string, string>;
  posted_at?: number;
  reference?: string;
  shipping?: {
    amount?: number;
    tax_behavior?: 'inclusive' | 'exclusive';
    tax_code?: string;
  };
  source?: string;
  type?: 'automatic' | 'manual';
}

// Composable Return Types
export interface UseTaxReturn {
  taxRate: Readonly<Ref<TaxRate | null>>;
  calculation: Readonly<Ref<TaxCalculation | null>>;
  transaction: Readonly<Ref<TaxTransaction | null>>;
  loading: Readonly<Ref<boolean>>;
  error: Readonly<Ref<string | null>>;
  // Tax Rates
  createTaxRate: (params: CreateTaxRateParams) => Promise<TaxRate>;
  retrieveTaxRate: (taxRateId: string) => Promise<TaxRate>;
  updateTaxRate: (params: UpdateTaxRateParams) => Promise<TaxRate>;
  listTaxRates: (active?: boolean) => Promise<TaxRate[]>;
  // Tax Calculation
  createCalculation: (params: CreateTaxCalculationParams) => Promise<TaxCalculation>;
  retrieveCalculation: (calculationId: string) => Promise<TaxCalculation>;
  // Tax Transaction
  createTransaction: (params: CreateTaxTransactionParams) => Promise<TaxTransaction>;
  retrieveTransaction: (transactionId: string) => Promise<TaxTransaction>;
  voidTransaction: (transactionId: string) => Promise<TaxTransaction>;
  reverseTransaction: (transactionId: string, params?: ReverseTransactionParams) => Promise<TaxTransaction>;
}

export interface ReverseTransactionParams {
  amount?: number;
  line_items?: Array<{
    amount?: number;
    reference?: string;
    quantity?: number;
    tax_behavior?: 'inclusive' | 'exclusive';
    tax_code?: string;
    unit_amount?: number;
  }>;
  mode?: 'partial' | 'full';
  reference?: string;
}

// Tax Settings
export interface TaxSettings {
  object: 'tax.settings';
  defaults?: TaxSettingsDefaults;
  head_office?: TaxSettingsHeadOffice;
  livemode?: boolean;
  status?: 'active' | 'pending' | 'restricted';
}

export interface TaxSettingsDefaults {
  product_tax_code?: string;
  shipping_tax_code?: string;
  tax_behavior?: 'inclusive' | 'exclusive';
  tax_rate?: string;
}

export interface TaxSettingsHeadOffice {
  address?: TaxAddress;
}
