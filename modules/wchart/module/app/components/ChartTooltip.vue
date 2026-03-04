<script setup lang="ts">
import type { DataPoint } from "../types/chart";

interface Props {
	data: DataPoint | null;
	visible: boolean;
	x: number;
	y: number;
	theme?: "light" | "dark";
}

const props = withDefaults(defineProps<Props>(), {
	theme: "light",
});
</script>

<template>
  <div
    v-if="visible && data"
    class="fixed pointer-events-none z-1000 -translate-x-1/2 -translate-y-full -mt-2"
    :style="{ left: x + 'px', top: y + 'px' }"
  >
    <div class="bg-white border border-gray-300 rounded px-2 py-1 text-sm min-w-32" :class="theme === 'dark' ? 'bg-gray-900 border-gray-600 text-white' : ''">
      <div v-if="data.x !== undefined" class="flex justify-between gap-4 mb-1 last:mb-0">
        <span class="font-medium opacity-80">X:</span>
        <span class="font-semibold">{{ data.x }}</span>
      </div>
      <div v-if="data.y !== undefined" class="flex justify-between gap-4 mb-1 last:mb-0">
        <span class="font-medium opacity-80">Y:</span>
        <span class="font-semibold">{{ data.y }}</span>
      </div>
      <div v-if="data.label" class="flex justify-between gap-4 mb-1 last:mb-0">
        <span class="font-medium opacity-80">Label:</span>
        <span class="font-semibold">{{ data.label }}</span>
      </div>
    </div>
  </div>
</template>
