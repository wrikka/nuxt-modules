<script setup lang="ts">
const emit = defineEmits<{
	close: [];
	separateStems: [stems: string[]];
}>();

const selectedStems = ref(["vocals", "drums", "bass", "other"]);
const isProcessing = ref(false);
const progress = ref(0);

const stemOptions = [
	{
		id: "vocals",
		name: "Vocals",
		icon: "i-ph-microphone",
		color: "bg-blue-500",
	},
	{ id: "drums", name: "Drums", icon: "i-ph-drum", color: "bg-red-500" },
	{ id: "bass", name: "Bass", icon: "i-ph-guitar", color: "bg-yellow-500" },
	{
		id: "other",
		name: "Other",
		icon: "i-ph-piano-keys",
		color: "bg-green-500",
	},
];

const toggleStem = (stemId: string) => {
	const index = selectedStems.value.indexOf(stemId);
	if (index > -1) {
		selectedStems.value.splice(index, 1);
	} else {
		selectedStems.value.push(stemId);
	}
};

const startSeparation = () => {
	if (selectedStems.value.length === 0) return;

	isProcessing.value = true;
	progress.value = 0;

	const interval = setInterval(() => {
		progress.value += 5;
		if (progress.value >= 100) {
			clearInterval(interval);
			isProcessing.value = false;
			emit("separateStems", selectedStems.value);
		}
	}, 150);
};

const previewStem = (stemId: string) => {
	// Preview individual stem
};
</script>

<template>
	<div class="stem-separator bg-gray-800 rounded-lg p-4 w-[450px]">
		<div class="flex items-center justify-between mb-4">
			<h3 class="text-white font-semibold flex items-center gap-2">
				<Icon name="i-ph-music-notes" class="w-5 h-5" />
				AI Stem Separation
			</h3>
			<button class="text-gray-400 hover:text-white" @click="emit('close')">
				<Icon name="i-ph-x" class="w-4 h-4" />
			</button>
		</div>

		<p class="text-gray-400 text-sm mb-4">
			Separate audio into individual stems using AI.
		</p>

		<!-- Stem Selection -->
		<div class="mb-4">
			<label class="text-gray-300 text-sm mb-2 block"
			>Select Stems to Extract</label>
			<div class="space-y-2">
				<div
					v-for="stem in stemOptions"
					:key="stem.id"
					class="flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-colors"
					:class="selectedStems.includes(stem.id)
					? 'bg-blue-600/30 ring-1 ring-blue-500'
					: 'bg-gray-700/50 hover:bg-gray-700'"
					@click="toggleStem(stem.id)"
				>
					<input
						type="checkbox"
						:checked="selectedStems.includes(stem.id)"
						class="w-4 h-4 rounded"
						@click.stop
					>
					<div
						class="w-8 h-8 rounded-lg flex items-center justify-center"
						:class="stem.color"
					>
						<Icon :name="stem.icon" class="w-4 h-4 text-white" />
					</div>
					<div class="flex-1">
						<div class="text-white text-sm font-medium">{{ stem.name }}</div>
					</div>
				</div>
			</div>
		</div>

		<!-- Progress -->
		<div v-if="isProcessing" class="mb-4">
			<div class="flex items-center justify-between text-sm mb-2">
				<span class="text-gray-300">Separating stems...</span>
				<span class="text-blue-400">{{ progress }}%</span>
			</div>
			<div class="h-2 bg-gray-700 rounded-full overflow-hidden">
				<div
					class="h-full bg-blue-500 rounded-full transition-all"
					:style="{ width: `${progress}%` }"
				/>
			</div>
		</div>

		<!-- Actions -->
		<div class="flex gap-2">
			<button
				class="flex-1 px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg text-sm"
				@click="emit('close')"
			>
				Cancel
			</button>
			<button
				class="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-sm font-medium flex items-center justify-center gap-2"
				:disabled="isProcessing || selectedStems.length === 0"
				@click="startSeparation"
			>
				<Icon
					v-if="isProcessing"
					name="i-ph-spinner"
					class="w-4 h-4 animate-spin"
				/>
				Separate Stems
			</button>
		</div>
	</div>
</template>
