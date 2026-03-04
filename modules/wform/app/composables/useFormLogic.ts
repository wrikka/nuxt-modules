import { computed, ref } from 'vue';
import type { FieldCondition, FormField, FormValues } from '../types';

export function useFormLogic() {
  const conditions = ref<FieldCondition[]>([]);

  // ========== Conditional Logic ==========
  const addCondition = (condition: Omit<FieldCondition, 'id'>) => {
    const newCondition: FieldCondition = {
      ...condition,
      id: generateId('cond'),
    };
    conditions.value.push(newCondition);
  };

  const removeCondition = (conditionId: string) => {
    const index = conditions.value.findIndex(c => c.id === conditionId);
    if (index > -1) {
      conditions.value.splice(index, 1);
    }
  };

  const updateCondition = (conditionId: string, updates: Partial<FieldCondition>) => {
    const condition = conditions.value.find(c => c.id === conditionId);
    if (condition) {
      Object.assign(condition, updates);
    }
  };

  const evaluateCondition = (condition: FieldCondition, values: FormValues): boolean => {
    const fieldValue = values[condition.fieldId];
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
      case 'contains':
        return typeof fieldValue === 'string' && typeof compareValue === 'string' && fieldValue.includes(compareValue);
      case 'in':
        return Array.isArray(compareValue) && compareValue.includes(fieldValue as string);
      case 'empty':
        return fieldValue === undefined || fieldValue === null || fieldValue === '' ||
          (Array.isArray(fieldValue) && fieldValue.length === 0);
      case 'not_empty':
        return fieldValue !== undefined && fieldValue !== null && fieldValue !== '' &&
          (!Array.isArray(fieldValue) || fieldValue.length > 0);
      default:
        return false;
    }
  };

  const shouldShowField = (field: FormField, values: FormValues): boolean => {
    if (!field.conditions || field.conditions.length === 0) return true;

    // Check all conditions for this field
    const fieldConditions = field.conditions.filter(c => c.targetFieldId === field.id);
    if (fieldConditions.length === 0) return true;

    // For 'show' action, all conditions must be met
    const showConditions = fieldConditions.filter(c => c.action === 'show');
    const hideConditions = fieldConditions.filter(c => c.action === 'hide');

    // If any hide condition is met, don't show
    if (hideConditions.some(c => evaluateCondition(c, values))) {
      return false;
    }

    // If there are show conditions, at least one must be met
    if (showConditions.length > 0) {
      return showConditions.some(c => evaluateCondition(c, values));
    }

    return true;
  };

  const getVisibleFields = (fields: FormField[], values: FormValues): FormField[] => {
    return fields.filter(f => shouldShowField(f, values));
  };

  // ========== Calculator / Scoring ==========
  const calculateValue = (expression: string, values: FormValues): number => {
    // Simple expression evaluator
    // Replace field references with values
    let evalExpression = expression;

    // Replace {fieldId} with actual values
    Object.entries(values).forEach(([key, value]) => {
      const placeholder = `{${key}}`;
      const numValue = typeof value === 'number' ? value :
        typeof value === 'string' ? parseFloat(value) || 0 : 0;
      evalExpression = evalExpression.replace(new RegExp(placeholder.replace(/[{}]/g, '\\$&'), 'g'), String(numValue));
    });

    // Handle basic operators
    try {
      // eslint-disable-next-line no-eval
      return eval(evalExpression);
    } catch {
      return 0;
    }
  };

  const calculateScore = (fields: FormField[], values: FormValues, correctAnswers: Record<string, unknown>): number => {
    let score = 0;
    let maxScore = 0;

    fields.forEach(field => {
      if (field.type === 'multiple_choice' || field.type === 'checkbox') {
        const userAnswer = values[field.id];
        const correct = correctAnswers[field.id];

        if (correct !== undefined) {
          maxScore++;
          if (Array.isArray(correct) && Array.isArray(userAnswer)) {
            // Multiple correct answers
            const correctCount = (correct as string[]).filter(c => (userAnswer as string[]).includes(c)).length;
            score += correctCount / (correct as string[]).length;
          } else if (userAnswer === correct) {
            score++;
          }
        }
      }
    });

    return maxScore > 0 ? (score / maxScore) * 100 : 0;
  };

  // ========== Multi-step Logic ==========
  const getFieldsByPage = (fields: FormField[], pageBreaks: number[]): FormField[][] => {
    const pages: FormField[][] = [];
    let currentPage: FormField[] = [];

    fields.forEach(field => {
      if (field.type === 'page_break') {
        if (currentPage.length > 0) {
          pages.push(currentPage);
          currentPage = [];
        }
      } else {
        currentPage.push(field);
      }
    });

    if (currentPage.length > 0) {
      pages.push(currentPage);
    }

    return pages;
  };

  const validatePage = (fields: FormField[], values: FormValues): boolean => {
    return fields.every(field => {
      if (!field.required) return true;
      const value = values[field.id];
      return value !== undefined && value !== null && value !== '' &&
        (!Array.isArray(value) || value.length > 0);
    });
  };

  return {
    conditions,
    addCondition,
    removeCondition,
    updateCondition,
    evaluateCondition,
    shouldShowField,
    getVisibleFields,
    calculateValue,
    calculateScore,
    getFieldsByPage,
    validatePage,
  };
}

function generateId(prefix: string): string {
  return `${prefix}_${Math.random().toString(36).substring(2, 9)}`;
}
