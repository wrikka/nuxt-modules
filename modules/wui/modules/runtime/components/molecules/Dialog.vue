<script setup lang="ts">
import { ref, watch } from 'vue'

interface Props {
  open?: boolean
  title?: string
  description?: string
  showCloseButton?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  showCloseButton: true
})

const emit = defineEmits<{
  'update:open': [open: boolean]
  close: []
}>()

const isOpen = ref(props.open)

watch(() => props.open, (newValue) => {
  isOpen.value = newValue
})

watch(isOpen, (newValue) => {
  emit('update:open', newValue)
  if (!newValue) {
    emit('close')
  }
})

const closeDialog = () => {
  isOpen.value = false
}

const _onBackdropClick = (event: MouseEvent) => {
  if (event.target === event.currentTarget) {
    closeDialog()
  }
}
</script>

<template>
  <Teleport to="body">
    <div
      v-if="isOpen"
      class="fixed inset-0 z-50 flex items-center justify-center"
      @click="_onBackdropClick"
    >
      <!-- Backdrop -->
      <div class="fixed inset-0 bg-background/80 backdrop-blur-sm" />
      
      <!-- Dialog -->
      <div class="relative z-50 grid w-full max-w-lg gap-4 border bg-background p-6 shadow-lg rounded-lg">
        <!-- Close button -->
        <button
          v-if="props.showCloseButton"
          class="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none"
          @click="closeDialog"
        >
          <div class="i-lucide-x h-4 w-4" />
          <span class="sr-only">Close</span>
        </button>
        
        <!-- Content -->
        <div class="flex flex-col space-y-1.5 text-center sm:text-left">
          <h2 v-if="props.title" class="text-lg font-semibold leading-none tracking-tight">
            {{ props.title }}
          </h2>
          <p v-if="props.description" class="text-sm text-muted-foreground">
            {{ props.description }}
          </p>
        </div>
        
        <!-- Default slot -->
        <div class="mt-4">
          <slot />
        </div>
      </div>
    </div>
  </Teleport>
</template>
