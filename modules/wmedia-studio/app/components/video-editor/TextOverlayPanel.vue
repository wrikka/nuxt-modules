<script setup lang="ts">
import { useVideoEditor } from "~/composables/useVideoEditor";

const {
	selectedClip,
	currentVideoProject,
	addTextClip,
	addKeyframe,
	currentTime,
	getTransformPropertiesAtTime,
} = useVideoEditor();

const textContent = ref("Your Text Here");

const animatedTransform = computed(() => {
	if (!selectedClip.value || !selectedClip.value.transform) return null;
	return getTransformPropertiesAtTime(selectedClip.value, currentTime.value);
});

const opacityPercent = computed(() => {
	const opacity = animatedTransform.value?.opacity ?? 1;
	return Math.round(opacity * 100);
});

const updateTextContent = (content: string) => {
	if (selectedClip.value) {
		void content;
	}
};

const updateFontSize = (size: number) => {
	if (selectedClip.value) {
		const clipTime = currentTime.value - selectedClip.value.startTime;
		addKeyframe(selectedClip.value.id, "scale", clipTime, size);
	}
};

const updatePositionX = (x: number) => {
	if (selectedClip.value) {
		const clipTime = currentTime.value - selectedClip.value.startTime;
		addKeyframe(selectedClip.value.id, "x", clipTime, x);
	}
};

const updatePositionY = (y: number) => {
	if (selectedClip.value) {
		const clipTime = currentTime.value - selectedClip.value.startTime;
		addKeyframe(selectedClip.value.id, "y", clipTime, y);
	}
};

const updateRotation = (rotation: number) => {
	if (selectedClip.value) {
		const clipTime = currentTime.value - selectedClip.value.startTime;
		addKeyframe(selectedClip.value.id, "rotation", clipTime, rotation);
	}
};

const updateOpacity = (opacity: number) => {
	if (selectedClip.value) {
		const clipTime = currentTime.value - selectedClip.value.startTime;
		addKeyframe(selectedClip.value.id, "opacity", clipTime, opacity);
	}
};

const addTextOverlay = () => {
	if (!currentVideoProject.value) return;

	const textTrack = currentVideoProject.value.tracks.find((t) =>
		t.type === "text"
	);
	const trackId = textTrack?.id;

	if (!trackId) {
		alert("Please add a text track first");
		return;
	}

	addTextClip(trackId, 0, textContent.value, 5);
};
</script>

<template>
	<div class="w-64 bg-gray-900 border-l border-gray-700 flex flex-col">
		<div class="h-12 bg-gray-800 flex items-center px-4 border-b border-gray-700">
			<span class="text-white font-medium">Text</span>
		</div>

		<div class="flex-1 overflow-y-auto p-4">
			<div
				v-if="selectedClip && selectedClip.type === 'text'"
				class="space-y-4"
			>
				<div>
					<label class="block text-gray-400 text-sm mb-1">Text Content</label>
					<textarea
						:value="selectedClip.name"
						class="w-full bg-gray-800 text-white rounded px-3 py-2 text-sm border border-gray-700 focus:border-blue-500 focus:outline-none resize-none"
						rows="3"
						@input="updateTextContent(($event.target as HTMLTextAreaElement).value)"
					/>
				</div>

				<div>
					<label class="block text-gray-400 text-sm mb-1">Font Size</label>
					<input
						:value="animatedTransform?.scale ?? 1"
						type="number"
						step="0.1"
						min="0.1"
						class="w-full bg-gray-800 text-white rounded px-3 py-2 text-sm border border-gray-700 focus:border-blue-500 focus:outline-none"
						@input="updateFontSize(Number(($event.target as HTMLInputElement).value))"
					>
				</div>

				<div>
					<label class="block text-gray-400 text-sm mb-1">Position X</label>
					<input
						:value="animatedTransform?.x ?? 0"
						type="number"
						class="w-full bg-gray-800 text-white rounded px-3 py-2 text-sm border border-gray-700 focus:border-blue-500 focus:outline-none"
						@input="updatePositionX(Number(($event.target as HTMLInputElement).value))"
					>
				</div>

				<div>
					<label class="block text-gray-400 text-sm mb-1">Position Y</label>
					<input
						:value="animatedTransform?.y ?? 0"
						type="number"
						class="w-full bg-gray-800 text-white rounded px-3 py-2 text-sm border border-gray-700 focus:border-blue-500 focus:outline-none"
						@input="updatePositionY(Number(($event.target as HTMLInputElement).value))"
					>
				</div>

				<div>
					<label class="block text-gray-400 text-sm mb-1">Rotation</label>
					<input
						:value="animatedTransform?.rotation ?? 0"
						type="number"
						class="w-full bg-gray-800 text-white rounded px-3 py-2 text-sm border border-gray-700 focus:border-blue-500 focus:outline-none"
						@input="updateRotation(Number(($event.target as HTMLInputElement).value))"
					>
				</div>

				<div>
					<label class="block text-gray-400 text-sm mb-1">Opacity</label>
					<input
						:value="animatedTransform?.opacity ?? 1"
						type="range"
						min="0"
						max="1"
						step="0.1"
						class="w-full"
						@input="updateOpacity(Number(($event.target as HTMLInputElement).value))"
					>
					<div class="text-white text-sm mt-1">{{ opacityPercent }}%</div>
				</div>
			</div>

			<div v-else class="space-y-4">
				<div>
					<label class="block text-gray-400 text-sm mb-1">Text Content</label>
					<textarea
						v-model="textContent"
						class="w-full bg-gray-800 text-white rounded px-3 py-2 text-sm border border-gray-700 focus:border-blue-500 focus:outline-none resize-none"
						rows="3"
						placeholder="Enter your text..."
					/>
				</div>

				<button
					class="w-full py-2 bg-blue-600 hover:bg-blue-700 text-white rounded text-sm font-medium"
					@click="addTextOverlay"
				>
					+ Add Text Overlay
				</button>
			</div>
		</div>
	</div>
</template>
