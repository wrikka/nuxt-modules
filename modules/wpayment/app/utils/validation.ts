import { z } from 'zod';
import type { StripeConfig, StripeConfirmParams, StripeElementsOptions } from '#wpayment/types';

// Configuration validation schemas
export const stripeConfigSchema = z.object({
  publishableKey: z.string().min(1, 'Stripe publishable key is required'),
  apiVersion: z.string().optional(),
  locale: z.string().optional(),
  elementsOptions: z.record(z.any()).optional(),
  confirmParams: z.record(z.any()).optional(),
});

export const stripeElementsOptionsSchema = z.object({
  appearance: z.object({
    theme: z.enum(['stripe', 'night', 'flat', 'none']).optional(),
    variables: z.record(z.string()).optional(),
    rules: z.record(z.any()).optional(),
    labels: z.enum(['above', 'floating', 'hidden']).optional(),
  }).optional(),
  clientSecret: z.string().optional(),
  fonts: z.array(z.object({
    family: z.string().optional(),
    src: z.string().optional(),
    weight: z.union([z.string(), z.number()]).optional(),
    style: z.string().optional(),
    display: z.string().optional(),
  })).optional(),
  locale: z.string().optional(),
  mode: z.enum(['payment', 'subscription', 'setup']).optional(),
  amount: z.number().min(0).optional(),
  currency: z.string().length(3).optional(),
  paymentMethodCreation: z.string().optional(),
  paymentMethodTypes: z.array(z.string()).optional(),
});

export const stripeConfirmParamsSchema = z.object({
  return_url: z.string().url().optional(),
  payment_method_data: z.object({
    billing_details: z.object({
      email: z.string().email().optional(),
      phone: z.string().optional(),
      address: z.object({
        city: z.string().optional(),
        country: z.string().length(2).optional(),
        line1: z.string().optional(),
        line2: z.string().optional(),
        postal_code: z.string().optional(),
        state: z.string().optional(),
      }).optional(),
      name: z.string().optional(),
    }).optional(),
  }).optional(),
  save_payment_method: z.boolean().optional(),
  setup_future_usage: z.enum(['off_session', 'on_session']).optional(),
});

// Payment Intent validation
export const paymentIntentSchema = z.object({
  amount: z.number().min(1, 'Amount must be at least 1'),
  currency: z.string().length(3, 'Currency must be a 3-letter code'),
  customer: z.string().optional(),
  payment_method: z.string().optional(),
  metadata: z.record(z.string()).optional(),
});

// Customer validation
export const customerSchema = z.object({
  email: z.string().email('Valid email is required'),
  name: z.string().optional(),
  metadata: z.record(z.string()).optional(),
});

// Checkout Session validation
export const checkoutSessionSchema = z.object({
  success_url: z.string().url('Valid success URL is required'),
  cancel_url: z.string().url('Valid cancel URL is required'),
  customer: z.string().optional(),
  customer_email: z.string().email().optional(),
  line_items: z.array(z.object({
    price_data: z.object({
      currency: z.string().length(3),
      product_data: z.object({
        name: z.string().min(1, 'Product name is required'),
        description: z.string().optional(),
        images: z.array(z.string().url()).optional(),
      }),
      unit_amount: z.number().min(1),
      recurring: z.object({
        interval: z.enum(['day', 'week', 'month', 'year']),
        interval_count: z.number().min(1).optional(),
      }).optional(),
    }),
    quantity: z.number().min(1),
  })).min(1, 'At least one line item is required'),
  mode: z.enum(['payment', 'subscription']).default('payment'),
  metadata: z.record(z.string()).optional(),
});

// Validation functions
export function validateStripeConfig(config: unknown): StripeConfig {
  const result = stripeConfigSchema.safeParse(config);
  if (!result.success) {
    throw new Error(`Invalid Stripe configuration: ${result.error.message}`);
  }
  return result.data;
}

export function validateElementsOptions(options: unknown): StripeElementsOptions {
  const result = stripeElementsOptionsSchema.safeParse(options);
  if (!result.success) {
    throw new Error(`Invalid elements options: ${result.error.message}`);
  }
  return result.data;
}

export function validateConfirmParams(params: unknown): StripeConfirmParams {
  const result = stripeConfirmParamsSchema.safeParse(params);
  if (!result.success) {
    throw new Error(`Invalid confirm params: ${result.error.message}`);
  }
  return result.data;
}

export function validatePaymentIntent(data: unknown) {
  const result = paymentIntentSchema.safeParse(data);
  if (!result.success) {
    throw new Error(`Invalid payment intent data: ${result.error.message}`);
  }
  return result.data;
}

export function validateCustomer(data: unknown) {
  const result = customerSchema.safeParse(data);
  if (!result.success) {
    throw new Error(`Invalid customer data: ${result.error.message}`);
  }
  return result.data;
}

export function validateCheckoutSession(data: unknown) {
  const result = checkoutSessionSchema.safeParse(data);
  if (!result.success) {
    throw new Error(`Invalid checkout session data: ${result.error.message}`);
  }
  return result.data;
}

// Error class for Stripe validation errors
export class StripeValidationError extends Error {
  constructor(message: string, public code?: string) {
    super(message);
    this.name = 'StripeValidationError';
  }
}

// Common validation errors
export const VALIDATION_ERRORS = {
  INVALID_PUBLISHABLE_KEY: new StripeValidationError(
    'Invalid Stripe publishable key format',
    'invalid_publishable_key',
  ),
  INVALID_SECRET_KEY: new StripeValidationError('Invalid Stripe secret key format', 'invalid_secret_key'),
  INVALID_AMOUNT: new StripeValidationError('Amount must be a positive number', 'invalid_amount'),
  INVALID_CURRENCY: new StripeValidationError('Currency must be a valid 3-letter code', 'invalid_currency'),
  INVALID_EMAIL: new StripeValidationError('Invalid email format', 'invalid_email'),
  INVALID_URL: new StripeValidationError('Invalid URL format', 'invalid_url'),
  MISSING_REQUIRED_FIELD: (field: string) =>
    new StripeValidationError(`Missing required field: ${field}`, 'missing_required_field'),
} as const;

// Helper functions
export function isValidPublishableKey(key: string): boolean {
  return /^pk_test_[a-zA-Z0-9]{16,}$|^pk_live_[a-zA-Z0-9]{16,}$/.test(key);
}

export function isValidSecretKey(key: string): boolean {
  return /^sk_test_[a-zA-Z0-9]{16,}$|^sk_live_[a-zA-Z0-9]{16,}$/.test(key);
}

export function isValidCurrency(currency: string): boolean {
  return /^[A-Z]{3}$/.test(currency);
}

export function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export function isValidUrl(url: string): boolean {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}
