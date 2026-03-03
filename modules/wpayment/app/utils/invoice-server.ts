import { getStripe } from './stripe-server';
import type {
  CreateInvoiceItemParams,
  CreateInvoiceParams,
  Invoice,
  InvoiceItem,
  InvoiceLineItem,
  PayInvoiceParams,
  SendInvoiceParams,
  UpdateInvoiceParams,
} from '#wpayment/types';

export async function createInvoice(params: CreateInvoiceParams): Promise<Invoice> {
  const stripe = getStripe();

  const invoice = await stripe.invoices.create({
    customer: params.customer,
    account_tax_ids: params.account_tax_ids,
    application_fee_amount: params.application_fee_amount,
    auto_advance: params.auto_advance,
    collection_method: params.collection_method,
    currency: params.currency,
    custom_fields: params.custom_fields,
    days_until_due: params.days_until_due,
    default_payment_method: params.default_payment_method,
    default_source: params.default_source,
    default_tax_rates: params.default_tax_rates,
    description: params.description,
    discounts: params.discounts,
    due_date: params.due_date,
    effective_at: params.effective_at,
    footer: params.footer,
    from_invoice: params.from_invoice,
    metadata: params.metadata,
    on_behalf_of: params.on_behalf_of,
    payment_settings: params.payment_settings,
    pending_invoice_items_behavior: params.pending_invoice_items_behavior,
    rendering_options: params.rendering_options,
    shipping: params.shipping,
    statement_descriptor: params.statement_descriptor,
    subscription: params.subscription,
    transfer_data: params.transfer_data,
  });

  return invoice as unknown as Invoice;
}

export async function retrieveInvoice(invoiceId: string): Promise<Invoice> {
  const stripe = getStripe();
  const invoice = await stripe.invoices.retrieve(invoiceId);
  return invoice as unknown as Invoice;
}

export async function updateInvoice(
  invoiceId: string,
  params: UpdateInvoiceParams,
): Promise<Invoice> {
  const stripe = getStripe();

  const invoice = await stripe.invoices.update(invoiceId, {
    account_tax_ids: params.account_tax_ids,
    application_fee_amount: params.application_fee_amount,
    auto_advance: params.auto_advance,
    collection_method: params.collection_method,
    custom_fields: params.custom_fields,
    days_until_due: params.days_until_due,
    default_payment_method: params.default_payment_method,
    default_source: params.default_source,
    default_tax_rates: params.default_tax_rates,
    description: params.description,
    discounts: params.discounts,
    due_date: params.due_date,
    effective_at: params.effective_at,
    footer: params.footer,
    metadata: params.metadata,
    on_behalf_of: params.on_behalf_of,
    payment_settings: params.payment_settings,
    rendering_options: params.rendering_options,
    shipping: params.shipping,
    statement_descriptor: params.statement_descriptor,
    transfer_data: params.transfer_data,
  });

  return invoice as unknown as Invoice;
}

export async function deleteInvoice(invoiceId: string): Promise<void> {
  const stripe = getStripe();
  await stripe.invoices.del(invoiceId);
}

export async function finalizeInvoice(invoiceId: string): Promise<Invoice> {
  const stripe = getStripe();
  const invoice = await stripe.invoices.finalizeInvoice(invoiceId);
  return invoice as unknown as Invoice;
}

export async function payInvoice(
  invoiceId: string,
  params?: PayInvoiceParams,
): Promise<Invoice> {
  const stripe = getStripe();

  const invoice = await stripe.invoices.pay(invoiceId, {
    cancel_at: params?.cancel_at,
    cancellation_reason: params?.cancellation_reason,
    forgive: params?.forgive,
    mandate: params?.mandate,
    off_session: params?.off_session,
    paid_out_of_band: params?.paid_out_of_band,
    payment_method: params?.payment_method,
    source: params?.source,
  });

  return invoice as unknown as Invoice;
}

export async function sendInvoice(
  invoiceId: string,
  params?: SendInvoiceParams,
): Promise<Invoice> {
  const stripe = getStripe();

  const invoice = await stripe.invoices.sendInvoice(invoiceId, {
    customer: params?.customer,
    delivery_method: params?.delivery_method,
    paid: params?.paid,
    paid_out_of_band: params?.paid_out_of_band,
  });

  return invoice as unknown as Invoice;
}

export async function voidInvoice(invoiceId: string): Promise<Invoice> {
  const stripe = getStripe();
  const invoice = await stripe.invoices.voidInvoice(invoiceId);
  return invoice as unknown as Invoice;
}

export async function markInvoiceUncollectible(invoiceId: string): Promise<Invoice> {
  const stripe = getStripe();
  const invoice = await stripe.invoices.markUncollectible(invoiceId);
  return invoice as unknown as Invoice;
}

export async function listInvoices(customerId: string): Promise<Invoice[]> {
  const stripe = getStripe();

  const invoices = await stripe.invoices.list({
    customer: customerId,
  });

  return invoices.data as unknown as Invoice[];
}

export async function listInvoiceLineItems(invoiceId: string): Promise<InvoiceLineItem[]> {
  const stripe = getStripe();

  const lineItems = await stripe.invoices.listLineItems(invoiceId);

  return lineItems.data as unknown as InvoiceLineItem[];
}

export async function createInvoiceItem(params: CreateInvoiceItemParams): Promise<InvoiceItem> {
  const stripe = getStripe();

  const item = await stripe.invoiceItems.create({
    customer: params.customer,
    amount: params.amount,
    currency: params.currency,
    account: params.account,
    description: params.description,
    discountable: params.discountable,
    discounts: params.discounts,
    invoice: params.invoice,
    metadata: params.metadata,
    period: params.period,
    price: params.price,
    quantity: params.quantity,
    subscription: params.subscription,
    subscription_item: params.subscription_item,
    tax_rates: params.tax_rates,
    unit_amount: params.unit_amount,
    unit_amount_decimal: params.unit_amount_decimal,
  });

  return item as unknown as InvoiceItem;
}

export async function deleteInvoiceItem(itemId: string): Promise<void> {
  const stripe = getStripe();
  await stripe.invoiceItems.del(itemId);
}

export async function getUpcomingInvoice(params: {
  customer: string;
  subscription?: string;
  subscription_items?: Array<{
    id?: string;
    price?: string;
    quantity?: number;
  }>;
}): Promise<Invoice> {
  const stripe = getStripe();

  const invoice = await stripe.invoices.retrieveUpcoming({
    customer: params.customer,
    subscription: params.subscription,
    subscription_items: params.subscription_items,
  });

  return invoice as unknown as Invoice;
}
