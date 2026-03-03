<script setup lang="ts">
import { ref, computed } from 'vue';

interface Suggestion {
  id: string;
  stepId: string;
  title: string;
  reason: string;
  priority: 'high' | 'medium' | 'low';
  confidence: number;
}

interface Props {
  suggestions?: Suggestion[];
  show?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  suggestions: () => [],
  show: true,
});

const emit = defineEmits<{
  accept: [suggestion: Suggestion];
  dismiss: [suggestionId: string];
  close: [];
}>();

const dismissedIds = ref<Set<string>>(new Set());

const visibleSuggestions = computed(() => {
  return props.suggestions.filter(s => !dismissedIds.value.has(s.id));
});

const getPriorityColor = (priority: string): string => {
  switch (priority) {
    case 'high':
      return 'bg-red-100 text-red-700 border-red-300 dark:bg-red-900/30 dark:text-red-400 dark:border-red-700';
    case 'medium':
      return 'bg-yellow-100 text-yellow-700 border-yellow-300 dark:bg-yellow-900/30 dark:text-yellow-400 dark:border-yellow-700';
    case 'low':
      return 'bg-green-100 text-green-700 border-green-300 dark:bg-green-900/30 dark:text-green-400 dark:border-green-700';
    default:
      return 'bg-gray-100 text-gray-700 border-gray-300 dark:bg-gray-700/30 dark:text-gray-400 dark:border-gray-600';
  }
};

const getConfidenceColor = (confidence: number): string => {
  if (confidence >= 80) return 'text-green-600 dark:text-green-400';
  if (confidence >= 60) return 'text-yellow-600 dark:text-yellow-400';
  return 'text-orange-600 dark:text-orange-400';
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
        v-if="show && visibleSuggestions.length > 0"
        class="fixed bottom-6 right-6 z-50 max-w-md w-full"
      >
        <div class="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl overflow-hidden">
          <div class="p-4 bg-gradient-to-r from-blue-500 to-purple-600">
            <div class="flex items-center justify-between">
              <div class="flex items-center gap-3">
                <div class="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
                  <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                  </svg>
                </div>
                <div>
                  <h3 class="text-lg font-semibold text-white">
                    AI Suggestions
                  </h3>
                  <p class="text-sm text-white/80">
                    {{ visibleSuggestions.length }} recommendation{{ visibleSuggestions.length !== 1 ? 's' : '' }}
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

          <div class="p-4 max-h-96 overflow-y-auto">
            <div
              v-for="suggestion in visibleSuggestions"
              :key="suggestion.id"
              class="mb-4 last:mb-0"
            >
              <div class="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-4 border border-gray-200 dark:border-gray-700">
                <div class="flex items-start justify-between mb-3">
                  <div class="flex-1">
                    <h4 class="font-semibold text-gray-900 dark:text-white mb-1">
                      {{ suggestion.title }}
                    </h4>
                    <span
                      class="inline-block px-2 py-1 text-xs font-medium rounded-full border"
                      :class="getPriorityColor(suggestion.priority)"
                    >
                      {{ suggestion.priority }} priority
                    </span>
                  </div>
                  <button
                    class="p-1 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg transition-colors ml-2"
                    @click="emit('dismiss', suggestion.id)"
                  >
                    <svg class="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>

                <p class="text-sm text-gray-600 dark:text-gray-400 mb-3">
                  {{ suggestion.reason }}
                </p>

                <div class="flex items-center justify-between">
                  <div class="flex items-center gap-1">
                    <svg class="w-4 h-4" :class="getConfidenceColor(suggestion.confidence)" fill="currentColor" viewBox="0 0 20 20">
                      <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
                    </svg>
                    <span class="text-sm font-medium" :class="getConfidenceColor(suggestion.confidence)">
                      {{ suggestion.confidence }}% confident
                    </span>
                  </div>
                  <button
                    class="px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white text-sm font-medium rounded-lg hover:opacity-90 transition-opacity"
                    @click="emit('accept', suggestion)"
                  >
                    Accept
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>
