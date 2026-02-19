// Webhook Event Types
export type WebhookEventType =
  | 'account.application.authorized'
  | 'account.application.deauthorized'
  | 'account.external_account.created'
  | 'account.external_account.deleted'
  | 'account.external_account.updated'
  | 'account.updated'
  | 'application_fee.created'
  | 'application_fee.refunded'
  | 'application_fee.refund.updated'
  | 'balance.available'
  | 'billing_portal.configuration.created'
  | 'billing_portal.configuration.updated'
  | 'billing_portal.session.created'
  | 'capability.updated'
  | 'cash_balance.funds_available'
  | 'charge.captured'
  | 'charge.dispute.closed'
  | 'charge.dispute.created'
  | 'charge.dispute.funds_reinstated'
  | 'charge.dispute.funds_withdrawn'
  | 'charge.dispute.updated'
  | 'charge.expired'
  | 'charge.failed'
  | 'charge.pending'
  | 'charge.refundable'
  | 'charge.refunded'
  | 'charge.succeeded'
  | 'charge.updated'
  | 'checkout.session.async_payment_failed'
  | 'checkout.session.async_payment_succeeded'
  | 'checkout.session.completed'
  | 'checkout.session.expired'
  | 'climate.order.created'
  | 'climate.order.delivered'
  | 'climate.order.product_substituted'
  | 'climate.product.created'
  | 'climate.product.pricing_updated'
  | 'coupon.created'
  | 'coupon.deleted'
  | 'coupon.updated'
  | 'credit_note.created'
  | 'credit_note.updated'
  | 'credit_note.voided'
  | 'customer.created'
  | 'customer.deleted'
  | 'customer.updated'
  | 'customer.discount.created'
  | 'customer.discount.deleted'
  | 'customer.discount.updated'
  | 'customer.source.created'
  | 'customer.source.deleted'
  | 'customer.source.expiring'
  | 'customer.source.updated'
  | 'customer.tax_id.created'
  | 'customer.tax_id.deleted'
  | 'customer.tax_id.updated'
  | 'customer_cash_balance_transaction.created'
  | 'customer_cash_balance_transaction.updated'
  | 'entitlements.active_entitlement_summary.updated'
  | 'entitlements.feature.created'
  | 'entitlements.feature.updated'
  | 'file.created'
  | 'financial_connections.account.created'
  | 'financial_connections.account.deactivated'
  | 'financial_connections.account.disconnected'
  | 'financial_connections.account.reactivated'
  | 'financial_connections.account.refreshed_balance'
  | 'financial_connections.account.refreshed_ownership'
  | 'financial_connections.account.refreshed_transactions'
  | 'identity.verification_session.canceled'
  | 'identity.verification_session.created'
  | 'identity.verification_session.processing'
  | 'identity.verification_session.redacted'
  | 'identity.verification_session.requires_input'
  | 'identity.verification_session.verified'
  | 'invoice.created'
  | 'invoice.deleted'
  | 'invoice.finalization_failed'
  | 'invoice.finalized'
  | 'invoice.marked_uncollectible'
  | 'invoice.overdue'
  | 'invoice.paid'
  | 'invoice.payment_action_required'
  | 'invoice.payment_failed'
  | 'invoice.payment_succeeded'
  | 'invoice.sent'
  | 'invoice.tax_amounts_updated'
  | 'invoice.upcoming'
  | 'invoice.updated'
  | 'invoice.voided'
  | 'invoice.will_be_due'
  | 'invoiceitem.created'
  | 'invoiceitem.deleted'
  | 'issuing_authorization.created'
  | 'issuing_authorization.request'
  | 'issuing_authorization.updated'
  | 'issuing_card.created'
  | 'issuing_card.updated'
  | 'issuing_cardholder.created'
  | 'issuing_cardholder.updated'
  | 'issuing_dispute.closed'
  | 'issuing_dispute.created'
  | 'issuing_dispute.funds_reinstated'
  | 'issuing_dispute.submitted'
  | 'issuing_dispute.updated'
  | 'issuing_personal_interest_design.created'
  | 'issuing_personal_interest_design.rejected'
  | 'issuing_transaction.created'
  | 'issuing_transaction.updated'
  | 'mandate.updated'
  | 'order.created'
  | 'order.payment_failed'
  | 'order.payment_succeeded'
  | 'order.updated'
  | 'order_return.created'
  | 'order_return.updated'
  | 'payment_intent.amount_capturable_updated'
  | 'payment_intent.canceled'
  | 'payment_intent.created'
  | 'payment_intent.partially_funded'
  | 'payment_intent.payment_failed'
  | 'payment_intent.processing'
  | 'payment_intent.requires_action'
  | 'payment_intent.succeeded'
  | 'payment_link.created'
  | 'payment_link.updated'
  | 'payment_method.attached'
  | 'payment_method.automatically_updated'
  | 'payment_method.detached'
  | 'payment_method.updated'
  | 'payout.canceled'
  | 'payout.created'
  | 'payout.failed'
  | 'payout.paid'
  | 'payout.reconciliation_completed'
  | 'payout.updated'
  | 'person.created'
  | 'person.deleted'
  | 'person.updated'
  | 'plan.created'
  | 'plan.deleted'
  | 'plan.updated'
  | 'price.created'
  | 'price.deleted'
  | 'price.updated'
  | 'product.created'
  | 'product.deleted'
  | 'product.updated'
  | 'promotion_code.created'
  | 'promotion_code.updated'
  | 'quote.accepted'
  | 'quote.canceled'
  | 'quote.created'
  | 'quote.finalized'
  | 'radar.early_fraud_warning.created'
  | 'radar.early_fraud_warning.updated'
  | 'reader.action_failed'
  | 'reader.action_succeeded'
  | 'refund.canceled'
  | 'refund.created'
  | 'refund.updated'
  | 'reporting.report_run.failed'
  | 'reporting.report_run.succeeded'
  | 'reporting.report_type.updated'
  | 'review.closed'
  | 'review.opened'
  | 'setup_intent.canceled'
  | 'setup_intent.created'
  | 'setup_intent.requires_action'
  | 'setup_intent.setup_failed'
  | 'setup_intent.succeeded'
  | 'sigma.scheduled_query_run.created'
  | 'source.canceled'
  | 'source.chargeable'
  | 'source.failed'
  | 'source.mandate_notification'
  | 'source.refund_attributes_required'
  | 'source.transaction.created'
  | 'source.transaction.updated'
  | 'customer.subscription.created'
  | 'customer.subscription.deleted'
  | 'customer.subscription.paused'
  | 'customer.subscription.pending_update_applied'
  | 'customer.subscription.pending_update_expired'
  | 'customer.subscription.resumed'
  | 'customer.subscription.trial_will_end'
  | 'customer.subscription.updated'
  | 'subscription_schedule.aborted'
  | 'subscription_schedule.canceled'
  | 'subscription_schedule.completed'
  | 'subscription_schedule.created'
  | 'subscription_schedule.expiring'
  | 'subscription_schedule.released'
  | 'subscription_schedule.updated'
  | 'subscription_trials.trial_ended'
  | 'tax.calculation.created'
  | 'tax.registration.created'
  | 'tax.registration.deleted'
  | 'tax.registration.updated'
  | 'tax.settings.updated'
  | 'tax.transaction.created'
  | 'tax.transaction.reversed'
  | 'tax.transaction.updated'
  | 'terminal.reader.action_failed'
  | 'terminal.reader.action_succeeded'
  | 'terminal.reader.connected'
  | 'terminal.reader.disconnected'
  | 'test_helpers.test_clock.advancing'
  | 'test_helpers.test_clock.created'
  | 'test_helpers.test_clock.deleted'
  | 'test_helpers.test_clock.internal_failure'
  | 'test_helpers.test_clock.ready'
  | 'topup.canceled'
  | 'topup.created'
  | 'topup.failed'
  | 'topup.reversed'
  | 'topup.succeeded'
  | 'transfer.created'
  | 'transfer.reversed'
  | 'transfer.updated'
  | 'treasury.credit_reversal.created'
  | 'treasury.credit_reversal.posted'
  | 'treasury.debit_reversal.completed'
  | 'treasury.debit_reversal.created'
  | 'treasury.debit_reversal.initial_credit_granted'
  | 'treasury.financial_account.closed'
  | 'treasury.financial_account.created'
  | 'treasury.financial_account.features_status_updated'
  | 'treasury.inbound_transfer.canceled'
  | 'treasury.inbound_transfer.created'
  | 'treasury.inbound_transfer.failed'
  | 'treasury.inbound_transfer.succeeded'
  | 'treasury.outbound_payment.canceled'
  | 'treasury.outbound_payment.created'
  | 'treasury.outbound_payment.expected_arrival_date_updated'
  | 'treasury.outbound_payment.failed'
  | 'treasury.outbound_payment.posted'
  | 'treasury.outbound_payment.returned'
  | 'treasury.outbound_transfer.canceled'
  | 'treasury.outbound_transfer.created'
  | 'treasury.outbound_transfer.expected_arrival_date_updated'
  | 'treasury.outbound_transfer.failed'
  | 'treasury.outbound_transfer.posted'
  | 'treasury.outbound_transfer.returned'
  | 'treasury.received_credit.created'
  | 'treasury.received_credit.failed'
  | 'treasury.received_credit.succeeded'
  | 'treasury.received_debit.created'
  | 'usage_record.created'
  | 'usage_record.updated'
  | 'verify.session.canceled'
  | 'verify.session.created'
  | 'verify.session.expired'
  | 'verify.session.redacted'
  | 'verify.session.verified';

