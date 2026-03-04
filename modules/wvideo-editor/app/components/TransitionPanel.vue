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

const hasInTransition = computed(() => {
	return selectedClip.value?.effects?.some(e => e.startsWith("in:"));
});

const hasOutTransition = computed(() => {
	return selectedClip.value?.effects?.some(e => e.startsWith("out:"));
});

const getTransitionDuration = (type: "in" | "out") => {
	const effect = selectedClip.value?.effects?.find(e =>
		e.startsWith(`${type}:`)
	);
	if (!effect) return 1;
	const match = effect.match(/duration:(\d+\.?\d*)/);
	return match ? Number(match[1]) : 1;
};

const setInTransition = (value: string) => {
	if (!selectedClipId.value) return;

	const effects = selectedClip.value?.effects?.filter(e => !e.startsWith("in:"))
		|| [];
	if (value) {
		effects.push(`${value}:duration:1`);
	}
	videoStore.updateClip(selectedClipId.value, { effects });
};

const setOutTransition = (value: string) => {
	if (!selectedClipId.value) return;

	const effects =
		selectedClip.value?.effects?.filter(e => !e.startsWith("out:")) || [];
	if (value) {
		effects.push(`${value}:duration:1`);
	}
	videoStore.updateClip(selectedClipId.value, { effects });
};

const setTransitionDuration = (type: "in" | "out", duration: number) => {
	if (!selectedClipId.value) return;

	const effects = selectedClip.value?.effects?.map(e => {
		if (e.startsWith(`${type}:`)) {
			return e.replace(/duration:\d+\.?\d*/, `duration:${duration}`);
		}
		return e;
	}) || [];

	videoStore.updateClip(selectedClipId.value, { effects });
};

const applyTransitionToSelected = (type: string) => {
	if (!selectedClipId.value) return;

	const effects = [
		`in:${type}:duration:0.5`,
		`out:${type}:duration:0.5`,
	];

	videoStore.updateClip(selectedClipId.value, { effects });
};
</script>

<template>
	<div class="w-64 bg-gray-900 border-l border-gray-700 flex flex-col">
		<div class="h-12 bg-gray-800 flex items-center px-4 border-b border-gray-700">
			<span class="text-white font-medium">Transitions</span>
		</div>

		<div class="flex-1 overflow-y-auto p-4">
			<div v-if="selectedClip" class="space-y-4">
				<div>
					<label class="block text-gray-400 text-sm mb-2">In Transition</label>
					<select
						:value="selectedClip.effects?.find(e => e.startsWith('in:')) || ''"
						class="w-full bg-gray-800 text-white rounded px-3 py-2 text-sm border border-gray-700 focus:border-blue-500 focus:outline-none"
						@change="setInTransition(($event.target as HTMLSelectElement).value)"
					>
						<option value="">None</option>
						<option value="in:fade">Fade In</option>
						<option value="in:slide-left">Slide Left</option>
						<option value="in:slide-right">Slide Right</option>
						<option value="in:slide-up">Slide Up</option>
						<option value="in:slide-down">Slide Down</option>
						<option value="in:zoom-in">Zoom In</option>
					</select>
				</div>

				<div v-if="hasInTransition">
					<label class="block text-gray-400 text-sm mb-1">Duration (s)</label>
					<input
						:value="getTransitionDuration('in')"
						type="number"
						step="0.1"
						min="0.1"
						max="5"
						class="w-full bg-gray-800 text-white rounded px-3 py-2 text-sm border border-gray-700 focus:border-blue-500 focus:outline-none"
						@input="setTransitionDuration(
							'in',
							Number(($event.target as HTMLInputElement).value),
						)"
					>
				</div>

				<div class="border-t border-gray-700 pt-4">
					<label class="block text-gray-400 text-sm mb-2">Out Transition</label>
					<select
						:value="selectedClip.effects?.find(e => e.startsWith('out:')) || ''"
						class="w-full bg-gray-800 text-white rounded px-3 py-2 text-sm border border-gray-700 focus:border-blue-500 focus:outline-none"
						@change="setOutTransition(($event.target as HTMLSelectElement).value)"
					>
						<option value="">None</option>
						<option value="out:fade">Fade Out</option>
						<option value="out:slide-left">Slide Left</option>
						<option value="out:slide-right">Slide Right</option>
						<option value="out:slide-up">Slide Up</option>
						<option value="out:slide-down">Slide Down</option>
						<option value="out:zoom-out">Zoom Out</option>
					</select>
				</div>

				<div v-if="hasOutTransition">
					<label class="block text-gray-400 text-sm mb-1">Duration (s)</label>
					<input
						:value="getTransitionDuration('out')"
						type="number"
						step="0.1"
						min="0.1"
						max="5"
						class="w-full bg-gray-800 text-white rounded px-3 py-2 text-sm border border-gray-700 focus:border-blue-500 focus:outline-none"
						@input="setTransitionDuration(
							'out',
							Number(($event.target as HTMLInputElement).value),
						)"
					>
				</div>
			</div>

			<div v-else class="space-y-3">
				<div class="text-gray-400 text-sm mb-2">Quick Apply</div>

				<button
					class="w-full py-2 bg-gray-800 hover:bg-gray-700 text-white rounded text-sm flex items-center justify-center gap-2"
					@click="applyTransitionToSelected('fade')"
				>
					<span>🌫️</span>
					<span>Fade</span>
				</button>

				<button
					class="w-full py-2 bg-gray-800 hover:bg-gray-700 text-white rounded text-sm flex items-center justify-center gap-2"
					@click="applyTransitionToSelected('slide')"
				>
					<span>➡️</span>
					<span>Slide</span>
				</button>

				<button
					class="w-full py-2 bg-gray-800 hover:bg-gray-700 text-white rounded text-sm flex items-center justify-center gap-2"
					@click="applyTransitionToSelected('zoom')"
				>
					<span>🔍</span>
					<span>Zoom</span>
				</button>
			</div>
		</div>
	</div>
</template>
