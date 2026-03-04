<script setup lang="ts">
import type { CrossfadeSettings } from "#shared/types/audio";

const props = defineProps<{
	tracks: {
		id: string;
		name: string;
		clips: { id: string; name: string; startTime: number; endTime: number }[];
	}[];
	selectedTrackId: string | null;
}>();

const emit = defineEmits<{
	apply: [settings: CrossfadeSettings];
}>();

const clipAId = ref("");
const clipBId = ref("");
const fadeInDuration = ref(0.5);
const fadeOutDuration = ref(0.5);
const curve = ref<"linear" | "equal_power" | "s_curve">("equal_power");
const overlapTime = ref(1);

const availableClips = computed(() => {
	if (!props.selectedTrackId) return [];
	const track = props.tracks.find(t => t.id === props.selectedTrackId);
	return track?.clips || [];
});

const canApply = computed(() => {
	return clipAId.value && clipBId.value && clipAId.value !== clipBId.value;
});

const applyCrossfade = () => {
	if (!canApply.value || !props.selectedTrackId) return;

	const settings: CrossfadeSettings = {
		clipAId: clipAId.value,
		clipBId: clipBId.value,
		trackId: props.selectedTrackId,
		fadeInDuration: fadeInDuration.value,
		fadeOutDuration: fadeOutDuration.value,
		curve: curve.value,
		overlapTime: overlapTime.value,
	};

	emit("apply", settings);
};

const curveOptions: {
	value: "linear" | "equal_power" | "s_curve";
	label: string;
	description: string;
}[] = [
	{ value: "linear", label: "Linear", description: "Constant fade rate" },
	{
		value: "equal_power",
		label: "Equal Power",
		description: "Smooth volume transition",
	},
	{ value: "s_curve", label: "S-Curve", description: "Natural fade curve" },
];

const previewCurve = computed(() => {
	const points: string[] = [];
	const width = 100;
	const height = 40;

	for (let i = 0; i <= width; i++) {
		const t = i / width;
		let y: number;

		switch (curve.value) {
			case "linear":
				y = t;
				break;
			case "equal_power":
				y = Math.sin(t * Math.PI / 2);
				break;
			case "s_curve":
				y = t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
				break;
			default:
				y = t;
		}

		points.push(`${i},${height - y * height}`);
	}

	return `M ${points.join(" L ")}`;
});
</script>

<template>
	<div class="bg-gray-900 border-b border-gray-700 p-4">
		<div class="flex items-center justify-between mb-4">
			<span class="text-gray-400 text-sm font-medium">Crossfade Editor</span>
		</div>

		<div class="space-y-4">
			<!-- Clip Selection -->
			<div class="grid grid-cols-2 gap-3">
				<div>
					<label class="block text-gray-400 text-xs mb-1"
					>Clip A (Fade Out)</label>
					<select
						v-model="clipAId"
						class="w-full bg-gray-800 text-white rounded px-3 py-2 text-sm border border-gray-700 focus:border-blue-500 focus:outline-none"
						:disabled="!selectedTrackId"
					>
						<option value="">Select clip...</option>
						<option
							v-for="clip in availableClips"
							:key="clip.id"
							:value="clip.id"
						>
							{{ clip.name }}
						</option>
					</select>
				</div>

				<div>
					<label class="block text-gray-400 text-xs mb-1"
					>Clip B (Fade In)</label>
					<select
						v-model="clipBId"
						class="w-full bg-gray-800 text-white rounded px-3 py-2 text-sm border border-gray-700 focus:border-blue-500 focus:outline-none"
						:disabled="!selectedTrackId"
					>
						<option value="">Select clip...</option>
						<option
							v-for="clip in availableClips"
							:key="clip.id"
							:value="clip.id"
						>
							{{ clip.name }}
						</option>
					</select>
				</div>
			</div>

			<!-- Fade Durations -->
			<div class="grid grid-cols-2 gap-3">
				<div>
					<div class="flex justify-between text-xs mb-1">
						<span class="text-gray-400">Fade Out</span>
						<span class="text-gray-300">{{ fadeOutDuration.toFixed(2) }}s</span>
					</div>
					<input
						v-model.number="fadeOutDuration"
						type="range"
						min="0.1"
						max="5"
						step="0.1"
						class="w-full accent-blue-500"
					>
				</div>

				<div>
					<div class="flex justify-between text-xs mb-1">
						<span class="text-gray-400">Fade In</span>
						<span class="text-gray-300">{{ fadeInDuration.toFixed(2) }}s</span>
					</div>
					<input
						v-model.number="fadeInDuration"
						type="range"
						min="0.1"
						max="5"
						step="0.1"
						class="w-full accent-blue-500"
					>
				</div>
			</div>

			<!-- Overlap -->
			<div>
				<div class="flex justify-between text-xs mb-1">
					<span class="text-gray-400">Overlap Time</span>
					<span class="text-gray-300">{{ overlapTime.toFixed(2) }}s</span>
				</div>
				<input
					v-model.number="overlapTime"
					type="range"
					min="0"
					max="5"
					step="0.1"
					class="w-full accent-blue-500"
				>
			</div>

			<!-- Curve Selection -->
			<div>
				<label class="block text-gray-400 text-xs mb-2">Fade Curve</label>
				<div class="grid grid-cols-3 gap-2">
					<button
						v-for="option in curveOptions"
						:key="option.value"
						@click="curve = option.value"
						:class="[
							'p-2 rounded text-xs text-center transition-colors',
							curve === option.value
								? 'bg-blue-600 text-white'
								: 'bg-gray-800 text-gray-400 hover:bg-gray-700',
						]"
					>
						<div class="font-medium">{{ option.label }}</div>
						<div class="text-xs opacity-75">{{ option.description }}</div>
					</button>
				</div>
			</div>

			<!-- Curve Preview -->
			<div class="bg-gray-800 rounded p-3">
				<label class="block text-gray-400 text-xs mb-2">Curve Preview</label>
				<svg viewBox="0 0 100 40" class="w-full h-10">
					<path
						:d="previewCurve"
						fill="none"
						stroke="#3b82f6"
						stroke-width="2"
					/>
					<line
						x1="0"
						y1="40"
						x2="100"
						y2="40"
						stroke="#4b5563"
						stroke-width="1"
					/>
				</svg>
			</div>

			<!-- Apply Button -->
			<button
				@click="applyCrossfade"
				:disabled="!canApply"
				class="w-full px-3 py-2 bg-green-600 hover:bg-green-700 disabled:bg-gray-700 disabled:opacity-50 text-white rounded text-sm transition-colors"
			>
				Apply Crossfade
			</button>
		</div>
	</div>
</template>
