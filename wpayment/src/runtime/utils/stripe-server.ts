import Stripe from 'stripe';

let stripeInstance: Stripe | null = null;

export function getStripe(secretKey?: string): Stripe {
  if (!stripeInstance) {
    const key = secretKey || process.env.STRIPE_SECRET_KEY;
    if (!key) {
      throw new Error('Stripe secret key is not configured');
    }
    stripeInstance = new Stripe(key, {
      apiVersion: '2024-11-20.acacia',
    });
  }
  return stripeInstance;
}

export async function createPaymentIntent(params: {
  amount: number;
  currency: string;
  customer?: string;
  payment_method?: string;
  metadata?: Record<string, string>;
}) {
  const stripe = getStripe();

  return await stripe.paymentIntents.create({
    amount: params.amount,
    currency: params.currency,
    customer: params.customer,
    payment_method: params.payment_method,
    metadata: params.metadata,
    automatic_payment_methods: {
      enabled: true,
    },
  });
}

export async function retrievePaymentIntent(paymentIntentId: string) {
  const stripe = getStripe();
  return await stripe.paymentIntents.retrieve(paymentIntentId);
}

export async function confirmPaymentIntent(paymentIntentId: string) {
  const stripe = getStripe();
  return await stripe.paymentIntents.confirm(paymentIntentId);
}

export async function cancelPaymentIntent(paymentIntentId: string) {
  const stripe = getStripe();
  return await stripe.paymentIntents.cancel(paymentIntentId);
}

export async function createCustomer(params: {
  email: string;
  name?: string;
  metadata?: Record<string, string>;
}) {
  const stripe = getStripe();

  return await stripe.customers.create({
    email: params.email,
    name: params.name,
    metadata: params.metadata,
  });
}

export async function retrieveCustomer(customerId: string) {
  const stripe = getStripe();
  return await stripe.customers.retrieve(customerId);
}

export async function createCheckoutSession(params: {
  success_url: string;
  cancel_url: string;
  customer?: string;
  customer_email?: string;
  line_items: Array<{
    price_data: {
      currency: string;
      product_data: {
        name: string;
        description?: string;
        images?: string[];
      };
      unit_amount: number;
    };
    quantity: number;
  }>;
  mode?: 'payment' | 'subscription';
  metadata?: Record<string, string>;
}) {
  const stripe = getStripe();

  return await stripe.checkout.sessions.create({
    success_url: params.success_url,
    cancel_url: params.cancel_url,
    customer: params.customer,
    customer_email: params.customer_email,
    line_items: params.line_items,
    mode: params.mode || 'payment',
    metadata: params.metadata,
  });
}

export async function retrieveCheckoutSession(sessionId: string) {
  const stripe = getStripe();
  return await stripe.checkout.sessions.retrieve(sessionId);
}
