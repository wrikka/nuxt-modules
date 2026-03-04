<script setup lang="ts">
interface Props {
  modelValue?: string
  mask?: boolean
  type?: 'text' | 'password'
  placeholder?: string
  disabled?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: '',
  mask: true,
  type: 'text',
  placeholder: '',
  disabled: false
})

const emit = defineEmits<{
  'update:modelValue': [value: string]
  toggle: [masked: boolean]
}>()

const isMasked = ref(props.mask)

const inputType = computed(() => {
  return isMasked.value ? 'password' : 'text'
})

const toggleMask = () => {
  isMasked.value = !isMasked.value
  emit('toggle', isMasked.value)
}

const value = computed({
  get: () => props.modelValue,
  set: (val) => emit('update:modelValue', val)
})
</script>

<template>
  <div class="relative">
    <Input
      v-model="value"
      :type="inputType"
      :placeholder="placeholder"
      :disabled="disabled"
      class="pr-10"
    />
    <button
      type="button"
      class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
      :disabled="disabled"
      @click="toggleMask"
    >
      <span
        :class="isMasked ? 'i-lucide-eye' : 'i-lucide-eye-off'"
        class="size-4"
      />
    </button>
  </div>
</template>