// Base Webhook Event
export interface WebhookEvent {
  id: string;
  object: 'event';
  api_version?: string;
  created: number;
  data: {
    object: unknown;
    previous_attributes?: Record<string, unknown>;
  };
  livemode: boolean;
  pending_webhooks?: number;
  request?: {
    id?: string;
    idempotency_key?: string;
  };
  type: WebhookEventType;
}

// Payment Intent Event
export interface PaymentIntentEvent extends WebhookEvent {
  type:
    | 'payment_intent.amount_capturable_updated'
    | 'payment_intent.canceled'
    | 'payment_intent.created'
    | 'payment_intent.partially_funded'
    | 'payment_intent.payment_failed'
    | 'payment_intent.processing'
    | 'payment_intent.requires_action'
    | 'payment_intent.succeeded';
  data: {
    object: import('./index').PaymentIntent;
    previous_attributes?: Partial<import('./index').PaymentIntent>;
  };
}

// Checkout Session Event
export interface CheckoutSessionEvent extends WebhookEvent {
  type:
    | 'checkout.session.async_payment_failed'
    | 'checkout.session.async_payment_succeeded'
    | 'checkout.session.completed'
    | 'checkout.session.expired';
  data: {
    object: import('./index').CheckoutSession;
    previous_attributes?: Partial<import('./index').CheckoutSession>;
  };
}

