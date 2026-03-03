<script setup lang="ts">
const emit = defineEmits<{
	(e: "close"): void;
	(e: "import", source: string, files: File[]): void;
}>();

const selectedSource = ref<string | null>(null);
const isImporting = ref(false);
const importProgress = ref(0);
const dragOver = ref(false);
const uploadedFiles = ref<File[]>([]);

const sources = [
	{
		id: "canva",
		name: "Canva",
		icon: "i-mdi-palette",
		color: "bg-pink-500",
		description: "Import Canva designs (.canva, .zip)",
		supported: [".canva", ".zip", ".png", ".jpg"],
	},
	{
		id: "figma",
		name: "Figma",
		icon: "i-mdi-figma",
		color: "bg-purple-500",
		description: "Import Figma files (.fig, .figma)",
		supported: [".fig", ".figma"],
	},
	{
		id: "photoshop",
		name: "Photoshop",
		icon: "i-mdi-image-edit",
		color: "bg-blue-600",
		description: "Import PSD files (.psd)",
		supported: [".psd"],
	},
	{
		id: "sketch",
		name: "Sketch",
		icon: "i-mdi-drawing",
		color: "bg-yellow-500",
		description: "Import Sketch files (.sketch)",
		supported: [".sketch"],
	},
	{
		id: "adobe-xd",
		name: "Adobe XD",
		icon: "i-mdi-adobe",
		color: "bg-pink-600",
		description: "Import XD files (.xd)",
		supported: [".xd"],
	},
	{
		id: "powerpoint",
		name: "PowerPoint",
		icon: "i-mdi-presentation",
		color: "bg-orange-500",
		description: "Import presentations (.pptx)",
		supported: [".pptx", ".ppt"],
	},
];

const recentImports = ref([
	{
		name: "Summer Sale Banner.canva",
		source: "canva",
		date: "2 hours ago",
		status: "success",
	},
	{
		name: "Logo Design.fig",
		source: "figma",
		date: "Yesterday",
		status: "success",
	},
	{
		name: "Brochure.psd",
		source: "photoshop",
		date: "3 days ago",
		status: "partial",
	},
]);

const selectSource = (sourceId: string) => {
	selectedSource.value = sourceId;
	uploadedFiles.value = [];
};

const handleFileDrop = (e: DragEvent) => {
	e.preventDefault();
	dragOver.value = false;
	const files = Array.from(e.dataTransfer?.files || []);
	uploadedFiles.value = files;
};

const handleFileSelect = (e: Event) => {
	const input = e.target as HTMLInputElement;
	const files = Array.from(input.files || []);
	uploadedFiles.value = files;
};

const startImport = async () => {
	if (!selectedSource.value || uploadedFiles.value.length === 0) return;

	isImporting.value = true;
	importProgress.value = 0;

	for (let i = 0; i <= 100; i += 10) {
		await new Promise(r => setTimeout(r, 300));
		importProgress.value = i;
	}

	emit("import", selectedSource.value, uploadedFiles.value);
	isImporting.value = false;
};

const getSourceIcon = (sourceId: string) => {
	return sources.find(s => s.id === sourceId)?.icon || "i-mdi-file";
};
</script>

