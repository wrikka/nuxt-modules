<script setup lang="ts">
import { computed, onMounted, onUnmounted, watch } from 'vue'

interface Props {
  modelValue?: boolean
  title?: string
  description?: string
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full'
  dismissible?: boolean
  hideClose?: boolean
  center?: boolean
  class?: string
}

const _props = withDefaults(defineProps<Props>(), {
  modelValue: false,
  size: 'md',
  dismissible: true,
  hideClose: false,
  center: true
})

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
  'close': []
}>()

const _isOpen = computed({
  get: () => _props.modelValue,
  set: (val) => emit('update:modelValue', val)
})

const _sizeClasses = computed(() => ({
  sm: 'max-w-sm',
  md: 'max-w-md',
  lg: 'max-w-lg',
  xl: 'max-w-xl',
  full: 'max-w-[calc(100vw-2rem)]'
}))

const _close = () => {
  if (_props.dismissible) {
    _isOpen.value = false
    emit('close')
  }
}

const _handleKeydown = (event: KeyboardEvent) => {
  if (event.key === 'Escape' && _props.dismissible) {
    _close()
  }
}

onMounted(() => {
  document.addEventListener('keydown', _handleKeydown)
})

onUnmounted(() => {
  document.removeEventListener('keydown', _handleKeydown)
})

watch(() => _props.modelValue, (isOpen) => {
  if (isOpen) {
    document.body.style.overflow = 'hidden'
  }
  else {
    document.body.style.overflow = ''
  }
})
</script>

<template>
  <Teleport to="body">
    <Transition name="modal">
      <div
        v-if="_isOpen"
        class="fixed inset-0 z-50 flex items-center justify-center p-4"
        :class="[!center && 'items-start pt-20']"
        @click="_close"
      >
        <div class="fixed inset-0 bg-black/50 backdrop-blur-sm" />

        <div
          :class="[
            'relative z-10 w-full rounded-lg border bg-background shadow-lg',
            _sizeClasses[size],
            _props.class
          ]"
          @click.stop
        >
          <div
            v-if="title || description || !hideClose"
            class="flex items-start justify-between gap-4 border-b p-4"
          >
            <div class="flex-1">
              <h2 v-if="title" class="text-lg font-semibold">{{ title }}</h2>
              <p v-if="description" class="mt-1 text-sm text-muted-foreground">{{ description }}</p>
            </div>

            <button
              v-if="!hideClose && dismissible"
              type="button"
              class="shrink-0 rounded-md p-1 hover:bg-accent"
              @click="_close"
            >
              <span class="i-lucide-x h-4 w-4" />
            </button>
          </div>

          <div class="p-4">
            <slot />
          </div>

          <div v-if="$slots.footer" class="border-t p-4">
            <slot name="footer" :close="_close" />
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.2s ease;
}
.modal-enter-active .relative,
.modal-leave-active .relative {
  transition: transform 0.2s ease;
}
.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}
.modal-enter-from .relative,
.modal-leave-to .relative {
  transform: scale(0.95);
}
</style>