// Customer Event
export interface CustomerEvent extends WebhookEvent {
  type:
    | 'customer.created'
    | 'customer.deleted'
    | 'customer.updated';
  data: {
    object: import('./index').Customer;
    previous_attributes?: Partial<import('./index').Customer>;
  };
}

// Invoice Event
export interface InvoiceEvent extends WebhookEvent {
  type:
    | 'invoice.created'
    | 'invoice.deleted'
    | 'invoice.finalization_failed'
    | 'invoice.finalized'
    | 'invoice.marked_uncollectible'
    | 'invoice.overdue'
    | 'invoice.paid'
    | 'invoice.payment_action_required'
    | 'invoice.payment_failed'
    | 'invoice.payment_succeeded'
    | 'invoice.sent'
    | 'invoice.tax_amounts_updated'
    | 'invoice.upcoming'
    | 'invoice.updated'
    | 'invoice.voided'
    | 'invoice.will_be_due';
  data: {
    object: Invoice;
    previous_attributes?: Partial<Invoice>;
  };
}

// Subscription Event
export interface SubscriptionEvent extends WebhookEvent {
  type:
    | 'customer.subscription.created'
    | 'customer.subscription.deleted'
    | 'customer.subscription.paused'
    | 'customer.subscription.resumed'
    | 'customer.subscription.trial_will_end'
    | 'customer.subscription.updated';
  data: {
    object: Subscription;
    previous_attributes?: Partial<Subscription>;
  };
}

