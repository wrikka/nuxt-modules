<script setup lang="ts">
import { ref } from "vue";

const emit = defineEmits<{
	(e: "import", files: File[], format: string): void;
	(e: "export", templateId: string, format: string): void;
	(e: "close"): void;
}>();

const props = defineProps<{
	templateId?: string;
	mode: "import" | "export";
}>();

const activeTab = ref<"import" | "export">(props.mode);
const selectedFormat = ref("json");
const isDragging = ref(false);
const importProgress = ref(0);
const isImporting = ref(false);

const importFormats = [
	{
		value: "figma",
		label: "Figma",
		icon: "i-mdi-figma",
		description: "Import from Figma URL or file",
	},
	{
		value: "canva",
		label: "Canva",
		icon: "i-mdi-palette",
		description: "Import Canva design link",
	},
	{
		value: "psd",
		label: "Photoshop PSD",
		icon: "i-mdi-file-image",
		description: "Import PSD files with layers",
	},
	{
		value: "sketch",
		label: "Sketch",
		icon: "i-mdi-vector-square",
		description: "Import Sketch files",
	},
	{
		value: "json",
		label: "Media Studio JSON",
		icon: "i-mdi-code-json",
		description: "Import from backup file",
	},
];

const exportFormats = [
	{
		value: "json",
		label: "Media Studio JSON",
		icon: "i-mdi-code-json",
		description: "Full template with editable layers",
	},
	{
		value: "png",
		label: "PNG Image",
		icon: "i-mdi-image",
		description: "High-quality raster image",
	},
	{
		value: "svg",
		label: "SVG Vector",
		icon: "i-mdi-svg",
		description: "Scalable vector graphic",
	},
	{
		value: "pdf",
		label: "PDF Document",
		icon: "i-mdi-file-pdf",
		description: "Print-ready document",
	},
	{
		value: "html",
		label: "HTML/CSS",
		icon: "i-mdi-language-html5",
		description: "Web-ready code",
	},
];

const handleDrop = (e: DragEvent) => {
	isDragging.value = false;
	const files = Array.from(e.dataTransfer?.files || []);
	if (files.length > 0) {
		startImport(files);
	}
};

const handleFileSelect = (e: Event) => {
	const files = Array.from((e.target as HTMLInputElement).files || []);
	if (files.length > 0) {
		startImport(files);
	}
};

const startImport = async (files: File[]) => {
	isImporting.value = true;
	importProgress.value = 0;
	// Simulate progress
	for (let i = 0; i <= 100; i += 10) {
		await new Promise(resolve => setTimeout(resolve, 200));
		importProgress.value = i;
	}
	emit("import", files, selectedFormat.value);
	isImporting.value = false;
};

const handleExport = () => {
	if (props.templateId) {
		emit("export", props.templateId, selectedFormat.value);
	}
};
</script>

