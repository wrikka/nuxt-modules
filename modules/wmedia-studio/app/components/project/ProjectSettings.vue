<script setup lang="ts">
import type { ProjectSettings } from "#shared/types/project";
import { ref, watch } from "vue";

const props = defineProps<{
	settings: ProjectSettings;
	loading?: boolean;
}>();

const emit = defineEmits<{
	save: [settings: ProjectSettings];
	cancel: [];
}>();

const localSettings = ref<ProjectSettings>({ ...props.settings });

watch(
	() => props.settings,
	(newSettings) => {
		localSettings.value = { ...newSettings };
	},
	{ deep: true },
);

const handleSave = () => {
	emit("save", localSettings.value);
};
</script>

<template>
	<div class="project-settings space-y-6">
		<div>
			<h3 class="text-lg font-semibold text-gray-900 dark:text-white">
				Canvas Settings
			</h3>
			<div class="mt-4 grid grid-cols-2 gap-4">
				<div>
					<label
						for="canvasWidth"
						class="block text-sm font-medium text-gray-700 dark:text-gray-300"
					>Width</label>
					<input
						id="canvasWidth"
						v-model.number="localSettings.width"
						type="number"
						min="100"
						class="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
					/>
				</div>
				<div>
					<label
						for="canvasHeight"
						class="block text-sm font-medium text-gray-700 dark:text-gray-300"
					>Height</label>
					<input
						id="canvasHeight"
						v-model.number="localSettings.height"
						type="number"
						min="100"
						class="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
					/>
				</div>
			</div>
		</div>

		<div>
			<h3 class="text-lg font-semibold text-gray-900 dark:text-white">
				Editor Settings
			</h3>
			<div class="mt-4 space-y-4">
				<div class="flex items-center justify-between">
					<label
						for="snapToGrid"
						class="text-sm font-medium text-gray-700 dark:text-gray-300"
					>Snap to Grid</label>
					<input
						id="snapToGrid"
						v-model="localSettings.snapToGrid"
						type="checkbox"
						class="rounded border-gray-300 text-blue-600 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700"
					/>
				</div>
				<div>
					<label
						for="gridSize"
						class="block text-sm font-medium text-gray-700 dark:text-gray-300"
					>Grid Size</label>
					<input
						id="gridSize"
						v-model.number="localSettings.gridSize"
						type="number"
						min="1"
						class="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
					/>
				</div>
				<div class="flex items-center justify-between">
					<label
						for="showGuides"
						class="text-sm font-medium text-gray-700 dark:text-gray-300"
					>Show Guides</label>
					<input
						id="showGuides"
						v-model="localSettings.showGuides"
						type="checkbox"
						class="rounded border-gray-300 text-blue-600 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700"
					/>
				</div>
				<div class="flex items-center justify-between">
					<label
						for="showRulers"
						class="text-sm font-medium text-gray-700 dark:text-gray-300"
					>Show Rulers</label>
					<input
						id="showRulers"
						v-model="localSettings.showRulers"
						type="checkbox"
						class="rounded border-gray-300 text-blue-600 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700"
					/>
				</div>
			</div>
		</div>

		<div>
			<h3 class="text-lg font-semibold text-gray-900 dark:text-white">
				Auto Save
			</h3>
			<div class="mt-4 space-y-4">
				<div class="flex items-center justify-between">
					<label
						for="autoSave"
						class="text-sm font-medium text-gray-700 dark:text-gray-300"
					>Enable Auto Save</label>
					<input
						id="autoSave"
						v-model="localSettings.autoSave"
						type="checkbox"
						class="rounded border-gray-300 text-blue-600 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700"
					/>
				</div>
				<div>
					<label
						for="autoSaveInterval"
						class="block text-sm font-medium text-gray-700 dark:text-gray-300"
					>Auto Save Interval (seconds)</label>
					<input
						id="autoSaveInterval"
						v-model.number="localSettings.autoSaveInterval"
						type="number"
						min="10"
						class="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
					/>
				</div>
			</div>
		</div>

		<div class="flex justify-end gap-3">
			<button
				type="button"
				@click="$emit('cancel')"
				class="rounded-md border border-gray-300 px-4 py-2 text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700"
			>
				Cancel
			</button>
			<button
				type="button"
				@click="handleSave"
				:disabled="loading"
				class="rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 disabled:opacity-50 disabled:hover:bg-blue-600"
			>
				<i v-if="loading" class="i-mdi-loading animate-spin mr-2" />
				{{ loading ? "Saving..." : "Save Settings" }}
			</button>
		</div>
	</div>
</template>
