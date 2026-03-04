<script setup lang="ts">
import type { Recording, RecordingExportOptions, VideoExportPreset } from "~/types";

const props = defineProps<{
	recording: Recording;
	isOpen: boolean;
}>();

const emit = defineEmits<{
	close: [];
	export: [options: RecordingExportOptions];
}>();

const { defaultPresets, isExporting, exportProgress } = useVideoEditor();

const selectedPreset = ref<VideoExportPreset | null>(null);
const customFormat = ref<RecordingExportOptions["format"]>"mp4";
const customQuality = ref<RecordingExportOptions["quality"]>"high");
const customResolution = ref({ width: 1920, height: 1080 });
const customFps = ref(30);
const usePreset = ref(true);

const formatOptions = [
	{ value: "mp4" as const, label: "MP4", icon: "mdi:file-video", desc: "Best compatibility" },
	{ value: "mov" as const, label: "MOV", icon: "mdi:apple", desc: "ProRes quality" },
	{ value: "webm" as const, label: "WebM", icon: "mdi:web", desc: "Web optimized" },
	{ value: "gif" as const, label: "GIF", icon: "mdi:file-gif-box", desc: "Animation" },
];

const qualityOptions = [
	{ value: "low" as const, label: "Low", desc: "Smaller file, faster" },
	{ value: "medium" as const, label: "Medium", desc: "Balanced" },
	{ value: "high" as const, label: "High", desc: "Better quality" },
	{ value: "ultra" as const, label: "Ultra", desc: "Best quality" },
];

const resolutionOptions = [
	{ value: { width: 1920, height: 1080 }, label: "1080p FHD" },
	{ value: { width: 1280, height: 720 }, label: "720p HD" },
	{ value: { width: 3840, height: 2160 }, label: "4K UHD" },
	{ value: { width: 1440, height: 1080 }, label: "1440p QHD" },
	{ value: { width: 1080, height: 1080 }, label: "1:1 Square" },
	{ value: { width: 1080, height: 1920 }, label: "9:16 Vertical" },
];

const fpsOptions = [
	{ value: 24, label: "24fps (Cinematic)" },
	{ value: 30, label: "30fps (Standard)" },
	{ value: 60, label: "60fps (Smooth)" },
];

const handleExport = () => {
	if (usePreset.value && selectedPreset.value) {
		emit("export", {
			format: selectedPreset.value.format,
			quality: selectedPreset.value.quality,
			resolution: selectedPreset.value.resolution,
			fps: selectedPreset.value.fps,
		});
	} else {
		emit("export", {
			format: customFormat.value,
			quality: customQuality.value,
			resolution: customResolution.value,
			fps: customFps.value,
		});
	}
};

const formatFileSize = (bytes: number): string => {
	if (bytes === 0) return "0 B";
	const k = 1024;
	const sizes = ["B", "KB", "MB", "GB"];
	const i = Math.floor(Math.log(bytes) / Math.log(k));
	return `${parseFloat((bytes / k ** i).toFixed(2))} ${sizes[i]}`;
};
</script>

