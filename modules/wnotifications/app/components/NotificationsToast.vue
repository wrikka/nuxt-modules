<script setup lang="ts">
import { computed, onUnmounted, ref, watch } from 'vue';
import type { Notification, NotificationType } from '../types';
import { useNotifications } from '../composables/useNotifications';

const props = withDefaults(
  defineProps<{
    position?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left' | 'top-center' | 'bottom-center';
    maxVisible?: number;
    duration?: number;
    pauseOnHover?: boolean;
    showProgress?: boolean;
    showClose?: boolean;
  }>(),
  {
    position: 'top-right',
    maxVisible: 5,
    duration: 5000,
    pauseOnHover: true,
    showProgress: true,
    showClose: true,
  },
);

const { notifications, remove } = useNotifications();

const timers = ref<Map<string, ReturnType<typeof setTimeout>>>(new Map());
const pausedTimers = ref<Set<string>>(new Set());
const progressValues = ref<Map<string, number>>(new Map());

const toastNotifications = computed(() => {
  return notifications.value
    .filter((n: Notification) => !n.read && n.channel === 'in-app')
    .slice(0, props.maxVisible);
});

const positionClasses = computed(() => {
  const classes: string[] = [];

  switch (props.position) {
    case 'top-right':
      classes.push('top-4 right-4');
      break;
    case 'top-left':
      classes.push('top-4 left-4');
      break;
    case 'bottom-right':
      classes.push('bottom-4 right-4');
      break;
    case 'bottom-left':
      classes.push('bottom-4 left-4');
      break;
    case 'top-center':
      classes.push('top-4 left-1/2 -translate-x-1/2');
      break;
    case 'bottom-center':
      classes.push('bottom-4 left-1/2 -translate-x-1/2');
      break;
  }

  return classes;
});

const typeStyles: Record<NotificationType, { bg: string; border: string; icon: string }> = {
  info: {
    bg: 'bg-blue-50 dark:bg-blue-900/30',
    border: 'border-l-blue-500',
    icon: 'i-heroicons-information-circle text-blue-500',
  },
  success: {
    bg: 'bg-green-50 dark:bg-green-900/30',
    border: 'border-l-green-500',
    icon: 'i-heroicons-check-circle text-green-500',
  },
  warning: {
    bg: 'bg-yellow-50 dark:bg-yellow-900/30',
    border: 'border-l-yellow-500',
    icon: 'i-heroicons-exclamation-triangle text-yellow-500',
  },
  error: {
    bg: 'bg-red-50 dark:bg-red-900/30',
    border: 'border-l-red-500',
    icon: 'i-heroicons-x-circle text-red-500',
  },
  system: {
    bg: 'bg-gray-50 dark:bg-gray-800',
    border: 'border-l-gray-500',
    icon: 'i-heroicons-cog text-gray-500',
  },
  message: {
    bg: 'bg-purple-50 dark:bg-purple-900/30',
    border: 'border-l-purple-500',
    icon: 'i-heroicons-chat-bubble-left text-purple-500',
  },
};

const startTimer = (notification: Notification) => {
  if (timers.value.has(notification.id)) {
    return;
  }

  const startTime = Date.now();
  const duration = notification.priority === 'urgent' ? props.duration * 2 : props.duration;

  const timer = setTimeout(() => {
    dismissToast(notification.id);
  }, duration);

  timers.value.set(notification.id, timer);

  // Progress animation
  const progressInterval = setInterval(() => {
    if (pausedTimers.value.has(notification.id)) {
      return;
    }

    const elapsed = Date.now() - startTime;
    const remaining = Math.max(0, 1 - elapsed / duration);
    progressValues.value.set(notification.id, remaining * 100);

    if (remaining <= 0) {
      clearInterval(progressInterval);
    }
  }, 50);
};

const pauseTimer = (notificationId: string) => {
  if (props.pauseOnHover) {
    pausedTimers.value.add(notificationId);
  }
};

