<script setup lang="ts">
import { useFormBuilder } from '../../composables/useFormBuilder';
import type { FieldType } from '../../types';

const { state, addField } = useFormBuilder();

const fieldTypes: { type: FieldType; icon: string; label: string; category: string }[] = [
  // Text Fields
  { type: 'short_text', icon: 'i-lucide-type', label: 'Short Text', category: 'Text' },
  { type: 'long_text', icon: 'i-lucide-align-left', label: 'Long Text', category: 'Text' },
  { type: 'email', icon: 'i-lucide-mail', label: 'Email', category: 'Text' },
  { type: 'url', icon: 'i-lucide-link', label: 'Website', category: 'Text' },
  { type: 'phone', icon: 'i-lucide-phone', label: 'Phone', category: 'Text' },

  // Choice Fields
  { type: 'multiple_choice', icon: 'i-lucide-circle-dot', label: 'Multiple Choice', category: 'Choice' },
  { type: 'checkbox', icon: 'i-lucide-check-square', label: 'Checkboxes', category: 'Choice' },
  { type: 'dropdown', icon: 'i-lucide-chevron-down', label: 'Dropdown', category: 'Choice' },
  { type: 'ranking', icon: 'i-lucide-arrow-up-down', label: 'Ranking', category: 'Choice' },

  // Number & Date
  { type: 'number', icon: 'i-lucide-hash', label: 'Number', category: 'Number & Date' },
  { type: 'date', icon: 'i-lucide-calendar', label: 'Date', category: 'Number & Date' },
  { type: 'time', icon: 'i-lucide-clock', label: 'Time', category: 'Number & Date' },
  { type: 'date_time', icon: 'i-lucide-calendar-clock', label: 'Date & Time', category: 'Number & Date' },

  // Special Fields
  { type: 'file_upload', icon: 'i-lucide-upload', label: 'File Upload', category: 'Special' },
  { type: 'rating', icon: 'i-lucide-star', label: 'Rating', category: 'Special' },
  { type: 'scale', icon: 'i-lucide-slider', label: 'Scale', category: 'Special' },
  { type: 'matrix', icon: 'i-lucide-table', label: 'Matrix', category: 'Special' },
  { type: 'signature', icon: 'i-lucide-signature', label: 'Signature', category: 'Special' },

  // Structure
  { type: 'section', icon: 'i-lucide-heading', label: 'Section', category: 'Structure' },
  { type: 'page_break', icon: 'i-lucide-page-break', label: 'Page Break', category: 'Structure' },

  // Advanced
  { type: 'payment', icon: 'i-lucide-credit-card', label: 'Payment', category: 'Advanced' },
  { type: 'hidden', icon: 'i-lucide-eye-off', label: 'Hidden Field', category: 'Advanced' },
  { type: 'calculated', icon: 'i-lucide-calculator', label: 'Calculated', category: 'Advanced' },
];

const groupedFields = computed(() => {
  const groups: Record<string, typeof fieldTypes> = {};
  fieldTypes.forEach(field => {
    if (!groups[field.category]) {
      groups[field.category] = [];
    }
    groups[field.category].push(field);
  });
  return groups;
});

const handleDragStart = (type: FieldType) => {
  // Drag start logic
};
</script>

<template>
  <div class="w-builder-sidebar w-72 bg-gray-50 border-r border-gray-200 flex flex-col h-full">
    <!-- Header -->
    <div class="p-4 border-b border-gray-200">
      <h2 class="font-semibold text-gray-900">
        Form Elements
      </h2>
      <p class="text-sm text-gray-500 mt-1">
        Drag or click to add
      </p>
    </div>

    <!-- Field Types -->
    <div class="flex-1 overflow-y-auto p-4 space-y-6">
      <div
        v-for="(fields, category) in groupedFields"
        :key="category"
        class="space-y-2"
      >
        <h3 class="text-xs font-medium text-gray-500 uppercase tracking-wider">
          {{ category }}
        </h3>
        <div class="grid grid-cols-2 gap-2">
          <button
            v-for="field in fields"
            :key="field.type"
            class="flex items-center gap-2 p-2.5 bg-white rounded-lg border border-gray-200 hover:border-blue-500 hover:shadow-sm transition-all text-left group"
            @click="addField(field.type)"
          >
            <div class="w-8 h-8 rounded-lg bg-gray-100 group-hover:bg-blue-50 flex items-center justify-center transition-colors">
              <span :class="[field.icon, 'w-4 h-4 text-gray-600 group-hover:text-blue-600']" />
            </div>
            <span class="text-sm font-medium text-gray-700 group-hover:text-gray-900">
              {{ field.label }}
            </span>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
