<script setup lang="ts">
import type { AnimatableProperty } from "#shared/types/project";
import { useVideoEditor } from "~/composables/useVideoEditor";

const {
	selectedClipId,
	currentVideoProject,
	currentTime,
	formatTime,
	getTransformPropertiesAtTime,
	addKeyframe,
	removeKeyframe,
	addTransition,
	removeTransition,
	updateColorCorrection,
	resetColorCorrection,
	applyNoiseReduction,
} = useVideoEditor();

const selectedClip = computed(() => {
	if (!selectedClipId.value || !currentVideoProject.value) return null;
	return currentVideoProject.value.clips.find((c) =>
		c.id === selectedClipId.value
	);
});

const animatedTransform = computed(() => {
	if (!selectedClip.value || !selectedClip.value.transform) return null;
	return getTransformPropertiesAtTime(selectedClip.value, currentTime.value);
});

const hasKeyframeAtCurrentTime = (property: AnimatableProperty) => {
	if (!selectedClip.value || !selectedClip.value.transform) return false;
	const clipTime = currentTime.value - selectedClip.value.startTime;
	return selectedClip.value.transform[property].some(kf =>
		Math.abs(kf.time - clipTime) < 0.01
	);
};

const toggleKeyframe = (property: AnimatableProperty) => {
	if (
		!selectedClip.value || !animatedTransform.value
		|| !selectedClip.value.transform
	) return;
	const clipTime = currentTime.value - selectedClip.value.startTime;

	if (hasKeyframeAtCurrentTime(property)) {
		const keyframe = selectedClip.value.transform[property].find(kf =>
			Math.abs(kf.time - clipTime) < 0.01
		);
		if (keyframe) {
			removeKeyframe(selectedClip.value.id, property, keyframe.id);
		}
	} else {
		const currentValue =
			animatedTransform.value[property as keyof typeof animatedTransform.value];
		if (typeof currentValue === "number") {
			addKeyframe(selectedClip.value.id, property, clipTime, currentValue);
		}
	}
};

const updateValueAndAddKeyframe = (
	property: AnimatableProperty,
	value: number,
) => {
	if (!selectedClip.value) return;
	const clipTime = currentTime.value - selectedClip.value.startTime;
	addKeyframe(selectedClip.value.id, property, clipTime, value);
};

const transitionDuration = ref(1.0);
const noiseReductionStrength = ref(50);
const isApplyingNoiseReduction = ref(false);

const addTransitionToClip = (
	position: "in" | "out",
	type: "fade" | "dissolve",
) => {
	if (!selectedClip.value) return;
	addTransition(
		selectedClip.value.id,
		type,
		transitionDuration.value,
		position,
	);
};

const removeTransitionFromClip = (position: "in" | "out") => {
	if (!selectedClip.value) return;
	removeTransition(selectedClip.value.id, position);
};

const handleApplyNoiseReduction = async () => {
	if (!selectedClip.value) return;
	isApplyingNoiseReduction.value = true;
	await applyNoiseReduction(
		selectedClip.value.id,
		noiseReductionStrength.value,
	);
	isApplyingNoiseReduction.value = false;
};
</script>