<template>
	<Teleport to="body">
		<div
			class="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm"
			@click.self="emit('close')"
		>
			<div class="absolute inset-4 md:inset-10 bg-white dark:bg-gray-800 rounded-2xl overflow-hidden flex flex-col">
				<!-- Header -->
				<div class="flex items-center justify-between px-6 py-4 border-b border-gray-200 dark:border-gray-700">
					<div class="flex items-center gap-3">
						<div class="w-10 h-10 bg-indigo-100 dark:bg-indigo-900/30 rounded-full flex items-center justify-center">
							<i class="i-mdi-import text-indigo-600 text-xl" />
						</div>
						<div>
							<h2 class="text-xl font-semibold text-gray-900 dark:text-white">
								Import Templates
							</h2>
							<p class="text-sm text-gray-500">
								Migrate designs from other platforms
							</p>
						</div>
					</div>
					<button
						class="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
						@click="emit('close')"
					>
						<i class="i-mdi-close text-gray-600 dark:text-gray-400" />
					</button>
				</div>

				<!-- Content -->
				<div class="flex-1 flex overflow-hidden">
					<!-- Left: Source Selection -->
					<div class="w-1/3 border-r border-gray-200 dark:border-gray-700 overflow-y-auto p-6">
						<h3 class="text-sm font-medium text-gray-500 uppercase tracking-wide mb-4">
							Select Source
						</h3>
						<div class="space-y-3">
							<button
								v-for="source in sources"
								:key="source.id"
								class="w-full flex items-center gap-3 p-4 border rounded-xl transition-all text-left"
								:class="selectedSource === source.id
								? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
								: 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'"
								@click="selectSource(source.id)"
							>
								<div :class="`w-10 h-10 ${source.color} rounded-lg flex items-center justify-center text-white`">
									<i :class="source.icon" />
								</div>
								<div class="flex-1">
									<h4 class="font-medium text-gray-900 dark:text-white">
										{{ source.name }}
									</h4>
									<p class="text-xs text-gray-500">{{ source.description }}</p>
								</div>
								<i
									v-if="selectedSource === source.id"
									class="i-mdi-check-circle text-blue-500"
								/>
							</button>
						</div>

						<!-- Recent Imports -->
						<div class="mt-8">
							<h3 class="text-sm font-medium text-gray-500 uppercase tracking-wide mb-4">
								Recent Imports
							</h3>
							<div class="space-y-2">
								<div
									v-for="item in recentImports"
									:key="item.name"
									class="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg"
								>
									<i
										:class="getSourceIcon(item.source)"
										class="text-gray-400"
									/>
									<div class="flex-1 min-w-0">
										<p class="text-sm font-medium text-gray-900 dark:text-white truncate">
											{{ item.name }}
										</p>
										<p class="text-xs text-gray-500">{{ item.date }}</p>
									</div>
									<i
										:class="item.status === 'success'
										? 'i-mdi-check-circle text-green-500'
										: 'i-mdi-alert-circle text-yellow-500'"
									/>
								</div>
							</div>
						</div>
					</div>

					<!-- Right: Upload Area -->
					<div class="flex-1 p-6 overflow-y-auto">
						<div
							v-if="!selectedSource"
							class="h-full flex items-center justify-center"
						>
							<div class="text-center text-gray-400">
								<i class="i-mdi-arrow-left text-4xl mb-4" />
								<p>Select a source to start importing</p>
							</div>
						</div>

						<template v-else>
							<div
								class="border-2 border-dashed rounded-2xl p-12 text-center transition-colors"
								:class="dragOver
								? 'border-blue-500 bg-blue-50 dark:bg-blue-900/10'
								: 'border-gray-300 dark:border-gray-600'"
								@dragenter.prevent="dragOver = true"
								@dragleave.prevent="dragOver = false"
								@dragover.prevent
								@drop="handleFileDrop"
							>
								<div v-if="!isImporting">
									<i class="i-mdi-cloud-upload text-5xl text-gray-400 mb-4" />
									<h3 class="text-lg font-medium text-gray-900 dark:text-white mb-2">
										Drop files here or click to browse
									</h3>
									<p class="text-sm text-gray-500 mb-4">
										Supported formats: {{
											sources.find(s => s.id === selectedSource)?.supported
											.join(", ")
										}}
									</p>
									<label class="inline-block">
										<input
											type="file"
											class="hidden"
											:accept="sources.find(s => s.id === selectedSource)?.supported
											.join(',')"
											multiple
											@change="handleFileSelect"
										/>
										<span
											class="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg cursor-pointer transition-colors"
										>
											Choose Files
										</span>
									</label>
								</div>

								<div v-else>
									<div class="w-16 h-16 border-4 border-gray-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-4" />
									<h3 class="text-lg font-medium text-gray-900 dark:text-white mb-2">
										Importing...
									</h3>
									<div class="w-64 h-2 bg-gray-200 dark:bg-gray-700 rounded-full mx-auto overflow-hidden">
										<div
											class="h-full bg-blue-600 transition-all duration-300"
											:style="`width: ${importProgress}%`"
										/>
									</div>
									<p class="text-sm text-gray-500 mt-2">
										{{ importProgress }}%
									</p>
								</div>
							</div>

							<!-- Uploaded Files -->
							<div v-if="uploadedFiles.length > 0 && !isImporting" class="mt-6">
								<h4 class="text-sm font-medium text-gray-900 dark:text-white mb-3">
									Files to Import ({{ uploadedFiles.length }})
								</h4>
								<div class="space-y-2">
									<div
										v-for="(file, index) in uploadedFiles"
										:key="index"
										class="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg"
									>
										<div class="flex items-center gap-3">
											<i class="i-mdi-file text-gray-400" />
											<span class="text-sm text-gray-700 dark:text-gray-300">{{
												file.name
											}}</span>
											<span class="text-xs text-gray-500"
											>({{ (file.size / 1024 / 1024).toFixed(2) }} MB)</span>
										</div>
										<button
											class="p-1 text-gray-400 hover:text-red-500 transition-colors"
											@click="uploadedFiles.splice(index, 1)"
										>
											<i class="i-mdi-close" />
										</button>
									</div>
								</div>

								<button
									class="w-full mt-4 py-3 bg-green-600 hover:bg-green-700 text-white rounded-xl font-medium transition-colors"
									@click="startImport"
								>
									<i class="i-mdi-import mr-1" />
									Import {{ uploadedFiles.length }} Files
								</button>
							</div>

							<!-- Import Tips -->
							<div class="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl">
								<h4 class="text-sm font-medium text-blue-900 dark:text-blue-300 mb-2">
									<i class="i-mdi-lightbulb mr-1" />
									Import Tips
								</h4>
								<ul class="text-sm text-blue-700 dark:text-blue-400 space-y-1">
									<li>• Fonts may be substituted if not available</li>
									<li>• Complex effects might be simplified</li>
									<li>• Images are imported as-is</li>
									<li>• Layer groups become template groups</li>
								</ul>
							</div>
						</template>
					</div>
				</div>
			</div>
		</div>
	</Teleport>
</template>
