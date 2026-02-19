<script setup lang="ts">
import { computed, ref } from 'vue';
import { useNotifications } from '#notifications/composables';

const props = withDefaults(
  defineProps<{
    showCount?: boolean;
    maxCount?: number;
    color?: 'blue' | 'red' | 'green' | 'orange' | 'purple';
    size?: 'sm' | 'md' | 'lg';
    animate?: boolean;
    pulse?: boolean;
  }>(),
  {
    showCount: true,
    maxCount: 99,
    color: 'blue',
    size: 'md',
    animate: true,
    pulse: false,
  },
);

const emit = defineEmits<{
  click: [];
}>();

const { unreadCount } = useNotifications();

const isAnimating = ref(false);

const displayCount = computed(() => {
  if (!props.showCount) {
    return '';
  }
  if (unreadCount.value > props.maxCount) {
    return `${props.maxCount}+`;
  }
  return unreadCount.value > 0 ? String(unreadCount.value) : '';
});

const hasNotifications = computed(() => unreadCount.value > 0);

const sizeClasses = computed(() => {
  switch (props.size) {
    case 'sm':
      return 'min-w-4 h-4 text-xs';
    case 'lg':
      return 'min-w-6 h-6 text-sm';
    default:
      return 'min-w-5 h-5 text-xs';
  }
});

const colorClasses = computed(() => {
  switch (props.color) {
    case 'red':
      return 'bg-red-500 text-white';
    case 'green':
      return 'bg-green-500 text-white';
    case 'orange':
      return 'bg-orange-500 text-white';
    case 'purple':
      return 'bg-purple-500 text-white';
    default:
      return 'bg-blue-500 text-white';
  }
});

const handleClick = () => {
  if (props.animate && hasNotifications.value) {
    isAnimating.value = true;
    setTimeout(() => {
      isAnimating.value = false;
    }, 300);
  }
  emit('click');
};
</script>

<template>
  <button
    class="relative inline-flex items-center justify-center rounded-full p-2 transition-colors hover:bg-gray-100 dark:hover:bg-gray-800"
    @click="handleClick"
  >
    <!-- Bell Icon -->
    <div class="i-heroicons-bell h-5 w-5 text-gray-600 dark:text-gray-400" />

    <!-- Badge -->
    <Transition name="badge">
      <span
        v-if="hasNotifications"
        class="absolute -end-1 -top-1 flex items-center justify-center rounded-full font-medium"
        :class="[
          sizeClasses,
          colorClasses,
          {
            'animate-bounce': isAnimating && animate,
            'animate-pulse': pulse && !isAnimating,
          },
        ]"
      >
        {{ displayCount }}
      </span>
    </Transition>
  </button>
</template>

<style scoped>
.badge-enter-active {
  animation: badge-in 0.2s ease-out;
}

.badge-leave-active {
  animation: badge-out 0.2s ease-in forwards;
}

@keyframes badge-in {
  from {
    opacity: 0;
    transform: scale(0.5);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

@keyframes badge-out {
  from {
    opacity: 1;
    transform: scale(1);
  }
  to {
    opacity: 0;
    transform: scale(0.5);
  }
}
</style>
