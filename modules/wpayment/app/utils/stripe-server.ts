import Stripe from 'stripe';
import type { H3Event } from 'h3';

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

export function getStripeFromEvent(event: H3Event): Stripe {
  const config = useRuntimeConfig(event);
  const secretKey = config.private?.wpaymentSecretKey || process.env['STRIPE_SECRET_KEY'];

  if (!secretKey) {
    throw createError({
      statusCode: 500,
      statusMessage: 'Stripe secret key is not configured',
    });
  }

  return new Stripe(secretKey, {
    apiVersion: '2024-11-20.acacia',
    typescript: true,
  });
}

export function resetStripeInstance(): void {
  stripeInstance = null;
}

// Unified Payment Transformers
export function toUnifiedPaymentIntent(paymentIntent: Stripe.PaymentIntent) {
  return {
    id: paymentIntent.id,
    gateway: 'stripe' as const,
    amount: paymentIntent.amount,
    currency: paymentIntent.currency.toUpperCase(),
    status: mapPaymentStatus(paymentIntent.status),
    customerId: paymentIntent.customer as string | undefined,
    customerEmail: (paymentIntent.charges?.data[0] as { billing_details?: { email?: string } })?.billing_details?.email,
    description: paymentIntent.description || undefined,
    metadata: paymentIntent.metadata,
    clientSecret: paymentIntent.client_secret || undefined,
    paymentMethodId: paymentIntent.payment_method as string | undefined,
    subscriptionId: paymentIntent.subscription as string | undefined,
    invoiceId: paymentIntent.invoice as string | undefined,
    receiptUrl: (paymentIntent.charges?.data[0] as { receipt_url?: string })?.receipt_url,
    refundedAmount: paymentIntent.amount_refunded || 0,
    failureMessage: paymentIntent.last_payment_error?.message,
    createdAt: new Date(paymentIntent.created * 1000).toISOString(),
    updatedAt: new Date().toISOString(),
  };
}

function mapPaymentStatus(status: Stripe.PaymentIntent.Status) {
  const statusMap: Record<Stripe.PaymentIntent.Status, string> = {
    requires_payment_method: 'pending',
    requires_confirmation: 'pending',
    requires_action: 'requires_action',
    processing: 'processing',
    requires_capture: 'processing',
    canceled: 'canceled',
    succeeded: 'completed',
  };
  return statusMap[status] || status;
}

export function toUnifiedSubscription(subscription: Stripe.Subscription) {
  return {
    id: subscription.id,
    gateway: 'stripe' as const,
    customerId: subscription.customer as string,
    status: subscription.status,
    planId: subscription.items.data[0]?.price.id || '',
    planName: subscription.items.data[0]?.price.nickname || '',
    quantity: subscription.items.data[0]?.quantity || 1,
    currentPeriodStart: new Date(subscription.current_period_start * 1000).toISOString(),
    currentPeriodEnd: new Date(subscription.current_period_end * 1000).toISOString(),
    trialStart: subscription.trial_start
      ? new Date(subscription.trial_start * 1000).toISOString()
      : undefined,
    trialEnd: subscription.trial_end
      ? new Date(subscription.trial_end * 1000).toISOString()
      : undefined,
    cancelAtPeriodEnd: subscription.cancel_at_period_end,
    canceledAt: subscription.canceled_at
      ? new Date(subscription.canceled_at * 1000).toISOString()
      : undefined,
    defaultPaymentMethodId: subscription.default_payment_method as string | undefined,
    latestInvoiceId: subscription.latest_invoice as string | undefined,
    metadata: subscription.metadata,
    createdAt: new Date(subscription.created * 1000).toISOString(),
  };
}

export function toUnifiedInvoice(invoice: Stripe.Invoice) {
  return {
    id: invoice.id,
    gateway: 'stripe' as const,
    customerId: invoice.customer as string,
    subscriptionId: invoice.subscription as string | undefined,
    status: invoice.status || 'draft',
    amountDue: invoice.amount_due,
    amountPaid: invoice.amount_paid,
    amountRemaining: invoice.amount_remaining,
    currency: invoice.currency.toUpperCase(),
    lines: invoice.lines.data.map(line => ({
      id: line.id,
      description: line.description || '',
      amount: line.amount,
      currency: invoice.currency.toUpperCase(),
      quantity: line.quantity || 1,
      periodStart: line.period?.start
        ? new Date(line.period.start * 1000).toISOString()
        : undefined,
      periodEnd: line.period?.end
        ? new Date(line.period.end * 1000).toISOString()
        : undefined,
      proration: line.proration,
    })),
    pdfUrl: invoice.invoice_pdf,
    hostedInvoiceUrl: invoice.hosted_invoice_url,
    dueDate: invoice.due_date
      ? new Date(invoice.due_date * 1000).toISOString()
      : undefined,
    paidAt: invoice.status_transitions?.paid_at
      ? new Date(invoice.status_transitions.paid_at * 1000).toISOString()
      : undefined,
    createdAt: new Date(invoice.created * 1000).toISOString(),
  };
}

