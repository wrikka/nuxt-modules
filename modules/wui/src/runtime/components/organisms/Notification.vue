<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'

export type NotificationType = 'success' | 'error' | 'warning' | 'info'

export interface Notification {
  id: string
  type: NotificationType
  title: string
  message?: string
  duration?: number
  action?: {
    label: string
    callback: () => void
  }
}

interface Props {
  notifications: Notification[]
  position?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right' | 'top-center' | 'bottom-center'
  limit?: number
  class?: string
}

const _props = withDefaults(defineProps<Props>(), {
  position: 'top-right',
  limit: 5
})

const emit = defineEmits<{
  dismiss: [id: string]
}>()

const _positionClasses = computed(() => ({
  'top-left': 'top-4 left-4',
  'top-right': 'top-4 right-4',
  'bottom-left': 'bottom-4 left-4',
  'bottom-right': 'bottom-4 right-4',
  'top-center': 'top-4 left-1/2 -translate-x-1/2',
  'bottom-center': 'bottom-4 left-1/2 -translate-x-1/2'
}))

const _typeConfig = computed(() => ({
  success: { icon: 'i-lucide-check-circle', color: 'border-green-500 bg-green-50 text-green-800' },
  error: { icon: 'i-lucide-alert-circle', color: 'border-red-500 bg-red-50 text-red-800' },
  warning: { icon: 'i-lucide-alert-triangle', color: 'border-yellow-500 bg-yellow-50 text-yellow-800' },
  info: { icon: 'i-lucide-info', color: 'border-blue-500 bg-blue-50 text-blue-800' }
}))

const _visibleNotifications = computed(() => 
  _props.notifications.slice(0, _props.limit)
)

const _handleDismiss = (id: string) => {
  emit('dismiss', id)
}
</script>

<template>
  <div
    :class="[
      'fixed z-50 flex flex-col gap-2 w-full max-w-sm',
      _positionClasses[position],
      _props.class
    ]"
  >
    <TransitionGroup name="notification">
      <div
        v-for="notification in _visibleNotifications"
        :key="notification.id"
        :class="[
          'relative flex items-start gap-3 rounded-lg border p-4 shadow-lg',
          _typeConfig[notification.type].color
        ]"
      >
        <span :class="[_typeConfig[notification.type].icon, 'h-5 w-5 shrink-0 mt-0.5']" />
        
        <div class="flex-1 min-w-0">
          <h4 class="font-semibold text-sm">{{ notification.title }}</h4>
          <p v-if="notification.message" class="mt-1 text-sm opacity-90">
            {{ notification.message }}
          </p>
          
          <button
            v-if="notification.action"
            class="mt-2 text-sm font-medium underline hover:no-underline"
            @click="notification.action.callback"
          >
            {{ notification.action.label }}
          </button>
        </div>
        
        <button
          class="shrink-0 p-1 opacity-60 hover:opacity-100"
          @click="_handleDismiss(notification.id)"
        >
          <span class="i-lucide-x h-4 w-4" />
        </button>
      </div>
    </TransitionGroup>
  </div>
</template>

<style scoped>
.notification-enter-active,
.notification-leave-active {
  transition: all 0.3s ease;
}
.notification-enter-from,
.notification-leave-to {
  opacity: 0;
  transform: translateX(100%);
}
</style>
