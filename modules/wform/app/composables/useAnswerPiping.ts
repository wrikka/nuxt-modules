import { computed, ref } from 'vue';
import type { FormField, FormValues } from '../types';

export function useAnswerPiping() {
  const pipePattern = /\{\{([^}]+)\}\}/g;
  const fieldRefPattern = /\{field:([^}]+)\}/g;

  // Extract field references from text
  const extractFieldReferences = (text: string): string[] => {
    const matches: string[] = [];
    let match;

    // Match {{fieldId}} pattern
    while ((match = pipePattern.exec(text)) !== null) {
      matches.push(match[1].trim());
    }

    // Match {field:fieldId} pattern
    while ((match = fieldRefPattern.exec(text)) !== null) {
      matches.push(match[1].trim());
    }

    return [...new Set(matches)]; // Remove duplicates
  };

  // Check if text contains piping references
  const hasPipingReferences = (text: string): boolean => {
    return pipePattern.test(text) || fieldRefPattern.test(text);
  };

  // Replace piping references with actual values
  const pipeText = (text: string, values: FormValues, fields: FormField[]): string => {
    let result = text;

    // Get field labels for better display when value is empty
    const fieldLabels = new Map(fields.map(f => [f.id, f.label]));

    // Replace {{fieldId}} with value
    result = result.replace(pipePattern, (match, fieldId) => {
      const trimmedId = fieldId.trim();
      const value = values[trimmedId];

      if (value === undefined || value === null || value === '') {
        return `[${fieldLabels.get(trimmedId) ?? trimmedId}]`;
      }

      // Format based on value type
      if (Array.isArray(value)) {
        return value.join(', ');
      }

      if (typeof value === 'object') {
        return JSON.stringify(value);
      }

      return String(value);
    });

    // Replace {field:fieldId} with value
    result = result.replace(fieldRefPattern, (match, fieldId) => {
      const trimmedId = fieldId.trim();
      const value = values[trimmedId];

      if (value === undefined || value === null || value === '') {
        return `[${fieldLabels.get(trimmedId) ?? trimmedId}]`;
      }

      if (Array.isArray(value)) {
        return value.join(', ');
      }

      return String(value);
    });

    return result;
  };

  // Create a preview of how the text will look
  const createPipingPreview = (text: string, values: FormValues, fields: FormField[]): string => {
    return pipeText(text, values, fields);
  };

  // Get available fields for piping suggestions
  const getPipingSuggestions = (fields: FormField[], currentFieldId?: string): Array<{ id: string; label: string; type: string }> => {
    return fields
      .filter(f => f.id !== currentFieldId)
      .filter(f => f.order < (fields.find(field => field.id === currentFieldId)?.order ?? Infinity))
      .map(f => ({
        id: f.id,
        label: f.label,
        type: f.type,
      }));
  };

  // Validate piping references (check if referenced fields exist)
  const validatePiping = (text: string, fields: FormField[]): { valid: boolean; errors: string[] } => {
    const references = extractFieldReferences(text);
    const fieldIds = new Set(fields.map(f => f.id));
    const errors: string[] = [];

    references.forEach(ref => {
      if (!fieldIds.has(ref)) {
        errors.push(`Field "${ref}" does not exist`);
      }
    });

    return {
      valid: errors.length === 0,
      errors,
    };
  };

  // Insert piping reference at cursor position
  const insertPipingReference = (text: string, cursorPosition: number, fieldId: string): { newText: string; newCursorPosition: number } => {
    const before = text.slice(0, cursorPosition);
    const after = text.slice(cursorPosition);
    const insertion = `{{${fieldId}}}`;
    const newText = `${before}${insertion}${after}`;

    return {
      newText,
      newCursorPosition: cursorPosition + insertion.length,
    };
  };

  // Real-time piping preview for a field
  const useFieldPiping = (field: FormField, allValues: FormValues, allFields: FormField[]) => {
    const pipedLabel = computed(() => pipeText(field.label, allValues, allFields));
    const pipedDescription = computed(() =>
      field.description ? pipeText(field.description, allValues, allFields) : '',
    );
    const pipedPlaceholder = computed(() =>
      field.placeholder ? pipeText(field.placeholder, allValues, allFields) : '',
    );

    // Get referenced field IDs
    const referencedFields = computed(() => {
      const refs = new Set<string>();
      [field.label, field.description, field.placeholder].forEach(text => {
        if (text) {
          extractFieldReferences(text).forEach(ref => refs.add(ref));
        }
      });
      return Array.from(refs);
    });

    // Check if all referenced fields have been answered
    const canShow = computed(() => {
      return referencedFields.value.every(refId => {
        const value = allValues[refId];
        return value !== undefined && value !== null && value !== '';
      });
    });

    return {
      pipedLabel,
      pipedDescription,
      pipedPlaceholder,
      referencedFields,
      canShow,
    };
  };

  return {
    extractFieldReferences,
    hasPipingReferences,
    pipeText,
    createPipingPreview,
    getPipingSuggestions,
    validatePiping,
    insertPipingReference,
    useFieldPiping,
  };
}
