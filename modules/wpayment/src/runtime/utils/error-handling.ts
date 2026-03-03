import type { StripeError } from '#wpayment/types';

// Error types
export class StripeModuleError extends Error {
  constructor(
    message: string,
    public code?: string,
    public type?: string,
    public originalError?: Error,
  ) {
    super(message);
    this.name = 'StripeModuleError';
  }
}

export class StripeInitializationError extends StripeModuleError {
  constructor(message: string, originalError?: Error) {
    super(message, 'stripe_initialization_failed', 'initialization', originalError);
    this.name = 'StripeInitializationError';
  }
}

export class StripePaymentError extends StripeModuleError {
  constructor(message: string, public paymentIntentId?: string, originalError?: Error) {
    super(message, 'stripe_payment_failed', 'payment', originalError);
    this.name = 'StripePaymentError';
  }
}

export class StripeElementError extends StripeModuleError {
  constructor(message: string, public elementType?: string, originalError?: Error) {
    super(message, 'stripe_element_error', 'element', originalError);
    this.name = 'StripeElementError';
  }
}

export class StripeConfigurationError extends StripeModuleError {
  constructor(message: string, originalError?: Error) {
    super(message, 'stripe_configuration_error', 'configuration', originalError);
    this.name = 'StripeConfigurationError';
  }
}

// Error handler function
export function handleStripeError(error: unknown): StripeModuleError {
  if (error instanceof StripeModuleError) {
    return error;
  }

  if (error instanceof Error) {
    // Handle Stripe.js errors
    if (isStripeError(error)) {
      return new StripeModuleError(
        error.message,
        error.code,
        error.type,
        error,
      );
    }

    // Handle network errors
    if (isNetworkError(error)) {
      return new StripeModuleError(
        'Network error occurred. Please check your connection and try again.',
        'network_error',
        'network',
        error,
      );
    }

    // Handle generic errors
    return new StripeModuleError(
      error.message,
      'unknown_error',
      'unknown',
      error,
    );
  }

  // Handle non-Error objects
  return new StripeModuleError(
    'An unexpected error occurred',
    'unexpected_error',
    'unknown',
  );
}

// Type guards
function isStripeError(error: any): error is StripeError {
  return error && typeof error === 'object' && 'type' in error;
}

function isNetworkError(error: Error): boolean {
  // Check for common network error patterns
  return (
    error.message.includes('fetch')
    || error.message.includes('network')
    || error.message.includes('connection')
    || error.message.includes('timeout')
    // @ts-ignore - Some environments expose this
    || error.name === 'NetworkError'
    // @ts-ignore - Some environments expose this
    || error.code === 'NETWORK_ERROR'
  );
}

// Error message mapping
export const ERROR_MESSAGES = {
  // Card errors
  card_declined: 'Your card was declined. Please try a different card.',
  incorrect_number: 'The card number is incorrect.',
  invalid_expiry_month: "The card's expiration month is invalid.",
  invalid_expiry_year: "The card's expiration year is invalid.",
  invalid_cvc: "The card's security code is invalid.",
  invalid_number: 'The card number is not a valid credit card number.',
  expired_card: 'The card has expired.',
  incorrect_cvc: "The card's security code is incorrect.",
  insufficient_funds: 'The card has insufficient funds.',
  processing_error: 'An error occurred while processing the card. Please try again.',

  // Payment intent errors
  payment_intent_authentication_failure: 'Authentication failed. Please try again.',
  payment_intent_invalid_parameter: 'Invalid payment parameter provided.',
  payment_intent_payment_attempt_failed: 'Payment attempt failed. Please try again.',

  // Configuration errors
  no_publishable_key: 'Stripe publishable key is not configured.',
  no_secret_key: 'Stripe secret key is not configured.',
  invalid_publishable_key: 'Invalid Stripe publishable key.',
  invalid_secret_key: 'Invalid Stripe secret key.',

  // Network errors
  network_error: 'Network error occurred. Please check your connection and try again.',
  timeout_error: 'Request timed out. Please try again.',

  // Generic errors
  unknown_error: 'An unexpected error occurred. Please try again.',
  validation_error: 'Invalid data provided. Please check your input.',
} as const;

// Error code mapping
export function getErrorMessage(error: StripeError | StripeModuleError): string {
  const code = 'code' in error ? error.code : undefined;
  const type = 'type' in error ? error.type : undefined;

  // First try to match by code
  if (code && code in ERROR_MESSAGES) {
    return ERROR_MESSAGES[code as keyof typeof ERROR_MESSAGES];
  }

  // Then try to match by type
  if (type && type in ERROR_MESSAGES) {
    return ERROR_MESSAGES[type as keyof typeof ERROR_MESSAGES];
  }

  // Return the original message if no mapping found
  return error.message;
}

// Error logging utility
export function logStripeError(error: StripeModuleError, context?: string) {
  const errorData = {
    name: error.name,
    message: error.message,
    code: error.code,
    type: error.type,
    context,
    timestamp: new Date().toISOString(),
  };

  if (process.dev) {
    console.error('[@wrikka/wpayment] Error:', errorData);
  }

  // In production, you might want to send this to a logging service
  if (process.server && !process.dev) {
    // Example: send to your error tracking service
    // trackError(errorData);
  }
}

// User-friendly error messages
export function getUserFriendlyMessage(error: StripeError | StripeModuleError): string {
  const message = getErrorMessage(error);

  // Add helpful context for specific error types
  if (error.code === 'card_declined') {
    return `${message} Please contact your bank or try a different payment method.`;
  }

  if (error.code === 'insufficient_funds') {
    return `${message} Please ensure you have sufficient funds and try again.`;
  }

  if (error.type === 'card_error') {
    return `${message} Please check your card details and try again.`;
  }

  if (error.type === 'validation_error') {
    return `${message} Please review the form and correct any errors.`;
  }

  return message;
}

// Error recovery suggestions
export function getRecoverySuggestion(error: StripeError | StripeModuleError): string {
  switch (error.code) {
    case 'card_declined':
      return 'Try using a different card or contact your bank.';
    case 'insufficient_funds':
      return 'Add funds to your account or use a different payment method.';
    case 'incorrect_cvc':
    case 'invalid_expiry_month':
    case 'invalid_expiry_year':
      return 'Double-check your card details and try again.';
    case 'network_error':
      return 'Check your internet connection and try again.';
    case 'no_publishable_key':
    case 'no_secret_key':
      return 'Please contact support if this issue persists.';
    default:
      return 'Please try again or contact support if the problem continues.';
  }
}
