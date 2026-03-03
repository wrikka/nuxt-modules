<script setup lang="ts">
const emit = defineEmits<{
	import: [files: File[]];
}>();

const isDragging = ref(false);
const isProcessing = ref(false);
const uploadProgress = ref(0);

function handleDrop(e: DragEvent) {
	isDragging.value = false;
	const files = e.dataTransfer?.files;
	if (files && files.length > 0) {
		processFiles(files);
	}
}

function handleFileSelect(e: Event) {
	const target = e.target as HTMLInputElement;
	if (target.files && target.files.length > 0) {
		processFiles(target.files);
	}
}

async function processFiles(files: FileList) {
	const pptFiles = Array.from(files).filter(
		(file) => file.name.endsWith(".ppt") || file.name.endsWith(".pptx"),
	);

	if (pptFiles.length === 0) {
		alert("Please select PowerPoint files (.ppt or .pptx)");
		return;
	}

	isProcessing.value = true;
	uploadProgress.value = 0;

	// Simulate processing
	for (let i = 0; i <= 100; i += 10) {
		uploadProgress.value = i;
		await new Promise((resolve) => setTimeout(resolve, 100));
	}

	emit("import", pptFiles);
	isProcessing.value = false;
}

function handleDragOver(e: DragEvent) {
	e.preventDefault();
	isDragging.value = true;
}

function handleDragLeave() {
	isDragging.value = false;
}
</script>

<template>
	<div class="relative">
		<div
			class="border-2 border-dashed rounded-lg p-8 text-center transition-colors"
			:class="isDragging ? 'border-blue-500 bg-blue-500/10' : 'border-gray-600 bg-gray-800/50'"
			@drop="handleDrop"
			@dragover="handleDragOver"
			@dragleave="handleDragLeave"
		>
			<div v-if="!isProcessing">
				<svg class="w-12 h-12 mx-auto mb-4 text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
					<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
					<polyline points="14 2 14 8 20 8" />
					<path d="M12 18v-6" />
					<path d="M9 15l3-3 3 3" />
				</svg>
				<p class="text-gray-300 mb-2">Drop PowerPoint files here</p>
				<p class="text-sm text-gray-500">or click to browse</p>
				<input
					type="file"
					accept=".ppt,.pptx"
					multiple
					class="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
					@change="handleFileSelect"
				/>
			</div>
			<div v-else>
				<div class="text-gray-300 mb-4">Processing files...</div>
				<div class="w-full bg-gray-700 rounded-full h-2">
					<div
						class="bg-blue-500 h-2 rounded-full transition-all duration-300"
						:style="{ width: `${uploadProgress}%` }"
					/>
				</div>
				<div class="text-sm text-gray-500 mt-2">{{ uploadProgress }}%</div>
			</div>
		</div>

		<div class="mt-4 text-xs text-gray-500">
			<p>Supported formats: .ppt, .pptx</p>
			<p>Note: Import may not preserve all formatting</p>
		</div>
	</div>
</template>
