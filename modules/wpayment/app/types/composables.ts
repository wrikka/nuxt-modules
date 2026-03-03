import type { Ref } from 'vue';
import type { Stripe, StripeElement, StripeElements } from '@stripe/stripe-js';
import type { PaymentIntent } from './payment-intent';
import type { StripeConfig, StripeElementsOptions, StripeConfirmParams, StripeAppearance } from './stripe-config';

export interface UseStripeReturn {
  stripe: Readonly<Ref<Stripe | null>>;
  elements: Readonly<Ref<StripeElements | null>>;
  loading: Readonly<Ref<boolean>>;
  error: Readonly<Ref<string | null>>;
  initialize: () => Promise<void>;
  createElements: (options?: StripeElementsOptions) => void;
  confirmPayment: (
    clientSecret: string,
    elements?: StripeElements,
    confirmParams?: StripeConfirmParams,
  ) => Promise<PaymentResult>;
  confirmCardPayment: (
    clientSecret: string,
    data?: any,
    confirmParams?: StripeConfirmParams,
  ) => Promise<PaymentResult>;
  retrievePaymentIntent: (clientSecret: string) => Promise<Stripe.RetrievePaymentIntentResult>;
}

export interface UseStripeElementsReturn {
  elements: Readonly<Ref<StripeElements | null>>;
  error: Readonly<Ref<string | null>>;
  createElement: (type: string, options?: any) => StripeElement | null;
  getElement: (type: string) => StripeElement | null;
  update: (options: StripeElementsOptions) => void;
  clear: () => void;
  focus: (type: string) => void;
  blur: (type: string) => void;
  destroy: (type: string) => void;
}

export interface PaymentResult {
  paymentIntent?: PaymentIntent;
  error?: import('./payment-intent').StripeError;
}

export interface StripeElementsProps {
  elementsOptions?: StripeElementsOptions;
  theme?: 'stripe' | 'night' | 'flat' | 'none';
  variant?: 'default' | 'outlined' | 'filled';
  appearance?: StripeAppearance;
}

export interface StripeCardProps {
  options?: {
    hidePostalCode?: boolean;
    disabled?: boolean;
    style?: Record<string, any>;
  };
  theme?: 'stripe' | 'night' | 'flat' | 'none';
  variant?: 'default' | 'outlined' | 'filled';
}

export interface StripePaymentButtonProps {
  clientSecret: string;
  text?: string;
  processingText?: string;
  disabled?: boolean;
  elements?: StripeElements;
  confirmParams?: StripeConfirmParams;
  variant?: 'default' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
}

export interface StripePluginState {
  initialized: boolean;
  loading: boolean;
  error: string | null;
}

export interface StripePluginConfig extends StripeConfig {}
