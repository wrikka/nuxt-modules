import { computed, inject, ref } from 'vue';
import type { FieldValue, FormContext, FormValues, UseFormConditionalOptions, UseFormConditionalReturn } from '../types';
import { WFORM_CONTEXT_KEY } from '../utils/constants';

type ConditionOperator = 'eq' | 'neq' | 'gt' | 'gte' | 'lt' | 'lte' | 'in' | 'nin' | 'contains' | 'startsWith' | 'endsWith' | 'regex';

interface FieldCondition {
  field: string;
  operator: ConditionOperator;
  value: FieldValue;
}

function evaluateCondition(condition: FieldCondition, formValues: FormValues): boolean {
  const fieldValue = formValues[condition.field];
  const compareValue = condition.value;

  switch (condition.operator) {
    case 'eq':
      return fieldValue === compareValue;
    case 'neq':
      return fieldValue !== compareValue;
    case 'gt':
      return typeof fieldValue === 'number' && typeof compareValue === 'number' && fieldValue > compareValue;
    case 'gte':
      return typeof fieldValue === 'number' && typeof compareValue === 'number' && fieldValue >= compareValue;
    case 'lt':
      return typeof fieldValue === 'number' && typeof compareValue === 'number' && fieldValue < compareValue;
    case 'lte':
      return typeof fieldValue === 'number' && typeof compareValue === 'number' && fieldValue <= compareValue;
    case 'in':
      return Array.isArray(compareValue) && compareValue.includes(fieldValue);
    case 'nin':
      return Array.isArray(compareValue) && !compareValue.includes(fieldValue);
    case 'contains':
      return typeof fieldValue === 'string' && typeof compareValue === 'string' && fieldValue.includes(compareValue);
    case 'startsWith':
      return typeof fieldValue === 'string' && typeof compareValue === 'string' && fieldValue.startsWith(compareValue);
    case 'endsWith':
      return typeof fieldValue === 'string' && typeof compareValue === 'string' && fieldValue.endsWith(compareValue);
    case 'regex':
      return typeof fieldValue === 'string' && compareValue instanceof RegExp && compareValue.test(fieldValue);
    default:
      return false;
  }
}

export function useFormConditional(
  _options: UseFormConditionalOptions = {},
): UseFormConditionalReturn {
  const context = inject<FormContext>(WFORM_CONTEXT_KEY);
  const registeredFields = ref(new Map<string, FieldCondition>());

  const formValues = computed<FormValues>(() => {
    if (!context) return {};
    return context.form.value.values;
  });

  const registerConditionalField = (fieldName: string, condition: FieldCondition): void => {
    registeredFields.value.set(fieldName, condition);
  };

  const unregisterConditionalField = (fieldName: string): void => {
    registeredFields.value.delete(fieldName);
  };

  const shouldShowField = (fieldName: string): boolean => {
    const condition = registeredFields.value.get(fieldName);
    if (!condition) return true;
    return evaluateCondition(condition, formValues.value);
  };

  const getVisibleFields = (): string[] => {
    return Array.from(registeredFields.value.entries())
      .filter(([name]) => shouldShowField(name))
      .map(([name]) => name);
  };

  const createCondition = (
    field: string,
    operator: ConditionOperator,
    value: FieldValue,
  ): FieldCondition => ({
    field,
    operator,
    value,
  });

  const when = (field: string, operator: ConditionOperator, value: FieldValue) => {
    const condition = createCondition(field, operator, value);
    return {
      show: (targetField: string) => {
        registerConditionalField(targetField, condition);
        return {
          and: (additionalField: string, additionalOperator: ConditionOperator, additionalValue: FieldValue) => {
            // Chain conditions logic could be implemented here
            return when(additionalField, additionalOperator, additionalValue);
          },
        };
      },
    };
  };

  return {
    registerConditionalField,
    unregisterConditionalField,
    shouldShowField,
    getVisibleFields,
    when,
    createCondition,
  };
}
