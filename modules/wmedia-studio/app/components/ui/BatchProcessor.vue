<script setup lang="ts">
const emit = defineEmits<
	{ close: []; process: [files: string[], operation: string] }
>();
const files = ref([{ id: "1", name: "video1.mp4", selected: false }, {
	id: "2",
	name: "video2.mp4",
	selected: false,
}, { id: "3", name: "video3.mp4", selected: false }]);
const operation = ref("convert");
const isProcessing = ref(false);
const progress = ref(0);

const operations = [
	{ id: "convert", name: "Convert Format" },
	{ id: "compress", name: "Compress" },
	{ id: "watermark", name: "Add Watermark" },
	{ id: "thumbnail", name: "Generate Thumbnails" },
];

const selectedCount = computed(() =>
	files.value.filter(f => f.selected).length
);

const processAll = () => {
	const selected = files.value.filter(f => f.selected).map(f => f.id);
	if (selected.length === 0) return;
	isProcessing.value = true;
	progress.value = 0;
	const interval = setInterval(() => {
		progress.value += 10;
		if (progress.value >= 100) {
			clearInterval(interval);
			isProcessing.value = false;
			emit("process", selected, operation.value);
		}
	}, 200);
};
</script>
<template>
	<div class="batch-processor bg-white dark:bg-gray-800 rounded-xl p-4 w-[500px] max-h-[80vh] flex flex-col shadow-lg border border-gray-200 dark:border-gray-700">
		<div class="flex items-center justify-between mb-4">
			<h3 class="text-gray-900 dark:text-white font-semibold flex items-center gap-2">
				<Icon name="mdi:layers" class="w-5 h-5 text-blue-500" />
				Batch Processor
			</h3>
			<button
				class="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
				@click="emit('close')"
			>
				<Icon name="mdi:close" class="w-5 h-5" />
			</button>
		</div>
		<div class="mb-4">
			<label
				class="text-gray-500 dark:text-gray-400 text-xs mb-2 block uppercase font-medium"
			>Operation</label>
			<select
				v-model="operation"
				class="w-full bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white px-3 py-2 rounded-lg text-sm border-0"
			>
				<option v-for="op in operations" :key="op.id" :value="op.id">
					{{ op.name }}
				</option>
			</select>
		</div>
		<div class="flex-1 overflow-y-auto mb-4">
			<label
				class="text-gray-500 dark:text-gray-400 text-xs mb-2 block uppercase font-medium"
			>Files ({{ selectedCount }} selected)</label>
			<div class="space-y-2">
				<div
					v-for="file in files"
					:key="file.id"
					class="flex items-center gap-3 p-2 bg-gray-50 dark:bg-gray-700/50 rounded-lg"
				>
					<input
						v-model="file.selected"
						type="checkbox"
						class="w-4 h-4 rounded border-gray-300 text-blue-500 focus:ring-blue-500"
					>
					<Icon name="mdi:file-video" class="w-5 h-5 text-gray-400" />
					<span class="text-gray-900 dark:text-white text-sm">{{
						file.name
					}}</span>
				</div>
			</div>
		</div>
		<div v-if="isProcessing" class="mb-4">
			<div class="flex justify-between text-sm mb-1">
				<span class="text-gray-600 dark:text-gray-400">Processing...</span>
				<span class="text-blue-500 font-medium">{{ progress }}%</span>
			</div>
			<div class="h-2 bg-gray-200 dark:bg-gray-700 rounded-full">
				<div
					class="h-full bg-blue-500 rounded-full transition-all"
					:style="{ width: `${progress}%` }"
				/>
			</div>
		</div>
		<button
			class="w-full px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-colors"
			:disabled="isProcessing || selectedCount === 0"
			@click="processAll"
		>
			<Icon
				v-if="isProcessing"
				name="mdi:loading"
				class="w-4 h-4 animate-spin inline mr-2"
			/>
			Process {{ selectedCount }} Files
		</button>
	</div>
</template>
