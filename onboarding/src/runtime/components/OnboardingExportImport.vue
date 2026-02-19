<script setup lang="ts">
import { ref } from 'vue';

interface ProgressData {
  steps: Array<{
    id: string;
    completed: boolean;
    skipped: boolean;
  }>;
  progress: {
    started: boolean;
    completed: boolean;
    percentage: number;
  };
  gamification?: {
    points: number;
    badges: Array<{
      id: string;
      name: string;
    }>;
  };
}

interface Props {
  data?: ProgressData;
  show?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  data: () => ({
    steps: [],
    progress: { started: false, completed: false, percentage: 0 },
  }),
  show: true,
});

const emit = defineEmits<{
  export: [];
  import: [data: ProgressData];
  close: [];
}>();

const activeTab = ref<'export' | 'import'>('export');
const importData = ref('');

const handleImport = () => {
  try {
    const parsed = JSON.parse(importData.value);
    emit('import', parsed);
    importData.value = '';
  } catch {
    alert('Invalid JSON format');
  }
};

const copyToClipboard = () => {
  const dataStr = JSON.stringify(props.data, null, 2);
  navigator.clipboard.writeText(dataStr);
};

const downloadFile = () => {
  const dataStr = JSON.stringify(props.data, null, 2);
  const blob = new Blob([dataStr], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `onboarding-progress-${new Date().toISOString().split('T')[0]}.json`;
  a.click();
  URL.revokeObjectURL(url);
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
        class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
      >
        <div class="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-2xl w-full overflow-hidden">
          <div class="p-6">
            <div class="flex items-center justify-between mb-6">
              <div class="flex items-center gap-3">
                <div class="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
                  <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
                  </svg>
                </div>
                <div>
                  <h3 class="text-xl font-bold text-gray-900 dark:text-white">
                    Export / Import Progress
                  </h3>
                  <p class="text-sm text-gray-500 dark:text-gray-400">
                    Save or restore your onboarding progress
                  </p>
                </div>
              </div>
              <button
                class="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                @click="emit('close')"
              >
                <svg class="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div class="mb-4">
              <div class="flex gap-2">
                <button
                  class="flex-1 py-2 px-4 rounded-lg font-medium transition-colors"
                  :class="activeTab === 'export' ? 'bg-blue-500 text-white' : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'"
                  @click="activeTab = 'export'"
                >
                  Export
                </button>
                <button
                  class="flex-1 py-2 px-4 rounded-lg font-medium transition-colors"
                  :class="activeTab === 'import' ? 'bg-blue-500 text-white' : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'"
                  @click="activeTab = 'import'"
                >
                  Import
                </button>
              </div>
            </div>

            <div v-if="activeTab === 'export'" class="space-y-4">
              <div class="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-4">
                <div class="flex items-center justify-between mb-3">
                  <p class="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Progress Data (JSON)
                  </p>
                  <button
                    class="text-sm text-blue-500 hover:text-blue-600 transition-colors"
                    @click="copyToClipboard"
                  >
                    Copy
                  </button>
                </div>
                <pre class="text-xs bg-gray-100 dark:bg-gray-800 rounded-lg p-3 overflow-x-auto"><code>{{ JSON.stringify(data, null, 2) }}</code></pre>
              </div>

              <div class="grid grid-cols-2 gap-3">
                <button
                  class="py-3 px-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-medium rounded-xl hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
                  @click="downloadFile"
                >
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                  </svg>
                  Download
                </button>
                <button
                  class="py-3 px-4 border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 font-medium rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors flex items-center justify-center gap-2"
                  @click="copyToClipboard"
                >
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                  Copy
                </button>
              </div>

              <div class="flex items-start gap-3 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl">
                <svg class="w-5 h-5 text-blue-500 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <p class="text-sm text-gray-600 dark:text-gray-400">
                  Export your progress to backup or share with other devices. The data includes steps, progress, and achievements.
                </p>
              </div>
            </div>

            <div v-if="activeTab === 'import'" class="space-y-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Paste Progress Data
                </label>
                <textarea
                  v-model="importData"
                  rows="8"
                  placeholder="Paste your exported JSON data here..."
                  class="w-full px-4 py-3 bg-gray-100 dark:bg-gray-700 border-0 rounded-xl text-gray-900 dark:text-white placeholder-gray-500 focus:ring-2 focus:ring-blue-500 transition-all resize-none"
                />
              </div>

              <button
                class="w-full py-3 px-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-medium rounded-xl hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
                :disabled="!importData.trim()"
                @click="handleImport"
              >
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                </svg>
                Import Progress
              </button>

              <div class="flex items-start gap-3 p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-xl">
                <svg class="w-5 h-5 text-yellow-500 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
                <p class="text-sm text-gray-600 dark:text-gray-400">
                  Importing will replace your current progress. Make sure to backup before importing.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>
