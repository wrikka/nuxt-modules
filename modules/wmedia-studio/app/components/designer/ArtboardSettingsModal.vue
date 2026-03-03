<script setup lang="ts">
interface Artboard {
	width: number;
	height: number;
}

interface Preset {
	name: string;
	width: number;
	height: number;
}

interface Props {
	isOpen: boolean;
	artboard: Artboard;
}

defineProps<Props>();

defineEmits<{
	close: [];
	"update:artboard": [artboard: Artboard];
	apply: [];
}>();

const presets: Preset[] = [
	{ name: "Instagram Post", width: 1080, height: 1080 },
	{ name: "Instagram Story", width: 1080, height: 1920 },
	{ name: "Twitter Post", width: 1200, height: 675 },
	{ name: "Facebook Post", width: 1200, height: 630 },
	{ name: "A4", width: 2480, height: 3508 },
	{ name: "1080p", width: 1920, height: 1080 },
	{ name: "4K", width: 3840, height: 2160 },
];

const selectedPreset = ref<string | null>(null);

const selectPreset = (preset: Preset) => {
	selectedPreset.value = preset.name;
};
</script>

<template>
	<Modal :show="isOpen" size="md" @close="$emit('close')">
		<template #title>Artboard Settings</template>
		<div class="space-y-4">
			<div>
				<label
					class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
				>Presets</label>
				<div class="grid grid-cols-2 gap-2">
					<button
						v-for="preset in presets"
						:key="preset.name"
						class="px-3 py-2 text-sm rounded border transition-colors"
						:class="selectedPreset === preset.name
						? 'border-blue-500 bg-blue-50 dark:bg-blue-900'
						: 'border-gray-300 dark:border-gray-600 hover:border-gray-400'"
						@click="selectPreset(preset)"
					>
						{{ preset.name }}
					</button>
				</div>
			</div>
			<div class="grid grid-cols-2 gap-4">
				<div>
					<label
						class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
					>Width</label>
					<input
						:model-value="artboard.width"
						type="number"
						class="w-full rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-3 py-2"
						@update:model-value="$emit('update:artboard', { ...artboard, width: $event })"
					>
				</div>
				<div>
					<label
						class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
					>Height</label>
					<input
						:model-value="artboard.height"
						type="number"
						class="w-full rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-3 py-2"
						@update:model-value="$emit('update:artboard', { ...artboard, height: $event })"
					>
				</div>
			</div>
		</div>
		<template #footer>
			<div class="flex justify-end gap-2">
				<button
					class="px-4 py-2 text-sm rounded border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700"
					@click="$emit('close')"
				>
					Cancel
				</button>
				<button
					class="px-4 py-2 text-sm rounded bg-blue-600 text-white hover:bg-blue-700"
					@click="$emit('apply')"
				>
					Apply
				</button>
			</div>
		</template>
	</Modal>
</template>
