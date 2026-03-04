<script setup lang="ts">
const emit = defineEmits<{
	close: [];
	import: [file: File];
	export: [lutData: string];
}>();

const luts = ref([
	{
		id: "1",
		name: "Cinematic Teal",
		type: "cube",
		size: "33x33x33",
		color: "#4fd1c5",
	},
	{
		id: "2",
		name: "Warm Vintage",
		type: "cube",
		size: "64x64x64",
		color: "#f6ad55",
	},
	{
		id: "3",
		name: "Cool Blue",
		type: "cube",
		size: "33x33x33",
		color: "#63b3ed",
	},
	{
		id: "4",
		name: "High Contrast",
		type: "cube",
		size: "33x33x33",
		color: "#f56565",
	},
	{
		id: "5",
		name: "Soft Pastel",
		type: "cube",
		size: "64x64x64",
		color: "#d69e2e",
	},
]);

const selectedLut = ref<string | null>(null);
const isImporting = ref(false);
const dragActive = ref(false);

const handleDrop = (e: DragEvent) => {
	dragActive.value = false;
	const files = e.dataTransfer?.files;
	if (files && files[0]) {
		handleImport(files[0]);
	}
};

const handleImport = (file: File) => {
	isImporting.value = true;
	setTimeout(() => {
		isImporting.value = false;
		luts.value.push({
			id: Date.now().toString(),
			name: file.name.replace(".cube", ""),
			type: "cube",
			size: "33x33x33",
			color: "#a0aec0",
		});
		emit("import", file);
	}, 1000);
};

const handleExport = () => {
	if (!selectedLut.value) return;
	const lut = luts.value.find(l => l.id === selectedLut.value);
	if (lut) {
		emit("export", `# ${lut.name}\nLUT_3D_SIZE ${lut.size.split("x")[0]}`);
	}
};

const deleteLut = (id: string) => {
	luts.value = luts.value.filter(l => l.id !== id);
	if (selectedLut.value === id) {
		selectedLut.value = null;
	}
};
</script>

<template>
	<div class="lut-panel bg-white dark:bg-gray-800 rounded-xl p-4 w-[450px] max-h-[80vh] overflow-hidden flex flex-col shadow-lg border border-gray-200 dark:border-gray-700">
		<div class="flex items-center justify-between mb-4">
			<h3 class="text-gray-900 dark:text-white font-semibold flex items-center gap-2">
				<Icon name="mdi:palette" class="w-5 h-5 text-blue-500" />
				LUT Import/Export
			</h3>
			<button
				class="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors"
				@click="emit('close')"
			>
				<Icon name="mdi:close" class="w-5 h-5" />
			</button>
		</div>

		<!-- Drop Zone -->
		<div
			class="mb-4 p-6 border-2 border-dashed rounded-lg text-center transition-colors"
			:class="dragActive
			? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
			: 'border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700/30'"
			@dragenter.prevent="dragActive = true"
			@dragleave.prevent="dragActive = false"
			@dragover.prevent
			@drop.prevent="handleDrop"
		>
			<Icon
				name="mdi:upload"
				class="w-8 h-8 mx-auto mb-2"
				:class="dragActive ? 'text-blue-500' : 'text-gray-400'"
			/>
			<p class="text-gray-700 dark:text-gray-300 text-sm mb-1">
				Drop .cube files here
			</p>
			<p class="text-gray-500 text-xs">or click to browse</p>
			<input
				type="file"
				accept=".cube"
				class="hidden"
				@change="const files = ($event.target as HTMLInputElement).files;
				const file = files?.[0];
				file && handleImport(file);"
			>
		</div>

		<!-- LUT List -->
		<div class="flex-1 overflow-y-auto mb-4">
			<div class="text-gray-700 dark:text-gray-300 text-sm mb-2 font-medium">
				Available LUTs ({{ luts.length }})
			</div>
			<div class="space-y-1">
				<div
					v-for="lut in luts"
					:key="lut.id"
					class="flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-colors group"
					:class="selectedLut === lut.id
					? 'bg-blue-100 dark:bg-blue-900/30 ring-1 ring-blue-500'
					: 'bg-gray-50 dark:bg-gray-700/30 hover:bg-gray-100 dark:hover:bg-gray-700'"
					@click="selectedLut = lut.id"
				>
					<div
						class="w-10 h-10 rounded"
						:style="{ backgroundColor: lut.color }"
					/>
					<div class="flex-1 min-w-0">
						<div class="text-gray-900 dark:text-white text-sm font-medium truncate">
							{{ lut.name }}
						</div>
						<div class="text-gray-500 dark:text-gray-400 text-xs">
							{{ lut.type }} • {{ lut.size }}
						</div>
					</div>
					<button
						class="opacity-0 group-hover:opacity-100 p-1.5 text-gray-400 hover:text-red-500 transition-all"
						@click.stop="deleteLut(lut.id)"
					>
						<Icon name="mdi:delete" class="w-4 h-4" />
					</button>
				</div>
			</div>
		</div>

		<!-- Import Progress -->
		<div
			v-if="isImporting"
			class="mb-4 p-3 bg-blue-50 dark:bg-blue-900/30 rounded-lg"
		>
			<div class="flex items-center gap-2 text-blue-600 dark:text-blue-400 text-sm">
				<Icon name="mdi:loading" class="w-4 h-4 animate-spin" />
				<span>Importing LUT...</span>
			</div>
		</div>

		<!-- Selected LUT Preview -->
		<div
			v-if="selectedLut"
			class="mb-4 p-3 bg-gray-50 dark:bg-gray-700/30 rounded-lg"
		>
			<div class="flex items-center gap-2 text-gray-700 dark:text-gray-300 text-sm mb-2">
				<Icon name="mdi:check-circle" class="w-4 h-4 text-green-500" />
				<span>Selected: {{ luts.find(l => l.id === selectedLut)?.name }}</span>
			</div>
			<div class="flex gap-2">
				<button
					class="flex-1 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded-lg transition-colors flex items-center justify-center gap-2"
					@click="handleExport"
				>
					<Icon name="mdi:download" class="w-4 h-4" />
					Export .cube
				</button>
				<button
					class="flex-1 px-3 py-1.5 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-900 dark:text-white text-sm rounded-lg transition-colors"
					@click="selectedLut = null"
				>
					Clear
				</button>
			</div>
		</div>

		<!-- Info -->
		<div class="p-3 bg-gray-100 dark:bg-gray-700/30 rounded-lg text-xs text-gray-500 dark:text-gray-400">
			<p class="mb-1">Supported formats: .cube (3D LUT)</p>
			<p>
				Max size: 64x64x64, Compatible with DaVinci Resolve, Premiere Pro, Final
				Cut Pro
			</p>
		</div>
	</div>
</template>
