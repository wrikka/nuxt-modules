import type { Ref } from 'vue';
import type { ZodSchema } from 'zod';

export type FieldValue = string | number | boolean | null | undefined | object | unknown[];

export type FormValues = Record<string, FieldValue>;

export type FormErrors = Record<string, string[]>;

export type FormTouched = Record<string, boolean>;

export type FormDirty = Record<string, boolean>;

export interface FieldState {
  value: FieldValue;
  error?: string;
  touched: boolean;
  dirty: boolean;
}

export interface FormState<T extends FormValues = FormValues> {
  values: T;
  errors: FormErrors;
  touched: FormTouched;
  dirty: FormDirty;
  isSubmitting: boolean;
  isValidating: boolean;
  isValid: boolean;
  isDirty: boolean;
  isTouched: boolean;
}

export interface FormOptions<T extends FormValues = FormValues> {
  schema?: ZodSchema<T>;
  initialValues?: Partial<T>;
  validateOnMount?: boolean;
  validateOnChange?: boolean;
  validateOnBlur?: boolean;
  debounceMs?: number;
  onSubmit?: (values: T) => Promise<void> | void;
  onError?: (errors: FormErrors) => void;
}

export interface UseFormReturn<T extends FormValues = FormValues> {
  form: Ref<FormState<T>>;
  setValue: <K extends keyof T>(name: K, value: T[K]) => void;
  setValues: (values: Partial<T>) => void;
  setError: (name: keyof T, error: string) => void;
  setErrors: (errors: FormErrors) => void;
  clearError: (name: keyof T) => void;
  clearErrors: () => void;
  setTouched: (name: keyof T, touched: boolean) => void;
  setDirty: (name: keyof T, dirty: boolean) => void;
  reset: (values?: Partial<T>) => void;
  validate: () => Promise<boolean>;
  validateField: (name: keyof T) => Promise<boolean>;
  handleSubmit: (fn?: (values: T) => Promise<void> | void) => (e?: Event) => Promise<void>;
}

export interface UseFieldOptions {
  validateOnChange?: boolean;
  validateOnBlur?: boolean;
  debounceMs?: number;
}

export interface UseFieldReturn<T extends FieldValue = FieldValue> {
  value: Ref<T>;
  error: Ref<string | undefined>;
  touched: Ref<boolean>;
  dirty: Ref<boolean>;
  setValue: (value: T) => void;
  setError: (error: string) => void;
  clearError: () => void;
  setTouched: (touched: boolean) => void;
  validate: () => Promise<boolean>;
}

export interface FieldArrayItem<T = FieldValue> {
  id: string;
  value: T;
}

export interface UseFieldArrayReturn<T = FieldValue> {
  fields: Ref<FieldArrayItem<T>[]>;
  append: (value: T) => void;
  prepend: (value: T) => void;
  insert: (index: number, value: T) => void;
  remove: (index: number) => void;
  swap: (indexA: number, indexB: number) => void;
  move: (from: number, to: number) => void;
  replace: (index: number, value: T) => void;
  update: (index: number, value: Partial<T>) => void;
  clear: () => void;
  reset: (values?: T[]) => void;
}

export interface FormContext<T extends FormValues = FormValues> {
  form: Ref<FormState<T>>;
  options: Required<FormOptions<T>>;
  registerField: (name: string, options?: UseFieldOptions) => void;
  unregisterField: (name: string) => void;
}

export type FormValidationMode = 'onSubmit' | 'onChange' | 'onBlur' | 'onMount';

export interface ValidationResult {
  valid: boolean;
  errors: string[];
}

export type ValidatorFn<T = FieldValue> = (value: T) => string | undefined;

export type AsyncValidatorFn<T = FieldValue> = (value: T) => Promise<string | undefined>;

export interface ValidationRules {
  required?: boolean | string;
  min?: number | { value: number; message: string };
  max?: number | { value: number; message: string };
  minLength?: number | { value: number; message: string };
  maxLength?: number | { value: number; message: string };
  pattern?: RegExp | { value: RegExp; message: string };
  email?: boolean | string;
  url?: boolean | string;
  custom?: ValidatorFn | ValidatorFn[];
}

// ========== Form Persist Types ==========
export interface UseFormPersistOptions<T extends FormValues = FormValues> {
  storage?: 'localStorage' | 'sessionStorage';
  include?: string[];
  exclude?: string[];
  serialize?: (value: Partial<T>) => string;
  deserialize?: (value: string) => Partial<T>;
  onRestored?: (values: Partial<T>) => void;
  onSaved?: (values: Partial<T>) => void;
  debounceMs?: number;
}

export interface UseFormPersistReturn<T extends FormValues = FormValues> {
  persist: (values: T) => void;
  restore: () => Partial<T> | null;
  clear: () => void;
  watchAndPersist: (values: T) => void;
  isRestored: Ref<boolean>;
  lastSaved: Ref<Date | null>;
  storageKey: string;
}

// ========== Form Wizard Types ==========
export interface WizardStep<T extends FormValues = FormValues> {
  id: string;
  title: string;
  description?: string;
  fields?: (keyof T)[];
  validate?: () => boolean | Promise<boolean>;
  schema?: ZodSchema<T>;
}

export interface UseFormWizardOptions<T extends FormValues = FormValues> {
  steps: WizardStep<T>[];
  initialStep?: number;
  validateStep?: (stepIndex: number) => boolean | Promise<boolean>;
  onStepChange?: (fromStep: number, toStep: number) => void;
  onComplete?: () => void;
  linear?: boolean;
}

export interface UseFormWizardReturn<T extends FormValues = FormValues> {
  currentStep: Ref<WizardStep<T>>;
  currentStepIndex: Ref<number>;
  totalSteps: Ref<number>;
  isFirstStep: Ref<boolean>;
  isLastStep: Ref<boolean>;
  progress: Ref<number>;
  canGoNext: Ref<boolean>;
  canGoPrevious: Ref<boolean>;
  visitedSteps: Ref<Set<number>>;
  stepHistory: Ref<number[]>;
  goToStep: (index: number) => Promise<boolean>;
  nextStep: () => Promise<boolean>;
  previousStep: () => Promise<boolean>;
  goBack: () => Promise<boolean>;
  reset: (step?: number) => void;
  getStepStatus: (index: number) => 'pending' | 'current' | 'completed' | 'error';
}

// ========== Form Conditional Types ==========
export type ConditionOperator = 'eq' | 'neq' | 'gt' | 'gte' | 'lt' | 'lte' | 'in' | 'nin' | 'contains' | 'startsWith' | 'endsWith' | 'regex';

export interface FieldCondition {
  field: string;
  operator: ConditionOperator;
  value: FieldValue;
}

export interface UseFormConditionalOptions {
  debug?: boolean;
}

export interface UseFormConditionalReturn {
  registerConditionalField: (fieldName: string, condition: FieldCondition) => void;
  unregisterConditionalField: (fieldName: string) => void;
  shouldShowField: (fieldName: string) => boolean;
  getVisibleFields: () => string[];
  when: (field: string, operator: ConditionOperator, value: FieldValue) => {
    show: (targetField: string) => {
      and: (additionalField: string, additionalOperator: ConditionOperator, additionalValue: FieldValue) => ReturnType<UseFormConditionalReturn['when']>;
    };
  };
  createCondition: (field: string, operator: ConditionOperator, value: FieldValue) => FieldCondition;
}
