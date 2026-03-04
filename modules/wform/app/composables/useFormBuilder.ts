import { computed, reactive, ref } from 'vue';
import type { BuilderState, Form, FormField, FormHistoryItem } from '../types';
import { generateId } from '../utils/id';

const defaultForm = (): Form => ({
  id: generateId('form'),
  title: 'Untitled Form',
  description: '',
  status: 'draft',
  fields: [],
  settings: {
    allowMultipleSubmissions: true,
    requireLogin: false,
    showProgressBar: false,
    notifications: [],
    webhooks: [],
    integrations: [],
    spamProtection: {
      recaptcha: false,
      honeypot: true,
      rateLimit: 100,
    },
    autoSave: true,
    autoSaveInterval: 30,
    partialResponses: false,
  },
  theme: {
    primaryColor: '#3B82F6',
    backgroundColor: '#FFFFFF',
    textColor: '#1F2937',
    fontFamily: 'Inter',
  },
  createdAt: new Date(),
  updatedAt: new Date(),
  userId: '',
  version: 1,
});

export function useFormBuilder(initialForm?: Partial<Form>) {
  const state = reactive<BuilderState>({
    form: { ...defaultForm(), ...initialForm },
    selectedFieldId: null,
    draggedFieldId: null,
    isDragging: false,
    previewMode: 'desktop',
    activeTab: 'build',
    history: [],
    historyIndex: -1,
    isSaving: false,
    lastSaved: null,
  });

  // ========== Field Management ==========
  const addField = (type: FormField['type'], index?: number) => {
    const newField: FormField = {
      id: generateId('field'),
      type,
      label: getDefaultLabel(type),
      required: false,
      order: index ?? state.form.fields.length,
      options: getDefaultOptions(type),
      settings: getDefaultSettings(type),
    };

    if (index !== undefined) {
      state.form.fields.splice(index, 0, newField);
      // Reorder fields
      state.form.fields.forEach((f, i) => { f.order = i; });
    } else {
      state.form.fields.push(newField);
    }

    state.selectedFieldId = newField.id;
    saveToHistory('Add field');
    return newField;
  };

  const removeField = (fieldId: string) => {
    const index = state.form.fields.findIndex(f => f.id === fieldId);
    if (index > -1) {
      state.form.fields.splice(index, 1);
      if (state.selectedFieldId === fieldId) {
        state.selectedFieldId = null;
      }
      saveToHistory('Remove field');
    }
  };

  const updateField = (fieldId: string, updates: Partial<FormField>) => {
    const field = state.form.fields.find(f => f.id === fieldId);
    if (field) {
      Object.assign(field, updates);
    }
  };

  const moveField = (fromIndex: number, toIndex: number) => {
    const [moved] = state.form.fields.splice(fromIndex, 1);
    state.form.fields.splice(toIndex, 0, moved);
    state.form.fields.forEach((f, i) => { f.order = i; });
    saveToHistory('Move field');
  };

  const duplicateField = (fieldId: string) => {
    const field = state.form.fields.find(f => f.id === fieldId);
    if (field) {
      const index = state.form.fields.findIndex(f => f.id === fieldId);
      const newField: FormField = {
        ...field,
        id: generateId('field'),
        label: `${field.label} (Copy)`,
        order: field.order + 1,
      };
      state.form.fields.splice(index + 1, 0, newField);
      state.form.fields.forEach((f, i) => { f.order = i; });
      saveToHistory('Duplicate field');
    }
  };

  // ========== Selection ==========
  const selectedField = computed(() =>
    state.form.fields.find(f => f.id === state.selectedFieldId) ?? null,
  );

  const selectField = (fieldId: string | null) => {
    state.selectedFieldId = fieldId;
  };

  // ========== Drag & Drop ==========
  const startDrag = (fieldId: string) => {
    state.draggedFieldId = fieldId;
    state.isDragging = true;
  };

  const endDrag = () => {
    state.draggedFieldId = null;
    state.isDragging = false;
  };

  // ========== History (Undo/Redo) ==========
  const saveToHistory = (action: string) => {
    // Remove any future history if we're not at the end
    if (state.historyIndex < state.history.length - 1) {
      state.history = state.history.slice(0, state.historyIndex + 1);
    }

    const historyItem: FormHistoryItem = {
      id: generateId('history'),
      timestamp: new Date(),
      action,
      form: JSON.parse(JSON.stringify(state.form)),
    };

    state.history.push(historyItem);
    state.historyIndex++;

    // Limit history to 50 items
    if (state.history.length > 50) {
      state.history.shift();
      state.historyIndex--;
    }
  };

  const canUndo = computed(() => state.historyIndex > 0);
  const canRedo = computed(() => state.historyIndex < state.history.length - 1);

  const undo = () => {
    if (canUndo.value) {
      state.historyIndex--;
      const historyItem = state.history[state.historyIndex];
      state.form = JSON.parse(JSON.stringify(historyItem.form));
    }
  };

  const redo = () => {
    if (canRedo.value) {
      state.historyIndex++;
      const historyItem = state.history[state.historyIndex];
      state.form = JSON.parse(JSON.stringify(historyItem.form));
    }
  };

  // ========== Form Actions ==========
  const updateForm = (updates: Partial<Form>) => {
    Object.assign(state.form, updates);
    state.form.updatedAt = new Date();
  };

  const updateTheme = (updates: Partial<Form['theme']>) => {
    Object.assign(state.form.theme, updates);
  };

  const updateSettings = (updates: Partial<Form['settings']>) => {
    Object.assign(state.form.settings, updates);
  };

  // ========== Preview ==========
  const setPreviewMode = (mode: BuilderState['previewMode']) => {
    state.previewMode = mode;
  };

  // ========== Tab ==========
  const setActiveTab = (tab: BuilderState['activeTab']) => {
    state.activeTab = tab;
  };

  // ========== Save ==========
  const saveForm = async () => {
    state.isSaving = true;
    // API call would go here
    await new Promise(resolve => setTimeout(resolve, 500));
    state.lastSaved = new Date();
    state.isSaving = false;
    saveToHistory('Save form');
  };

  // Initialize with first history item
  saveToHistory('Initial state');

  return {
    state,
    selectedField,
    canUndo,
    canRedo,
    addField,
    removeField,
    updateField,
    moveField,
    duplicateField,
    selectField,
    startDrag,
    endDrag,
    undo,
    redo,
    updateForm,
    updateTheme,
    updateSettings,
    setPreviewMode,
    setActiveTab,
    saveForm,
  };
}