// Charge Event
export interface ChargeEvent extends WebhookEvent {
  type:
    | 'charge.captured'
    | 'charge.expired'
    | 'charge.failed'
    | 'charge.pending'
    | 'charge.refundable'
    | 'charge.refunded'
    | 'charge.succeeded'
    | 'charge.updated';
  data: {
    object: Charge;
    previous_attributes?: Partial<Charge>;
  };
}

// Refund Event
export interface RefundEvent extends WebhookEvent {
  type:
    | 'refund.canceled'
    | 'refund.created'
    | 'refund.updated';
  data: {
    object: Refund;
    previous_attributes?: Partial<Refund>;
  };
}

// Invoice
export interface Invoice {
  id: string;
  object: 'invoice';
  account_country?: string;
  account_name?: string;
  account_tax_ids?: string[];
  amount_due?: number;
  amount_paid?: number;
  amount_remaining?: number;
  amount_shipping?: number;
  application?: string;
  application_fee_amount?: number;
  attempt_count?: number;
  attempted?: boolean;
  auto_advance?: boolean;
  automatic_tax?: InvoiceAutomaticTax;
  billing_reason?: string;
  collection_method?: 'charge_automatically' | 'send_invoice';
  created: number;
  currency?: string;
  custom_fields?: InvoiceCustomField[];
  customer?: string;
  customer_address?: import('./index').StripeAddress;
  customer_email?: string;
  customer_name?: string;
  customer_phone?: string;
  customer_shipping?: import('./index').StripeShipping;
  customer_tax_exempt?: 'none' | 'exempt' | 'reverse';
  customer_tax_ids?: InvoiceCustomerTaxId[];
  default_payment_method?: string;
  default_source?: string;
  default_tax_rates?: string[];
  description?: string;
  discount?: InvoiceDiscount;
  discounts?: string[];
  due_date?: number;
  effective_at?: number;
  ending_balance?: number;
  footer?: string;
  from_invoice?: InvoiceFromInvoice;
  hosted_invoice_url?: string;
  invoice_pdf?: string;
  last_finalization_error?: import('./index').StripeError;
  latest_revision?: string;
  livemode: boolean;
  metadata?: Record<string, string>;
  next_payment_attempt?: number;
  number?: string;
  on_behalf_of?: string;
  paid?: boolean;
  paid_out_of_band?: boolean;
  payment_intent?: string;
  payment_settings?: InvoicePaymentSettings;
  period_end?: number;
  period_start?: number;
  post_payment_credit_notes_amount?: number;
  pre_payment_credit_notes_amount?: number;
  quote?: string;
  receipt_number?: string;
  rendering_options?: InvoiceRenderingOptions;
  shipping?: InvoiceShipping;
  starting_balance?: number;
  statement_descriptor?: string;
  status?: InvoiceStatus;
  status_transitions?: InvoiceStatusTransitions;
  subscription?: string;
  subscription_details?: InvoiceSubscriptionDetails;
  subtotal?: number;
  tax?: number;
  test_clock?: string;
  total?: number;
  total_discount_amounts?: InvoiceDiscountAmount[];
  total_tax_amounts?: InvoiceTaxAmount[];
  transfer_data?: InvoiceTransferData;
  webhooks_delivered_at?: number;
}

export type InvoiceStatus =
  | 'draft'
  | 'open'
  | 'paid'
  | 'uncollectible'
  | 'void';

