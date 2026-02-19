import type { Ref } from 'vue';

// 3D Secure Authentication
export interface ThreeDSecureAuthentication {
  version: string;
  authentication_flow?: 'challenge' | 'frictionless';
  result?: 'authenticated' | 'attempt_acknowledged' | 'failed' | 'not_supported' | 'processing';
  result_reason?: string;
  challenge_form?: ThreeDSecureChallengeForm;
  liability_shift_possible?: boolean;
  liability_shifted?: boolean;
  stripe_3ds2_fingerprint?: string;
  stripe_3ds2_result?: string;
  electronic_commerce_indicator?: string;
  transaction_id?: string;
}

export interface ThreeDSecureChallengeForm {
  html?: string;
  iframe?: {
    url: string;
    width: number;
    height: number;
  };
}

// 3D Secure Options
export interface ThreeDSecureOptions {
  request_three_d_secure?: 'automatic' | 'any';
  require_enrolled_card?: boolean;
  require_challenge?: boolean;
  exemption_reason?: 'low_value' | 'transaction_risk_analysis';
  preferred_exemption?: 'low_value' | 'transaction_risk_analysis';
}

// 3D Secure Result
export interface ThreeDSecureResult {
  success: boolean;
  authentication?: ThreeDSecureAuthentication;
  error?: {
    code?: string;
    message: string;
    type?: string;
  };
  liabilityShifted?: boolean;
  liabilityShiftPossible?: boolean;
}

// 3D Secure Handler
export interface ThreeDSecureHandler {
  authenticate: (clientSecret: string, options?: ThreeDSecureOptions) => Promise<ThreeDSecureResult>;
  verify: (paymentIntentId: string) => Promise<ThreeDSecureResult>;
  isAvailable: () => Promise<boolean>;
}

// Composable Return Types
export interface UseThreeDSecureReturn {
  loading: Readonly<Ref<boolean>>;
  error: Readonly<Ref<string | null>>;
  result: Readonly<Ref<ThreeDSecureResult | null>>;
  authenticate: (clientSecret: string, options?: ThreeDSecureOptions) => Promise<ThreeDSecureResult>;
  verify: (paymentIntentId: string) => Promise<ThreeDSecureResult>;
  isAvailable: () => Promise<boolean>;
  getAuthenticationStatus: (paymentIntentId: string) => Promise<ThreeDSecureAuthentication | null>;
}

// Payment Retry Configuration
export interface PaymentRetryConfig {
  maxRetries: number;
  backoffStrategy: 'exponential' | 'linear' | 'fixed';
  initialDelay: number;
  maxDelay: number;
  retryableErrors: string[];
  onRetry?: (attempt: number, error: string) => void;
  onSuccess?: (attempt: number) => void;
  onFailure?: (attempts: number, lastError: string) => void;
}

// Payment Retry Result
export interface PaymentRetryResult {
  success: boolean;
  attempts: number;
  lastError?: string;
  paymentIntent?: import('./index').PaymentIntent;
  retryHistory: RetryAttempt[];
}

export interface RetryAttempt {
  attempt: number;
  timestamp: number;
  error?: string;
  delay: number;
}

// Composable Return Types
export interface UsePaymentRetryReturn {
  loading: Readonly<Ref<boolean>>;
  error: Readonly<Ref<string | null>>;
  result: Readonly<Ref<PaymentRetryResult | null>>;
  executeWithRetry: (
    paymentFn: () => Promise<{ success: boolean; error?: string; }>,
    config?: Partial<PaymentRetryConfig>,
  ) => Promise<PaymentRetryResult>;
  shouldRetry: (error: string) => boolean;
  getRetryDelay: (attempt: number, config: PaymentRetryConfig) => number;
}

// Default Retry Configuration
export const DEFAULT_RETRY_CONFIG: PaymentRetryConfig = {
  maxRetries: 3,
  backoffStrategy: 'exponential',
  initialDelay: 1000,
  maxDelay: 30000,
  retryableErrors: [
    'api_connection_error',
    'api_error',
    'rate_limit_error',
    'lock_timeout',
    'idempotency_error',
  ],
};

// Retryable Error Codes
export const RETRYABLE_ERROR_CODES = [
  'api_connection_error',
  'api_error',
  'rate_limit_error',
  'lock_timeout',
  'idempotency_error',
  'processing_error',
  'try_again_later',
  'card_declined_velocity_exceeded',
];