// Helper functions
function getDefaultLabel(type: FormField['type']): string {
  const labels: Record<FormField['type'], string> = {
    short_text: 'Short Text',
    long_text: 'Long Text',
    multiple_choice: 'Multiple Choice',
    checkbox: 'Checkboxes',
    dropdown: 'Dropdown',
    date: 'Date',
    time: 'Time',
    date_time: 'Date & Time',
    number: 'Number',
    email: 'Email',
    url: 'Website',
    phone: 'Phone',
    file_upload: 'File Upload',
    rating: 'Rating',
    scale: 'Scale',
    matrix: 'Matrix',
    ranking: 'Ranking',
    signature: 'Signature',
    payment: 'Payment',
    section: 'Section Title',
    page_break: 'Page Break',
    hidden: 'Hidden Field',
    calculated: 'Calculated Field',
  };
  return labels[type] ?? 'Question';
}

function getDefaultOptions(type: FormField['type']): FormField['options'] | undefined {
  if (['multiple_choice', 'checkbox', 'dropdown', 'ranking'].includes(type)) {
    return [
      { id: generateId('opt'), label: 'Option 1', value: 'option_1' },
      { id: generateId('opt'), label: 'Option 2', value: 'option_2' },
    ];
  }
  return undefined;
}

function getDefaultSettings(type: FormField['type']): FormField['settings'] | undefined {
  switch (type) {
    case 'rating':
      return { minRating: 1, maxRating: 5, ratingIcon: 'star' };
    case 'scale':
      return { scaleMin: 1, scaleMax: 10, scaleLabels: { min: 'Not likely', max: 'Very likely' } };
    case 'matrix':
      return { matrixRows: ['Row 1', 'Row 2'], matrixColumns: ['Column 1', 'Column 2'] };
    case 'file_upload':
      return { maxFiles: 1, maxFileSize: 10 };
    default:
      return undefined;
  }
}
