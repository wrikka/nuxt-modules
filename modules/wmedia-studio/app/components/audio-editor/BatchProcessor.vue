<script setup lang="ts">
import type { AudioClip, BatchProcessJob } from "#shared/types/audio";
import { nanoid } from "nanoid";

const props = defineProps<{
	clips: AudioClip[];
}>();

const emit = defineEmits<{
	process: [job: BatchProcessJob];
}>();

const selectedClipIds = ref<string[]>([]);
const selectedEffect = ref<string>("normalize");
const isProcessing = ref(false);

const effectOptions = [
	{
		value: "normalize",
		label: "Normalize",
		icon:
			"M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z",
	},
	{
		value: "fadeIn",
		label: "Fade In",
		icon: "M15.536 8.464a5 5 0 010 7.072M12 12a4 4 0 00-4 4v1",
	},
	{
		value: "fadeOut",
		label: "Fade Out",
		icon: "M8.464 15.536a5 5 0 010-7.072M12 12a4 4 0 004-4V7",
	},
	{ value: "compress", label: "Compress", icon: "M13 10V3L4 14h7v7l9-11h-7z" },
	{
		value: "gate",
		label: "Noise Gate",
		icon:
			"M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636",
	},
	{
		value: "eq",
		label: "EQ Adjust",
		icon:
			"M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3",
	},
];

const effectParams = ref<Record<string, number>>({});

const paramConfigs: Record<
	string,
	{ name: string; min: number; max: number; step: number; default: number }[]
> = {
	normalize: [{ name: "target", min: -23, max: -8, step: 0.5, default: -16 }],
	fadeIn: [{ name: "duration", min: 0.1, max: 5, step: 0.1, default: 1 }],
	fadeOut: [{ name: "duration", min: 0.1, max: 5, step: 0.1, default: 1 }],
	compress: [
		{ name: "threshold", min: -60, max: 0, step: 1, default: -24 },
		{ name: "ratio", min: 1, max: 20, step: 0.5, default: 4 },
	],
	gate: [
		{ name: "threshold", min: -80, max: -20, step: 1, default: -50 },
		{ name: "reduction", min: 0, max: 60, step: 1, default: 20 },
	],
	eq: [
		{ name: "low", min: -12, max: 12, step: 0.5, default: 0 },
		{ name: "mid", min: -12, max: 12, step: 0.5, default: 0 },
		{ name: "high", min: -12, max: 12, step: 0.5, default: 0 },
	],
};

const currentParams = computed(() => {
	return paramConfigs[selectedEffect.value] || [];
});

// Initialize params when effect changes
watch(selectedEffect, (newEffect) => {
	const configs = paramConfigs[newEffect] || [];
	effectParams.value = {};
	for (const config of configs) {
		effectParams.value[config.name] = config.default;
	}
}, { immediate: true });

const toggleClip = (clipId: string) => {
	const index = selectedClipIds.value.indexOf(clipId);
	if (index > -1) {
		selectedClipIds.value.splice(index, 1);
	} else {
		selectedClipIds.value.push(clipId);
	}
};

const selectAll = () => {
	selectedClipIds.value = props.clips.map(c => c.id);
};

const selectNone = () => {
	selectedClipIds.value = [];
};

const startBatchProcess = async () => {
	if (selectedClipIds.value.length === 0) return;

	isProcessing.value = true;

	const job: BatchProcessJob = {
		id: nanoid(),
		clipIds: [...selectedClipIds.value],
		effect: selectedEffect.value,
		params: { ...effectParams.value },
		status: "processing",
		progress: 0,
	};

	emit("process", job);

	// Simulate processing
	for (let i = 0; i <= 100; i += 10) {
		job.progress = i;
		await new Promise(resolve => setTimeout(resolve, 100));
	}

	job.status = "completed";
	job.progress = 100;
	isProcessing.value = false;
};

const formatDuration = (duration: number): string => {
	const mins = Math.floor(duration / 60);
	const secs = Math.floor(duration % 60);
	return `${mins}:${secs.toString().padStart(2, "0")}`;
};
</script>

<template>
	<div class="bg-gray-900 border-b border-gray-700 p-4">
		<div class="flex items-center justify-between mb-4">
			<span class="text-gray-400 text-sm font-medium">Batch Processor</span>
			<span class="text-xs text-gray-500">{{ selectedClipIds.length }} clips
				selected</span>
		</div>

		<!-- Clip Selection -->
		<div class="mb-4 bg-gray-800 rounded p-3 max-h-40 overflow-y-auto">
			<div class="flex items-center justify-between mb-2">
				<span class="text-xs text-gray-400">Select Clips</span>
				<div class="flex gap-2">
					<button
						@click="selectAll"
						class="text-xs text-blue-400 hover:text-blue-300"
					>
						All
					</button>
					<button
						@click="selectNone"
						class="text-xs text-blue-400 hover:text-blue-300"
					>
						None
					</button>
				</div>
			</div>
			<div class="space-y-1">
				<label
					v-for="clip in clips"
					:key="clip.id"
					class="flex items-center gap-2 p-2 rounded hover:bg-gray-700 cursor-pointer"
				>
					<input
						type="checkbox"
						:checked="selectedClipIds.includes(clip.id)"
						@change="toggleClip(clip.id)"
						class="accent-blue-500"
					>
					<span class="text-sm text-gray-300 truncate flex-1">{{
						clip.name
					}}</span>
					<span class="text-xs text-gray-500">{{
						formatDuration(clip.duration)
					}}</span>
				</label>
			</div>
		</div>

		<!-- Effect Selection -->
		<div class="mb-4">
			<label class="block text-gray-400 text-xs mb-2">Effect</label>
			<div class="grid grid-cols-3 gap-2">
				<button
					v-for="effect in effectOptions"
					:key="effect.value"
					@click="selectedEffect = effect.value"
					:class="[
						'p-2 rounded text-xs flex flex-col items-center gap-1 transition-colors',
						selectedEffect === effect.value
							? 'bg-blue-600 text-white'
							: 'bg-gray-800 text-gray-400 hover:bg-gray-700',
					]"
				>
					<svg
						class="w-4 h-4"
						fill="none"
						viewBox="0 0 24 24"
						stroke="currentColor"
					>
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							:d="effect.icon"
						/>
					</svg>
					{{ effect.label }}
				</button>
			</div>
		</div>

		<!-- Parameters -->
		<div v-if="currentParams.length > 0" class="mb-4 space-y-3">
			<div v-for="param in currentParams" :key="param.name">
				<div class="flex justify-between text-xs mb-1">
					<span class="text-gray-400 capitalize">{{ param.name }}</span>
					<span class="text-gray-300">{{ effectParams[param.name] }}</span>
				</div>
				<input
					v-model.number="effectParams[param.name]"
					type="range"
					:min="param.min"
					:max="param.max"
					:step="param.step"
					class="w-full accent-blue-500"
				>
			</div>
		</div>

		<!-- Action Button -->
		<button
			@click="startBatchProcess"
			:disabled="selectedClipIds.length === 0 || isProcessing"
			class="w-full px-3 py-2 bg-green-600 hover:bg-green-700 disabled:bg-gray-700 disabled:opacity-50 text-white rounded text-sm transition-colors"
		>
			{{
				isProcessing
				? "Processing..."
				: `Process ${selectedClipIds.length} Clip${
					selectedClipIds.length !== 1 ? "s" : ""
				}`
			}}
		</button>
	</div>
</template>