<template>
	<TransitionRoot appear :show="isOpen" as="template">
		<Dialog as="div" class="relative z-50" @close="emit('close')">
			<TransitionChild
				enter="duration-300 ease-out"
				enter-from="opacity-0"
				enter-to="opacity-100"
				leave="duration-200 ease-in"
				leave-from="opacity-100"
				leave-to="opacity-0"
			>
				<div class="fixed inset-0 bg-black/50" />
			</TransitionChild>

			<div class="fixed inset-0 overflow-y-auto">
				<div class="flex min-h-full items-center justify-center p-4">
					<TransitionChild
						enter="duration-300 ease-out"
						enter-from="opacity-0 scale-95"
						enter-to="opacity-100 scale-100"
						leave="duration-200 ease-in"
						leave-from="opacity-100 scale-100"
						leave-to="opacity-0 scale-95"
					>
						<DialogPanel
							class="w-full max-w-2xl transform overflow-hidden rounded-2xl bg-white dark:bg-gray-800 p-6 shadow-xl transition-all"
						>
							<DialogTitle
								class="text-xl font-semibold text-gray-900 dark:text-white mb-4"
							>
								Export Recording
							</DialogTitle>

							<div class="space-y-4">
								<!-- Recording Info -->
								<div class="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
									<div class="flex items-center gap-3">
										<Icon name="mdi:video" class="w-8 h-8 text-purple-500" />
										<div>
											<p class="font-medium text-gray-900 dark:text-white">
												{{ recording.name }}
											</p>
											<p class="text-sm text-gray-500 dark:text-gray-400">
												{{ formatFileSize(recording.blob.size) }} • {{
													Math.floor(recording.duration / 60)
												}}:{{
													(recording.duration % 60).toString().padStart(2, "0")
												}}
											</p>
										</div>
									</div>
								</div>

								<!-- Mode Toggle -->
								<div class="flex gap-2 p-1 bg-gray-100 dark:bg-gray-700 rounded-lg">
									<button
										:class="[
											'flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all',
											usePreset
												? 'bg-white dark:bg-gray-600 text-purple-600 dark:text-purple-400 shadow-sm'
												: 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white',
										]"
										@click="usePreset = true"
									>
											Presets
										</button>
									<button
										:class="[
											'flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all',
											!usePreset
												? 'bg-white dark:bg-gray-600 text-purple-600 dark:text-purple-400 shadow-sm'
												: 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white',
										]"
										@click="usePreset = false"
									>
											Custom
										</button>
								</div>

								<!-- Presets -->
								<div v-if="usePreset" class="grid grid-cols-2 gap-3">
									<button
										v-for="preset in defaultPresets"
										:key="preset.name"
										:class="[
											'p-4 rounded-lg border-2 text-left transition-all',
											selectedPreset?.name === preset.name
												? 'border-purple-500 bg-purple-50 dark:bg-purple-900/20'
												: 'border-gray-200 dark:border-gray-700 hover:border-purple-300 dark:hover:border-purple-700',
										]"
										@click="selectedPreset = preset"
									>
											<p class="font-medium text-gray-900 dark:text-white">
												{{ preset.name }}
											</p>
											<p class="text-xs text-gray-500 dark:text-gray-400 mt-1">
												{{ preset.resolution.width }}×{{ preset.resolution.height }} • {{ preset.fps }}fps • {{ preset.format.toUpperCase() }}
											</p>
										</button>
								</div>

								<!-- Custom Settings -->
								<div v-else class="space-y-4">
									<!-- Format -->
									<div>
										<label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Format</label>
										<div class="grid grid-cols-4 gap-2">
											<button
												v-for="fmt in formatOptions"
												:key="fmt.value"
												:class="[
													'p-3 rounded-lg border-2 text-center transition-all',
													customFormat === fmt.value
															? 'border-purple-500 bg-purple-50 dark:bg-purple-900/20'
															: 'border-gray-200 dark:border-gray-700 hover:border-purple-300 dark:hover:border-purple-700',
												]"
												@click="customFormat = fmt.value"
											>
													<Icon :name="fmt.icon" class="w-6 h-6 mx-auto mb-1" :class="customFormat === fmt.value ? 'text-purple-500' : 'text-gray-400'" />
													<p class="text-sm font-medium text-gray-900 dark:text-white">{{ fmt.label }}</p>
													<p class="text-xs text-gray-500 dark:text-gray-400">{{ fmt.desc }}</p>
												</button>
											</div>
										</div>

									<!-- Quality -->
									<div>
										<label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Quality</label>
										<div class="grid grid-cols-4 gap-2">
											<button
												v-for="q in qualityOptions"
												:key="q.value"
												:class="[
													'py-2 px-3 rounded-lg border-2 text-sm font-medium transition-all',
													customQuality === q.value
															? 'border-purple-500 bg-purple-50 dark:bg-purple-900/20 text-purple-700 dark:text-purple-300'
															: 'border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:border-purple-300 dark:hover:border-purple-700',
												]"
												@click="customQuality = q.value"
											>
													{{ q.label }}
												</button>
											</div>
										</div>

									<!-- Resolution -->
									<div>
										<label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Resolution</label>
										<select
											v-model="customResolution"
											class="w-full px-4 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white"
										>
											<option v-for="res in resolutionOptions" :key="res.label" :value="res.value">
												{{ res.label }}
											</option>
											</select>
										</div>

									<!-- FPS -->
									<div>
										<label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Frame Rate</label>
										<div class="flex gap-2">
											<button
												v-for="fps in fpsOptions"
												:key="fps.value"
												:class="[
													'flex-1 py-2 px-3 rounded-lg border-2 text-sm font-medium transition-all',
													customFps === fps.value
															? 'border-purple-500 bg-purple-50 dark:bg-purple-900/20 text-purple-700 dark:text-purple-300'
															: 'border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:border-purple-300 dark:hover:border-purple-700',
												]"
												@click="customFps = fps.value"
											>
													{{ fps.label }}
												</button>
											</div>
										</div>
									</div>

								<!-- Export Progress -->
								<div v-if="isExporting && exportProgress" class="bg-purple-50 dark:bg-purple-900/20 rounded-lg p-4">
									<div class="flex items-center justify-between mb-2">
										<span class="text-sm font-medium text-purple-700 dark:text-purple-300">
											{{ exportProgress.stage === "preparing" ? "Preparing..." : exportProgress.stage === "encoding" ? "Encoding..." : "Processing..." }}
										</span>
										<span class="text-sm text-purple-600 dark:text-purple-400">{{ exportProgress.percentage }}%</span>
									</div>
									<div class="w-full bg-purple-200 dark:bg-purple-800 rounded-full h-2">
										<div class="bg-purple-600 h-2 rounded-full transition-all duration-300" :style="{ width: `${exportProgress.percentage}%` }" />
									</div>
								</div>

								<!-- Actions -->
								<div class="flex justify-end gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
									<button
										class="px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
										@click="emit('close')"
									>
										Cancel
									</button>
									<button
										class="px-6 py-2 bg-purple-600 hover:bg-purple-700 text-white font-medium rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
										:disabled="usePreset && !selectedPreset"
										@click="handleExport"
									>
										{{ isExporting ? "Exporting..." : "Export" }}
									</button>
								</div>
							</div>
						</DialogPanel>
					</TransitionChild>
				</div>
			</div>
		</Dialog>
	</TransitionRoot>
</template>
