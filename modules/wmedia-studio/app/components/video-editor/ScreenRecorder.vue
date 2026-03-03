<script setup lang="ts">
const emit = defineEmits<{ close: []; start: [settings: any]; stop: [] }>();
const isRecording = ref(false);
const duration = ref(0);
const audioEnabled = ref(true);
const showCursor = ref(true);
const quality = ref("high");

const qualities = [
	{ id: "low", name: "Low (720p)" },
	{ id: "medium", name: "Medium (1080p)" },
	{ id: "high", name: "High (1440p)" },
	{ id: "ultra", name: "Ultra (4K)" },
];

let timer: NodeJS.Timeout | null = null;

const start = () => {
	isRecording.value = true;
	duration.value = 0;
	timer = setInterval(() => duration.value++, 1000);
	emit("start", {
		quality: quality.value,
		audio: audioEnabled.value,
		cursor: showCursor.value,
	});
};

const stop = () => {
	isRecording.value = false;
	if (timer) clearInterval(timer);
	emit("stop");
};

const formatTime = (s: number) =>
	`${String(Math.floor(s / 60)).padStart(2, "0")}:${
		String(s % 60).padStart(2, "0")
	}`;
</script>
<template>
	<div class="screen-recorder bg-white dark:bg-gray-800 rounded-xl p-4 w-[450px] shadow-lg border border-gray-200 dark:border-gray-700">
		<div class="flex items-center justify-between mb-4">
			<h3 class="text-gray-900 dark:text-white font-semibold flex items-center gap-2">
				<Icon name="mdi:monitor" class="w-5 h-5 text-blue-500" />
				Screen Recorder
			</h3>
			<button
				class="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
				@click="emit('close')"
			>
				<Icon name="mdi:close" class="w-5 h-5" />
			</button>
		</div>
		<div class="aspect-video bg-gray-100 dark:bg-gray-700 rounded-lg mb-4 flex items-center justify-center">
			<div v-if="isRecording" class="text-center">
				<div class="w-16 h-16 bg-red-500 rounded-full flex items-center justify-center mb-2 animate-pulse">
					<Icon name="mdi:circle" class="w-8 h-8 text-white" />
				</div>
				<div class="text-red-500 font-mono text-2xl">
					{{ formatTime(duration) }}
				</div>
			</div>
			<div v-else class="text-gray-500 dark:text-gray-400 text-sm">
				Ready to record
			</div>
		</div>
		<div class="mb-4">
			<label
				class="text-gray-500 dark:text-gray-400 text-xs mb-2 block uppercase font-medium"
			>Quality</label>
			<select
				v-model="quality"
				:disabled="isRecording"
				class="w-full bg-white dark:bg-gray-700 text-gray-900 dark:text-white px-3 py-2 rounded-lg text-sm border-0"
			>
				<option v-for="q in qualities" :key="q.id" :value="q.id">
					{{ q.name }}
				</option>
			</select>
		</div>
		<div class="space-y-2 mb-4">
			<label
				class="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-700/30 rounded-lg cursor-pointer"
			>
				<span class="text-gray-700 dark:text-gray-300 text-sm"
				>Record Audio</span>
				<input
					v-model="audioEnabled"
					type="checkbox"
					:disabled="isRecording"
					class="w-4 h-4 rounded border-gray-300 text-blue-500 focus:ring-blue-500"
				>
			</label>
			<label
				class="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-700/30 rounded-lg cursor-pointer"
			>
				<span class="text-gray-700 dark:text-gray-300 text-sm"
				>Show Cursor</span>
				<input
					v-model="showCursor"
					type="checkbox"
					:disabled="isRecording"
					class="w-4 h-4 rounded border-gray-300 text-blue-500 focus:ring-blue-500"
				>
			</label>
		</div>
		<button
			class="w-full px-4 py-2.5 rounded-lg text-sm font-medium transition-colors"
			:class="isRecording
			? 'bg-red-600 hover:bg-red-700 text-white'
			: 'bg-blue-600 hover:bg-blue-700 text-white'"
			@click="isRecording ? stop() : start()"
		>
			<Icon
				:name="isRecording ? 'mdi:stop' : 'mdi:circle'"
				class="w-4 h-4 inline mr-2"
			/>{{ isRecording ? "Stop Recording" : "Start Recording" }}
		</button>
	</div>
</template>
