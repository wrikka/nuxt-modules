<script setup lang="ts">
import { computed } from "vue";

interface Props {
	type: "added" | "deleted" | "updated";
	items: Record<string, unknown>;
	icon: string;
	label: string;
}

const props = defineProps<Props>();

const headerClasses = computed(() => {
	switch (props.type) {
		case "added":
			return "bg-green-50 text-green-800 border-b border-green-200";
		case "deleted":
			return "bg-red-50 text-red-800 border-b border-red-200";
		case "updated":
			return "bg-blue-50 text-blue-800 border-b border-blue-200";
		default:
			return "";
	}
});

const itemClasses = computed(() => {
	switch (props.type) {
		case "added":
			return "bg-green-25";
		case "deleted":
			return "bg-red-25";
		case "updated":
			return "bg-blue-25";
		default:
			return "";
	}
});

function formatValue(value: unknown): string {
	if (value === null) return "null";
	if (value === undefined) return "undefined";
	if (typeof value === "string") return `"${value}"`;
	if (typeof value === "object") {
		try {
			return JSON.stringify(value, null, 2);
		} catch {
			return String(value);
		}
	}
	return String(value);
}
</script>

<template>
  <div class="border border-gray-200 rounded-md overflow-hidden">
    <div :class="`px-3 py-2 flex items-center gap-2 font-medium ${headerClasses}`">
      <span class="text-sm">{{ props.icon }}</span>
      <span class="text-sm">{{ props.label }} ({{ Object.keys(props.items).length }})</span>
    </div>
    <div class="divide-y divide-gray-100">
      <div
        v-for="(value, key) in props.items"
        :key="`${props.type}-${key}`"
        :class="`px-3 py-2 flex justify-between items-start gap-4 ${itemClasses}`"
      >
        <div class="font-mono text-sm text-gray-900 font-medium flex-shrink-0 min-w-0">{{ key }}</div>
        <div class="font-mono text-sm text-gray-700 flex-1 text-right break-all">{{ formatValue(value) }}</div>
      </div>
    </div>
  </div>
</template>
