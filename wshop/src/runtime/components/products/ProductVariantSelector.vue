<script setup lang="ts">
import type { ProductOption } from '#shared/types';

interface Props {
  options: ProductOption[];
  modelValue: Record<string, string>;
}

const props = defineProps<Props>();
const emit = defineEmits(['update:modelValue']);

const selectedOptions = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value),
});
</script>

<template>
  <div class="space-y-4 mb-6">
    <div v-for="option in options" :key="option.id">
      <label class="text-sm font-bold">{{ option.name }}</label>
      
      <!-- Dropdown -->
      <select v-if="option.displayType === 'dropdown'" v-model="selectedOptions[option.name]" class="mt-2 block w-full rounded-md border-gray-300 shadow-sm">
        <option v-for="val in option.values" :key="val.value" :value="val.value">{{ val.label }}</option>
      </select>

      <!-- Color Swatches -->
      <div v-else-if="option.displayType === 'swatch'" class="flex flex-wrap gap-2 mt-2">
        <button 
          v-for="val in option.values" 
          :key="val.value" 
          @click="selectedOptions[option.name] = val.value"
          class="w-8 h-8 rounded-full border-2 transition-transform transform hover:scale-110"
          :style="{ backgroundColor: val.value }"
          :class="{'ring-2 ring-offset-2 ring-blue-500': selectedOptions[option.name] === val.value, 'border-gray-300': selectedOptions[option.name] !== val.value}"
          :aria-label="val.label"
        ></button>
      </div>

      <!-- Buttons (default) -->
      <div v-else class="flex flex-wrap gap-2 mt-2">
        <button 
          v-for="val in option.values" 
          :key="val.value" 
          @click="selectedOptions[option.name] = val.value"
          class="px-4 py-2 border rounded-md text-sm"
          :class="{'bg-gray-900 text-white': selectedOptions[option.name] === val.value, 'bg-white text-gray-900': selectedOptions[option.name] !== val.value}"
        >
          {{ val.label }}
        </button>
      </div>
    </div>
  </div>
</template>
