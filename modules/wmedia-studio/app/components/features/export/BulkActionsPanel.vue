<script setup lang="ts">
interface Props {
	selectedCount: number;
	selectedTypes: string[];
}

const props = defineProps<Props>();
const emit = defineEmits<{
	apply: [action: string, value: unknown];
	close: [];
}>();

const isOpen = computed(() => props.selectedCount > 1);

const actions = [
	{ id: "align-left", name: "Align Left", icon: "mdi:format-align-left" },
	{ id: "align-center", name: "Align Center", icon: "mdi:format-align-center" },
	{ id: "align-right", name: "Align Right", icon: "mdi:format-align-right" },
	{
		id: "distribute-h",
		name: "Distribute H",
		icon: "mdi:align-horizontal-distribute",
	},
	{
		id: "distribute-v",
		name: "Distribute V",
		icon: "mdi:align-vertical-distribute",
	},
];

const bulkProperties = [
	{
		id: "opacity",
		name: "Opacity",
		type: "slider",
		min: 0,
		max: 100,
		default: 100,
	},
	{
		id: "blendMode",
		name: "Blend Mode",
		type: "select",
		options: ["normal", "multiply", "screen", "overlay"],
		default: "normal",
	},
	{
		id: "rotation",
		name: "Rotation",
		type: "number",
		min: 0,
		max: 360,
		default: 0,
	},
];

const propertyValues = ref<Record<string, unknown>>({});
</script>

<template>
	<div
		v-if="isOpen"
		class="fixed top-20 left-1/2 -translate-x-1/2 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl shadow-2xl z-50 flex items-center gap-2 px-4 py-3"
	>
		<!-- Selection Count -->
		<div class="flex items-center gap-2 pr-4 border-r border-gray-200 dark:border-gray-700">
			<span
				class="w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-medium"
			>
				{{ selectedCount }}
			</span>
			<span class="text-sm text-gray-600 dark:text-gray-400"
			>items selected</span>
		</div>

		<!-- Quick Actions -->
		<div class="flex items-center gap-1 px-2">
			<button
				v-for="action in actions"
				:key="action.id"
				class="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
				:title="action.name"
				@click="emit('apply', action.id, null)"
			>
				<Icon
					:name="action.icon"
					class="w-4 h-4 text-gray-600 dark:text-gray-400"
				/>
			</button>
		</div>

		<!-- Properties -->
		<div class="flex items-center gap-3 px-2 border-l border-gray-200 dark:border-gray-700">
			<div class="flex items-center gap-2">
				<label class="text-xs text-gray-500 dark:text-gray-400">Opacity</label>
				<input
					type="range"
					min="0"
					max="100"
					value="100"
					class="w-20 h-1 bg-gray-200 rounded-lg appearance-none cursor-pointer"
					@change="emit('apply', 'opacity', ($event.target as HTMLInputElement).value)"
				>
			</div>

			<select
				class="px-2 py-1 bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded text-xs dark:text-white"
				@change="emit('apply', 'blendMode', ($event.target as HTMLSelectElement).value)"
			>
				<option value="normal">Normal</option>
				<option value="multiply">Multiply</option>
				<option value="screen">Screen</option>
				<option value="overlay">Overlay</option>
			</select>
		</div>

		<!-- Close -->
		<button
			class="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
			@click="emit('close')"
		>
			<Icon name="mdi:close" class="w-4 h-4 text-gray-500" />
		</button>
	</div>
</template>
