<script setup lang="ts">
import { computed } from "vue";
import { useDiff } from "../composables/useDiff";

interface Props {
	oldObj: Record<string, unknown>;
	newObj: Record<string, unknown>;
	title?: string;
}

const props = withDefaults(defineProps<Props>(), {
	title: "Side-by-Side Diff",
});

const { diffResult } = useDiff(props.oldObj, props.newObj);

const _allKeys = computed(() => {
	const keys = new Set([
		...Object.keys(props.oldObj),
		...Object.keys(props.newObj),
	]);
	return Array.from(keys).sort();
});

const getChangeType = (key: string) => {
	if (key in diffResult.value.added) return "added";
	if (key in diffResult.value.deleted) return "deleted";
	if (key in diffResult.value.updated) return "updated";
	return "common";
};

const _getOldValue = (key: string) => {
	if (key in props.oldObj) return props.oldObj[key];
	return undefined;
};

const _getNewValue = (key: string) => {
	if (key in props.newObj) return props.newObj[key];
	return undefined;
};

const _getRowClasses = (key: string) => {
	const type = getChangeType(key);
	switch (type) {
		case "added":
			return "bg-green-50 border-green-200";
		case "deleted":
			return "bg-red-50 border-red-200";
		case "updated":
			return "bg-yellow-50 border-yellow-200";
		default:
			return "bg-white";
	}
};

function _formatValue(value: unknown): string {
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
  <div class="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">
    <div v-if="title" class="px-4 py-3 bg-gray-50 border-b border-gray-200">
      <h3 class="text-lg font-semibold text-gray-900 m-0">{{ title }}</h3>
    </div>

    <div class="overflow-x-auto">
      <table class="w-full">
        <thead class="bg-gray-50 border-b border-gray-200">
          <tr>
            <th class="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-1/2">
              Old
            </th>
            <th class="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-l border-gray-200 w-1/2">
              New
            </th>
          </tr>
        </thead>
        <tbody class="divide-y divide-gray-200">
          <tr
            v-for="key in _allKeys"
            :key="key"
            :class="_getRowClasses(key)"
          >
            <td class="px-4 py-2 align-top">
              <div class="font-mono text-sm">
                <div class="font-medium text-gray-900 mb-1">{{ key }}</div>
                <div class="text-gray-700 break-all">{{ _formatValue(_getOldValue(key)) }}</div>
              </div>
            </td>
            <td class="px-4 py-2 align-top border-l border-gray-200">
              <div class="font-mono text-sm">
                <div class="font-medium text-gray-900 mb-1">{{ key }}</div>
                <div class="text-gray-700 break-all">{{ _formatValue(_getNewValue(key)) }}</div>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>
