<script setup lang="ts">
const isProcessing = ref(false);
const originalImage = ref<string | null>(null);
const processedImage = ref<string | null>(null);
const progress = ref(0);

const handleFileUpload = (e: Event) => {
	const file = (e.target as HTMLInputElement).files?.[0];
	if (file) {
		originalImage.value = URL.createObjectURL(file);
	}
};

const removeBackground = async () => {
	isProcessing.value = true;
	progress.value = 0;

	const interval = setInterval(() => {
		progress.value += 10;
		if (progress.value >= 100) {
			clearInterval(interval);
			processedImage.value = originalImage.value;
			isProcessing.value = false;
		}
	}, 200);
};

const downloadResult = () => {
	console.log("Downloading...");
};
</script>

<template>
	<div class="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
		<div class="flex items-center justify-between mb-6">
			<h3 class="text-lg font-semibold text-gray-900 dark:text-white">
				AI Background Remover
			</h3>
			<span
				class="px-2 py-1 bg-purple-100 dark:bg-purple-900 text-purple-700 dark:text-purple-300 text-xs rounded"
			>AI Powered</span>
		</div>

		<!-- Upload Area -->
		<div
			v-if="!originalImage"
			class="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-8 text-center"
		>
			<input
				type="file"
				accept="image/*"
				@change="handleFileUpload"
				class="hidden"
				id="bg-upload"
			/>
			<label for="bg-upload" class="cursor-pointer">
				<Icon
					name="mdi:cloud-upload"
					class="w-12 h-12 text-gray-400 mx-auto mb-2"
				/>
				<p class="text-sm text-gray-500">Click to upload or drag and drop</p>
				<p class="text-xs text-gray-400 mt-1">PNG, JPG up to 10MB</p>
			</label>
		</div>

		<!-- Preview Area -->
		<div v-else class="grid grid-cols-2 gap-4 mb-4">
			<div>
				<p class="text-sm text-gray-500 mb-2">Original</p>
				<img :src="originalImage" class="w-full h-32 object-cover rounded-lg" />
			</div>
			<div>
				<p class="text-sm text-gray-500 mb-2">Result</p>
				<div class="w-full h-32 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyMCIgaGVpZ2h0PSIyMCI+PHJlY3Qgd2lkdGg9IjEwIiBoZWlnaHQ9IjEwIiBmaWxsPSIjZjBmMGYwIi8+PHJlY3QgeD0iMTAiIHk9IjEwIiB3aWR0aD0iMTAiIGhlaWdodD0iMTAiIGZpbGw9IiNmMGYwZjAiLz48cmVjdCB4PSIxMCIgd2lkdGg9IjEwIiBoZWlnaHQ9IjEwIiBmaWxsPSIjZmZmIi8+PHJlY3QgeT0iMTAiIHdpZHRoPSIxMCIgaGVpZ2h0PSIxMCIgZmlsbD0iI2ZmZiIvPjwvc3ZnPg==')] rounded-lg flex items-center justify-center">
					<img
						v-if="processedImage"
						:src="processedImage"
						class="max-h-full max-w-full object-contain"
					/>
					<span v-else class="text-gray-400 text-sm"
					>Click Remove to process</span>
				</div>
			</div>
		</div>

		<!-- Progress -->
		<div v-if="isProcessing" class="mb-4">
			<div class="flex justify-between text-sm mb-1">
				<span>Removing background...</span>
				<span>{{ progress }}%</span>
			</div>
			<div class="h-2 bg-gray-200 rounded-full overflow-hidden">
				<div
					class="h-full bg-purple-500 transition-all"
					:style="{ width: `${progress}%` }"
				/>
			</div>
		</div>

		<!-- Actions -->
		<div class="flex gap-2">
			<button
				v-if="originalImage && !isProcessing"
				@click="removeBackground"
				class="flex-1 py-2 bg-purple-500 text-white rounded-lg"
			>
				Remove Background
			</button>
			<button
				v-if="processedImage"
				@click="downloadResult"
				class="flex-1 py-2 bg-green-500 text-white rounded-lg"
			>
				Download
			</button>
			<button
				v-if="originalImage"
				@click="originalImage = null;
				processedImage = null;"
				class="px-4 py-2 bg-gray-100 dark:bg-gray-700 rounded-lg"
			>
				Reset
			</button>
		</div>
	</div>
</template>