const resumeTimer = (notificationId: string) => {
  pausedTimers.value.delete(notificationId);
};

const dismissToast = (id: string) => {
  const timer = timers.value.get(id);
  if (timer) {
    clearTimeout(timer);
    timers.value.delete(id);
  }
  pausedTimers.value.delete(id);
  progressValues.value.delete(id);
  remove(id);
};

const handleClose = (id: string) => {
  dismissToast(id);
};

watch(
  toastNotifications,
  (newToasts) => {
    for (const toast of newToasts) {
      if (!timers.value.has(toast.id)) {
        startTimer(toast);
      }
    }
  },
  { immediate: true },
);

onUnmounted(() => {
  for (const timer of timers.value.values()) {
    clearTimeout(timer);
  }
  timers.value.clear();
});
</script>

<template>
  <Teleport to="body">
    <div
      class="pointer-events-none fixed z-50 flex flex-col gap-2"
      :class="positionClasses"
    >
      <TransitionGroup name="toast">
        <div
          v-for="notification in toastNotifications"
          :key="notification.id"
          class="pointer-events-auto w-80 overflow-hidden rounded-lg border-l-4 shadow-lg"
          :class="[typeStyles[notification.type].bg, typeStyles[notification.type].border]"
          @mouseenter="pauseTimer(notification.id)"
          @mouseleave="resumeTimer(notification.id)"
        >
          <!-- Progress bar -->
          <div
            v-if="showProgress"
            class="h-1 w-full bg-gray-200/50 dark:bg-gray-700/50"
          >
            <div
              class="h-full transition-all duration-100"
              :class="[
                notification.type === 'error' ? 'bg-red-500' : '',
                notification.type === 'success' ? 'bg-green-500' : '',
                notification.type === 'warning' ? 'bg-yellow-500' : '',
                notification.type === 'info' ? 'bg-blue-500' : '',
                notification.type === 'system' ? 'bg-gray-500' : '',
                notification.type === 'message' ? 'bg-purple-500' : '',
              ]"
              :style="{ width: `${progressValues.get(notification.id) ?? 100}%` }"
            />
          </div>

          <div class="flex items-start gap-3 p-3">
            <!-- Icon -->
            <div class="flex-shrink-0">
              <div :class="typeStyles[notification.type].icon" class="h-5 w-5" />
            </div>

            <!-- Content -->
            <div class="min-w-0 flex-1">
              <p class="text-sm font-medium text-gray-900 dark:text-gray-100">
                {{ notification.title }}
              </p>
              <p class="mt-0.5 text-sm text-gray-600 dark:text-gray-400">
                {{ notification.message }}
              </p>

              <!-- Action buttons -->
              <div v-if="notification.url" class="mt-2">
                <NuxtLink
                  :to="notification.url"
                  class="text-xs font-medium text-blue-600 hover:text-blue-700 dark:text-blue-400"
                  @click="dismissToast(notification.id)"
                >
                  View details →
                </NuxtLink>
              </div>
            </div>

            <!-- Close button -->
            <button
              v-if="showClose"
              class="flex-shrink-0 rounded p-1 text-gray-400 hover:bg-gray-200 hover:text-gray-600 dark:hover:bg-gray-700 dark:hover:text-gray-300"
              @click="handleClose(notification.id)"
            >
              <div class="i-heroicons-x-mark h-4 w-4" />
            </button>
          </div>
        </div>
      </TransitionGroup>
    </div>
  </Teleport>
</template>

<style scoped>
.toast-enter-active {
  animation: toast-in 0.3s ease-out;
}

.toast-leave-active {
  animation: toast-out 0.2s ease-in forwards;
}

.toast-move {
  transition: transform 0.3s ease;
}

@keyframes toast-in {
  from {
    opacity: 0;
    transform: translateX(100%);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

@keyframes toast-out {
  from {
    opacity: 1;
    transform: translateX(0);
  }
  to {
    opacity: 0;
    transform: translateX(100%);
  }
}
</style>
