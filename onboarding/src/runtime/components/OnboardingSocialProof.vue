<script setup lang="ts">

interface SocialProofItem {
  id: string;
  type: 'completion' | 'active' | 'rating';
  title: string;
  count: number;
  users?: Array<{
    name: string;
    avatar?: string;
  }>;
  rating?: number;
}

interface Props {
  items?: SocialProofItem[];
  show?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  items: () => [],
  show: true,
});

const emit = defineEmits<{
  close: [];
}>();

const getTypeIcon = (type: string): string => {
  switch (type) {
    case 'completion':
      return '✓';
    case 'active':
      return '●';
    case 'rating':
      return '★';
    default:
      return '•';
  }
};

const getTypeColor = (type: string): string => {
  switch (type) {
    case 'completion':
      return 'from-green-400 to-green-600';
    case 'active':
      return 'from-blue-400 to-blue-600';
    case 'rating':
      return 'from-yellow-400 to-yellow-600';
    default:
      return 'from-gray-400 to-gray-600';
  }
};

const formatNumber = (num: number): string => {
  if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
  if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
  return num.toString();
};
</script>

<template>
  <Teleport to="body">
    <Transition
      enter-active-class="transition ease-out duration-300"
      enter-from-class="opacity-0"
      enter-to-class="opacity-100"
      leave-active-class="transition ease-in duration-200"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <div
        v-if="show"
        class="fixed bottom-6 left-6 z-50 max-w-sm w-full"
      >
        <div class="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl overflow-hidden">
          <div class="p-4 bg-gradient-to-r from-blue-500 to-purple-600">
            <div class="flex items-center justify-between">
              <div class="flex items-center gap-3">
                <div class="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
                  <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
                <div>
                  <h3 class="text-lg font-semibold text-white">
                    Social Proof
                  </h3>
                  <p class="text-sm text-white/80">
                    See what others are doing
                  </p>
                </div>
              </div>
              <button
                class="p-2 hover:bg-white/20 rounded-lg transition-colors"
                @click="emit('close')"
              >
                <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>

          <div class="p-4 max-h-96 overflow-y-auto space-y-3">
            <div
              v-for="item in items"
              :key="item.id"
              class="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-4"
            >
              <div class="flex items-start gap-3">
                <div
                  class="w-10 h-10 rounded-xl flex items-center justify-center text-white font-bold flex-shrink-0 bg-gradient-to-br"
                  :class="getTypeColor(item.type)"
                >
                  {{ getTypeIcon(item.type) }}
                </div>
                <div class="flex-1 min-w-0">
                  <h4 class="font-semibold text-gray-900 dark:text-white mb-1">
                    {{ item.title }}
                  </h4>
                  <p class="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                    {{ formatNumber(item.count) }}
                  </p>

                  <div v-if="item.users && item.users.length > 0" class="flex -space-x-2 mb-2">
                    <div
                      v-for="(user, index) in item.users.slice(0, 3)"
                      :key="index"
                      class="w-8 h-8 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 border-2 border-white dark:border-gray-800 flex items-center justify-center text-white text-xs font-medium"
                    >
                      {{ user.name.charAt(0) }}
                    </div>
                    <div
                      v-if="item.users.length > 3"
                      class="w-8 h-8 rounded-full bg-gray-300 dark:bg-gray-600 border-2 border-white dark:border-gray-800 flex items-center justify-center text-gray-600 dark:text-gray-300 text-xs font-medium"
                    >
                      +{{ item.users.length - 3 }}
                    </div>
                  </div>

                  <div v-if="item.rating" class="flex items-center gap-1">
                    <svg
                      v-for="i in 5"
                      :key="i"
                      class="w-4 h-4"
                      :class="i <= item.rating ? 'text-yellow-500' : 'text-gray-300 dark:text-gray-600'"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>
