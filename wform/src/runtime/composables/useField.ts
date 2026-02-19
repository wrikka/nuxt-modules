import { computed, inject, ref, watch } from 'vue';
import type { FieldValue, FormContext, UseFieldOptions, UseFieldReturn } from '../types';
import { WFORM_CONTEXT_KEY } from '../utils/constants';

export function useField<T extends FieldValue = FieldValue>(
  name: string,
  options: UseFieldOptions = {},
): UseFieldReturn<T> {
  const context = inject<FormContext>(WFORM_CONTEXT_KEY);

  if (!context) {
    throw new Error('useField must be used within a form context. Make sure to use useForm first.');
  }

  const {
    validateOnChange = context.options.validateOnChange,
    validateOnBlur = context.options.validateOnBlur,
    debounceMs = context.options.debounceMs,
  } = options;

  const value = computed<T>({
    get: () => context.form.values[name] as T,
    set: (newValue: T) => {
      context.form.values[name] = newValue;
      context.form.dirty[name] = true;
      context.form.isDirty = true;

      if (validateOnChange) {
        validate();
      }
    },
  });

  const error = computed(() => context.form.errors[name]?.[0]);
  const touched = computed(() => context.form.touched[name] ?? false);
  const dirty = computed(() => context.form.dirty[name] ?? false);

  let debounceTimer: ReturnType<typeof setTimeout> | null = null;

  const setValue = (newValue: T) => {
    value.value = newValue;
  };

  const setError = (errorMessage: string) => {
    context.form.errors[name] = [errorMessage];
    context.form.isValid = false;
  };

  const clearError = () => {
    delete context.form.errors[name];
    context.form.isValid = Object.keys(context.form.errors).length === 0;
  };

  const setTouched = (isTouched: boolean) => {
    context.form.touched[name] = isTouched;
    context.form.isTouched = Object.values(context.form.touched).some(Boolean);

    if (isTouched && validateOnBlur) {
      validate();
    }
  };

  const validate = async (): Promise<boolean> => {
    if (!context.options.schema) return true;

    if (debounceTimer) {
      clearTimeout(debounceTimer);
    }

    return new Promise((resolve) => {
      debounceTimer = setTimeout(async () => {
        try {
          const result = await context.options.schema.safeParseAsync({
            [name]: value.value,
          });

          if (!result.success) {
            const fieldErrors = result.error.errors.filter((e) => e.path[0] === name);
            if (fieldErrors.length > 0) {
              setError(fieldErrors[0].message);
              resolve(false);
              return;
            }
          }

          clearError();
          resolve(true);
        } catch {
          clearError();
          resolve(true);
        }
      }, debounceMs);
    });
  };

  context.registerField(name, options);

  return {
    value: value as ReturnType<typeof ref<T>>,
    error,
    touched,
    dirty,
    setValue,
    setError,
    clearError,
    setTouched,
    validate,
  };
}
