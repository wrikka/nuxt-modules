import { provide, ref } from 'vue';
import type { ZodSchema } from 'zod';
import type {
  FormContext,
  FormErrors,
  FormOptions,
  FormState,
  FormValues,
  UseFormReturn,
} from '../types';
import { WFORM_CONTEXT_KEY } from '../utils/constants';

export function useForm<T extends FormValues = FormValues>(
  options: FormOptions<T> = {},
): UseFormReturn<T> {
  const config = useRuntimeConfig();
  const wformConfig = config.public.wform;

  const {
    schema,
    initialValues = {} as Partial<T>,
    validateOnMount = wformConfig?.validateOnMount ?? false,
    validateOnChange = wformConfig?.validateOnChange ?? true,
    validateOnBlur = wformConfig?.validateOnBlur ?? true,
    debounceMs = wformConfig?.debounceMs ?? 300,
    onSubmit,
    onError,
  } = options;

  const form = ref<FormState<T>>({
    values: { ...initialValues } as T,
    errors: {},
    touched: {},
    dirty: {},
    isSubmitting: false,
    isValidating: false,
    isValid: true,
    isDirty: false,
    isTouched: false,
  }) as FormState<T>;

  const registeredFields = ref(new Set<string>());

  const setValue = <K extends keyof T>(name: K, value: T[K]) => {
    form.value.values[name] = value as T[K];
    form.value.dirty[name as string] = true;
    form.value.isDirty = true;

    if (validateOnChange) {
      void validateField(name);
    }
  };

  const setValues = (values: Partial<T>) => {
    Object.assign(form.value.values, values);
    Object.keys(values).forEach((key) => {
      form.value.dirty[key] = true;
    });
    form.value.isDirty = true;

    if (validateOnChange) {
      void validate();
    }
  };

  const setError = (name: keyof T, error: string) => {
    form.value.errors[name as string] = [error];
    form.value.isValid = Object.keys(form.value.errors).length === 0;
  };

  const setErrors = (errors: FormErrors) => {
    form.value.errors = errors;
    form.value.isValid = Object.keys(errors).length === 0;
  };

  const clearError = (name: keyof T) => {
    delete form.value.errors[name as string];
    form.value.isValid = Object.keys(form.value.errors).length === 0;
  };

  const clearErrors = () => {
    form.value.errors = {};
    form.value.isValid = true;
  };

  const setTouched = (name: keyof T, touched: boolean) => {
    form.value.touched[name as string] = touched;
    form.value.isTouched = Object.values(form.value.touched).some(Boolean);

    if (touched && validateOnBlur) {
      void validateField(name);
    }
  };

  const setDirty = (name: keyof T, dirty: boolean) => {
    form.value.dirty[name as string] = dirty;
    form.value.isDirty = Object.values(form.value.dirty).some(Boolean);
  };

  const reset = (values?: Partial<T>) => {
    form.value.values = { ...initialValues, ...values } as T;
    form.value.errors = {};
    form.value.touched = {};
    form.value.dirty = {};
    form.value.isSubmitting = false;
    form.value.isValidating = false;
    form.value.isValid = true;
    form.value.isDirty = false;
    form.value.isTouched = false;
  };

  const validateField = async (name: keyof T): Promise<boolean> => {
    if (!schema) return true;

    try {
      const fieldSchema = (schema as ZodSchema<T>).pick?.({ [name]: true }) ?? schema;
      const result = await fieldSchema.safeParseAsync({ [name]: form.value.values[name] });

      if (!result.success) {
        const errors = result.error.errors.filter((e) => e.path[0] === name);
        if (errors.length > 0) {
          setError(name, errors[0].message);
          return false;
        }
      }

      clearError(name);
      return true;
    } catch {
      return true;
    }
  };

  const validate = async (): Promise<boolean> => {
    if (!schema) return true;

    form.value.isValidating = true;

    try {
      const result = await schema.safeParseAsync(form.value.values);

      if (!result.success) {
        const errors: FormErrors = {};
        result.error.errors.forEach((error) => {
          const path = error.path[0] as string;
          if (!errors[path]) errors[path] = [];
          errors[path].push(error.message);
        });
        setErrors(errors);
        return false;
      }

      clearErrors();
      return true;
    } finally {
      form.value.isValidating = false;
    }
  };

  const handleSubmit = (fn?: (values: T) => Promise<void> | void) => {
    return async (e?: Event) => {
      e?.preventDefault();

      clearErrors();

      const isValid = await validate();

      if (!isValid) {
        onError?.(form.value.errors);
        return;
      }

      form.value.isSubmitting = true;

      try {
        const submitFn = fn ?? onSubmit;
        await submitFn?.(form.value.values);
      } finally {
        form.value.isSubmitting = false;
      }
    };
  };

  const context: FormContext<T> = {
    form: form as FormState<T>,
    options: {
      schema,
      initialValues,
      validateOnMount,
      validateOnChange,
      validateOnBlur,
      debounceMs,
      onSubmit,
      onError,
    } as Required<FormOptions<T>>,
    registerField: (name: string) => {
      registeredFields.value.add(name);
    },
    unregisterField: (name: string) => {
      registeredFields.value.delete(name);
    },
  };

  provide(WFORM_CONTEXT_KEY, context);

  if (validateOnMount) {
    void validate();
  }

  return {
    form: form as FormState<T>,
    setValue,
    setValues,
    setError,
    setErrors,
    clearError,
    clearErrors,
    setTouched,
    setDirty,
    reset,
    validate,
    validateField,
    handleSubmit,
  };
}