export interface InvoiceAutomaticTax {
  enabled: boolean;
  status?: 'pending' | 'complete' | 'failed' | 'requires_location_inputs';
}

export interface InvoiceCustomField {
  name: string;
  value: string;
}

export interface InvoiceCustomerTaxId {
  type: string;
  value: string;
}

export interface InvoiceDiscount {
  coupon?: import('./index').StripeCoupon;
}

export interface InvoiceDiscountAmount {
  amount: number;
  discount: string;
}

export interface InvoiceFromInvoice {
  invoice?: string;
  action: 'revision';
}

export interface InvoicePaymentSettings {
  default_mandate?: string;
  payment_method_options?: InvoicePaymentMethodOptions;
  payment_method_types?: string[];
}

export interface InvoicePaymentMethodOptions {
  acss_debit?: InvoiceAcssDebitOptions;
  bancontact?: InvoiceBancontactOptions;
  card?: InvoiceCardOptions;
  customer_balance?: InvoiceCustomerBalanceOptions;
  konbini?: InvoiceKonbiniOptions;
  sepa_debit?: InvoiceSepaDebitOptions;
  us_bank_account?: InvoiceUsBankAccountOptions;
}

export interface InvoiceAcssDebitOptions {}
export interface InvoiceBancontactOptions {}
export interface InvoiceCardOptions {}
export interface InvoiceCustomerBalanceOptions {}
export interface InvoiceKonbiniOptions {}
export interface InvoiceSepaDebitOptions {}
export interface InvoiceUsBankAccountOptions {}

export interface InvoiceRenderingOptions {
  amount_tax_display?: 'exclude_tax' | 'include_tax';
}

export interface InvoiceShipping {
  address?: import('./index').StripeAddress;
  name?: string;
  phone?: string;
}

export interface InvoiceStatusTransitions {
  finalized_at?: number;
  marked_uncollectible_at?: number;
  paid_at?: number;
  voided_at?: number;
}

export interface InvoiceSubscriptionDetails {
  metadata?: Record<string, string>;
}

export interface InvoiceTaxAmount {
  amount: number;
  inclusive?: boolean;
  tax_rate?: string;
  tax_behavior?: 'inclusive' | 'exclusive';
}

export interface InvoiceTransferData {
  destination: string;
  amount?: number;
}

// Charge
export interface Charge {
  id: string;
  object: 'charge';
  amount: number;
  amount_captured?: number;
  amount_refunded?: number;
  application?: string;
  application_fee?: string;
  application_fee_amount?: number;
  balance_transaction?: string;
  billing_details?: import('./index').StripeBillingDetails;
  calculated_statement_descriptor?: string;
  captured?: boolean;
  created: number;
  currency: string;
  customer?: string;
  description?: string;
  destination?: string;
  dispute?: string;
  disputed?: boolean;
  failure_balance_transaction?: string;
  failure_code?: string;
  failure_message?: string;
  fraud_details?: ChargeFraudDetails;
  invoice?: string;
  livemode: boolean;
  metadata?: Record<string, string>;
  on_behalf_of?: string;
  order?: string;
  outcome?: ChargeOutcome;
  paid?: boolean;
  payment_intent?: string;
  payment_method?: string;
  payment_method_details?: ChargePaymentMethodDetails;
  radar_options?: ChargeRadarOptions;
  receipt_email?: string;
  receipt_number?: string;
  receipt_url?: string;
  refunded?: boolean;
  review?: string;
  shipping?: import('./index').StripeShipping;
  source?: string;
  source_transfer?: string;
  statement_descriptor?: string;
  statement_descriptor_suffix?: string;
  status: ChargeStatus;
  transfer?: string;
  transfer_data?: ChargeTransferData;
  transfer_group?: string;
}

export type ChargeStatus =
  | 'succeeded'
  | 'pending'
  | 'failed';

export interface ChargeFraudDetails {
  stripe_report?: 'fraudulent' | 'safe';
  user_report?: 'fraudulent' | 'safe';
}