export function toUnifiedCustomer(customer: Stripe.Customer) {
  return {
    id: customer.id,
    gateway: 'stripe' as const,
    email: customer.email || '',
    name: customer.name || undefined,
    phone: customer.phone || undefined,
    balance: customer.balance,
    currency: customer.currency?.toUpperCase(),
    defaultPaymentMethodId: customer.invoice_settings?.default_payment_method as string | undefined,
    address: customer.address
      ? {
          line1: customer.address.line1 || undefined,
          line2: customer.address.line2 || undefined,
          city: customer.address.city || undefined,
          state: customer.address.state || undefined,
          postalCode: customer.address.postal_code || undefined,
          country: customer.address.country || '',
        }
      : undefined,
    metadata: customer.metadata,
    createdAt: new Date(customer.created * 1000).toISOString(),
  };
}

export function toUnifiedPaymentMethod(paymentMethod: Stripe.PaymentMethod) {
  const card = paymentMethod.card;
  return {
    id: paymentMethod.id,
    type: paymentMethod.type === 'card' ? 'card' as const : 'digital_wallet' as const,
    gateway: 'stripe' as const,
    last4: card?.last4,
    brand: card?.brand,
    expiryMonth: card?.exp_month,
    expiryYear: card?.exp_year,
    isDefault: false, // Will be set based on customer context
    billingDetails: paymentMethod.billing_details
      ? {
          name: paymentMethod.billing_details.name || undefined,
          email: paymentMethod.billing_details.email || undefined,
          phone: paymentMethod.billing_details.phone || undefined,
          address: paymentMethod.billing_details.address
            ? {
                line1: paymentMethod.billing_details.address.line1 || undefined,
                line2: paymentMethod.billing_details.address.line2 || undefined,
                city: paymentMethod.billing_details.address.city || undefined,
                state: paymentMethod.billing_details.address.state || undefined,
                postalCode: paymentMethod.billing_details.address.postal_code || undefined,
                country: paymentMethod.billing_details.address.country || '',
              }
            : undefined,
        }
      : undefined,
    createdAt: new Date(paymentMethod.created * 1000).toISOString(),
  };
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

export async function confirmPaymentIntent(paymentIntentId: string, params?: {
  payment_method?: string;
  receipt_email?: string;
  return_url?: string;
  off_session?: boolean;
}) {
  const stripe = getStripe();
  return await stripe.paymentIntents.confirm(paymentIntentId, params);
}

export async function cancelPaymentIntent(paymentIntentId: string) {
  const stripe = getStripe();
  return await stripe.paymentIntents.cancel(paymentIntentId);
}

export async function refundPaymentIntent(paymentIntentId: string, params?: {
  amount?: number;
  reason?: 'duplicate' | 'fraudulent' | 'requested_by_customer' | 'other';
  metadata?: Record<string, string>;
}) {
  const stripe = getStripe();
  return await stripe.refunds.create({
    payment_intent: paymentIntentId,
    amount: params?.amount,
    reason: params?.reason,
    metadata: params?.metadata,
  });
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

export async function updateCustomer(customerId: string, params: {
  name?: string;
  email?: string;
  phone?: string;
  address?: Stripe.AddressParam;
  invoice_settings?: { default_payment_method?: string };
  metadata?: Record<string, string>;
}) {
  const stripe = getStripe();
  return await stripe.customers.update(customerId, params);
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

// Subscription Functions
export async function createSubscription(params: {
  customer: string;
  price: string;
  quantity?: number;
  trial_period_days?: number;
  default_payment_method?: string;
  metadata?: Record<string, string>;
  cancel_at_period_end?: boolean;
  proration_behavior?: 'create_prorations' | 'none' | 'always_invoice';
}) {
  const stripe = getStripe();

  const subscriptionData: Stripe.SubscriptionCreateParams = {
    customer: params.customer,
    items: [{ price: params.price, quantity: params.quantity || 1 }],
    default_payment_method: params.default_payment_method,
    metadata: params.metadata,
    cancel_at_period_end: params.cancel_at_period_end,
    proration_behavior: params.proration_behavior,
  };

  if (params.trial_period_days) {
    subscriptionData.trial_period_days = params.trial_period_days;
  }

  return await stripe.subscriptions.create(subscriptionData);
}

export async function retrieveSubscription(subscriptionId: string) {
  const stripe = getStripe();
  return await stripe.subscriptions.retrieve(subscriptionId);
}

export async function updateSubscription(subscriptionId: string, params: {
  items?: Array<{ id?: string; price?: string; quantity?: number }>;
  metadata?: Record<string, string>;
  cancel_at_period_end?: boolean;
  proration_behavior?: 'create_prorations' | 'none' | 'always_invoice';
}) {
  const stripe = getStripe();
  return await stripe.subscriptions.update(subscriptionId, params);
}

export async function cancelSubscription(subscriptionId: string, params?: {
  invoice_now?: boolean;
  prorate?: boolean;
}) {
  const stripe = getStripe();
  return await stripe.subscriptions.cancel(subscriptionId, params);
}

export async function pauseSubscription(subscriptionId: string, params: {
  pause_collection?: { behavior: 'mark_uncollectible' | 'keep_as_draft' | 'void' };
  proration_behavior?: 'create_prorations' | 'none' | 'always_invoice';
}) {
  const stripe = getStripe();
  return await stripe.subscriptions.update(subscriptionId, {
    pause_collection: params.pause_collection,
    proration_behavior: params.proration_behavior,
  });
}

export async function resumeSubscription(subscriptionId: string) {
  const stripe = getStripe();
  return await stripe.subscriptions.resume(subscriptionId);
}

export async function listSubscriptions(params: {
  customer: string;
  status?: Stripe.Subscription.Status;
  limit?: number;
}) {
  const stripe = getStripe();
  return await stripe.subscriptions.list(params);
}

// Invoice Functions
export async function createInvoice(params: {
  customer: string;
  description?: string;
  due_days?: number;
  auto_advance?: boolean;
  default_tax_rates?: string[];
  metadata?: Record<string, string>;
}) {
  const stripe = getStripe();

  const invoiceData: Stripe.InvoiceCreateParams = {
    customer: params.customer,
    description: params.description,
    auto_advance: params.auto_advance,
    default_tax_rates: params.default_tax_rates,
    metadata: params.metadata,
  };

  if (params.due_days) {
    invoiceData.due_date = Math.floor(Date.now() / 1000) + params.due_days * 86400;
  }

  return await stripe.invoices.create(invoiceData);
}

export async function finalizeInvoice(invoiceId: string) {
  const stripe = getStripe();
  return await stripe.invoices.finalizeInvoice(invoiceId);
}

export async function voidInvoice(invoiceId: string) {
  const stripe = getStripe();
  return await stripe.invoices.voidInvoice(invoiceId);
}

export async function retrieveInvoice(invoiceId: string) {
  const stripe = getStripe();
  return await stripe.invoices.retrieve(invoiceId);
}

export async function createInvoiceItem(params: {
  customer: string;
  invoice?: string;
  description: string;
  amount: number;
  currency: string;
  quantity?: number;
  tax_rates?: string[];
}) {
  const stripe = getStripe();

  return await stripe.invoiceItems.create({
    customer: params.customer,
    invoice: params.invoice,
    description: params.description,
    amount: params.amount,
    currency: params.currency,
    quantity: params.quantity,
    tax_rates: params.tax_rates,
  });
}

// Payment Method Functions
export async function listPaymentMethods(params: {
  customer: string;
  type?: Stripe.PaymentMethodListParams['type'];
  limit?: number;
}) {
  const stripe = getStripe();
  return await stripe.paymentMethods.list(params);
}

export async function attachPaymentMethod(paymentMethodId: string, customerId: string) {
  const stripe = getStripe();
  return await stripe.paymentMethods.attach(paymentMethodId, {
    customer: customerId,
  });
}

export async function detachPaymentMethod(paymentMethodId: string) {
  const stripe = getStripe();
  return await stripe.paymentMethods.detach(paymentMethodId);
}

export async function retrievePaymentMethod(paymentMethodId: string) {
  const stripe = getStripe();
  return await stripe.paymentMethods.retrieve(paymentMethodId);
}

// Refund Functions
export async function retrieveRefund(refundId: string) {
  const stripe = getStripe();
  return await stripe.refunds.retrieve(refundId);
}

export async function listRefunds(params?: {
  payment_intent?: string;
  limit?: number;
}) {
  const stripe = getStripe();
  return await stripe.refunds.list(params);
}

// Coupon Functions
export async function createCoupon(params: {
  id?: string;
  name: string;
  percent_off?: number;
  amount_off?: number;
  currency?: string;
  duration: 'forever' | 'once' | 'repeating';
  duration_in_months?: number;
  max_redemptions?: number;
  redeem_by?: number;
  applies_to?: { products?: string[] };
}) {
  const stripe = getStripe();
  return await stripe.coupons.create(params);
}

export async function retrieveCoupon(couponId: string) {
  const stripe = getStripe();
  return await stripe.coupons.retrieve(couponId);
}

export async function deleteCoupon(couponId: string) {
  const stripe = getStripe();
  return await stripe.coupons.del(couponId);
}

// Tax Functions
export async function createTaxRate(params: {
  display_name: string;
  description?: string;
  jurisdiction?: string;
  percentage: number;
  inclusive: boolean;
  active?: boolean;
  metadata?: Record<string, string>;
}) {
  const stripe = getStripe();
  return await stripe.taxRates.create(params);
}

export async function retrieveTaxRate(taxRateId: string) {
  const stripe = getStripe();
  return await stripe.taxRates.retrieve(taxRateId);
}

export async function listTaxRates(params?: { active?: boolean; limit?: number }) {
  const stripe = getStripe();
  return await stripe.taxRates.list(params);
}

// Customer Portal Functions
export async function createCustomerPortalSession(params: {
  customer: string;
  return_url?: string;
  configuration?: string;
}) {
  const stripe = getStripe();
  return await stripe.billingPortal.sessions.create(params);
}

// Payment Link Functions
export async function createPaymentLink(params: {
  line_items: Array<{ price: string; quantity: number }>;
  after_completion?: {
    type: 'hosted_confirmation' | 'redirect';
    redirect?: { url: string };
    hosted_confirmation?: { custom_message?: string };
  };
  allow_promotion_codes?: boolean;
  automatic_tax?: { enabled: boolean };
  billing_address_collection?: 'auto' | 'required';
  currency?: string;
  custom_text?: { shipping_address?: { message?: string }; submit?: { message?: string } };
  invoice_creation?: { enabled: boolean; invoice_data?: { description?: string; metadata?: Record<string, string> } };
  metadata?: Record<string, string>;
  payment_method_types?: string[];
  shipping_address_collection?: { allowed_countries: string[] };
  submit_type?: 'auto' | 'book' | 'donate' | 'pay' | 'subscribe';
  subscription_data?: { description?: string; metadata?: Record<string, string>; trial_period_days?: number };
  tax_id_collection?: { enabled: boolean };
}) {
  const stripe = getStripe();
  return await stripe.paymentLinks.create(params);
}

export async function retrievePaymentLink(paymentLinkId: string) {
  const stripe = getStripe();
  return await stripe.paymentLinks.retrieve(paymentLinkId);
}

export async function updatePaymentLink(paymentLinkId: string, params: {
  active?: boolean;
  allow_promotion_codes?: boolean;
  automatic_tax?: { enabled: boolean };
  billing_address_collection?: 'auto' | 'required';
  custom_text?: { shipping_address?: { message?: string }; submit?: { message?: string } };
  invoice_creation?: { enabled: boolean; invoice_data?: { description?: string; metadata?: Record<string, string> } };
  metadata?: Record<string, string>;
  payment_method_types?: string[];
  shipping_address_collection?: { allowed_countries: string[] };
  tax_id_collection?: { enabled: boolean };
}) {
  const stripe = getStripe();
  return await stripe.paymentLinks.update(paymentLinkId, params);
}

// Webhook Functions
export async function constructWebhookEvent(
  payload: string | Buffer,
  signature: string,
  secret: string,
) {
  const stripe = getStripe();
  return stripe.webhooks.constructEvent(payload, signature, secret);
}

// Tax Calculation Functions (Stripe Tax)
export async function createTaxCalculation(params: {
  currency: string;
  line_items: Array<{
    amount: number;
    reference: string;
    tax_behavior?: 'inclusive' | 'exclusive' | 'unspecified';
    tax_code?: string;
  }>;
  customer?: string;
  customer_details?: {
    address: {
      line1?: string;
      line2?: string;
      city?: string;
      state?: string;
      postal_code?: string;
      country: string;
    };
    address_source?: 'billing' | 'shipping';
    ip_address?: string;
    tax_ids?: Array<{ type: string; value: string }>;
  };
  shipping_cost?: { amount: number; tax_behavior?: 'inclusive' | 'exclusive' | 'unspecified'; tax_code?: string };
  expand?: string[];
}) {
  const stripe = getStripe();
  return await stripe.tax.calculations.create(params);
}

// Balance Functions
export async function retrieveBalance() {
  const stripe = getStripe();
  return await stripe.balance.retrieve();
}

// Event Functions
export async function retrieveEvent(eventId: string) {
  const stripe = getStripe();
  return await stripe.events.retrieve(eventId);
}

export async function listEvents(params?: {
  type?: string | string[];
  created?: { gt?: number; gte?: number; lt?: number; lte?: number };
  ending_before?: string;
  limit?: number;
  starting_after?: string;
}) {
  const stripe = getStripe();
  return await stripe.events.list(params);
}

