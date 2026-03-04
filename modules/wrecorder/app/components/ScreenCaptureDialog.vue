<script setup lang="ts">
import type { ScreenshotResult } from "../composables/useScreenCapture";

const isOpen = defineModel<boolean>("isOpen", { default: false });

const { isCapturing, lastScreenshot, screenshots, captureFullScreen, captureWindow, captureRegion, downloadScreenshot, deleteScreenshot, clearScreenshots } = useScreenCapture();

const activeTab = ref<"full" | "window" | "region">("full");
const selectedFormat = ref<"image/png" | "image/jpeg" | "image/webp">("image/png");
const quality = ref(0.95);
const showPreview = ref(true);

const handleCapture = async () => {
	try {
		switch (activeTab.value) {
			case "full":
				await captureFullScreen({ format: selectedFormat.value, quality: quality.value });
				break;
			case "window":
				await captureWindow({ format: selectedFormat.value, quality: quality.value });
				break;
			case "region":
				await captureFullScreen({ format: selectedFormat.value, quality: quality.value });
				break;
		}
	} catch (error) {
		console.error("Capture failed:", error);
	}
};

const handleDownload = (screenshot: ScreenshotResult) => {
	const extension = selectedFormat.value === "image/jpeg" ? "jpg" : selectedFormat.value === "image/webp" ? "webp" : "png";
	downloadScreenshot(screenshot, `screenshot-${new Date().toISOString().replace(/[:.]/g, "-")}.${extension}`);
};

const formatFileSize = (bytes: number): string => {
	if (bytes < 1024) return `${bytes} B`;
	if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
	return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
};
</script>

<template>
	<ModalDialog v-model:is-open="isOpen" title="Screen Capture" max-width="900px">
		<div class="space-y-4">
			<!-- Capture Options -->
			<div class="flex gap-2 p-1 bg-gray-100 dark:bg-gray-800 rounded-lg">
				<button
					class="flex-1 px-4 py-2 rounded-md text-sm font-medium transition-all"
					:class="activeTab === 'full' ? 'bg-white dark:bg-gray-700 shadow-sm text-gray-900 dark:text-white' : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'"
					@click="activeTab = 'full'"
				>
					<Icon name="mdi:monitor" class="w-4 h-4 inline mr-2" />
					Full Screen
				</button>
				<button
					class="flex-1 px-4 py-2 rounded-md text-sm font-medium transition-all"
					:class="activeTab === 'window' ? 'bg-white dark:bg-gray-700 shadow-sm text-gray-900 dark:text-white' : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'"
					@click="activeTab = 'window'"
				>
					<Icon name="mdi:window-maximize" class="w-4 h-4 inline mr-2" />
					Window
				</button>
				<button
					class="flex-1 px-4 py-2 rounded-md text-sm font-medium transition-all"
					:class="activeTab === 'region' ? 'bg-white dark:bg-gray-700 shadow-sm text-gray-900 dark:text-white' : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'"
					@click="activeTab = 'region'"
				>
					<Icon name="mdi:crop" class="w-4 h-4 inline mr-2" />
					Region
				</button>
			</div>

			<!-- Settings -->
			<div class="grid grid-cols-2 gap-4">
				<div>
					<label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Format</label>
					<select
						v-model="selectedFormat"
						class="w-full px-3 py-2 border rounded-lg dark:bg-gray-800 dark:border-gray-700 text-sm"
					>
						<option value="image/png">PNG (Lossless)</option>
						<option value="image/jpeg">JPEG (Compressed)</option>
						<option value="image/webp">WebP (Modern)</option>
					</select>
				</div>
				<div v-if="selectedFormat === 'image/jpeg'">
					<label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Quality: {{ Math.round(quality * 100) }}%</label>
					<input
						v-model.number="quality"
						type="range"
						min="0.1"
						max="1"
						step="0.05"
						class="w-full"
					/>
				</div>
			</div>

			<!-- Capture Button -->
			<button
				class="w-full px-4 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-medium flex items-center justify-center gap-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
				:disabled="isCapturing"
				@click="handleCapture"
			>
				<Icon v-if="isCapturing" name="mdi:loading" class="w-5 h-5 animate-spin" />
				<Icon v-else name="mdi:camera" class="w-5 h-5" />
				{{ isCapturing ? 'Capturing...' : 'Capture Screenshot' }}
			</button>

			<!-- Preview -->
			<div v-if="lastScreenshot && showPreview" class="border rounded-lg p-4 dark:border-gray-700">
				<div class="flex items-center justify-between mb-3">
					<h3 class="font-medium text-gray-900 dark:text-white">Latest Capture</h3>
					<div class="flex gap-2">
						<button
							class="px-3 py-1.5 text-sm bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400 rounded-lg hover:bg-purple-200 dark:hover:bg-purple-900/50 transition-colors"
							@click="handleDownload(lastScreenshot)"
						>
							<Icon name="mdi:download" class="w-4 h-4 inline mr-1" />
							Download
						</button>
						<button
							class="px-3 py-1.5 text-sm bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 rounded-lg hover:bg-red-200 dark:hover:bg-red-900/50 transition-colors"
							@click="deleteScreenshot(lastScreenshot.id)"
						>
							<Icon name="mdi:delete" class="w-4 h-4" />
						</button>
					</div>
				</div>
				<img
					:src="lastScreenshot.url"
					alt="Screenshot"
					class="w-full max-h-64 object-contain rounded-lg bg-gray-100 dark:bg-gray-800"
				/>
				<div class="mt-2 text-sm text-gray-500 dark:text-gray-400 flex gap-4">
					<span>{{ lastScreenshot.width }} x {{ lastScreenshot.height }}</span>
					<span>{{ formatFileSize(lastScreenshot.blob.size) }}</span>
					<span>{{ new Date(lastScreenshot.timestamp).toLocaleTimeString() }}</span>
				</div>
			</div>

			<!-- History -->
			<div v-if="screenshots.length > 1" class="border rounded-lg p-4 dark:border-gray-700">
				<div class="flex items-center justify-between mb-3">
					<h3 class="font-medium text-gray-900 dark:text-white">History ({{ screenshots.length }})</h3>
					<button
						class="text-sm text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300"
						@click="clearScreenshots"
					>
						Clear All
					</button>
				</div>
				<div class="grid grid-cols-4 gap-2">
					<div
						v-for="screenshot in screenshots.slice(0, 8)"
						:key="screenshot.id"
						class="relative group cursor-pointer"
						@click="handleDownload(screenshot)"
					>
						<img
							:src="screenshot.url"
							alt="Screenshot"
							class="w-full aspect-video object-cover rounded-lg"
						/>
						<div class="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center">
							<Icon name="mdi:download" class="w-6 h-6 text-white" />
						</div>
					</div>
				</div>
			</div>
		</div>
	</ModalDialog>
</template>
