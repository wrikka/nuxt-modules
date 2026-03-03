<script setup lang="ts">
export interface SmartGuide {
	type: "center" | "edge" | "spacing";
	direction: "horizontal" | "vertical";
	position: number;
	targetObject?: string;
	distance?: number;
}

const props = defineProps<{
	enabled: boolean;
	showDistances: boolean;
	snapToObjects: boolean;
	snapToGrid: boolean;
	snapToGuides: boolean;
	guides: SmartGuide[];
}>();

const emit = defineEmits<{
	(e: "update:enabled", value: boolean): void;
	(e: "update:showDistances", value: boolean): void;
	(e: "update:snapToObjects", value: boolean): void;
	(e: "update:snapToGrid", value: boolean): void;
	(e: "update:snapToGuides", value: boolean): void;
	(e: "clearGuides"): void;
}>();
</script>

<template>
	<div class="space-y-3">
		<div class="flex items-center justify-between">
			<label class="text-sm font-medium text-gray-700 dark:text-gray-300"
			>Smart Guides</label>
			<label class="relative inline-flex items-center cursor-pointer">
				<input
					type="checkbox"
					:checked="enabled"
					class="sr-only peer"
					@change="$emit('update:enabled', ($event.target as HTMLInputElement).checked)"
				>
				<div class="w-9 h-5 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-blue-300 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600" />
			</label>
		</div>

		<div
			v-if="enabled"
			class="space-y-2 pl-2 border-l-2 border-gray-200 dark:border-gray-600"
		>
			<div class="flex items-center justify-between">
				<label class="text-xs text-gray-600 dark:text-gray-400"
				>Show Distances</label>
				<label class="relative inline-flex items-center cursor-pointer">
					<input
						type="checkbox"
						:checked="showDistances"
						class="sr-only peer"
						@change="$emit(
							'update:showDistances',
							($event.target as HTMLInputElement).checked,
						)"
					>
					<div class="w-7 h-4 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-blue-300 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-3 after:w-3 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600" />
				</label>
			</div>

			<div class="flex items-center justify-between">
				<label class="text-xs text-gray-600 dark:text-gray-400"
				>Snap to Objects</label>
				<label class="relative inline-flex items-center cursor-pointer">
					<input
						type="checkbox"
						:checked="snapToObjects"
						class="sr-only peer"
						@change="$emit(
							'update:snapToObjects',
							($event.target as HTMLInputElement).checked,
						)"
					>
					<div class="w-7 h-4 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-blue-300 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-3 after:w-3 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600" />
				</label>
			</div>

			<div class="flex items-center justify-between">
				<label class="text-xs text-gray-600 dark:text-gray-400"
				>Snap to Grid</label>
				<label class="relative inline-flex items-center cursor-pointer">
					<input
						type="checkbox"
						:checked="snapToGrid"
						class="sr-only peer"
						@change="$emit(
							'update:snapToGrid',
							($event.target as HTMLInputElement).checked,
						)"
					>
					<div class="w-7 h-4 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-blue-300 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-3 after:w-3 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600" />
				</label>
			</div>

			<div class="flex items-center justify-between">
				<label class="text-xs text-gray-600 dark:text-gray-400"
				>Snap to Guides</label>
				<label class="relative inline-flex items-center cursor-pointer">
					<input
						type="checkbox"
						:checked="snapToGuides"
						class="sr-only peer"
						@change="$emit(
							'update:snapToGuides',
							($event.target as HTMLInputElement).checked,
						)"
					>
					<div class="w-7 h-4 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-blue-300 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-3 after:w-3 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600" />
				</label>
			</div>

			<div class="flex items-center justify-between pt-2 border-t border-gray-200 dark:border-gray-700">
				<span class="text-xs text-gray-500">Active Guides: {{
						guides.length
					}}</span>
				<button
					type="button"
					class="text-xs text-red-500 hover:text-red-600"
					@click="$emit('clearGuides')"
				>
					Clear
				</button>
			</div>
		</div>

		<div class="flex items-center gap-2 p-2 bg-blue-50 dark:bg-blue-900/20 rounded">
			<svg
				class="w-4 h-4 text-blue-500"
				fill="none"
				stroke="currentColor"
				viewBox="0 0 24 24"
			>
				<path
					stroke-linecap="round"
					stroke-linejoin="round"
					stroke-width="2"
					d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
				/>
			</svg>
			<span class="text-xs text-blue-600 dark:text-blue-400">
				Hold <kbd class="px-1 bg-white dark:bg-gray-800 rounded">Ctrl</kbd> to
				temporarily disable snapping
			</span>
		</div>
	</div>
</template>
