<script setup lang="ts">
import { computed, inject } from 'vue';
import type { FormContext, FormValues } from '../types';
import { WFORM_CONTEXT_KEY } from '../utils/constants';

interface Props {
  name: string;
}

const props = defineProps<Props>();
const context = inject<FormContext<FormValues>>(WFORM_CONTEXT_KEY);

const error = computed(() => {
  if (!context) return undefined;
  return context.form.value.errors[props.name]?.[0];
});

const touched = computed(() => {
  if (!context) return false;
  return context.form.value.touched[props.name] ?? false;
});

const handleBlur = () => {
  if (!context) return;
  context.form.value.touched[props.name] = true;
  context.form.value.isTouched = true;
};
</script>

<template>
  <div class="w-field">
    <slot :error="error" :touched="touched" @blur="handleBlur" />
    <WErrorMessage v-if="error && touched" :message="error" />
  </div>
</template>
