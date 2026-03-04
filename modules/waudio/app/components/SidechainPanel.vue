<script setup lang="ts">
import type { SidechainSettings } from "#shared/types/audio";

const props = defineProps<{
	tracks: { id: string; name: string }[];
	currentTrackId: string | null;
}>();

const emit = defineEmits<{
	apply: [settings: SidechainSettings];
	remove: [];
}>();

const enabled = ref(false);
const sourceTrackId = ref("");
const threshold = ref(-24);
const ratio = ref(4);
const attack = ref(10);
const release = ref(100);
const makeupGain = ref(0);

const availableSources = computed(() => {
	return props.tracks.filter(t => t.id !== props.currentTrackId);
});

const applySidechain = () => {
	if (!sourceTrackId.value) return;

	const settings: SidechainSettings = {
		sourceTrackId: sourceTrackId.value,
		threshold: threshold.value,
		ratio: ratio.value,
		attack: attack.value,
		release: release.value,
		makeupGain: makeupGain.value,
	};

	emit("apply", settings);
};

const removeSidechain = () => {
	emit("remove");
	enabled.value = false;
};

const toggleEnabled = () => {
	enabled.value = !enabled.value;
	if (enabled.value && sourceTrackId.value) {
		applySidechain();
	} else if (!enabled.value) {
		removeSidechain();
	}
};
</script>

<template>
	<div class="bg-gray-900 border-b border-gray-700 p-4">
		<div class="flex items-center justify-between mb-4">
			<span class="text-gray-400 text-sm font-medium"
			>Sidechain Compression</span>
			<button
				@click="toggleEnabled"
				:class="[
					'px-2 py-1 rounded text-xs transition-colors',
					enabled ? 'bg-green-600 text-white' : 'bg-gray-700 text-gray-400',
				]"
			>
				{{ enabled ? "ON" : "OFF" }}
			</button>
		</div>

		<div class="space-y-4">
			<!-- Source Track -->
			<div>
				<label class="block text-gray-400 text-xs mb-2"
				>Source Track (Trigger)</label>
				<select
					v-model="sourceTrackId"
					class="w-full bg-gray-800 text-white rounded px-3 py-2 text-sm border border-gray-700 focus:border-blue-500 focus:outline-none"
					:disabled="!enabled"
				>
					<option value="">Select source track...</option>
					<option
						v-for="track in availableSources"
						:key="track.id"
						:value="track.id"
					>
						{{ track.name }}
					</option>
				</select>
			</div>

			<!-- Controls -->
			<div class="space-y-3" :class="{ 'opacity-50': !enabled }">
				<div>
					<div class="flex justify-between text-xs mb-1">
						<span class="text-gray-400">Threshold</span>
						<span class="text-gray-300">{{ threshold }}dB</span>
					</div>
					<input
						v-model.number="threshold"
						type="range"
						min="-60"
						max="0"
						step="1"
						class="w-full accent-blue-500"
						:disabled="!enabled"
						@input="enabled && applySidechain()"
					>
				</div>

				<div>
					<div class="flex justify-between text-xs mb-1">
						<span class="text-gray-400">Ratio</span>
						<span class="text-gray-300">{{ ratio }}:1</span>
					</div>
					<input
						v-model.number="ratio"
						type="range"
						min="1"
						max="20"
						step="0.5"
						class="w-full accent-blue-500"
						:disabled="!enabled"
						@input="enabled && applySidechain()"
					>
				</div>

				<div class="grid grid-cols-2 gap-2">
					<div>
						<div class="flex justify-between text-xs mb-1">
							<span class="text-gray-400">Attack</span>
							<span class="text-gray-300">{{ attack }}ms</span>
						</div>
						<input
							v-model.number="attack"
							type="range"
							min="1"
							max="100"
							step="1"
							class="w-full accent-blue-500"
							:disabled="!enabled"
							@input="enabled && applySidechain()"
						>
					</div>

					<div>
						<div class="flex justify-between text-xs mb-1">
							<span class="text-gray-400">Release</span>
							<span class="text-gray-300">{{ release }}ms</span>
						</div>
						<input
							v-model.number="release"
							type="range"
							min="10"
							max="500"
							step="10"
							class="w-full accent-blue-500"
							:disabled="!enabled"
							@input="enabled && applySidechain()"
						>
					</div>
				</div>

				<div>
					<div class="flex justify-between text-xs mb-1">
						<span class="text-gray-400">Makeup Gain</span>
						<span class="text-gray-300">{{ makeupGain }}dB</span>
					</div>
					<input
						v-model.number="makeupGain"
						type="range"
						min="0"
						max="20"
						step="0.5"
						class="w-full accent-blue-500"
						:disabled="!enabled"
						@input="enabled && applySidechain()"
					>
				</div>
			</div>

			<!-- Visualization placeholder -->
			<div class="bg-gray-800 rounded p-3 h-20 flex items-center justify-center">
				<div v-if="enabled" class="flex items-center gap-4">
					<div class="text-center">
						<div class="w-2 h-12 bg-gradient-to-t from-gray-600 to-blue-500 rounded-full mb-1" />
						<span class="text-xs text-gray-500">Input</span>
					</div>
					<svg
						class="w-6 h-6 text-gray-500"
						fill="none"
						viewBox="0 0 24 24"
						stroke="currentColor"
					>
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M17 8l4 4m0 0l-4 4m4-4H3"
						/>
					</svg>
					<div class="text-center">
						<div class="w-2 h-12 bg-gradient-to-t from-gray-600 to-green-500 rounded-full mb-1" />
						<span class="text-xs text-gray-500">Output</span>
					</div>
				</div>
				<span v-else class="text-xs text-gray-500"
				>Enable to see sidechain activity</span>
			</div>
		</div>

		<p class="mt-3 text-xs text-gray-500">
			Sidechain compression reduces the volume of this track when the source
			track plays. Perfect for ducking music under voice.
		</p>
	</div>
</template>
