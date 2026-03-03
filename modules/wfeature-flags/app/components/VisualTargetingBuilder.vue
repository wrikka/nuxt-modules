<script setup lang="ts">
import { ref, computed } from '#imports';
import type { TargetingRule, TargetingOperator } from '#feature-flags/types';

const props = defineProps<{
  modelValue: TargetingRule[];
}>();

const emit = defineEmits<{
  'update:modelValue': [rules: TargetingRule[]];
}>();

const operators: { key: TargetingOperator; label: string }[] = [
  { key: 'eq', label: 'equals' },
  { key: 'neq', label: 'not equals' },
  { key: 'gt', label: 'greater than' },
  { key: 'gte', label: 'greater or equal' },
  { key: 'lt', label: 'less than' },
  { key: 'lte', label: 'less or equal' },
  { key: 'contains', label: 'contains' },
  { key: 'not_contains', label: 'not contains' },
  { key: 'starts_with', label: 'starts with' },
  { key: 'ends_with', label: 'ends with' },
  { key: 'in', label: 'is one of' },
  { key: 'not_in', label: 'is not one of' },
];

const commonAttributes = [
  { key: 'userId', label: 'User ID' },
  { key: 'email', label: 'Email' },
  { key: 'plan', label: 'Plan' },
  { key: 'role', label: 'Role' },
  { key: 'country', label: 'Country' },
  { key: 'device', label: 'Device' },
  { key: 'browser', label: 'Browser' },
  { key: 'betaTester', label: 'Beta Tester' },
];

const rules = computed({
  get: () => props.modelValue,
  set: (val) => emit('update:modelValue', val),
});

const draggedIndex = ref<number | null>(null);
const dragOverIndex = ref<number | null>(null);

const addRule = () => {
  const newRule: TargetingRule = {
    attribute: 'userId',
    operator: 'eq',
    value: '',
  };
  rules.value = [...rules.value, newRule];
};

const removeRule = (index: number) => {
  const newRules = [...rules.value];
  newRules.splice(index, 1);
  rules.value = newRules;
};

const duplicateRule = (index: number) => {
  const newRules = [...rules.value];
  const rule = { ...newRules[index] };
  newRules.splice(index + 1, 0, rule);
  rules.value = newRules;
};

const onDragStart = (index: number) => {
  draggedIndex.value = index;
};

const onDragOver = (index: number, e: DragEvent) => {
  e.preventDefault();
  dragOverIndex.value = index;
};

const onDrop = (index: number) => {
  if (draggedIndex.value !== null && draggedIndex.value !== index) {
    const newRules = [...rules.value];
    const draggedRule = newRules[draggedIndex.value];
    newRules.splice(draggedIndex.value, 1);
    newRules.splice(index, 0, draggedRule);
    rules.value = newRules;
  }
  draggedIndex.value = null;
  dragOverIndex.value = null;
};

const updateRule = (index: number, field: keyof TargetingRule, value: unknown) => {
  const newRules = [...rules.value];
  newRules[index] = { ...newRules[index], [field]: value };
  rules.value = newRules;
};

const getOperatorLabel = (op: TargetingOperator) => {
  return operators.find((o) => o.key === op)?.label || op;
};
</script>

