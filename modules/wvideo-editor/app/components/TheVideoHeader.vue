<script setup lang="ts">
import { useVideoProjectManagement } from "~/composables/useVideoProjectManagement";
import { useVideoStore } from "~/stores/video";

const videoStore = useVideoStore();
const { currentVideoProject } = storeToRefs(videoStore);
const { saveProject, getProjectInfo } = useVideoProjectManagement();

const projectInfo = computed(() => getProjectInfo.value);

const save = async () => {
	await saveProject();
};

const isExporting = ref(false);

const exportVideo = async () => {
	if (!currentVideoProject.value) return;
	isExporting.value = true;
	try {
		const response = await $fetch(
			`/api/video-projects/${currentVideoProject.value.id}/export`,
			{
				method: "POST",
				body: {
					resolution: "1080p",
					quality: "high",
					format: "mp4",
				},
			},
		);
		alert(`Export successful! Download here: ${response.data.url}`);
	} catch (error) {
		console.error("Export failed:", error);
		alert("Export failed. Please check the console for details.");
	} finally {
		isExporting.value = false;
	}
};
</script>

<template>
	<header class="h-14 bg-gray-900 border-b border-gray-700 flex items-center justify-between px-4">
		<div class="flex items-center gap-4">
			<NuxtLink
				to="/"
				class="text-gray-400 hover:text-white"
			>
				← Back
			</NuxtLink>
			<h1 class="text-white font-semibold">
				{{ currentVideoProject?.name || "Video Editor" }}
			</h1>
		</div>

		<div class="flex items-center gap-2">
			<button
				class="px-4 py-2 bg-gray-800 hover:bg-gray-700 text-white rounded text-sm font-medium"
				@click="saveProject"
			>
				Save
			</button>
			<button
				class="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded text-sm font-medium disabled:bg-blue-400 disabled:cursor-not-allowed"
				@click="exportVideo"
				:disabled="isExporting"
			>
				{{ isExporting ? "Exporting..." : "Export" }}
			</button>
		</div>
	</header>
</template>
