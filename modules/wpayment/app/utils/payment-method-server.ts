import Stripe from 'stripe';
import { getStripe } from './stripe-server';
import type {
  AttachPaymentMethodParams,
  CreatePaymentMethodParams,
  Customer,
  DetachPaymentMethodParams,
  PaymentMethodDetails,
  UpdatePaymentMethodParams,
} from '#wpayment/types';

export async function createPaymentMethod(
  params: CreatePaymentMethodParams,
): Promise<PaymentMethodDetails> {
  const stripe = getStripe();

  const paymentMethod = await stripe.paymentMethods.create({
    type: params.type as Stripe.PaymentMethodCreateParams.Type,
    billing_details: params.billing_details,
    card: params.card,
    sepa_debit: params.sepa_debit,
    us_bank_account: params.us_bank_account,
    metadata: params.metadata,
  });

  return paymentMethod as unknown as PaymentMethodDetails;
}

export async function retrievePaymentMethod(
  paymentMethodId: string,
): Promise<PaymentMethodDetails> {
  const stripe = getStripe();
  const paymentMethod = await stripe.paymentMethods.retrieve(paymentMethodId);
  return paymentMethod as unknown as PaymentMethodDetails;
}

export async function updatePaymentMethod(
  params: UpdatePaymentMethodParams,
): Promise<PaymentMethodDetails> {
  const stripe = getStripe();

  const paymentMethod = await stripe.paymentMethods.update(params.paymentMethodId, {
    billing_details: params.billing_details,
    card: params.card,
    metadata: params.metadata,
  });

  return paymentMethod as unknown as PaymentMethodDetails;
}

export async function attachPaymentMethod(
  params: AttachPaymentMethodParams,
): Promise<PaymentMethodDetails> {
  const stripe = getStripe();

  const paymentMethod = await stripe.paymentMethods.attach(params.paymentMethodId, {
    customer: params.customerId,
  });

  return paymentMethod as unknown as PaymentMethodDetails;
}

export async function detachPaymentMethod(
  params: DetachPaymentMethodParams,
): Promise<PaymentMethodDetails> {
  const stripe = getStripe();
  const paymentMethod = await stripe.paymentMethods.detach(params.paymentMethodId);
  return paymentMethod as unknown as PaymentMethodDetails;
}

export async function listPaymentMethods(
  customerId: string,
  type?: string,
): Promise<PaymentMethodDetails[]> {
  const stripe = getStripe();

  const paymentMethods = await stripe.customers.listPaymentMethods(customerId, {
    type: type as Stripe.PaymentMethodListParams.Type,
  });

  return paymentMethods.data as unknown as PaymentMethodDetails[];
}

export async function setDefaultPaymentMethod(
  customerId: string,
  paymentMethodId: string,
): Promise<Customer> {
  const stripe = getStripe();

  const customer = await stripe.customers.update(customerId, {
    invoice_settings: {
      default_payment_method: paymentMethodId,
    },
  });

  return customer as unknown as Customer;
}

export async function verifyPaymentMethod(
  paymentMethodId: string,
): Promise<{
  valid: boolean;
  checks: {
    cvcCheck: string;
    addressLine1Check: string;
    addressPostalCodeCheck: string;
  };
}> {
  const stripe = getStripe();

  const paymentMethod = await stripe.paymentMethods.retrieve(paymentMethodId);

  const card = paymentMethod.card;

  return {
    valid: card?.checks?.cvc_check === 'pass',
    checks: {
      cvcCheck: card?.checks?.cvc_check || 'unchecked',
      addressLine1Check: card?.checks?.address_line1_check || 'unchecked',
      addressPostalCodeCheck: card?.checks?.address_postal_code_check || 'unchecked',
    },
  };
}
