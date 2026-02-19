<script setup lang="ts">
import { computed } from 'vue';

interface StepNode {
  id: string;
  title: string;
  completed: boolean;
  skipped: boolean;
  dependsOn?: string[];
  position: { x: number; y: number };
}

interface Props {
  steps?: StepNode[];
  show?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  steps: () => [],
  show: true,
});

const emit = defineEmits<{
  'step-click': [stepId: string];
  close: [];
}>();

const connections = computed(() => {
  const conns: Array<{ from: StepNode; to: StepNode }> = [];
  for (const step of props.steps) {
    for (const depId of step.dependsOn || []) {
      const depStep = props.steps.find(s => s.id === depId);
      if (depStep) {
        conns.push({ from: depStep, to: step });
      }
    }
  }
  return conns;
});

const getNodeColor = (step: StepNode): string => {
  if (step.completed) return 'bg-green-500 border-green-600';
  if (step.skipped) return 'bg-yellow-500 border-yellow-600';
  return 'bg-blue-500 border-blue-600';
};

const getNodeStatusIcon = (step: StepNode): string => {
  if (step.completed) return '✓';
  if (step.skipped) return '→';
  return '○';
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
        <div class="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-4xl w-full overflow-hidden">
          <div class="p-6">
            <div class="flex items-center justify-between mb-6">
              <div class="flex items-center gap-3">
                <div class="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
                  <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                  </svg>
                </div>
                <div>
                  <h3 class="text-xl font-bold text-gray-900 dark:text-white">
                    Step Dependencies
                  </h3>
                  <p class="text-sm text-gray-500 dark:text-gray-400">
                    Visualize step relationships
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

            <div class="relative bg-gray-50 dark:bg-gray-700/50 rounded-xl p-6 min-h-[400px] overflow-auto">
              <svg class="absolute inset-0 w-full h-full pointer-events-none">
                <defs>
                  <marker id="arrowhead" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
                    <polygon points="0 0, 10 3.5, 0 7" fill="#6B7280" />
                  </marker>
                </defs>
                <line
                  v-for="(conn, index) in connections"
                  :key="`conn-${index}`"
                  :x1="conn.from.position.x + 80"
                  :y1="conn.from.position.y + 40"
                  :x2="conn.to.position.x"
                  :y2="conn.to.position.y + 40"
                  stroke="#6B7280"
                  stroke-width="2"
                  stroke-dasharray="5,5"
                  marker-end="url(#arrowhead)"
                />
              </svg>

              <div
                v-for="step in steps"
                :key="step.id"
                class="absolute cursor-pointer transition-all hover:scale-105"
                :style="{
                  left: `${step.position.x}px`,
                  top: `${step.position.y}px`,
                }"
                @click="emit('step-click', step.id)"
              >
                <div
                  class="w-40 p-3 rounded-xl border-2 shadow-lg"
                  :class="getNodeColor(step)"
                >
                  <div class="flex items-center gap-2 mb-2">
                    <div class="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center text-white font-bold">
                      {{ getNodeStatusIcon(step) }}
                    </div>
                    <span class="text-white font-medium text-sm truncate">
                      {{ step.title }}
                    </span>
                  </div>
                  <div v-if="step.dependsOn && step.dependsOn.length > 0" class="text-xs text-white/80">
                    Depends on: {{ step.dependsOn.length }} step{{ step.dependsOn.length !== 1 ? 's' : '' }}
                  </div>
                </div>
              </div>
            </div>

            <div class="flex gap-4 mt-4">
              <div class="flex items-center gap-2">
                <div class="w-4 h-4 bg-green-500 rounded" />
                <span class="text-sm text-gray-600 dark:text-gray-400">Completed</span>
              </div>
              <div class="flex items-center gap-2">
                <div class="w-4 h-4 bg-yellow-500 rounded" />
                <span class="text-sm text-gray-600 dark:text-gray-400">Skipped</span>
              </div>
              <div class="flex items-center gap-2">
                <div class="w-4 h-4 bg-blue-500 rounded" />
                <span class="text-sm text-gray-600 dark:text-gray-400">Pending</span>
              </div>
              <div class="flex items-center gap-2">
                <div class="w-8 h-0.5 bg-gray-400" style="background-image: repeating-linear-gradient(to right, #6B7280 0, #6B7280 5px, transparent 5px, transparent 10px)" />
                <span class="text-sm text-gray-600 dark:text-gray-400">Dependency</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>