<template>
	<div class="w-64 bg-gray-900 border-l border-gray-700 flex flex-col">
		<div class="h-12 bg-gray-800 flex items-center px-4 border-b border-gray-700">
			<span class="text-white font-medium">Properties</span>
		</div>

		<div class="flex-1 overflow-y-auto p-4">
			<div v-if="selectedClip" class="space-y-4">
				<div>
					<label class="block text-gray-400 text-sm mb-1">Name</label>
					<input
						v-model="selectedClip.name"
						type="text"
						class="w-full bg-gray-800 text-white rounded px-3 py-2 text-sm border border-gray-700 focus:border-blue-500 focus:outline-none"
					>
				</div>

				<div>
					<label class="block text-gray-400 text-sm mb-1">Type</label>
					<div class="bg-gray-800 text-white rounded px-3 py-2 text-sm">
						{{ selectedClip.type }}
					</div>
				</div>

				<div>
					<label class="block text-gray-400 text-sm mb-1">Duration</label>
					<div class="bg-gray-800 text-white rounded px-3 py-2 text-sm">
						{{ formatTime(selectedClip.duration) }}
					</div>
				</div>

				<div
					v-if="selectedClip.transform && animatedTransform"
					class="space-y-4"
				>
					<div>
						<label class="block text-gray-400 text-sm mb-1">Position X</label>
						<div class="flex items-center gap-2">
							<button
								@click="toggleKeyframe('x')"
								class="p-1 rounded hover:bg-gray-700"
								:class="hasKeyframeAtCurrentTime('x')
								? 'text-blue-400'
								: 'text-gray-500'"
							>
								<svg
									viewBox="0 0 24 24"
									width="16"
									height="16"
									fill="currentColor"
								>
									<path d="M12 18.414l-6.364-6.364 1.414-1.414L12 15.586l4.95-4.95 1.414 1.414L12 18.414zM12 5.586L5.636 11.95l-1.414-1.414L12 2.758l7.778 7.778-1.414 1.414L12 5.586z" />
								</svg>
							</button>
							<input
								:value="animatedTransform?.x ?? 0"
								type="number"
								class="w-full bg-gray-800 text-white rounded px-3 py-2 text-sm border border-gray-700 focus:border-blue-500 focus:outline-none"
								@input="updateValueAndAddKeyframe(
									'x',
									Number(($event.target as HTMLInputElement).value),
								)"
							>
						</div>
					</div>

					<div>
						<label class="block text-gray-400 text-sm mb-1">Position Y</label>
						<div class="flex items-center gap-2">
							<button
								@click="toggleKeyframe('y')"
								class="p-1 rounded hover:bg-gray-700"
								:class="hasKeyframeAtCurrentTime('y')
								? 'text-blue-400'
								: 'text-gray-500'"
							>
								<svg
									viewBox="0 0 24 24"
									width="16"
									height="16"
									fill="currentColor"
								>
									<path d="M12 18.414l-6.364-6.364 1.414-1.414L12 15.586l4.95-4.95 1.414 1.414L12 18.414zM12 5.586L5.636 11.95l-1.414-1.414L12 2.758l7.778 7.778-1.414 1.414L12 5.586z" />
								</svg>
							</button>
							<input
								:value="animatedTransform?.y ?? 0"
								type="number"
								class="w-full bg-gray-800 text-white rounded px-3 py-2 text-sm border border-gray-700 focus:border-blue-500 focus:outline-none"
								@input="updateValueAndAddKeyframe(
									'y',
									Number(($event.target as HTMLInputElement).value),
								)"
							>
						</div>
					</div>

					<div>
						<label class="block text-gray-400 text-sm mb-1">Scale</label>
						<div class="flex items-center gap-2">
							<button
								@click="toggleKeyframe('scale')"
								class="p-1 rounded hover:bg-gray-700"
								:class="hasKeyframeAtCurrentTime('scale')
								? 'text-blue-400'
								: 'text-gray-500'"
							>
								<svg
									viewBox="0 0 24 24"
									width="16"
									height="16"
									fill="currentColor"
								>
									<path d="M12 18.414l-6.364-6.364 1.414-1.414L12 15.586l4.95-4.95 1.414 1.414L12 18.414zM12 5.586L5.636 11.95l-1.414-1.414L12 2.758l7.778 7.778-1.414 1.414L12 5.586z" />
								</svg>
							</button>
							<input
								:value="animatedTransform?.scale ?? 1"
								type="number"
								step="0.1"
								class="w-full bg-gray-800 text-white rounded px-3 py-2 text-sm border border-gray-700 focus:border-blue-500 focus:outline-none"
								@input="updateValueAndAddKeyframe(
									'scale',
									Number(($event.target as HTMLInputElement).value),
								)"
							>
						</div>
					</div>

					<div>
						<label class="block text-gray-400 text-sm mb-1">Rotation</label>
						<div class="flex items-center gap-2">
							<button
								@click="toggleKeyframe('rotation')"
								class="p-1 rounded hover:bg-gray-700"
								:class="hasKeyframeAtCurrentTime('rotation')
								? 'text-blue-400'
								: 'text-gray-500'"
							>
								<svg
									viewBox="0 0 24 24"
									width="16"
									height="16"
									fill="currentColor"
								>
									<path d="M12 18.414l-6.364-6.364 1.414-1.414L12 15.586l4.95-4.95 1.414 1.414L12 18.414zM12 5.586L5.636 11.95l-1.414-1.414L12 2.758l7.778 7.778-1.414 1.414L12 5.586z" />
								</svg>
							</button>
							<input
								:value="animatedTransform?.rotation ?? 0"
								type="number"
								class="w-full bg-gray-800 text-white rounded px-3 py-2 text-sm border border-gray-700 focus:border-blue-500 focus:outline-none"
								@input="updateValueAndAddKeyframe(
									'rotation',
									Number(($event.target as HTMLInputElement).value),
								)"
							>
						</div>
					</div>

					<div>
						<label class="block text-gray-400 text-sm mb-1">Opacity</label>
						<div class="flex items-center gap-2">
							<button
								@click="toggleKeyframe('opacity')"
								class="p-1 rounded hover:bg-gray-700"
								:class="hasKeyframeAtCurrentTime('opacity')
								? 'text-blue-400'
								: 'text-gray-500'"
							>
								<svg
									viewBox="0 0 24 24"
									width="16"
									height="16"
									fill="currentColor"
								>
									<path d="M12 18.414l-6.364-6.364 1.414-1.414L12 15.586l4.95-4.95 1.414 1.414L12 18.414zM12 5.586L5.636 11.95l-1.414-1.414L12 2.758l7.778 7.778-1.414 1.414L12 5.586z" />
								</svg>
							</button>
							<input
								:value="animatedTransform?.opacity ?? 1"
								type="range"
								min="0"
								max="1"
								step="0.01"
								class="w-full"
								@input="updateValueAndAddKeyframe(
									'opacity',
									Number(($event.target as HTMLInputElement).value),
								)"
							>
						</div>
						<div class="text-white text-sm mt-1 text-right">
							{{ (animatedTransform?.opacity ?? 1).toFixed(2) }}
						</div>
					</div>
				</div>

				<div class="border-t border-gray-700 pt-4 mt-4">
					<h3 class="text-white font-medium mb-3">Transitions</h3>

					<div class="mb-3">
						<label class="block text-gray-400 text-xs mb-1"
						>Duration (seconds)</label>
						<input
							v-model.number="transitionDuration"
							type="number"
							min="0.1"
							max="5"
							step="0.1"
							class="w-full bg-gray-800 text-white rounded px-3 py-2 text-sm border border-gray-700 focus:border-blue-500 focus:outline-none"
						>
					</div>

					<div class="space-y-2">
						<div class="flex items-center justify-between">
							<span class="text-gray-300 text-sm">Fade In</span>
							<div class="flex gap-2">
								<button
									v-if="!selectedClip.transitionIn"
									@click="addTransitionToClip('in', 'fade')"
									class="px-2 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded text-xs"
								>
									Add
								</button>
								<button
									v-else
									@click="removeTransitionFromClip('in')"
									class="px-2 py-1 bg-red-600 hover:bg-red-700 text-white rounded text-xs"
								>
									Remove
								</button>
							</div>
						</div>

						<div class="flex items-center justify-between">
							<span class="text-gray-300 text-sm">Fade Out</span>
							<div class="flex gap-2">
								<button
									v-if="!selectedClip.transitionOut"
									@click="addTransitionToClip('out', 'fade')"
									class="px-2 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded text-xs"
								>
									Add
								</button>
								<button
									v-else
									@click="removeTransitionFromClip('out')"
									class="px-2 py-1 bg-red-600 hover:bg-red-700 text-white rounded text-xs"
								>
									Remove
								</button>
							</div>
						</div>

						<div
							v-if="selectedClip.transitionIn || selectedClip.transitionOut"
							class="text-gray-400 text-xs mt-2"
						>
							<span v-if="selectedClip.transitionIn"
							>Fade In: {{ selectedClip.transitionIn.duration }}s</span>
							<span
								v-if="selectedClip.transitionIn && selectedClip.transitionOut"
								class="mx-2"
							>|</span>
							<span v-if="selectedClip.transitionOut"
							>Fade Out: {{ selectedClip.transitionOut.duration }}s</span>
						</div>
					</div>
				</div>

				<div class="border-t border-gray-700 pt-4 mt-4">
					<div class="flex items-center justify-between mb-3">
						<h3 class="text-white font-medium">Color Correction</h3>
						<button
							v-if="selectedClip.colorCorrection"
							@click="resetColorCorrection(selectedClip.id)"
							class="text-xs text-gray-400 hover:text-white"
						>
							Reset
						</button>
					</div>

					<div class="space-y-4">
						<div>
							<div class="flex justify-between mb-1">
								<label class="text-gray-400 text-xs">Brightness</label>
								<span class="text-white text-xs">{{
									(selectedClip.colorCorrection?.brightness ?? 0) > 0
									? "+"
									: ""
								}}{{ selectedClip.colorCorrection?.brightness ?? 0 }}</span>
							</div>
							<input
								:type="'range'"
								:min="-100"
								:max="100"
								:value="selectedClip.colorCorrection?.brightness ?? 0"
								@input="updateColorCorrection(selectedClip.id, {
									brightness: Number(($event.target as HTMLInputElement).value),
								})"
								class="w-full"
							>
						</div>

						<div>
							<div class="flex justify-between mb-1">
								<label class="text-gray-400 text-xs">Contrast</label>
								<span class="text-white text-xs">{{
									(selectedClip.colorCorrection?.contrast ?? 0) > 0 ? "+" : ""
								}}{{ selectedClip.colorCorrection?.contrast ?? 0 }}</span>
							</div>
							<input
								type="range"
								min="-100"
								max="100"
								:value="selectedClip.colorCorrection?.contrast ?? 0"
								@input="updateColorCorrection(selectedClip.id, {
									contrast: Number(($event.target as HTMLInputElement).value),
								})"
								class="w-full"
							>
						</div>

						<div>
							<div class="flex justify-between mb-1">
								<label class="text-gray-400 text-xs">Saturation</label>
								<span class="text-white text-xs">{{
									(selectedClip.colorCorrection?.saturation ?? 0) > 0
									? "+"
									: ""
								}}{{ selectedClip.colorCorrection?.saturation ?? 0 }}</span>
							</div>
							<input
								type="range"
								min="-100"
								max="100"
								:value="selectedClip.colorCorrection?.saturation ?? 0"
								@input="updateColorCorrection(selectedClip.id, {
									saturation: Number(($event.target as HTMLInputElement).value),
								})"
								class="w-full"
							>
						</div>
					</div>
				</div>

				<!-- Captions (for video/audio clips) -->
				<CaptionsEditor
					v-if="selectedClip
					&& (selectedClip.type === 'video' || selectedClip.type === 'audio')"
					:clip-id="selectedClip.id"
				/>

				<!-- Color Grading (for video/image clips) -->
				<ColorGradingEditor
					v-if="selectedClip
					&& (selectedClip.type === 'video' || selectedClip.type === 'image')"
					:clip-id="selectedClip.id"
				/>

				<!-- Noise Reduction (for video/audio clips) -->
				<div
					v-if="selectedClip
					&& (selectedClip.type === 'video' || selectedClip.type === 'audio')"
					class="border-t border-gray-700 pt-4 mt-4"
				>
					<h3 class="text-white font-medium mb-3">AI Noise Reduction</h3>

					<div class="space-y-3">
						<div
							v-if="selectedClip.audioSettings?.noiseReduction?.enabled"
							class="p-3 bg-green-900 bg-opacity-30 rounded border border-green-700"
						>
							<div class="flex items-center gap-2 mb-2">
								<span class="text-green-400 text-xs"
								>✓ Noise reduction applied</span>
								<span class="text-gray-400 text-xs"
								>({{
										selectedClip.audioSettings.noiseReduction.strength
									}}%)</span>
							</div>
						</div>

						<div>
							<label class="block text-gray-400 text-xs mb-1">Strength</label>
							<input
								v-model.number="noiseReductionStrength"
								type="range"
								min="0"
								max="100"
								class="w-full"
							>
							<div class="text-white text-xs mt-1">
								{{ noiseReductionStrength }}%
							</div>
						</div>

						<button
							class="w-full px-3 py-2 bg-purple-600 hover:bg-purple-700 text-white text-sm rounded flex items-center justify-center gap-2 disabled:opacity-50"
							:disabled="isApplyingNoiseReduction"
							@click="handleApplyNoiseReduction"
						>
							<svg
								v-if="isApplyingNoiseReduction"
								xmlns="http://www.w3.org/2000/svg"
								width="16"
								height="16"
								viewBox="0 0 24 24"
								fill="none"
								stroke="currentColor"
								stroke-width="2"
								class="animate-spin"
							>
								<path d="M21 12a9 9 0 1 1-6.219-8.56" />
							</svg>
							<span>{{
								isApplyingNoiseReduction
								? "Processing..."
								: "Apply AI Noise Reduction"
							}}</span>
						</button>

						<p class="text-gray-500 text-[10px]">
							Uses AI to remove background noise, hiss, and hum from audio
						</p>
					</div>
				</div>
			</div>

			<div v-else class="text-gray-500 text-sm text-center mt-8">
				Select a clip to view properties
			</div>
		</div>
	</div>
</template>
