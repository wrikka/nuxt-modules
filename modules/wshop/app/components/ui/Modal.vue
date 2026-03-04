<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue'

interface Props {
  modelValue: boolean
  title?: string
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full'
  dismissible?: boolean
  hideHeader?: boolean
  hideFooter?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  size: 'md',
  dismissible: true,
  hideHeader: false,
  hideFooter: false
})

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
  close: []
}>()

const modalRef = ref<HTMLElement>()

const sizeClasses = {
  sm: 'max-w-sm',
  md: 'max-w-lg',
  lg: 'max-w-2xl',
  xl: 'max-w-4xl',
  full: 'max-w-full mx-4'
}

const handleKeydown = (e: KeyboardEvent) => {
  if (e.key === 'Escape' && props.dismissible) {
    close()
  }
}

const handleClickOutside = (e: MouseEvent) => {
  if (props.dismissible && e.target === modalRef.value) {
    close()
  }
}

const close = () => {
  emit('update:modelValue', false)
  emit('close')
}

onMounted(() => {
  document.addEventListener('keydown', handleKeydown)
  document.body.style.overflow = 'hidden'
})

onUnmounted(() => {
  document.removeEventListener('keydown', handleKeydown)
  document.body.style.overflow = ''
})
</script>

<template>
  <Teleport to="body">
    <Transition
      enter-active-class="ease-out duration-300"
      enter-from-class="opacity-0"
      enter-to-class="opacity-100"
      leave-active-class="ease-in duration-200"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <div
        v-show="modelValue"
        ref="modalRef"
        class="fixed inset-0 z-50 overflow-y-auto"
        aria-labelledby="modal-title"
        role="dialog"
        aria-modal="true"
        @click="handleClickOutside"
      >
        <div class="flex min-h-full items-center justify-center p-4 text-center sm:p-0">
          <Transition
            enter-active-class="ease-out duration-300"
            enter-from-class="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            enter-to-class="opacity-100 translate-y-0 sm:scale-100"
            leave-active-class="ease-in duration-200"
            leave-from-class="opacity-100 translate-y-0 sm:scale-100"
            leave-to-class="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
          >
            <div
              v-show="modelValue"
              class="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all w-full"
              :class="sizeClasses[size]"
            >
              <div
                v-if="!hideHeader"
                class="flex items-center justify-between px-4 py-3 border-b border-secondary-200"
              >
                <h3
                  id="modal-title"
                  class="text-lg font-semibold text-secondary-900"
                >
                  {{ title }}
                </h3>
                <button
                  v-if="dismissible"
                  type="button"
                  class="text-secondary-400 hover:text-secondary-500 focus:outline-none focus:ring-2 focus:ring-primary-500 rounded-lg p-1"
                  aria-label="Close modal"
                  @click="close"
                >
                  <svg class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M6.28 5.22a.75.75 0 00-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 101.06 1.06L10 11.06l3.72 3.72a.75.75 0 101.06-1.06L11.06 10l3.72-3.72a.75.75 0 00-1.06-1.06L10 8.94 6.28 5.22z" />
                  </svg>
                </button>
              </div>

              <div class="px-4 py-4">
                <slot />
              </div>

              <div
                v-if="!hideFooter"
                class="flex items-center justify-end gap-3 px-4 py-3 border-t border-secondary-200 bg-secondary-50"
              >
                <slot name="footer">
                  <WShopButton
                    variant="ghost"
                    @click="close"
                  >
                    Cancel
                  </WShopButton>
                  <WShopButton
                    variant="primary"
                    @click="$emit('confirm')"
                  >
                    Confirm
                  </WShopButton>
                </slot>
              </div>
            </div>
          </Transition>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>
