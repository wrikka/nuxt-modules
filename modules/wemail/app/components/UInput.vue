<script setup lang="ts">
const props = defineProps({
  modelValue: { type: String, default: '' },
  placeholder: { type: String, default: '' },
  icon: { type: String, default: null },
})

const emit = defineEmits(['update:modelValue'])

const _localValue = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value),
})
</script>

<template>
  <div class="relative group">
    <Icon v-if="icon" :name="icon" class="absolute left-4 top-1/2 -translate-y-1/2 text-xl text-slate-400 dark:text-zinc-500 group-focus-within:text-blue-500 transition-colors" />
    <input
      v-model="_localValue"
      :placeholder="placeholder"
      class="w-full bg-slate-100 dark:bg-zinc-800 rounded-lg py-2.5 pr-4 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 transition-shadow duration-200 group-hover:shadow-sm"
      :class="icon ? 'pl-12' : 'pl-4'"
    />
  </div>
</template>
