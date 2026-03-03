<script setup lang="ts">
import { computed, inject } from 'vue';
import type { FieldArrayItem, FieldValue, FormContext, FormValues } from '../types';
import { WFORM_CONTEXT_KEY } from '../utils/constants';
import { generateId } from '../utils/id';

interface Props {
  name: string;
}

const props = defineProps<Props>();
const context = inject<FormContext<FormValues>>(WFORM_CONTEXT_KEY);

const fields = computed<FieldArrayItem<FieldValue>[]>(() => {
  if (!context) return [];
  const values = (context.form.value.values[props.name] as FieldValue[]) ?? [];
  return values.map((value, index) => ({
    id: generateId(`${props.name}-${index}`),
    value,
  }));
});

const append = (value: FieldValue) => {
  if (!context) return;
  const currentValues = (context.form.value.values[props.name] as FieldValue[]) ?? [];
  context.form.value.values[props.name] = [...currentValues, value] as unknown as typeof context.form.value.values[typeof props.name];
  context.form.value.dirty[props.name] = true;
  context.form.value.isDirty = true;
};

const remove = (index: number) => {
  if (!context) return;
  const currentValues = (context.form.value.values[props.name] as FieldValue[]) ?? [];
  const newValues = [...currentValues];
  newValues.splice(index, 1);
  context.form.value.values[props.name] = newValues as unknown as typeof context.form.value.values[typeof props.name];
  context.form.value.dirty[props.name] = true;
  context.form.value.isDirty = true;
};

const move = (from: number, to: number) => {
  if (!context) return;
  const currentValues = (context.form.value.values[props.name] as FieldValue[]) ?? [];
  if (from < 0 || from >= currentValues.length || to < 0 || to > currentValues.length) {
    return;
  }
  const newValues = [...currentValues];
  const [item] = newValues.splice(from, 1);
  newValues.splice(to, 0, item);
  context.form.value.values[props.name] = newValues as unknown as typeof context.form.value.values[typeof props.name];
  context.form.value.dirty[props.name] = true;
  context.form.value.isDirty = true;
};

const clear = () => {
  if (!context) return;
  context.form.value.values[props.name] = [] as unknown as typeof context.form.value.values[typeof props.name];
  context.form.value.dirty[props.name] = true;
  context.form.value.isDirty = true;
};
</script>

<template>
  <div class="w-field-array">
    <slot :fields="fields" :append="append" :remove="remove" :move="move" :clear="clear" />
  </div>
</template>
