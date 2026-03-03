<script setup lang="ts">
import { ref, computed } from 'vue';

interface Action {
  id: string;
  type: 'complete' | 'skip' | 'reset';
  stepId?: string;
  stepTitle?: string;
  timestamp: Date;
}

interface Props {
  actions?: Action[];
  show?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  actions: () => [],
  show: true,
});

const emit = defineEmits<{
  undo: [actionId: string];
  redo: [actionId: string];
  close: [];
}>();

const currentActionIndex = ref(props.actions.length - 1);

const canUndo = computed(() => currentActionIndex.value >= 0);
const canRedo = computed(() => currentActionIndex.value < props.actions.length - 1);

const currentAction = computed(() => props.actions[currentActionIndex.value]);

const handleUndo = () => {
  if (canUndo.value) {
    emit('undo', props.actions[currentActionIndex.value].id);
    currentActionIndex.value--;
  }
};

const handleRedo = () => {
  if (canRedo.value) {
    currentActionIndex.value++;
    emit('redo', props.actions[currentActionIndex.value].id);
  }
};

const formatTime = (date: Date): string => {
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  const minutes = Math.floor(diff / 60000);

  if (minutes < 1) return 'Just now';
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
};

const getActionIcon = (type: string): string => {
  switch (type) {
    case 'complete':
      return '✓';
    case 'skip':
      return '→';
    case 'reset':
      return '↺';
    default:
      return '•';
  }
};

const getActionColor = (type: string): string => {
  switch (type) {
    case 'complete':
      return 'text-green-600 bg-green-100 dark:bg-green-900/30';
    case 'skip':
      return 'text-yellow-600 bg-yellow-100 dark:bg-yellow-900/30';
    case 'reset':
      return 'text-red-600 bg-red-100 dark:bg-red-900/30';
    default:
      return 'text-gray-600 bg-gray-100 dark:bg-gray-700/30';
  }
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
        class="fixed bottom-6 right-6 z-50 max-w-sm w-full"
      >
        <div class="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl overflow-hidden">
          <div class="p-4 bg-gradient-to-r from-blue-500 to-purple-600">
            <div class="flex items-center justify-between">
              <div class="flex items-center gap-3">
                <div class="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
                  <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                </div>
                <div>
                  <h3 class="text-lg font-semibold text-white">
                    Undo / Redo
                  </h3>
                  <p class="text-sm text-white/80">
                    {{ actions.length }} action{{ actions.length !== 1 ? 's' : '' }}
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

          <div class="p-4">
            <div v-if="currentAction" class="mb-4">
              <p class="text-sm text-gray-500 dark:text-gray-400 mb-2">
                Current Action
              </p>
              <div class="flex items-center gap-3 p-3 rounded-xl" :class="getActionColor(currentAction.type)">
                <div class="w-8 h-8 rounded-lg flex items-center justify-center text-white font-bold">
                  {{ getActionIcon(currentAction.type) }}
                </div>
                <div class="flex-1">
                  <p class="font-semibold text-gray-900 dark:text-white">
                    {{ currentAction.stepTitle || currentAction.type }}
                  </p>
                  <p class="text-xs text-gray-600 dark:text-gray-400">
                    {{ formatTime(currentAction.timestamp) }}
                  </p>
                </div>
              </div>
            </div>

            <div class="flex gap-3">
              <button
                class="flex-1 py-3 px-4 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 font-medium rounded-xl hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                :disabled="!canUndo"
                @click="handleUndo"
              >
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" />
                </svg>
                Undo
              </button>
              <button
                class="flex-1 py-3 px-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-medium rounded-xl hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                :disabled="!canRedo"
                @click="handleRedo"
              >
                Redo
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 10h-10a8 8 0 00-8 8v2M21 10l-6 6m6-6l-6-6" />
                </svg>
              </button>
            </div>

            <div v-if="actions.length > 0" class="mt-4">
              <p class="text-sm text-gray-500 dark:text-gray-400 mb-2">
                Action History
              </p>
              <div class="space-y-2 max-h-48 overflow-y-auto">
                <div
                  v-for="(action, index) in actions.slice().reverse()"
                  :key="action.id"
                  class="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors cursor-pointer"
                  :class="{
                    'bg-blue-50 dark:bg-blue-900/20': index === actions.length - 1 - currentActionIndex,
                  }"
                >
                  <div
                    class="w-6 h-6 rounded flex items-center justify-center text-xs font-bold"
                    :class="getActionColor(action.type)"
                  >
                    {{ getActionIcon(action.type) }}
                  </div>
                  <div class="flex-1 min-w-0">
                    <p class="text-sm font-medium text-gray-900 dark:text-white truncate">
                      {{ action.stepTitle || action.type }}
                    </p>
                    <p class="text-xs text-gray-500 dark:text-gray-400">
                      {{ formatTime(action.timestamp) }}
                    </p>
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
