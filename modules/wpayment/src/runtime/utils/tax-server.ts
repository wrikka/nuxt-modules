import { getStripe } from './stripe-server';
import type {
  CreateTaxCalculationParams,
  CreateTaxRateParams,
  CreateTaxTransactionParams,
  ReverseTransactionParams,
  TaxCalculation,
  TaxRate,
  TaxTransaction,
  UpdateTaxRateParams,
} from '#wpayment/types';

// Tax Rate Operations
export async function createTaxRate(params: CreateTaxRateParams): Promise<TaxRate> {
  const stripe = getStripe();

  const taxRate = await stripe.taxRates.create({
    display_name: params.display_name,
    inclusive: params.inclusive,
    percentage: params.percentage,
    active: params.active,
    country: params.country,
    description: params.description,
    jurisdiction: params.jurisdiction,
    jurisdiction_level: params.jurisdiction_level,
    metadata: params.metadata,
    state: params.state,
    tax_type: params.tax_type,
  });

  return taxRate as unknown as TaxRate;
}

export async function retrieveTaxRate(taxRateId: string): Promise<TaxRate> {
  const stripe = getStripe();
  const taxRate = await stripe.taxRates.retrieve(taxRateId);
  return taxRate as unknown as TaxRate;
}

export async function updateTaxRate(params: UpdateTaxRateParams): Promise<TaxRate> {
  const stripe = getStripe();

  const taxRate = await stripe.taxRates.update(params.taxRateId, {
    active: params.active,
    country: params.country,
    description: params.description,
    display_name: params.display_name,
    jurisdiction: params.jurisdiction,
    jurisdiction_level: params.jurisdiction_level,
    metadata: params.metadata,
    state: params.state,
    tax_type: params.tax_type,
  });

  return taxRate as unknown as TaxRate;
}

export async function listTaxRates(active?: boolean): Promise<TaxRate[]> {
  const stripe = getStripe();

  const taxRates = await stripe.taxRates.list({
    active,
  });

  return taxRates.data as unknown as TaxRate[];
}

// Tax Calculation Operations
export async function createTaxCalculation(
  params: CreateTaxCalculationParams,
): Promise<TaxCalculation> {
  const stripe = getStripe();

  const calculation = await stripe.tax.calculations.create({
    currency: params.currency,
    line_items: params.line_items,
    customer_details: params.customer_details,
    customer: params.customer,
    shipping: params.shipping,
    tax_date: params.tax_date,
  });

  return calculation as unknown as TaxCalculation;
}

export async function retrieveTaxCalculation(
  calculationId: string,
): Promise<TaxCalculation> {
  const stripe = getStripe();
  const calculation = await stripe.tax.calculations.retrieve(calculationId);
  return calculation as unknown as TaxCalculation;
}

// Tax Transaction Operations
export async function createTaxTransaction(
  params: CreateTaxTransactionParams,
): Promise<TaxTransaction> {
  const stripe = getStripe();

  const transaction = await stripe.tax.transactions.createFromCalculation({
    calculation: params.calculation,
    customer: params.customer,
    description: params.description,
    metadata: params.metadata,
    posted_at: params.posted_at,
    reference: params.reference,
    shipping: params.shipping,
    source: params.source,
    type: params.type,
  });

  return transaction as unknown as TaxTransaction;
}

export async function retrieveTaxTransaction(
  transactionId: string,
): Promise<TaxTransaction> {
  const stripe = getStripe();
  const transaction = await stripe.tax.transactions.retrieve(transactionId);
  return transaction as unknown as TaxTransaction;
}

export async function voidTaxTransaction(transactionId: string): Promise<TaxTransaction> {
  const stripe = getStripe();
  const transaction = await stripe.tax.transactions.void(transactionId);
  return transaction as unknown as TaxTransaction;
}

export async function reverseTaxTransaction(
  transactionId: string,
  params?: ReverseTransactionParams,
): Promise<TaxTransaction> {
  const stripe = getStripe();

  const transaction = await stripe.tax.transactions.createReversal({
    transaction: transactionId,
    amount: params?.amount,
    line_items: params?.line_items,
    mode: params?.mode,
    reference: params?.reference,
  });

  return transaction as unknown as TaxTransaction;
}

// Calculate tax for a given amount and location
export async function calculateTax(params: {
  amount: number;
  currency: string;
  country: string;
  state?: string;
  postalCode?: string;
  taxCode?: string;
}): Promise<{
  taxAmount: number;
  totalAmount: number;
  taxRate: number;
  breakdown: Array<{
    rate: number;
    amount: number;
    jurisdiction: string;
  }>;
}> {
  const stripe = getStripe();

  const calculation = await stripe.tax.calculations.create({
    currency: params.currency,
    line_items: [
      {
        amount: params.amount,
        reference: 'line_item_1',
        tax_code: params.taxCode || 'txcd_99999999',
      },
    ],
    customer_details: {
      address: {
        country: params.country,
        state: params.state,
        postal_code: params.postalCode,
      },
      address_source: 'billing',
    },
  });

  return {
    taxAmount: calculation.tax_amount_exclusive || 0,
    totalAmount: calculation.amount_total,
    taxRate: calculation.tax_breakdown?.[0]?.rate || 0,
    breakdown: calculation.tax_breakdown.map(b => ({
      rate: b.rate || 0,
      amount: b.amount || 0,
      jurisdiction: b.jurisdiction?.display_name || '',
    })),
  };
}
