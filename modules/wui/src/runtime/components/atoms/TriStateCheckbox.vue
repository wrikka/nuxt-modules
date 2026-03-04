<script setup lang="ts">
interface Props {
  modelValue?: boolean | null
  indeterminate?: boolean
  disabled?: boolean
  label?: string
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: false,
  indeterminate: false,
  disabled: false
})

const emit = defineEmits<{
  'update:modelValue': [value: boolean | null]
  change: [value: boolean | null]
}>()

const checkboxRef = ref<HTMLInputElement>()

const state = computed({
  get: () => props.modelValue,
  set: (value) => {
    emit('update:modelValue', value)
    emit('change', value)
  }
})

const toggle = () => {
  if (props.disabled) return
  
  if (state.value === false) {
    state.value = null
  } else if (state.value === null) {
    state.value = true
  } else {
    state.value = false
  }
}

const stateIcon = computed(() => {
  switch (state.value) {
    case true:
      return 'i-lucide-check'
    case null:
      return 'i-lucide-minus'
    default:
      return ''
  }
})

const stateClasses = computed(() => {
  switch (state.value) {
    case true:
      return 'bg-blue-600 text-white'
    case null:
      return 'bg-blue-400 text-white'
    default:
      return 'bg-white border-gray-300'
  }
})

onMounted(() => {
  if (checkboxRef.value) {
    checkboxRef.value.indeterminate = props.indeterminate || state.value === null
  }
})
</script>

<template>
  <label class="flex cursor-pointer items-center gap-2" :class="{ 'cursor-not-allowed opacity-50': disabled }">
    <button
      type="button"
      class="flex h-5 w-5 items-center justify-center rounded border-2 transition-colors"
      :class="stateClasses"
      :disabled="disabled"
      @click="toggle"
    >
      <span v-if="stateIcon" :class="[stateIcon, 'size-3.5']" />
    </button>
    <input
      ref="checkboxRef"
      type="checkbox"
      class="hidden"
      :checked="state === true"
      :disabled="disabled"
    />
    <span v-if="label" class="text-sm">{{ label }}</span>
  </label>
</template>
