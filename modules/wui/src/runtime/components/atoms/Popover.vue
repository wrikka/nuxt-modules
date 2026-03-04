<script setup lang="ts">
import { ref, watch, computed } from 'vue'

interface Props {
  open?: boolean
  trigger?: 'click' | 'hover'
  placement?: 'top' | 'bottom' | 'left' | 'right'
}

const props = withDefaults(defineProps<Props>(), {
  trigger: 'click',
  placement: 'bottom'
})

const emit = defineEmits<{
  'update:open': [open: boolean]
}>()

const isOpen = ref(props.open)

watch(() => props.open, (newValue) => {
  isOpen.value = newValue
})

watch(isOpen, (newValue) => {
  emit('update:open', newValue)
})

const _toggle = () => {
  if (props.trigger === 'click') {
    isOpen.value = !isOpen.value
  }
}

const _show = () => {
  if (props.trigger === 'hover') {
    isOpen.value = true
  }
}

const _hide = () => {
  if (props.trigger === 'hover') {
    isOpen.value = false
  }
}

const _placementClasses = computed(() => {
  const placements = {
    top: 'bottom-full left-1/2 -translate-x-1/2 mb-2',
    bottom: 'top-full left-1/2 -translate-x-1/2 mt-2',
    left: 'right-full top-1/2 -translate-y-1/2 mr-2',
    right: 'left-full top-1/2 -translate-y-1/2 ml-2'
  }
  return placements[props.placement]
})
</script>

<template>
  <div class="relative inline-block">
    <!-- Trigger -->
    <div
      @click="_toggle"
      @mouseenter="_show"
      @mouseleave="_hide"
    >
      <slot name="trigger" />
    </div>
    
    <!-- Content -->
    <Teleport to="body">
      <div
        v-if="isOpen"
        :class="[
          'absolute z-50 w-72 rounded-md border bg-popover p-4 text-popover-foreground shadow-md',
          _placementClasses
        ]"
      >
        <slot />
      </div>
    </Teleport>
  </div>
</template>
