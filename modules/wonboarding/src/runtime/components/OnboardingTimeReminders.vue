<script setup lang="ts">

interface Reminder {
  id: string;
  title: string;
  message: string;
  time: Date;
  type: 'info' | 'warning' | 'success';
}

interface Props {
  reminders?: Reminder[];
  show?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  reminders: () => [],
  show: true,
});

const emit = defineEmits<{
  dismiss: [reminderId: string];
  action: [reminderId: string];
  snooze: [reminderId: string, minutes: number];
}>();

const getTypeColor = (type: string): string => {
  switch (type) {
    case 'success':
      return 'bg-green-500 border-green-600';
    case 'warning':
      return 'bg-yellow-500 border-yellow-600';
    default:
      return 'bg-blue-500 border-blue-600';
  }
};

const getTypeIcon = (type: string): string => {
  switch (type) {
    case 'success':
      return '✓';
    case 'warning':
      return '⚠';
    default:
      return 'ℹ';
  }
};

const formatTime = (date: Date): string => {
  const now = new Date();
  const diff = date.getTime() - now.getTime();
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (days > 0) return `${days} day${days !== 1 ? 's' : ''} ago`;
  if (hours > 0) return `${hours} hour${hours !== 1 ? 's' : ''} ago`;
  if (minutes > 0) return `${minutes} minute${minutes !== 1 ? 's' : ''} ago`;
  return 'Just now';
};
</script>

<template>
  <Teleport to="body">
    <Transition
      enter-active-class="transition ease-out duration-300"
      enter-from-class="opacity-0 translate-x-full"
      enter-to-class="opacity-100 translate-x-0"
      leave-active-class="transition ease-in duration-200"
      leave-from-class="opacity-100 translate-x-0"
      leave-to-class="opacity-0 translate-x-full"
    >
      <div
        v-if="show && reminders.length > 0"
        class="fixed top-6 right-6 z-50 max-w-sm w-full space-y-3"
      >
        <div
          v-for="reminder in reminders"
          :key="reminder.id"
          class="bg-white dark:bg-gray-800 rounded-xl shadow-2xl overflow-hidden border-l-4"
          :class="getTypeColor(reminder.type)"
        >
          <div class="p-4">
            <div class="flex items-start gap-3">
              <div
                class="w-10 h-10 rounded-lg flex items-center justify-center text-white font-bold flex-shrink-0"
                :class="getTypeColor(reminder.type)"
              >
                {{ getTypeIcon(reminder.type) }}
              </div>
              <div class="flex-1 min-w-0">
                <h4 class="font-semibold text-gray-900 dark:text-white mb-1">
                  {{ reminder.title }}
                </h4>
                <p class="text-sm text-gray-600 dark:text-gray-400 mb-2">
                  {{ reminder.message }}
                </p>
                <div class="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-500">
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  {{ formatTime(reminder.time) }}
                </div>
              </div>
              <button
                class="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                @click="emit('dismiss', reminder.id)"
              >
                <svg class="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div class="flex gap-2 mt-3 pt-3 border-t border-gray-200 dark:border-gray-700">
              <button
                class="flex-1 px-3 py-1.5 text-sm font-medium text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                @click="emit('snooze', reminder.id, 5)"
              >
                Snooze 5m
              </button>
              <button
                class="flex-1 px-3 py-1.5 text-sm font-medium text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                @click="emit('snooze', reminder.id, 30)"
              >
                Snooze 30m
              </button>
              <button
                class="flex-1 px-3 py-1.5 text-sm font-medium bg-blue-500 text-white hover:bg-blue-600 rounded-lg transition-colors"
                @click="emit('action', reminder.id)"
              >
                Action
              </button>
            </div>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>
