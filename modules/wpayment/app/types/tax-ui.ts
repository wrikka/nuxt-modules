// Tax Calculator UI Types
export interface TaxCalculationInput {
  amount: number;
  currency: string;
  customerAddress?: TaxAddress;
  productType?: string;
  productTaxCode?: string;
  shippingAmount?: number;
  discountAmount?: number;
}

export interface TaxAddress {
  line1?: string;
  line2?: string;
  city?: string;
  state?: string;
  postal_code?: string;
  country: string;
}

export interface TaxCalculationResult {
  subtotal: number;
  taxAmount: number;
  taxRate: number;
  taxName: string;
  total: number;
  currency: string;
  breakdown: TaxBreakdownItem[];
}

export interface TaxBreakdownItem {
  name: string;
  rate: number;
  amount: number;
  country?: string;
  state?: string;
}

export interface TaxRate {
  id: string;
  object: 'tax_rate';
  active: boolean;
  country?: string;
  created: number;
  description?: string;
  display_name: string;
  inclusive: boolean;
  jurisdiction?: string;
  jurisdiction_level?: 'country' | 'state' | 'county' | 'city' | 'district';
  metadata?: Record<string, string>;
  percentage: number;
  state?: string;
}

export interface TaxRateFormData {
  display_name: string;
  description?: string;
  percentage: number;
  inclusive: boolean;
  country?: string;
  state?: string;
  jurisdiction?: string;
  active: boolean;
  metadata?: Record<string, string>;
}

export interface TaxSettings {
  automaticTaxEnabled: boolean;
  defaultTaxBehavior: 'exclusive' | 'inclusive';
  taxIdCollection: boolean;
  defaultTaxRates: string[];
}

export interface TaxExemption {
  id: string;
  customerId: string;
  type: TaxExemptionType;
  jurisdiction: string;
  validUntil?: number;
  status: 'active' | 'expired' | 'pending';
}

export type TaxExemptionType = 'gst' | 'vat' | 'sales_tax' | 'other';

export interface TaxReport {
  period: string;
  totalTaxCollected: number;
  totalTaxRefunded: number;
  netTax: number;
  byJurisdiction: TaxJurisdictionSummary[];
}

export interface TaxJurisdictionSummary {
  jurisdiction: string;
  taxCollected: number;
  taxRefunded: number;
  transactionCount: number;
}