<template>
	<Teleport to="body">
		<div
			class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
			@click.self="$emit('close')"
		>
			<div class="bg-white dark:bg-gray-800 rounded-xl shadow-2xl w-full max-w-2xl overflow-hidden">
				<!-- Header -->
				<div class="flex items-center justify-between px-6 py-4 border-b border-gray-200 dark:border-gray-700">
					<h2 class="text-xl font-bold text-gray-900 dark:text-white">
						Template Import / Export
					</h2>
					<button
						class="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
						@click="$emit('close')"
					>
						<i class="i-mdi-close text-gray-600 dark:text-gray-400 text-xl" />
					</button>
				</div>

				<!-- Tabs -->
				<div class="flex border-b border-gray-200 dark:border-gray-700">
					<button
						class="flex-1 px-6 py-3 text-sm font-medium border-b-2 transition-colors"
						:class="activeTab === 'import'
						? 'border-blue-500 text-blue-600 dark:text-blue-400'
						: 'border-transparent text-gray-600 dark:text-gray-400'"
						@click="activeTab = 'import'"
					>
						<i class="i-mdi-upload mr-2" />
						Import Template
					</button>
					<button
						class="flex-1 px-6 py-3 text-sm font-medium border-b-2 transition-colors"
						:class="activeTab === 'export'
						? 'border-blue-500 text-blue-600 dark:text-blue-400'
						: 'border-transparent text-gray-600 dark:text-gray-400'"
						@click="activeTab = 'export'"
					>
						<i class="i-mdi-download mr-2" />
						Export Template
					</button>
				</div>

				<!-- Import Panel -->
				<div v-if="activeTab === 'import'" class="p-6">
					<!-- Format Selection -->
					<div class="mb-6">
						<label
							class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3"
						>Import From</label>
						<div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
							<button
								v-for="format in importFormats"
								:key="format.value"
								class="flex items-start gap-3 p-3 rounded-lg border text-left transition-all"
								:class="selectedFormat === format.value
								? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
								: 'border-gray-200 dark:border-gray-700 hover:border-gray-300'"
								@click="selectedFormat = format.value"
							>
								<i
									:class="[format.icon, 'text-2xl text-gray-600 dark:text-gray-400']"
								/>
								<div>
									<div class="font-medium text-gray-900 dark:text-white">
										{{ format.label }}
									</div>
									<div class="text-xs text-gray-500 dark:text-gray-400">
										{{ format.description }}
									</div>
								</div>
							</button>
						</div>
					</div>

					<!-- Drop Zone -->
					<div
						class="border-2 border-dashed rounded-xl p-8 text-center transition-all"
						:class="isDragging
						? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
						: 'border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500'"
						@dragenter.prevent="isDragging = true"
						@dragleave.prevent="isDragging = false"
						@dragover.prevent
						@drop.prevent="handleDrop"
					>
						<input
							type="file"
							class="hidden"
							accept=".json,.psd,.sketch"
							@change="handleFileSelect"
						/>
						<i
							class="i-mdi-cloud-upload text-5xl text-gray-400 dark:text-gray-500 mb-4"
						/>
						<p class="text-gray-700 dark:text-gray-300 font-medium">
							Drop files here or <span
								class="text-blue-600 dark:text-blue-400 cursor-pointer"
							>browse</span>
						</p>
						<p class="text-sm text-gray-500 dark:text-gray-400 mt-2">
							Supports JSON, PSD, Sketch files up to 50MB
						</p>
					</div>

					<!-- Progress -->
					<div v-if="isImporting" class="mt-4">
						<div class="flex items-center justify-between text-sm mb-2">
							<span class="text-gray-700 dark:text-gray-300">Importing...</span>
							<span class="text-gray-900 dark:text-white">{{
									importProgress
								}}%</span>
						</div>
						<div class="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
							<div
								class="h-full bg-blue-500 transition-all duration-300"
								:style="{ width: `${importProgress}%` }"
							/>
						</div>
					</div>
				</div>

				<!-- Export Panel -->
				<div v-else class="p-6">
					<div class="mb-6">
						<label
							class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3"
						>Export Format</label>
						<div class="space-y-2">
							<button
								v-for="format in exportFormats"
								:key="format.value"
								class="w-full flex items-center gap-3 p-3 rounded-lg border text-left transition-all"
								:class="selectedFormat === format.value
								? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
								: 'border-gray-200 dark:border-gray-700 hover:border-gray-300'"
								@click="selectedFormat = format.value"
							>
								<i
									:class="[format.icon, 'text-2xl text-gray-600 dark:text-gray-400']"
								/>
								<div class="flex-1">
									<div class="font-medium text-gray-900 dark:text-white">
										{{ format.label }}
									</div>
									<div class="text-xs text-gray-500 dark:text-gray-400">
										{{ format.description }}
									</div>
								</div>
								<i
									v-if="selectedFormat === format.value"
									class="i-mdi-check-circle text-blue-500"
								/>
							</button>
						</div>
					</div>

					<div class="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-700">
						<div class="text-sm text-gray-500 dark:text-gray-400">
							<i class="i-mdi-information-outline mr-1" />
							Some formats may flatten layers
						</div>
						<button
							class="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium"
							@click="handleExport"
						>
							<i class="i-mdi-download mr-2" />
							Download
						</button>
					</div>
				</div>
			</div>
		</div>
	</Teleport>
</template>
