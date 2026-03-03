<script setup lang="ts">
const { selectedClip, selectedTrackId, updateClip, formatTime } = useAudioEditor();

const handleStartTimeChange = (event: Event) => {
	const target = event.target as HTMLInputElement;
	const value = parseFloat(target.value);
	if (!selectedClip.value || value >= selectedClip.value.endTime) return;
	updateClip(selectedClip.value.id, { startTime: value });
};

const handleEndTimeChange = (event: Event) => {
	const target = event.target as HTMLInputElement;
	const value = parseFloat(target.value);
	if (!selectedClip.value || value <= selectedClip.value.startTime) return;
	updateClip(selectedClip.value.id, { endTime: value });
};

const handleTrim = async () => {
	if (!selectedClip.value || !selectedTrackId.value) return;
	const { removeClip, addClipToTrack } = useAudioEditor();
	const blob = await fetch(selectedClip.value.url).then((r) => r.blob());
	const file = new File([blob], selectedClip.value.name, { type: blob.type });
	
	removeClip(selectedClip.value.id, selectedTrackId.value);
	await addClipToTrack(file, selectedTrackId.value);
};

const handleReset = () => {
	if (!selectedClip.value) return;
	updateClip(selectedClip.value.id, {
		startTime: 0,
		endTime: selectedClip.value.duration,
	});
};
</script>

<template>
	<div v-if="selectedClip" class="bg-gray-900 border-b border-gray-700 px-4 py-3">
		<div class="flex items-center justify-between mb-3">
			<span class="text-gray-400 text-sm font-medium">Clip Trimmer</span>
			span class="text-white text-sm">{{ selectedClip.name }}</span>
		</div>
		<div class="space-y-4">
			<div>
				<div class="flex items-center justify-between mb-2">
					<label class="text-gray-400 text-xs">Start Time</label>
					<span class="text-white text-xs font-mono">{{ formatTime(selectedClip.startTime) }}</span>
				</div>
				<input
					:value="selectedClip.startTime"
					@input="handleStartTimeChange"
					type="range"
					:min="0"
					:max="selectedClip.duration"
					:step="0.01"
					class="w-full accent-blue-500 cursor-pointer"
				>
			</div>
			<div>
				<div class="flex items-center justify-between mb-2">
					<label class="text-gray-400 text-xs">End Time</label>
					<span class="text-white text-xs font-mono">{{ formatTime(selectedClip.endTime) }}</span>
				</div>
				<input
					:value="selectedClip.endTime"
					@input="handleEndTimeChange"
					type="range"
					:min="0"
					:max="selectedClip.duration"
					:step="0.01"
					class="w-full accent-blue-500 cursor-pointer"
				>
			</div>
			<div>
				<div class="flex items-center justify-between mb-2">
					<label class="text-gray-400 text-xs">Duration</label>
					<span class="text-white text-xs font-mono">{{ formatTime(selectedClip.endTime - selectedClip.startTime) }}</span>
				</div>
			</div>
			<div class="flex gap-2">
				<button
					@click="handleTrim"
					class="flex-1 px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded text-sm transition-colors"
				>
					Trim
				</button>
				<button
					@click="handleReset"
					class="flex-1 px-3 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded text-sm transition-colors"
				>
					Reset
				</button>
			</div>
		</div>
	</div>
</template>
