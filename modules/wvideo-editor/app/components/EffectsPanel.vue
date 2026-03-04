<script setup lang="ts">
import { useVideoStore } from "~/stores/video";

const videoStore = useVideoStore();
const { selectedClipId, currentVideoProject } = storeToRefs(videoStore);

const selectedClip = computed(() => {
	if (!selectedClipId.value || !currentVideoProject.value) return null;
	return currentVideoProject.value.clips.find((c) =>
		c.id === selectedClipId.value
	);
});

const colorFilters = [
	{ name: "grayscale", icon: "⬛" },
	{ name: "sepia", icon: "🟤" },
	{ name: "invert", icon: "🔄" },
	{ name: "warm", icon: "🔥" },
	{ name: "cool", icon: "❄️" },
	{ name: "vintage", icon: "📷" },
];

const getEffectValue = (effectName: string) => {
	const effect = selectedClip.value?.effects?.find(e =>
		e.startsWith(`${effectName}:`)
	);
	if (!effect) return effectName === "speed" ? 1 : 0;
	const match = effect.match(/value:(-?\d+\.?\d*)/);
	return match ? Number(match[1]) : 0;
};

const setEffect = (effectName: string, value: number) => {
	if (!selectedClipId.value) return;

	const effects =
		selectedClip.value?.effects?.filter(e => !e.startsWith(`${effectName}:`))
		|| [];
	if (value !== 0) {
		effects.push(`${effectName}:value:${value}`);
	}

	videoStore.updateClip(selectedClipId.value, { effects });
};

const hasColorFilter = (filterName: string) => {
	return selectedClip.value?.effects?.includes(`color:${filterName}`) || false;
};

const toggleColorFilter = (filterName: string) => {
	if (!selectedClipId.value) return;

	const effects =
		selectedClip.value?.effects?.filter(e => e !== `color:${filterName}`) || [];
	if (!hasColorFilter(filterName)) {
		effects.push(`color:${filterName}`);
	}

	videoStore.updateClip(selectedClipId.value, { effects });
};

const resetEffects = () => {
	if (!selectedClipId.value) return;
	videoStore.updateClip(selectedClipId.value, { effects: [] });
};
</script>

<template>
	<div class="w-64 bg-gray-900 border-l border-gray-700 flex flex-col">
		<div class="h-12 bg-gray-800 flex items-center px-4 border-b border-gray-700">
			<span class="text-white font-medium">Effects</span>
		</div>

		<div class="flex-1 overflow-y-auto p-4">
			<div v-if="selectedClip" class="space-y-4">
				<div>
					<label class="block text-gray-400 text-sm mb-1">Brightness</label>
					<input
						:value="getEffectValue('brightness')"
						type="range"
						min="-100"
						max="100"
						class="w-full"
						@input="setEffect(
							'brightness',
							Number(($event.target as HTMLInputElement).value),
						)"
					>
					<div class="text-white text-sm mt-1">
						{{ getEffectValue("brightness") }}
					</div>
				</div>

				<div>
					<label class="block text-gray-400 text-sm mb-1">Contrast</label>
					<input
						:value="getEffectValue('contrast')"
						type="range"
						min="-100"
						max="100"
						class="w-full"
						@input="setEffect(
							'contrast',
							Number(($event.target as HTMLInputElement).value),
						)"
					>
					<div class="text-white text-sm mt-1">
						{{ getEffectValue("contrast") }}
					</div>
				</div>

				<div>
					<label class="block text-gray-400 text-sm mb-1">Saturation</label>
					<input
						:value="getEffectValue('saturation')"
						type="range"
						min="-100"
						max="100"
						class="w-full"
						@input="setEffect(
							'saturation',
							Number(($event.target as HTMLInputElement).value),
						)"
					>
					<div class="text-white text-sm mt-1">
						{{ getEffectValue("saturation") }}
					</div>
				</div>

				<div>
					<label class="block text-gray-400 text-sm mb-1">Blur</label>
					<input
						:value="getEffectValue('blur')"
						type="range"
						min="0"
						max="20"
						class="w-full"
						@input="setEffect(
							'blur',
							Number(($event.target as HTMLInputElement).value),
						)"
					>
					<div class="text-white text-sm mt-1">
						{{ getEffectValue("blur") }}px
					</div>
				</div>

				<div>
					<label class="block text-gray-400 text-sm mb-1">Speed</label>
					<select
						:value="getEffectValue('speed')"
						class="w-full bg-gray-800 text-white rounded px-3 py-2 text-sm border border-gray-700 focus:border-blue-500 focus:outline-none"
						@change="setEffect(
							'speed',
							Number(($event.target as HTMLSelectElement).value),
						)"
					>
						<option value="0.25">0.25x (Slow)</option>
						<option value="0.5">0.5x (Slow)</option>
						<option value="1">1x (Normal)</option>
						<option value="1.5">1.5x (Fast)</option>
						<option value="2">2x (Fast)</option>
						<option value="4">4x (Fast)</option>
					</select>
				</div>

				<div class="border-t border-gray-700 pt-4">
					<label class="block text-gray-400 text-sm mb-2">Color Filters</label>
					<div class="grid grid-cols-3 gap-2">
						<button
							v-for="filter in colorFilters"
							:key="filter.name"
							class="p-2 rounded text-xs"
							:class="hasColorFilter(filter.name)
							? 'bg-blue-600 text-white'
							: 'bg-gray-700 text-gray-300 hover:bg-gray-600'"
							@click="toggleColorFilter(filter.name)"
						>
							{{ filter.icon }}
						</button>
					</div>
				</div>

				<div class="border-t border-gray-700 pt-4">
					<button
						class="w-full py-2 bg-red-600 hover:bg-red-700 text-white rounded text-sm font-medium"
						@click="resetEffects"
					>
						Reset All Effects
					</button>
				</div>
			</div>

			<div v-else class="text-gray-500 text-sm text-center mt-8">
				Select a clip to apply effects
			</div>
		</div>
	</div>
</template>