export interface ChargeOutcome {
  network_status?: 'approved_by_network' | 'declined_by_network' | 'not_sent_to_network' | 'reversed_after_approval';
  reason?: string;
  risk_level?: 'normal' | 'elevated' | 'highest' | 'not_assessed' | 'unknown';
  risk_score?: number;
  rule?: string;
  seller_message?: string;
  type?: 'authorized' | 'manual_review' | 'issuer_declined' | 'blocked' | 'invalid';
}

export interface ChargePaymentMethodDetails {
  card?: ChargeCardDetails;
  type: string;
}

export interface ChargeCardDetails {
  brand: string;
  checks?: ChargeCardChecks;
  country?: string;
  exp_month?: number;
  exp_year?: number;
  fingerprint?: string;
  funding?: 'credit' | 'debit' | 'prepaid' | 'unknown';
  installments?: ChargeCardInstallments;
  last4?: string;
  mandate?: string;
  network?: string;
  three_d_secure?: ChargeCardThreeDSecure;
  wallet?: ChargeCardWallet;
}

export interface ChargeCardChecks {
  address_line1_check?: 'pass' | 'fail' | 'unavailable' | 'unchecked';
  address_postal_code_check?: 'pass' | 'fail' | 'unavailable' | 'unchecked';
  cvc_check?: 'pass' | 'fail' | 'unavailable' | 'unchecked';
}

export interface ChargeCardInstallments {
  plan?: ChargeCardInstallmentPlan;
}

export interface ChargeCardInstallmentPlan {
  count?: number;
  interval?: 'month';
  type?: 'fixed_count';
}

export interface ChargeCardThreeDSecure {
  authentication_flow?: 'challenge' | 'frictionless';
  result?: 'authenticated' | 'attempt_acknowledged' | 'failed' | 'not_supported';
  result_reason?: string;
  version?: string;
}

export interface ChargeCardWallet {
  type?: 'apple_pay' | 'google_pay' | 'link' | 'samsung_pay';
}

export interface ChargeRadarOptions {}
export interface ChargeTransferData {
  destination: string;
  amount?: number;
}

// Refund
export interface Refund {
  id: string;
  object: 'refund';
  amount?: number;
  balance_transaction?: string;
  charge: string;
  created: number;
  currency?: string;
  description?: string;
  destination_details?: RefundDestinationDetails;
  failure_balance_transaction?: string;
  failure_reason?: RefundFailureReason;
  instructions_email?: string;
  livemode: boolean;
  metadata?: Record<string, string>;
  next_pending_charge?: string;
  origin?: 'customer_balance' | 'stripe_connect' | 'stripe_fee';
  payment_intent?: string;
  reason?: RefundReason;
  receipt_number?: string;
  source_transfer_reversal?: string;
  status: RefundStatus;
  transfer_reversal?: string;
}

export type RefundFailureReason =
  | 'expired_or_canceled_card'
  | 'lost_or_stolen_card'
  | 'unknown';

export type RefundReason =
  | 'duplicate'
  | 'fraudulent'
  | 'requested_by_customer'
  | 'expired_uncaptured_charge';

export type RefundStatus =
  | 'pending'
  | 'succeeded'
  | 'failed'
  | 'canceled';

export interface RefundDestinationDetails {
  card?: RefundCardDetails;
  type?: string;
}

export interface RefundCardDetails {
  reference?: string;
  reference_status?: 'pending' | 'available';
  reference_type?: 'acquirer_reference_number' | 'transaction_id';
}

// Webhook Handler Types
export interface WebhookHandlerOptions {
  secret?: string;
  tolerance?: number;
  rawBody?: string;
}

export interface WebhookHandlerResult {
  received: boolean;
  event?: WebhookEvent;
  error?: string;
}

export interface WebhookEventHandler {
  event: WebhookEventType;
  handler: (event: WebhookEvent) => Promise<void> | void;
}

// Import Subscription from subscription.ts
import type { Subscription } from './subscription';
