<script setup lang="ts">
interface Props {
  modelValue?: boolean
  title?: string
  height?: string
  dismissible?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: false,
  title: '',
  height: '50vh',
  dismissible: true
})

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
  close: []
}>()

const isOpen = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value)
})

const close = () => {
  isOpen.value = false
  emit('close')
}

const handleBackdropClick = () => {
  if (props.dismissible) {
    close()
  }
}
</script>

<template>
  <Teleport to="body">
    <Transition name="bottom-sheet">
      <div v-if="isOpen" class="fixed inset-0 z-50">
        <div
          class="absolute inset-0 bg-black/50 transition-opacity"
          @click="handleBackdropClick"
        />
        
        <div
          class="absolute bottom-0 left-0 right-0 rounded-t-2xl bg-white shadow-2xl transition-transform"
          :style="{ height }"
        >
          <div class="flex h-full flex-col">
            <div class="flex items-center justify-between border-b border-gray-100 px-4 py-3">
              <div class="mx-auto h-1 w-12 rounded-full bg-gray-300" />
            </div>
            
            <div v-if="title" class="flex items-center justify-between border-b border-gray-100 px-4 py-3">
              <h3 class="text-lg font-semibold">{{ title }}</h3>
              <button
                v-if="dismissible"
                type="button"
                class="rounded-full p-1 hover:bg-gray-100"
                @click="close"
              >
                <span class="i-lucide-x size-5" />
              </button>
            </div>
            
            <div class="flex-1 overflow-auto p-4">
              <slot />
            </div>
            
            <div v-if="$slots.footer" class="border-t border-gray-100 p-4">
              <slot name="footer" />
            </div>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
.bottom-sheet-enter-active,
.bottom-sheet-leave-active {
  transition: opacity 0.3s ease;
}

.bottom-sheet-enter-from,
.bottom-sheet-leave-to {
  opacity: 0;
}

.bottom-sheet-enter-active > div:last-child,
.bottom-sheet-leave-active > div:last-child {
  transition: transform 0.3s ease;
}

.bottom-sheet-enter-from > div:last-child,
.bottom-sheet-leave-to > div:last-child {
  transform: translateY(100%);
}
</style>
