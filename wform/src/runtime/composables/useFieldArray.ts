import { computed, inject } from 'vue';
import type { FieldArrayItem, FieldValue, FormContext, UseFieldArrayReturn } from '../types';
import { WFORM_CONTEXT_KEY } from '../utils/constants';
import { generateId } from '../utils/id';

export function useFieldArray<T = FieldValue>(name: string): UseFieldArrayReturn<T> {
  const context = inject<FormContext>(WFORM_CONTEXT_KEY);

  if (!context) {
    throw new Error('useFieldArray must be used within a form context. Make sure to use useForm first.');
  }

  const fields = computed<FieldArrayItem<T>[]>(() => {
    const values = (context.form.value.values[name] as T[]) ?? [];
    return values.map((value, index) => ({
      id: generateId(`${name}-${index}`),
      value,
    }));
  });

  const append = (value: T) => {
    const currentValues = (context.form.value.values[name] as T[]) ?? [];
    context.form.value.values[name] = [...currentValues, value] as unknown as typeof context.form.value.values[typeof name];
    context.form.value.dirty[name] = true;
    context.form.value.isDirty = true;
  };

  const prepend = (value: T) => {
    const currentValues = (context.form.value.values[name] as T[]) ?? [];
    context.form.value.values[name] = [value, ...currentValues] as unknown as typeof context.form.value.values[typeof name];
    context.form.value.dirty[name] = true;
    context.form.value.isDirty = true;
  };

  const insert = (index: number, value: T) => {
    const currentValues = (context.form.value.values[name] as T[]) ?? [];
    const newValues = [...currentValues];
    newValues.splice(index, 0, value);
    context.form.value.values[name] = newValues as unknown as typeof context.form.value.values[typeof name];
    context.form.value.dirty[name] = true;
    context.form.value.isDirty = true;
  };

  const remove = (index: number) => {
    const currentValues = (context.form.value.values[name] as T[]) ?? [];
    const newValues = [...currentValues];
    newValues.splice(index, 1);
    context.form.value.values[name] = newValues as unknown as typeof context.form.value.values[typeof name];
    context.form.value.dirty[name] = true;
    context.form.value.isDirty = true;
  };

  const swap = (indexA: number, indexB: number) => {
    const currentValues = (context.form.value.values[name] as T[]) ?? [];
    if (
      indexA < 0 ||
      indexA >= currentValues.length ||
      indexB < 0 ||
      indexB >= currentValues.length
    ) {
      return;
    }
    const newValues = [...currentValues];
    [newValues[indexA], newValues[indexB]] = [newValues[indexB], newValues[indexA]];
    context.form.value.values[name] = newValues as unknown as typeof context.form.value.values[typeof name];
    context.form.value.dirty[name] = true;
    context.form.value.isDirty = true;
  };

  const move = (from: number, to: number) => {
    const currentValues = (context.form.value.values[name] as T[]) ?? [];
    if (from < 0 || from >= currentValues.length || to < 0 || to > currentValues.length) {
      return;
    }
    const newValues = [...currentValues];
    const [item] = newValues.splice(from, 1);
    newValues.splice(to, 0, item);
    context.form.value.values[name] = newValues as unknown as typeof context.form.value.values[typeof name];
    context.form.value.dirty[name] = true;
    context.form.value.isDirty = true;
  };

  const replace = (index: number, value: T) => {
    const currentValues = (context.form.value.values[name] as T[]) ?? [];
    if (index < 0 || index >= currentValues.length) {
      return;
    }
    const newValues = [...currentValues];
    newValues[index] = value;
    context.form.value.values[name] = newValues as unknown as typeof context.form.value.values[typeof name];
    context.form.value.dirty[name] = true;
    context.form.value.isDirty = true;
  };

  const update = (index: number, value: Partial<T>) => {
    const currentValues = (context.form.value.values[name] as T[]) ?? [];
    if (index < 0 || index >= currentValues.length) {
      return;
    }
    const newValues = [...currentValues];
    newValues[index] = { ...newValues[index], ...value } as T;
    context.form.value.values[name] = newValues as unknown as typeof context.form.value.values[typeof name];
    context.form.value.dirty[name] = true;
    context.form.value.isDirty = true;
  };

  const clear = () => {
    context.form.value.values[name] = [] as unknown as typeof context.form.value.values[typeof name];
    context.form.value.dirty[name] = true;
    context.form.value.isDirty = true;
  };

  const reset = (values?: T[]) => {
    context.form.value.values[name] = (values ?? []) as unknown as typeof context.form.value.values[typeof name];
    context.form.value.dirty[name] = false;
    context.form.value.isDirty = Object.values(context.form.value.dirty).some(Boolean);
  };

  return {
    fields,
    append,
    prepend,
    insert,
    remove,
    swap,
    move,
    replace,
    update,
    clear,
    reset,
  };
}
