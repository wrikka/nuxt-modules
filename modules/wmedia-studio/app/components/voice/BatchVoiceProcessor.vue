<script setup lang="ts">
const emit = defineEmits<
	{ close: []; process: [files: string[], settings: any] }
>();
const files = ref([{ name: "voiceover_01.wav", size: "2.4 MB" }, {
	name: "podcast_ep3.wav",
	size: "15.2 MB",
}]);
const selectedFiles = ref<string[]>([]);
const operation = ref("normalize");
const isProcessing = ref(false);
const progress = ref(0);
const operations = [
	{ id: "normalize", name: "Normalize" },
	{ id: "denoise", name: "De-noise" },
	{ id: "enhance", name: "AI Enhance" },
	{ id: "convert", name: "Convert Format" },
];
const toggleFile = (name: string) => {
	const i = selectedFiles.value.indexOf(name);
	if (i > -1) selectedFiles.value.splice(i, 1);
	else selectedFiles.value.push(name);
};
const processAll = () => {
	isProcessing.value = true;
	progress.value = 0;
	const interval = setInterval(() => {
		progress.value += 10;
		if (progress.value >= 100) {
			clearInterval(interval);
			isProcessing.value = false;
			emit("process", selectedFiles.value, { operation: operation.value });
		}
	}, 200);
};
</script>
<template>
	<div class="batch-voice-processor bg-gray-800 rounded-lg p-4 w-[450px] max-h-[80vh] flex flex-col">
		<div class="flex items-center justify-between mb-4">
			<h3 class="text-white font-semibold flex items-center gap-2">
				<Icon name="i-ph-stack" class="w-5 h-5" />Batch Voice Processor
			</h3>
			<button class="text-gray-400 hover:text-white" @click="emit('close')">
				<Icon name="i-ph-x" class="w-4 h-4" />
			</button>
		</div>
		<div class="mb-4">
			<label class="text-gray-300 text-sm mb-2 block">Operation</label>
			<select
				v-model="operation"
				class="w-full bg-gray-700 text-white px-3 py-2 rounded-lg text-sm"
			>
				<option v-for="op in operations" :key="op.id" :value="op.id">
					{{ op.name }}
				</option>
			</select>
		</div>
		<div class="flex-1 mb-4">
			<label class="text-gray-300 text-sm mb-2 block"
			>Files ({{ selectedFiles.length }}/{{ files.length }})</label>
			<div class="space-y-2">
				<div
					v-for="file in files"
					:key="file.name"
					class="flex items-center gap-3 p-2 rounded-lg cursor-pointer"
					:class="selectedFiles.includes(file.name)
					? 'bg-blue-600/30 ring-1 ring-blue-500'
					: 'bg-gray-700/30'"
					@click="toggleFile(file.name)"
				>
					<input
						type="checkbox"
						:checked="selectedFiles.includes(file.name)"
						class="w-4 h-4 rounded"
						@click.stop
					>
					<Icon name="i-ph-file-audio" class="w-5 h-5 text-gray-400" />
					<div class="flex-1">
						<div class="text-white text-sm">{{ file.name }}</div>
						<div class="text-gray-500 text-xs">{{ file.size }}</div>
					</div>
				</div>
			</div>
		</div>
		<div v-if="isProcessing" class="mb-4">
			<div class="flex items-center justify-between text-sm mb-2">
				<span class="text-gray-300">Processing...</span><span
					class="text-blue-400"
				>{{ progress }}%</span>
			</div>
			<div class="h-2 bg-gray-700 rounded-full overflow-hidden">
				<div
					class="h-full bg-blue-500 rounded-full transition-all"
					:style="{ width: `${progress}%` }"
				/>
			</div>
		</div>
		<div class="flex gap-2">
			<button
				class="flex-1 px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg text-sm"
				@click="emit('close')"
			>
				Cancel
			</button>
			<button
				class="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-sm font-medium flex items-center justify-center gap-2"
				:disabled="isProcessing || selectedFiles.length === 0"
				@click="processAll"
			>
				<Icon
					v-if="isProcessing"
					name="i-ph-spinner"
					class="w-4 h-4 animate-spin"
				/>Process {{ selectedFiles.length }} Files
			</button>
		</div>
	</div>
</template>
