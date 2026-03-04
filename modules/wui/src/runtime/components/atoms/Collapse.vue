<script setup lang="ts">
import { ref, watch } from 'vue'

interface Props {
  modelValue?: boolean
  defaultOpen?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: undefined,
  defaultOpen: false
})

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
}>()

const isOpen = ref(props.defaultOpen)

watch(() => props.modelValue, (val) => {
  if (val !== undefined) isOpen.value = val
})

const toggle = () => {
  isOpen.value = !isOpen.value
  emit('update:modelValue', isOpen.value)
}
</script>

<template>
  <div>
    <button
      type="button"
      class="flex items-center gap-2 text-left"
      @click="toggle"
    >
      <slot name="trigger" :is-open="isOpen" :toggle="toggle">
        <span
          class="i-lucide-chevron-down transition-transform"
          :class="{ 'rotate-180': isOpen }"
        />
      </slot>
    </button>
    <Transition
      enter-active-class="transition-all duration-200"
      enter-from-class="opacity-0 -translate-y-2"
      enter-to-class="opacity-100 translate-y-0"
      leave-active-class="transition-all duration-200"
      leave-from-class="opacity-100 translate-y-0"
      leave-to-class="opacity-0 -translate-y-2"
    >
      <div v-show="isOpen">
        <slot />
      </div>
    </Transition>
  </div>
</template>
