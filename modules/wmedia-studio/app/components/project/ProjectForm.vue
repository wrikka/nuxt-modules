<script setup lang="ts">
import type { ProjectType } from "#shared/types/project";
import { ref } from "vue";

const props = defineProps<{
	loading?: boolean;
}>();

const emit = defineEmits<{
	submit: [data: {
		name: string;
		description?: string;
		type: ProjectType;
		width: number;
		height: number;
		backgroundColor: string;
	}];
	cancel: [];
}>();

const formData = ref({
	name: "",
	description: "",
	type: "designer" as ProjectType,
	width: 1920,
	height: 1080,
	backgroundColor: "#ffffff",
});

const handleSubmit = () => {
	emit("submit", {
		name: formData.value.name,
		description: formData.value.description || undefined,
		type: formData.value.type,
		width: formData.value.width,
		height: formData.value.height,
		backgroundColor: formData.value.backgroundColor,
	});
};
</script>

<template>
	<form @submit.prevent="handleSubmit" class="project-form space-y-6">
		<div>
			<label
				for="name"
				class="block text-sm font-medium text-gray-700 dark:text-gray-300"
			>Project Name</label>
			<input
				id="name"
				v-model="formData.name"
				type="text"
				required
				placeholder="Enter project name"
				class="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
			/>
		</div>

		<div>
			<label
				for="description"
				class="block text-sm font-medium text-gray-700 dark:text-gray-300"
			>Description</label>
			<textarea
				id="description"
				v-model="formData.description"
				rows="3"
				placeholder="Enter project description"
				class="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
			/>
		</div>

		<div>
			<label
				for="type"
				class="block text-sm font-medium text-gray-700 dark:text-gray-300"
			>Project Type</label>
			<select
				id="type"
				v-model="formData.type"
				required
				class="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
			>
				<option value="designer">Designer</option>
				<option value="audio-editor">Audio Editor</option>
				<option value="video-editor">Video Editor</option>
				<option value="video-recording">Video Recording</option>
			</select>
		</div>

		<div class="grid grid-cols-2 gap-4">
			<div>
				<label
					for="width"
					class="block text-sm font-medium text-gray-700 dark:text-gray-300"
				>Width</label>
				<input
					id="width"
					v-model.number="formData.width"
					type="number"
					required
					min="100"
					placeholder="1920"
					class="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
				/>
			</div>
			<div>
				<label
					for="height"
					class="block text-sm font-medium text-gray-700 dark:text-gray-300"
				>Height</label>
				<input
					id="height"
					v-model.number="formData.height"
					type="number"
					required
					min="100"
					placeholder="1080"
					class="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
				/>
			</div>
		</div>

		<div>
			<label
				for="backgroundColor"
				class="block text-sm font-medium text-gray-700 dark:text-gray-300"
			>Background Color</label>
			<div class="mt-1 flex items-center gap-2">
				<input
					id="backgroundColor"
					v-model="formData.backgroundColor"
					type="color"
					class="h-10 w-16 rounded border border-gray-300"
				/>
				<input
					v-model="formData.backgroundColor"
					type="text"
					placeholder="#ffffff"
					class="flex-1 rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
				/>
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
				type="submit"
				:disabled="loading"
				class="rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 disabled:opacity-50 disabled:hover:bg-blue-600"
			>
				<i v-if="loading" class="i-mdi-loading animate-spin mr-2" />
				{{ loading ? "Creating..." : "Create Project" }}
			</button>
		</div>
	</form>
</template>
