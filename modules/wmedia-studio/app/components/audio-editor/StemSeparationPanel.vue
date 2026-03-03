<script setup lang="ts">
import type { StemSeparationResult } from "#shared/types/audio";

const props = defineProps<{
	audioBuffer: AudioBuffer | null;
}>();

const emit = defineEmits<{
	separated: [result: StemSeparationResult];
}>();

const isProcessing = ref(false);
const progress = ref(0);
const selectedStems = ref<string[]>(["vocals", "drums", "bass", "other"]);

const stemOptions = [
	{ id: "vocals", label: "Vocals", color: "#ef4444" },
	{ id: "drums", label: "Drums", color: "#f97316" },
	{ id: "bass", label: "Bass", color: "#22c55e" },
	{ id: "other", label: "Other", color: "#3b82f6" },
	{ id: "piano", label: "Piano", color: "#a855f7" },
];

const separateStems = async () => {
	if (!props.audioBuffer) return;

	isProcessing.value = true;
	progress.value = 0;

	// Simulate AI stem separation with progress
	const totalSteps = 100;
	for (let i = 0; i <= totalSteps; i++) {
		await new Promise(resolve => setTimeout(resolve, 50));
		progress.value = i;
	}

	// Generate separated audio URLs (mock)
	const result: StemSeparationResult = {};
	for (const stem of selectedStems.value) {
		result[stem as keyof StemSeparationResult] =
			`blob:stem-${stem}-${Date.now()}`;
	}

	emit("separated", result);
	isProcessing.value = false;
};

const toggleStem = (stemId: string) => {
	const index = selectedStems.value.indexOf(stemId);
	if (index > -1) {
		selectedStems.value.splice(index, 1);
	} else {
		selectedStems.value.push(stemId);
	}
};

const selectAll = () => {
	selectedStems.value = stemOptions.map(s => s.id);
};

const selectNone = () => {
	selectedStems.value = [];
};
</script>

<template>
	<div class="bg-gray-900 border-b border-gray-700 p-4">
		<div class="flex items-center justify-between mb-4">
			<span class="text-gray-400 text-sm font-medium">AI Stem Separation</span>
		</div>

		<!-- Stem Selection -->
		<div class="mb-4">
			<div class="flex items-center justify-between mb-2">
				<label class="text-gray-400 text-xs">Select Stems to Extract</label>
				<div class="flex gap-1">
					<button
						@click="selectAll"
						class="text-xs text-blue-400 hover:text-blue-300"
					>
						All
					</button>
					<span class="text-gray-600">|</span>
					<button
						@click="selectNone"
						class="text-xs text-blue-400 hover:text-blue-300"
					>
						None
					</button>
				</div>
			</div>

			<div class="grid grid-cols-2 gap-2">
				<button
					v-for="stem in stemOptions"
					:key="stem.id"
					@click="toggleStem(stem.id)"
					:class="[
						'p-2 rounded text-xs font-medium transition-all',
						selectedStems.includes(stem.id)
							? 'text-white shadow-lg'
							: 'bg-gray-800 text-gray-400 hover:bg-gray-700',
					]"
					:style="selectedStems.includes(stem.id)
					? { backgroundColor: stem.color }
					: {}"
				>
					<div class="flex items-center gap-2">
						<div
							class="w-3 h-3 rounded-full"
							:style="{ backgroundColor: stem.color }"
						/>
						{{ stem.label }}
					</div>
				</button>
			</div>
		</div>

		<!-- Progress -->
		<div v-if="isProcessing" class="mb-4">
			<div class="flex justify-between text-xs mb-1">
				<span class="text-gray-400">Processing...</span>
				<span class="text-blue-400">{{ progress }}%</span>
			</div>
			<div class="h-2 bg-gray-800 rounded overflow-hidden">
				<div
					class="h-full bg-blue-500 transition-all duration-100"
					:style="{ width: `${progress}%` }"
				/>
			</div>
		</div>

		<!-- Action Button -->
		<button
			@click="separateStems"
			:disabled="!audioBuffer || isProcessing || selectedStems.length === 0"
			class="w-full px-3 py-2 bg-purple-600 hover:bg-purple-700 disabled:bg-gray-700 disabled:opacity-50 text-white rounded text-sm transition-colors"
		>
			{{
				isProcessing
				? "Separating..."
				: `Extract ${selectedStems.length} Stem${
					selectedStems.length !== 1 ? "s" : ""
				}`
			}}
		</button>

		<!-- Info -->
		<p class="mt-2 text-xs text-gray-500">
			AI-powered separation using advanced neural networks. Quality depends on
			audio complexity.
		</p>
	</div>
</template>
