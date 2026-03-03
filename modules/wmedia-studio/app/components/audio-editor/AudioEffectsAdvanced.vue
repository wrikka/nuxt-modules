<script setup lang="ts">
const { selectedClip, selectedTrackId, updateClip } = useAudioEditor();
const {
	timeStretchRate,
	pitchShiftSemitones,
	applyTimeStretch,
	applyPitchShift,
} = useAudioEffects();

const preservePitch = ref(true);

const handleTimeStretchChange = () => {
};

const handlePitchShiftChange = () => {
};

const handleApplyEffects = async () => {
	if (!selectedClip.value || !selectedTrackId.value) return;

	try {
		const response = await fetch(selectedClip.value.url);
		const arrayBuffer = await response.arrayBuffer();
		const audioContext =
			new (window.AudioContext || (window as any).webkitAudioContext)();
		const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);

		let processedBuffer = audioBuffer;

		if (timeStretchRate.value !== 1) {
			processedBuffer = await applyTimeStretch(processedBuffer, {
				rate: timeStretchRate.value,
				preservePitch: preservePitch.value,
			});
		}

		if (pitchShiftSemitones.value !== 0) {
			processedBuffer = await applyPitchShift(
				processedBuffer,
				pitchShiftSemitones.value,
			);
		}

		const wavBlob = await bufferToWav(processedBuffer);
		const url = URL.createObjectURL(wavBlob);

		updateClip(selectedClip.value.id, {
			url,
			duration: processedBuffer.duration,
		});
	} catch (error) {
		console.error("Failed to apply effects:", error);
		alert("Failed to apply effects. Please try again.");
	}
};

const handleResetEffects = () => {
	timeStretchRate.value = 1;
	pitchShiftSemitones.value = 0;
	preservePitch.value = true;
};

const bufferToWav = (buffer: AudioBuffer): Blob => {
	const numChannels = buffer.numberOfChannels;
	const sampleRate = buffer.sampleRate;
	const format = 1;
	const bitDepth = 16;

	const bytesPerSample = bitDepth / 8;
	const blockAlign = numChannels * bytesPerSample;

	const dataLength = buffer.length * blockAlign;
	const bufferLength = 44 + dataLength;

	const arrayBuffer = new ArrayBuffer(bufferLength);
	const view = new DataView(arrayBuffer);

	const writeString = (offset: number, string: string) => {
		for (let i = 0; i < string.length; i++) {
			view.setUint8(offset + i, string.charCodeAt(i));
		}
	};

	writeString(0, "RIFF");
	view.setUint32(4, 36 + dataLength, true);
	writeString(8, "WAVE");
	writeString(12, "fmt ");
	view.setUint32(16, 16, true);
	view.setUint16(20, format, true);
	view.setUint16(22, numChannels, true);
	view.setUint32(24, sampleRate, true);
	view.setUint32(28, sampleRate * blockAlign, true);
	view.setUint16(32, blockAlign, true);
	view.setUint16(34, bitDepth, true);
	writeString(36, "data");
	view.setUint32(40, dataLength, true);

	const channels: Float32Array[] = [];
	for (let i = 0; i < numChannels; i++) {
		channels.push(buffer.getChannelData(i));
	}

	let offset = 44;
	for (let i = 0; i < buffer.length; i++) {
		for (let channel = 0; channel < numChannels; channel++) {
			const sample = Math.max(-1, Math.min(1, channels[channel]?.[i] ?? 0));
			view.setInt16(
				offset,
				sample < 0 ? sample * 0x8000 : sample * 0x7fff,
				true,
			);
			offset += 2;
		}
	}

	return new Blob([arrayBuffer], { type: "audio/wav" });
};
</script>

<template>
	<div
		v-if="selectedClip"
		class="bg-gray-900 border-b border-gray-700 px-4 py-3"
	>
		<div class="flex items-center justify-between mb-3">
			<span class="text-gray-400 text-sm font-medium">Advanced Effects</span>
		</div>
		<div class="space-y-4">
			<div>
				<div class="flex items-center justify-between mb-2">
					<label class="text-gray-400 text-xs">Time Stretch</label>
					<span class="text-white text-xs">{{
							timeStretchRate.toFixed(2)
						}}x</span>
				</div>
				<input
					v-model="timeStretchRate"
					@input="handleTimeStretchChange"
					type="range"
					min="0.5"
					max="2"
					step="0.01"
					class="w-full accent-blue-500 cursor-pointer"
				>
				<div class="flex items-center gap-2 mt-2">
					<input
						v-model="preservePitch"
						type="checkbox"
						id="preserve-pitch"
						class="accent-blue-500"
					>
					<label for="preserve-pitch" class="text-gray-400 text-xs"
					>Preserve Pitch</label>
				</div>
			</div>
			<div>
				<div class="flex items-center justify-between mb-2">
					<label class="text-gray-400 text-xs">Pitch Shift</label>
					<span class="text-white text-xs">{{
							pitchShiftSemitones > 0 ? "+" : ""
						}}{{ pitchShiftSemitones }} semitones</span>
				</div>
				<input
					v-model="pitchShiftSemitones"
					@input="handlePitchShiftChange"
					type="range"
					min="-12"
					max="12"
					step="1"
					class="w-full accent-purple-500 cursor-pointer"
				>
			</div>
			<div class="flex gap-2">
				<button
					@click="handleApplyEffects"
					class="flex-1 px-3 py-2 bg-green-600 hover:bg-green-700 text-white rounded text-sm transition-colors"
				>
					Apply Effects
				</button>
				<button
					@click="handleResetEffects"
					class="flex-1 px-3 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded text-sm transition-colors"
				>
					Reset
				</button>
			</div>
		</div>
	</div>
</template>
