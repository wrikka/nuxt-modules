<script setup lang="ts">
import type { DiffResult } from "../types/diff";
import { useUnifiedDiff } from "../composables/useUnifiedDiff";

interface Props {
	diff: DiffResult;
	title?: string;
	contextLines?: number;
}

const props = withDefaults(defineProps<Props>(), {
	contextLines: 3,
});

const { unifiedDiff: _unifiedDiff } = useUnifiedDiff(props.diff, {
	contextLines: props.contextLines,
	title: props.title,
});
</script>

<template>
  <div class="bg-gray-900 border border-gray-700 rounded-lg shadow-lg overflow-hidden">
    <div v-if="title" class="px-4 py-3 bg-gray-800 border-b border-gray-700">
      <h3 class="text-lg font-semibold text-gray-100 m-0">{{ title }}</h3>
    </div>

    <div class="p-4">
      <pre class="text-sm font-mono leading-relaxed m-0 text-[#e5e7eb]"><code class="block whitespace-pre-wrap break-all">{{ _unifiedDiff }}</code></pre>
    </div>
  </div>
</template>

<style scoped>
/* Syntax highlighting for diff */
.diff-code :deep(.hljs-addition) {
  background-color: rgb(20 83 45 / 0.5);
  color: rgb(134 239 172);
}

.diff-code :deep(.hljs-deletion) {
  background-color: rgb(127 29 29 / 0.5);
  color: rgb(252 165 165);
}

.diff-code :deep(.hljs-section) {
  color: rgb(147 197 253);
  font-weight: 600;
}
</style>
