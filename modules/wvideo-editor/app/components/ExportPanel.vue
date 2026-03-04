<script setup lang="ts">
import { useMediaBunny } from "~/composables/useMediaBunny";
import { useVideoStore } from "~/stores/video";

const videoStore = useVideoStore();
const { currentVideoProject } = storeToRefs(videoStore);

const { exportVideo: exportVideoWithMediaBunny, isProcessing, progress } =
	useMediaBunny();

const exportConfig = ref({
	resolution: "1080p",
	quality: "high",
	format: "mp4",
	fps: 30,
});

const isExporting = computed(() => isProcessing.value);
const exportProgress = computed(() => progress.value);

const formatTime = (seconds: number): string => {
	const mins = Math.floor(seconds / 60);
	const secs = Math.floor(seconds % 60);
	return `${mins}:${secs.toString().padStart(2, "0")}`;
};

const getResolutionWidth = (resolution: string): number => {
	switch (resolution) {
		case "4k":
			return 3840;
		case "1080p":
			return 1920;
		case "720p":
			return 1280;
		case "480p":
			return 854;
		default:
			return 1920;
	}
};

const getResolutionHeight = (resolution: string): number => {
	switch (resolution) {
		case "4k":
			return 2160;
		case "1080p":
			return 1080;
		case "720p":
			return 720;
		case "480p":
			return 480;
		default:
			return 1080;
	}
};

const getQuality = (quality: string): "low" | "medium" | "high" => {
	switch (quality) {
		case "ultra":
		case "high":
			return "high";
		case "medium":
			return "medium";
		case "low":
			return "low";
		default:
			return "high";
	}
};

const exportVideo = async () => {
	if (!currentVideoProject.value) return;

	try {
		const canvas = document.createElement("canvas");
		canvas.width = getResolutionWidth(exportConfig.value.resolution);
		canvas.height = getResolutionHeight(exportConfig.value.resolution);

		const ctx = canvas.getContext("2d");
		if (!ctx) {
			throw new Error("Failed to get canvas context");
		}

		const blob = await exportVideoWithMediaBunny(canvas, {
			format: exportConfig.value.format as "mp4" | "webm",
			quality: getQuality(exportConfig.value.quality),
			fps: exportConfig.value.fps,
			resolution: {
				width: canvas.width,
				height: canvas.height,
			},
		});

		const url = URL.createObjectURL(blob);
		const a = document.createElement("a");
		a.href = url;
		a.download =
			`${currentVideoProject.value.name}.${exportConfig.value.format}`;
		a.click();
		URL.revokeObjectURL(url);

		alert(`Video exported successfully!`);
	} catch (error) {
		console.error("Export error:", error);
		alert("Failed to export video");
	}
};
</script>

<template>
	<div class="w-64 bg-gray-900 border-l border-gray-700 flex flex-col">
		<div class="h-12 bg-gray-800 flex items-center px-4 border-b border-gray-700">
			<span class="text-white font-medium">Export</span>
		</div>

		<div class="flex-1 overflow-y-auto p-4">
			<div class="space-y-4">
				<div>
					<label class="block text-gray-400 text-sm mb-1">Resolution</label>
					<select
						v-model="exportConfig.resolution"
						class="w-full bg-gray-800 text-white rounded px-3 py-2 text-sm border border-gray-700 focus:border-blue-500 focus:outline-none"
					>
						<option value="4k">4K (3840x2160)</option>
						<option value="1080p">1080p (1920x1080)</option>
						<option value="720p">720p (1280x720)</option>
						<option value="480p">480p (854x480)</option>
					</select>
				</div>

				<div>
					<label class="block text-gray-400 text-sm mb-1">Quality</label>
					<select
						v-model="exportConfig.quality"
						class="w-full bg-gray-800 text-white rounded px-3 py-2 text-sm border border-gray-700 focus:border-blue-500 focus:outline-none"
					>
						<option value="ultra">Ultra (10 Mbps)</option>
						<option value="high">High (5 Mbps)</option>
						<option value="medium">Medium (3 Mbps)</option>
						<option value="low">Low (1 Mbps)</option>
					</select>
				</div>

				<div>
					<label class="block text-gray-400 text-sm mb-1">Format</label>
					<select
						v-model="exportConfig.format"
						class="w-full bg-gray-800 text-white rounded px-3 py-2 text-sm border border-gray-700 focus:border-blue-500 focus:outline-none"
					>
						<option value="mp4">MP4</option>
						<option value="webm">WebM</option>
						<option value="mov">MOV</option>
					</select>
				</div>

				<div>
					<label class="block text-gray-400 text-sm mb-1">Frame Rate</label>
					<select
						v-model="exportConfig.fps"
						class="w-full bg-gray-800 text-white rounded px-3 py-2 text-sm border border-gray-700 focus:border-blue-500 focus:outline-none"
					>
						<option value="60">60 fps</option>
						<option value="30">30 fps</option>
						<option value="24">24 fps</option>
					</select>
				</div>

				<div v-if="currentVideoProject" class="border-t border-gray-700 pt-4">
					<div class="text-gray-400 text-sm mb-2">Project Info</div>
					<div class="space-y-1 text-sm">
						<div class="flex justify-between">
							<span class="text-gray-500">Duration:</span>
							<span class="text-white">{{
								formatTime(currentVideoProject.duration)
							}}</span>
						</div>
						<div class="flex justify-between">
							<span class="text-gray-500">Clips:</span>
							<span class="text-white">{{
								currentVideoProject.clips.length
							}}</span>
						</div>
						<div class="flex justify-between">
							<span class="text-gray-500">Tracks:</span>
							<span class="text-white">{{
								currentVideoProject.tracks.length
							}}</span>
						</div>
					</div>
				</div>

				<div class="border-t border-gray-700 pt-4">
					<button
						class="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white rounded text-sm font-medium flex items-center justify-center gap-2"
						:disabled="isExporting"
						@click="exportVideo"
					>
						<span v-if="isExporting">⏳</span>
						<span v-else>📤</span>
						<span>{{ isExporting ? "Exporting..." : "Export Video" }}</span>
					</button>
				</div>

				<div v-if="exportProgress > 0" class="border-t border-gray-700 pt-4">
					<div class="text-gray-400 text-sm mb-2">Export Progress</div>
					<div class="w-full bg-gray-700 rounded-full h-2">
						<div
							class="bg-blue-600 h-2 rounded-full transition-all"
							:style="{ width: `${exportProgress}%` }"
						/>
					</div>
					<div class="text-white text-sm mt-1 text-center">
						{{ exportProgress }}%
					</div>
				</div>
			</div>
		</div>
	</div>
</template>