<template>
  <div class="vtb-container">
    <div class="vtb-header">
      <h4>Targeting Rules</h4>
      <button class="vtb-btn vtb-btn-primary" @click="addRule">+ Add Rule</button>
    </div>

    <div v-if="rules.length === 0" class="vtb-empty">
      <p>No targeting rules configured</p>
      <p class="vtb-hint">Add rules to target specific users</p>
    </div>

    <div v-else class="vtb-rules">
      <div
        v-for="(rule, index) in rules"
        :key="index"
        class="vtb-rule"
        :class="{ 'vtb-drag-over': dragOverIndex === index }"
        draggable="true"
        @dragstart="onDragStart(index)"
        @dragover="onDragOver(index, $event)"
        @drop="onDrop(index)"
      >
        <div class="vtb-rule-drag">⋮⋮</div>

        <div class="vtb-rule-content">
          <div class="vtb-rule-if">IF</div>

          <select
            class="vtb-select vtb-attribute"
            :value="rule.attribute"
            @change="updateRule(index, 'attribute', ($event.target as HTMLSelectElement).value)"
          >
            <optgroup label="Common">
              <option v-for="attr in commonAttributes" :key="attr.key" :value="attr.key">
                {{ attr.label }}
              </option>
            </optgroup>
            <optgroup label="Custom">
              <option value="custom">Custom attribute...</option>
            </optgroup>
          </select>

          <select
            class="vtb-select vtb-operator"
            :value="rule.operator"
            @change="updateRule(index, 'operator', ($event.target as HTMLSelectElement).value)"
          >
            <option v-for="op in operators" :key="op.key" :value="op.key">
              {{ op.label }}
            </option>
          </select>

          <input
            v-if="['in', 'not_in'].includes(rule.operator)"
            type="text"
            class="vtb-input"
            placeholder="value1, value2, value3"
            :value="Array.isArray(rule.value) ? rule.value.join(', ') : rule.value"
            @input="updateRule(index, 'value', ($event.target as HTMLInputElement).value.split(',').map((v) => v.trim()))"
          />
          <input
            v-else
            type="text"
            class="vtb-input"
            :value="rule.value"
            @input="updateRule(index, 'value', ($event.target as HTMLInputElement).value)"
          />
        </div>

        <div class="vtb-rule-actions">
          <button class="vtb-btn-icon" title="Duplicate" @click="duplicateRule(index)">⧉</button>
          <button class="vtb-btn-icon vtb-danger" title="Remove" @click="removeRule(index)">×</button>
        </div>
      </div>
    </div>

    <div v-if="rules.length > 1" class="vtb-logic">
      <span class="vtb-logic-label">Match:</span>
      <button class="vtb-btn vtb-btn-sm vtb-active">ALL rules</button>
      <button class="vtb-btn vtb-btn-sm">ANY rule</button>
    </div>
  </div>
</template>

<style scoped>
.vtb-container {
  font-family: system-ui, -apple-system, sans-serif;
  padding: 1rem;
  background: #f9fafb;
  border-radius: 0.5rem;
}

.vtb-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.vtb-header h4 {
  margin: 0;
  font-size: 0.875rem;
  color: #374151;
}

.vtb-btn {
  padding: 0.5rem 1rem;
  border: 1px solid #d1d5db;
  border-radius: 0.375rem;
  background: white;
  cursor: pointer;
  font-size: 0.875rem;
}

.vtb-btn-primary {
  background: #3b82f6;
  color: white;
  border-color: #3b82f6;
}

.vtb-btn-sm {
  padding: 0.25rem 0.5rem;
  font-size: 0.75rem;
}

.vtb-active {
  background: #3b82f6;
  color: white;
  border-color: #3b82f6;
}

.vtb-empty {
  text-align: center;
  padding: 2rem;
  color: #9ca3af;
}

.vtb-hint {
  font-size: 0.75rem;
  margin-top: 0.25rem;
}

.vtb-rules {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.vtb-rule {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 0.375rem;
  padding: 0.5rem;
  cursor: grab;
}

.vtb-rule:active {
  cursor: grabbing;
}

.vtb-drag-over {
  border-color: #3b82f6;
  border-style: dashed;
}

.vtb-rule-drag {
  color: #9ca3af;
  cursor: grab;
  padding: 0.25rem;
}

.vtb-rule-content {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  flex: 1;
  flex-wrap: wrap;
}

.vtb-rule-if {
  font-size: 0.75rem;
  font-weight: 600;
  color: #6b7280;
  background: #e5e7eb;
  padding: 0.125rem 0.375rem;
  border-radius: 0.25rem;
}

.vtb-select,
.vtb-input {
  padding: 0.375rem 0.5rem;
  border: 1px solid #d1d5db;
  border-radius: 0.25rem;
  font-size: 0.75rem;
}

.vtb-attribute {
  min-width: 120px;
}

.vtb-operator {
  min-width: 100px;
}

.vtb-input {
  flex: 1;
  min-width: 150px;
}

.vtb-rule-actions {
  display: flex;
  gap: 0.25rem;
}

.vtb-btn-icon {
  background: transparent;
  border: none;
  cursor: pointer;
  padding: 0.25rem;
  font-size: 1rem;
  color: #6b7280;
}

.vtb-btn-icon:hover {
  color: #374151;
}

.vtb-danger:hover {
  color: #ef4444;
}

.vtb-logic {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-top: 1rem;
  padding-top: 1rem;
  border-top: 1px solid #e5e7eb;
}

.vtb-logic-label {
  font-size: 0.75rem;
  color: #6b7280;
}
</style>
