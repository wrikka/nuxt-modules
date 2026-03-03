import { getStripe } from './stripe-server';
import type {
  CreatePaymentLinkParams,
  ListPaymentLinksParams,
  PaymentLink,
  UpdatePaymentLinkParams,
} from '#wpayment/types';

export async function createPaymentLink(
  params: CreatePaymentLinkParams,
): Promise<PaymentLink> {
  const stripe = getStripe();

  const paymentLink = await stripe.paymentLinks.create({
    line_items: params.line_items,
    active: params.active,
    after_completion: params.after_completion,
    allow_promotion_codes: params.allow_promotion_codes,
    application_fee_amount: params.application_fee_amount,
    application_fee_percent: params.application_fee_percent,
    automatic_tax: params.automatic_tax,
    billing_address_collection: params.billing_address_collection,
    consent_collection: params.consent_collection,
    currency: params.currency,
    custom_fields: params.custom_fields,
    custom_text: params.custom_text,
    customer_creation: params.customer_creation,
    discounts: params.discounts,
    invoice_creation: params.invoice_creation,
    metadata: params.metadata,
    on_behalf_of: params.on_behalf_of,
    payment_intent_data: params.payment_intent_data,
    payment_method_collection: params.payment_method_collection,
    payment_method_options: params.payment_method_options,
    payment_method_types: params.payment_method_types,
    phone_number_collection: params.phone_number_collection,
    restrictions: params.restrictions,
    shipping_address_collection: params.shipping_address_collection,
    shipping_options: params.shipping_options,
    submit_type: params.submit_type,
    subscription_data: params.subscription_data,
    tax_id_collection: params.tax_id_collection,
    tax_rates: params.tax_rates,
    transfer_data: params.transfer_data,
  });

  return paymentLink as unknown as PaymentLink;
}

export async function retrievePaymentLink(
  paymentLinkId: string,
): Promise<PaymentLink> {
  const stripe = getStripe();
  const paymentLink = await stripe.paymentLinks.retrieve(paymentLinkId);
  return paymentLink as unknown as PaymentLink;
}

export async function updatePaymentLink(
  params: UpdatePaymentLinkParams,
): Promise<PaymentLink> {
  const stripe = getStripe();

  const paymentLink = await stripe.paymentLinks.update(params.paymentLinkId, {
    active: params.active,
    after_completion: params.after_completion,
    allow_promotion_codes: params.allow_promotion_codes,
    billing_address_collection: params.billing_address_collection,
    custom_fields: params.custom_fields,
    custom_text: params.custom_text,
    discounts: params.discounts,
    line_items: params.line_items,
    metadata: params.metadata,
    payment_method_options: params.payment_method_options,
    restrictions: params.restrictions,
    shipping_options: params.shipping_options,
    subscription_data: params.subscription_data,
  });

  return paymentLink as unknown as PaymentLink;
}

export async function listPaymentLinks(
  params?: ListPaymentLinksParams,
): Promise<PaymentLink[]> {
  const stripe = getStripe();

  const paymentLinks = await stripe.paymentLinks.list({
    active: params?.active,
    ending_before: params?.ending_before,
    limit: params?.limit,
    starting_after: params?.starting_after,
  });

  return paymentLinks.data as unknown as PaymentLink[];
}

export async function deactivatePaymentLink(
  paymentLinkId: string,
): Promise<PaymentLink> {
  const stripe = getStripe();

  const paymentLink = await stripe.paymentLinks.update(paymentLinkId, {
    active: false,
  });

  return paymentLink as unknown as PaymentLink;
}

export function getPaymentLinkUrl(paymentLinkId: string): string {
  return `https://buy.stripe.com/${paymentLinkId}`;
}
