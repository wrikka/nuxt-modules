// Payment Flow Wizard Types
export interface WizardStep {
  id: string;
  title: string;
  description?: string;
  status: 'pending' | 'active' | 'completed' | 'error';
  optional?: boolean;
}

export interface WizardConfig {
  steps: WizardStep[];
  currentStep: number;
  allowSkip: boolean;
  showProgress: boolean;
  onComplete?: () => void;
  onCancel?: () => void;
}

export interface PaymentFlowConfig {
  flowType: PaymentFlowType;
  customerInfo?: CustomerInfoStep;
  paymentMethod?: PaymentMethodStep;
  billingInfo?: BillingInfoStep;
  review?: ReviewStep;
  confirmation?: ConfirmationStep;
}

export type PaymentFlowType =
  | 'one_time'
  | 'subscription'
  | 'setup_future'
  | 'invoice_payment'
  | 'marketplace';

export interface CustomerInfoStep {
  collectEmail: boolean;
  collectName: boolean;
  collectPhone: boolean;
  requireEmail: boolean;
  requireName: boolean;
  requirePhone: boolean;
  prefillData?: {
    email?: string;
    name?: string;
    phone?: string;
  };
}

export interface PaymentMethodStep {
  allowedMethods: PaymentMethodOption[];
  defaultMethod?: string;
  showSavedMethods: boolean;
  allowSaveMethod: boolean;
}

export interface PaymentMethodOption {
  type: string;
  label: string;
  icon?: string;
  enabled: boolean;
  countries?: string[];
  currencies?: string[];
}

export interface BillingInfoStep {
  collectAddress: boolean;
  collectPostalCode: boolean;
  requireAddress: boolean;
  requirePostalCode: boolean;
  allowedCountries?: string[];
  prefillData?: {
    line1?: string;
    line2?: string;
    city?: string;
    state?: string;
    postal_code?: string;
    country?: string;
  };
}

export interface ReviewStep {
  showOrderSummary: boolean;
  showBillingDetails: boolean;
  showTermsAndConditions: boolean;
  termsUrl?: string;
  privacyUrl?: string;
  allowEdit: boolean;
}

export interface ConfirmationStep {
  successMessage: string;
  showReceipt: boolean;
  redirectUrl?: string;
  redirectDelay?: number;
  showContinueButton: boolean;
  continueButtonLabel?: string;
}

export interface WizardState {
  currentStep: number;
  completedSteps: string[];
  data: Record<string, any>;
  errors: Record<string, string>;
  isValid: boolean;
}

export interface WizardAction {
  type: 'next' | 'prev' | 'skip' | 'reset' | 'complete';
  stepId?: string;
  data?: Record<string, any>;
}

export interface PaymentFlowPreset {
  id: string;
  name: string;
  description: string;
  config: PaymentFlowConfig;
  isDefault: boolean;
}
