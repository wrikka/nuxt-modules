<script setup lang="ts">
export interface SpacingMeasurement {
	type: "object-to-object" | "object-to-canvas" | "spacing-between";
	from: string;
	to: string;
	distance: number;
	direction: "horizontal" | "vertical";
	position: { x: number; y: number };
}

const props = defineProps<{
	measurements: SpacingMeasurement[];
	enabled: boolean;
	showDimensions: boolean;
}>();

const emit = defineEmits<{
	(e: "update:enabled", value: boolean): void;
	(e: "update:showDimensions", value: boolean): void;
	(e: "clear"): void;
}>();

const formatDistance = (px: number): string => {
	if (px < 10) return `${px.toFixed(1)}px`;
	return `${Math.round(px)}px`;
};

const getMeasurementLabel = (m: SpacingMeasurement): string => {
	switch (m.type) {
		case "object-to-object":
			return "Object spacing";
		case "object-to-canvas":
			return "Canvas edge";
		case "spacing-between":
			return "Gap";
		default:
			return "Distance";
	}
};
</script>

<template>
	<div class="space-y-3">
		<div class="flex items-center justify-between">
			<label class="text-sm font-medium text-gray-700 dark:text-gray-300"
			>Smart Spacing</label>
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
				>Show Dimensions</label>
				<label class="relative inline-flex items-center cursor-pointer">
					<input
						type="checkbox"
						:checked="showDimensions"
						class="sr-only peer"
						@change="$emit(
							'update:showDimensions',
							($event.target as HTMLInputElement).checked,
						)"
					>
					<div class="w-7 h-4 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-blue-300 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-3 after:w-3 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600" />
				</label>
			</div>

			<div class="flex items-center justify-between pt-2 border-t border-gray-200 dark:border-gray-700">
				<span class="text-xs text-gray-500">Active: {{
						measurements.length
					}}</span>
				<button
					type="button"
					class="text-xs text-red-500 hover:text-red-600"
					@click="$emit('clear')"
				>
					Clear
				</button>
			</div>
		</div>

		<div
			v-if="measurements.length > 0"
			class="space-y-1 max-h-32 overflow-y-auto"
		>
			<div
				v-for="(m, i) in measurements"
				:key="i"
				class="flex items-center justify-between p-2 rounded bg-gray-50 dark:bg-gray-800 text-xs"
			>
				<div class="flex items-center gap-2">
					<svg
						class="w-3 h-3 text-blue-500"
						fill="none"
						stroke="currentColor"
						viewBox="0 0 24 24"
					>
						<path
							v-if="m.direction === 'horizontal'"
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M20 12H4"
						/>
						<path
							v-else
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M12 20V4"
						/>
					</svg>
					<span class="text-gray-600 dark:text-gray-400">{{
						getMeasurementLabel(m)
					}}</span>
				</div>
				<span class="font-medium text-gray-700 dark:text-gray-300">{{
					formatDistance(m.distance)
				}}</span>
			</div>
		</div>

		<div class="flex items-center gap-2 p-2 bg-blue-50 dark:bg-blue-900/20 rounded text-xs">
			<svg
				class="w-4 h-4 text-blue-500 flex-shrink-0"
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
			<span class="text-blue-600 dark:text-blue-400">
				Hold <kbd class="px-1 bg-white dark:bg-gray-800 rounded">Alt</kbd> to
				see spacing between objects
			</span>
		</div>
	</div>
</template>
