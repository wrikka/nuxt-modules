<script setup lang="ts">
const props = defineProps<{
	audioContext: AudioContext | null;
}>();

const activeBand = ref(0);
const isActive = ref(true);
const attackTime = ref(10);
const releaseTime = ref(100);

const bands = ref([
	{ id: 0, freq: 100, gain: 0, threshold: -20, ratio: 4, q: 1.4, active: true },
	{ id: 1, freq: 250, gain: 0, threshold: -20, ratio: 4, q: 1.4, active: true },
	{ id: 2, freq: 500, gain: 0, threshold: -20, ratio: 4, q: 1.4, active: true },
	{
		id: 3,
		freq: 1000,
		gain: 0,
		threshold: -20,
		ratio: 4,
		q: 1.4,
		active: true,
	},
	{
		id: 4,
		freq: 2000,
		gain: 0,
		threshold: -20,
		ratio: 4,
		q: 1.4,
		active: true,
	},
	{
		id: 5,
		freq: 4000,
		gain: 0,
		threshold: -20,
		ratio: 4,
		q: 1.4,
		active: true,
	},
	{
		id: 6,
		freq: 8000,
		gain: 0,
		threshold: -20,
		ratio: 4,
		q: 1.4,
		active: true,
	},
]);

const gainReduction = computed(() => {
	return bands.value.map(b => b.active ? Math.random() * 10 : 0);
});

const toggleBand = (index: number) => {
	bands.value[index]!.active = !bands.value[index]!.active;
};

const resetBand = (index: number) => {
	bands.value[index]!.gain = 0;
	bands.value[index]!.threshold = -20;
	bands.value[index]!.ratio = 4;
};
</script>

<template>
	<div class="bg-gray-900 rounded-lg p-4 space-y-4">
		<div class="flex items-center justify-between">
			<h3 class="text-lg font-semibold text-white flex items-center gap-2">
				<svg
					xmlns="http://www.w3.org/2000/svg"
					class="h-5 w-5 text-purple-400"
					fill="none"
					viewBox="0 0 24 24"
					stroke="currentColor"
				>
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="2"
						d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
					/>
				</svg>
				Dynamic EQ
			</h3>
			<button
				@click="isActive = !isActive"
				:class="[
					'px-3 py-1 rounded-lg text-sm font-medium transition-colors',
					isActive ? 'bg-green-600 text-white' : 'bg-gray-700 text-gray-400',
				]"
			>
				{{ isActive ? "Active" : "Bypass" }}
			</button>
		</div>

		<!-- EQ Bands Visualization -->
		<div class="relative h-32 bg-gray-800 rounded-lg overflow-hidden">
			<div class="absolute inset-0 flex items-end justify-around px-2 pb-2">
				<div
					v-for="(band, index) in bands"
					:key="band.id"
					class="flex flex-col items-center gap-1"
				>
					<div
						class="w-8 rounded-t transition-all duration-150"
						:class="band.active ? 'bg-purple-500' : 'bg-gray-600'"
						:style="{ height: `${Math.max(10, (gainReduction[index]! / 20) * 100)}%` }"
					>
					</div>
					<span class="text-xs text-gray-500">{{
						band.freq >= 1000 ? (band.freq / 1000) + "k" : band.freq
					}}</span>
				</div>
			</div>
		</div>

		<!-- Active Band Editor -->
		<div class="space-y-3">
			<div class="flex gap-1 bg-gray-800 p-1 rounded-lg">
				<button
					v-for="(band, index) in bands"
					:key="band.id"
					@click="activeBand = index"
					:class="[
						'px-3 py-2 text-sm font-medium rounded transition-colors',
						activeBand === index
							? 'bg-purple-600 text-white'
							: 'text-gray-400 hover:text-white hover:bg-gray-700',
						!band.active && 'opacity-50',
					]"
				>
					{{ band.freq >= 1000 ? (band.freq / 1000) + "k" : band.freq }}Hz
				</button>
			</div>

			<div
				v-if="bands[activeBand]"
				class="space-y-3 p-3 bg-gray-800 rounded-lg"
			>
				<div class="flex items-center justify-between">
					<span class="text-sm font-medium text-white"
					>Band {{ activeBand + 1 }} Settings</span>
					<div class="flex gap-2">
						<button
							@click="toggleBand(activeBand)"
							:class="[
								'px-2 py-1 text-xs rounded transition-colors',
								bands[activeBand]!.active
									? 'bg-green-600 text-white'
									: 'bg-gray-700 text-gray-400',
							]"
						>
							{{ bands[activeBand]!.active ? "ON" : "OFF" }}
						</button>
						<button
							@click="resetBand(activeBand)"
							class="px-2 py-1 text-xs bg-gray-700 hover:bg-gray-600 text-gray-400 rounded transition-colors"
						>
							Reset
						</button>
					</div>
				</div>

				<div class="space-y-1">
					<div class="flex justify-between text-xs">
						<span class="text-gray-400">Threshold</span>
						<span class="text-white">{{ bands[activeBand]!.threshold }}dB</span>
					</div>
					<input
						v-model="bands[activeBand]!.threshold"
						type="range"
						min="-60"
						max="0"
						class="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
					/>
				</div>

				<div class="space-y-1">
					<div class="flex justify-between text-xs">
						<span class="text-gray-400">Ratio</span>
						<span class="text-white">{{ bands[activeBand]!.ratio }}:1</span>
					</div>
					<input
						v-model="bands[activeBand]!.ratio"
						type="range"
						min="1"
						max="20"
						step="0.5"
						class="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
					/>
				</div>

				<div class="space-y-1">
					<div class="flex justify-between text-xs">
						<span class="text-gray-400">Makeup Gain</span>
						<span class="text-white">{{ bands[activeBand]!.gain }}dB</span>
					</div>
					<input
						v-model="bands[activeBand]!.gain"
						type="range"
						min="-12"
						max="12"
						class="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
					/>
				</div>

				<div class="space-y-1">
					<div class="flex justify-between text-xs">
						<span class="text-gray-400">Q (Bandwidth)</span>
						<span class="text-white">{{ bands[activeBand]!.q }}</span>
					</div>
					<input
						v-model="bands[activeBand]!.q"
						type="range"
						min="0.1"
						max="10"
						step="0.1"
						class="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
					/>
				</div>
			</div>
		</div>

		<!-- Global Settings -->
		<div class="grid grid-cols-2 gap-3">
			<div class="space-y-1">
				<div class="flex justify-between text-xs">
					<span class="text-gray-400">Attack</span>
					<span class="text-white">{{ attackTime }}ms</span>
				</div>
				<input
					v-model="attackTime"
					type="range"
					min="1"
					max="100"
					class="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
				/>
			</div>
			<div class="space-y-1">
				<div class="flex justify-between text-xs">
					<span class="text-gray-400">Release</span>
					<span class="text-white">{{ releaseTime }}ms</span>
				</div>
				<input
					v-model="releaseTime"
					type="range"
					min="10"
					max="1000"
					step="10"
					class="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
				/>
			</div>
		</div>
	</div>
</template>
