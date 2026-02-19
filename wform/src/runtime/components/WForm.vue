<script setup lang="ts">
import { provide } from 'vue';
import type { FormOptions, FormValues, UseFormReturn } from '../types';

interface Props<T extends FormValues = FormValues> {
  form: UseFormReturn<T>;
}

const props = defineProps<Props>();
const emit = defineEmits<{
  submit: [values: FormValues];
}>();

const handleSubmit = async (e: Event) => {
  e.preventDefault();
  const result = await props.form.handleSubmit(async (values) => {
    emit('submit', values);
  })();
  return result;
};
</script>

<template>
  <form @submit="handleSubmit">
    <slot />
  </form>
</template>
