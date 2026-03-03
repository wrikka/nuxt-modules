<script setup lang="ts">
const emit = defineEmits<{
	close: [];
	apply: [settings: AudioEffectsSettings];
}>();

interface Effect {
	id: string;
	name: string;
	type:
		| "reverb"
		| "delay"
		| "eq"
		| "compression"
		| "limiter"
		| "chorus"
		| "distortion";
	enabled: boolean;
	params: Record<string, number>;
}

interface AudioEffectsSettings {
	effects: Effect[];
	masterChain: boolean;
}

const effects = ref<Effect[]>([
	{
		id: "reverb-1",
		name: "Reverb",
		type: "reverb",
		enabled: false,
		params: {
			roomSize: 50,
			damping: 30,
			wetLevel: 30,
			dryLevel: 70,
			preDelay: 20,
		},
	},
	{
		id: "delay-1",
		name: "Delay",
		type: "delay",
		enabled: false,
		params: {
			time: 300,
			feedback: 40,
			mix: 30,
		},
	},
	{
		id: "eq-1",
		name: "Parametric EQ",
		type: "eq",
		enabled: false,
		params: {
			lowGain: 0,
			lowFreq: 80,
			midGain: 0,
			midFreq: 1000,
			midQ: 1,
			highGain: 0,
			highFreq: 10000,
		},
	},
	{
		id: "compression-1",
		name: "Compressor",
		type: "compression",
		enabled: false,
		params: {
			threshold: -20,
			ratio: 4,
			attack: 10,
			release: 100,
			makeupGain: 0,
		},
	},
	{
		id: "limiter-1",
		name: "Limiter",
		type: "limiter",
		enabled: false,
		params: {
			threshold: -3,
			release: 50,
			lookahead: 5,
		},
	},
	{
		id: "chorus-1",
		name: "Chorus",
		type: "chorus",
		enabled: false,
		params: {
			rate: 1.5,
			depth: 30,
			mix: 40,
		},
	},
	{
		id: "distortion-1",
		name: "Distortion",
		type: "distortion",
		enabled: false,
		params: {
			drive: 30,
			tone: 50,
			mix: 20,
		},
	},
]);

const selectedEffectId = ref<string | null>(null);
const isProcessing = ref(false);
const bypassAll = ref(false);

const selectedEffect = computed(() =>
	effects.value.find(e => e.id === selectedEffectId.value)
);

const toggleEffect = (id: string) => {
	const effect = effects.value.find(e => e.id === id);
	if (effect) {
		effect.enabled = !effect.enabled;
		if (effect.enabled && !selectedEffectId.value) {
			selectedEffectId.value = id;
		}
	}
};

const selectEffect = (id: string) => {
	selectedEffectId.value = id;
};

const updateParam = (effectId: string, param: string, value: number) => {
	const effect = effects.value.find(e => e.id === effectId);
	if (effect) {
		effect.params[param] = value;
	}
};

const getEffectIcon = (type: Effect["type"]): string => {
	const icons: Record<string, string> = {
		reverb: "i-ph-wave-sine",
		delay: "i-ph-repeat",
		eq: "i-ph-sliders-horizontal",
		compression: "i-ph-arrows-in-line-vertical",
		limiter: "i-ph-wall",
		chorus: "i-ph-circles-three",
		distortion: "i-ph-wave-triangle",
	};
	return icons[type] ?? "i-ph-sliders";
};

const handleApply = () => {
	isProcessing.value = true;
	setTimeout(() => {
		isProcessing.value = false;
		emit("apply", {
			effects: effects.value,
			masterChain: !bypassAll.value,
		});
	}, 500);
};

const resetAll = () => {
	effects.value.forEach(effect => {
		effect.enabled = false;
	});
	selectedEffectId.value = null;
};

const loadPreset = (presetName: string) => {
	const presets: Record<string, Partial<Effect>[]> = {
		"Voice Enhancement": [
			{
				id: "eq-1",
				enabled: true,
				params: { lowGain: -3, midGain: 2, highGain: 3 },
			},
			{
				id: "compression-1",
				enabled: true,
				params: { threshold: -18, ratio: 3 },
			},
			{ id: "limiter-1", enabled: true, params: { threshold: -2 } },
		],
		"Radio Voice": [
			{
				id: "eq-1",
				enabled: true,
				params: { lowGain: -6, midGain: 4, midFreq: 2500, highGain: 2 },
			},
			{
				id: "compression-1",
				enabled: true,
				params: { threshold: -15, ratio: 6 },
			},
			{ id: "distortion-1", enabled: true, params: { drive: 15, mix: 10 } },
		],
		"Concert Hall": [
			{
				id: "reverb-1",
				enabled: true,
				params: { roomSize: 80, damping: 40, wetLevel: 50 },
			},
			{ id: "eq-1", enabled: true, params: { highGain: -2 } },
		],
		"Slapback Echo": [
			{
				id: "delay-1",
				enabled: true,
				params: { time: 150, feedback: 25, mix: 35 },
			},
			{ id: "eq-1", enabled: true, params: { lowGain: -4, highGain: -2 } },
		],
	};

	const preset = presets[presetName];
	if (preset) {
		effects.value.forEach(effect => {
			const presetEffect = preset.find(pe => pe.id === effect.id);
			if (presetEffect) {
				effect.enabled = presetEffect.enabled ?? false;
				if (presetEffect.params) {
					Object.assign(effect.params, presetEffect.params);
				}
			}
		});
	}
};
</script>

<template>
	<div class="audio-effects-panel bg-white dark:bg-gray-800 rounded-xl p-4 w-[480px] flex flex-col shadow-lg border border-gray-200 dark:border-gray-700">
		<div class="flex items-center justify-between mb-4">
			<h3 class="text-gray-900 dark:text-white font-semibold flex items-center gap-2">
				<Icon name="mdi:tune" class="w-5 h-5 text-blue-500" />
				Audio Effects
			</h3>
			<div class="flex items-center gap-2">
				<button
					class="px-2 py-1 text-xs bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-600 dark:text-gray-300 rounded transition-colors"
					@click="resetAll"
				>
					Reset All
				</button>
				<button
					class="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors"
					@click="emit('close')"
				>
					<Icon name="mdi:close" class="w-5 h-5" />
				</button>
			</div>
		</div>

		<!-- Bypass Toggle -->
		<div class="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/30 rounded-lg mb-4">
			<span class="text-gray-900 dark:text-white text-sm font-medium"
			>Bypass All Effects</span>
			<button
				class="relative w-12 h-6 rounded-full transition-colors"
				:class="bypassAll ? 'bg-red-500' : 'bg-gray-300 dark:bg-gray-600'"
				@click="bypassAll = !bypassAll"
			>
				<div
					class="absolute top-1 w-4 h-4 bg-white rounded-full transition-all"
					:class="bypassAll ? 'left-7' : 'left-1'"
				/>
			</button>
		</div>

		<div class="flex gap-4 flex-1 overflow-hidden">
			<!-- Effects List -->
			<div class="w-1/3 flex flex-col gap-2 overflow-y-auto">
				<div class="text-xs text-gray-500 dark:text-gray-400 font-medium mb-1">
					EFFECT CHAIN
				</div>
				<button
					v-for="effect in effects"
					:key="effect.id"
					class="flex items-center gap-2 p-2 rounded-lg text-left transition-all"
					:class="[
						selectedEffectId === effect.id
							? 'bg-blue-100 dark:bg-blue-900/30 border border-blue-300 dark:border-blue-700'
							: 'bg-gray-100 dark:bg-gray-700 border border-transparent hover:bg-gray-200 dark:hover:bg-gray-600',
						effect.enabled && !bypassAll ? 'opacity-100' : 'opacity-50',
					]"
					@click="selectEffect(effect.id)"
				>
					<span :class="getEffectIcon(effect.type)" class="w-4 h-4" />
					<div class="flex-1 min-w-0">
						<div
							class="text-sm font-medium truncate"
							:class="effect.enabled && !bypassAll
							? 'text-gray-900 dark:text-white'
							: 'text-gray-500 dark:text-gray-400'"
						>
							{{ effect.name }}
						</div>
					</div>
					<button
						class="w-6 h-6 rounded flex items-center justify-center transition-colors"
						:class="effect.enabled
						? 'bg-green-500 text-white'
						: 'bg-gray-300 dark:bg-gray-600 text-gray-500'"
						@click.stop="toggleEffect(effect.id)"
					>
						<Icon name="mdi:power" class="w-3 h-3" />
					</button>
				</button>
			</div>

			<!-- Effect Parameters -->
			<div class="flex-1 flex flex-col overflow-y-auto">
				<div v-if="selectedEffect" class="space-y-4">
					<div class="flex items-center gap-2 mb-3">
						<span
							:class="getEffectIcon(selectedEffect.type)"
							class="w-5 h-5 text-blue-500"
						/>
						<h4 class="text-gray-900 dark:text-white font-medium">
							{{ selectedEffect.name }} Settings
						</h4>
					</div>

					<!-- Reverb Parameters -->
					<template v-if="selectedEffect.type === 'reverb'">
						<div class="space-y-3">
							<div>
								<div class="flex justify-between text-xs mb-1">
									<span class="text-gray-600 dark:text-gray-400"
									>Room Size</span>
									<span class="text-blue-500">{{
											selectedEffect.params.roomSize
										}}%</span>
								</div>
								<input
									v-model="selectedEffect.params.roomSize"
									type="range"
									min="0"
									max="100"
									class="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg accent-blue-500"
									@input="updateParam(
										selectedEffect!.id,
										'roomSize',
										selectedEffect?.params?.roomSize ?? 0,
									)"
								>
							</div>
							<div>
								<div class="flex justify-between text-xs mb-1">
									<span class="text-gray-600 dark:text-gray-400">Damping</span>
									<span class="text-blue-500">{{
											selectedEffect.params.damping
										}}%</span>
								</div>
								<input
									v-model="selectedEffect.params.damping"
									type="range"
									min="0"
									max="100"
									class="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg accent-blue-500"
								>
							</div>
							<div>
								<div class="flex justify-between text-xs mb-1">
									<span class="text-gray-600 dark:text-gray-400"
									>Wet Level</span>
									<span class="text-blue-500">{{
											selectedEffect.params.wetLevel
										}}%</span>
								</div>
								<input
									v-model="selectedEffect.params.wetLevel"
									type="range"
									min="0"
									max="100"
									class="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg accent-blue-500"
								>
							</div>
							<div>
								<div class="flex justify-between text-xs mb-1">
									<span class="text-gray-600 dark:text-gray-400"
									>Pre-delay</span>
									<span class="text-blue-500">{{
											selectedEffect.params.preDelay
										}}ms</span>
								</div>
								<input
									v-model="selectedEffect.params.preDelay"
									type="range"
									min="0"
									max="100"
									class="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg accent-blue-500"
								>
							</div>
						</div>
					</template>

					<!-- Delay Parameters -->
					<template v-if="selectedEffect.type === 'delay'">
						<div class="space-y-3">
							<div>
								<div class="flex justify-between text-xs mb-1">
									<span class="text-gray-600 dark:text-gray-400"
									>Delay Time</span>
									<span class="text-blue-500">{{
											selectedEffect.params.time
										}}ms</span>
								</div>
								<input
									v-model="selectedEffect.params.time"
									type="range"
									min="10"
									max="2000"
									class="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg accent-blue-500"
								>
							</div>
							<div>
								<div class="flex justify-between text-xs mb-1">
									<span class="text-gray-600 dark:text-gray-400">Feedback</span>
									<span class="text-blue-500">{{
											selectedEffect.params.feedback
										}}%</span>
								</div>
								<input
									v-model="selectedEffect.params.feedback"
									type="range"
									min="0"
									max="95"
									class="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg accent-blue-500"
								>
							</div>
							<div>
								<div class="flex justify-between text-xs mb-1">
									<span class="text-gray-600 dark:text-gray-400">Mix</span>
									<span class="text-blue-500">{{
											selectedEffect.params.mix
										}}%</span>
								</div>
								<input
									v-model="selectedEffect.params.mix"
									type="range"
									min="0"
									max="100"
									class="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg accent-blue-500"
								>
							</div>
						</div>
					</template>

					<!-- EQ Parameters -->
					<template v-if="selectedEffect.type === 'eq'">
						<div class="space-y-3">
							<div class="p-3 bg-gray-50 dark:bg-gray-900 rounded-lg">
								<div class="text-xs text-gray-500 dark:text-gray-400 mb-2">
									LOW
								</div>
								<div class="flex gap-2">
									<input
										v-model="selectedEffect.params.lowGain"
										type="range"
										min="-15"
										max="15"
										class="flex-1 h-2 bg-gray-200 dark:bg-gray-700 rounded-lg accent-blue-500"
									>
									<span class="text-xs text-blue-500 w-12 text-right">{{
											(selectedEffect?.params?.lowGain ?? 0) > 0 ? "+" : ""
										}}{{ selectedEffect?.params?.lowGain ?? 0 }}dB</span>
								</div>
							</div>
							<div class="p-3 bg-gray-50 dark:bg-gray-900 rounded-lg">
								<div class="text-xs text-gray-500 dark:text-gray-400 mb-2">
									MID ({{ selectedEffect.params.midFreq }}Hz)
								</div>
								<div class="flex gap-2 mb-2">
									<input
										v-model="selectedEffect.params.midGain"
										type="range"
										min="-15"
										max="15"
										class="flex-1 h-2 bg-gray-200 dark:bg-gray-700 rounded-lg accent-blue-500"
									>
									<span class="text-xs text-blue-500 w-12 text-right">{{
											(selectedEffect?.params?.midGain ?? 0) > 0 ? "+" : ""
										}}{{ selectedEffect?.params?.midGain ?? 0 }}dB</span>
								</div>
								<input
									v-model="selectedEffect.params.midFreq"
									type="range"
									min="200"
									max="8000"
									class="w-full h-1 bg-gray-200 dark:bg-gray-700 rounded-lg accent-blue-500"
								>
							</div>
							<div class="p-3 bg-gray-50 dark:bg-gray-900 rounded-lg">
								<div class="text-xs text-gray-500 dark:text-gray-400 mb-2">
									HIGH
								</div>
								<div class="flex gap-2">
									<input
										v-model="selectedEffect.params.highGain"
										type="range"
										min="-15"
										max="15"
										class="flex-1 h-2 bg-gray-200 dark:bg-gray-700 rounded-lg accent-blue-500"
									>
									<span class="text-xs text-blue-500 w-12 text-right">{{
											(selectedEffect?.params?.highGain ?? 0) > 0 ? "+" : ""
										}}{{ selectedEffect?.params?.highGain ?? 0 }}dB</span>
								</div>
							</div>
						</div>
					</template>

					<!-- Compressor Parameters -->
					<template v-if="selectedEffect.type === 'compression'">
						<div class="space-y-3">
							<div>
								<div class="flex justify-between text-xs mb-1">
									<span class="text-gray-600 dark:text-gray-400"
									>Threshold</span>
									<span class="text-blue-500">{{
											selectedEffect.params.threshold
										}}dB</span>
								</div>
								<input
									v-model="selectedEffect.params.threshold"
									type="range"
									min="-60"
									max="0"
									class="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg accent-blue-500"
								>
							</div>
							<div>
								<div class="flex justify-between text-xs mb-1">
									<span class="text-gray-600 dark:text-gray-400">Ratio</span>
									<span class="text-blue-500">1:{{
											selectedEffect.params.ratio
										}}</span>
								</div>
								<input
									v-model="selectedEffect.params.ratio"
									type="range"
									min="1"
									max="20"
									class="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg accent-blue-500"
								>
							</div>
							<div class="grid grid-cols-2 gap-3">
								<div>
									<div class="flex justify-between text-xs mb-1">
										<span class="text-gray-600 dark:text-gray-400">Attack</span>
										<span class="text-blue-500">{{
												selectedEffect.params.attack
											}}ms</span>
									</div>
									<input
										v-model="selectedEffect.params.attack"
										type="range"
										min="1"
										max="100"
										class="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg accent-blue-500"
									>
								</div>
								<div>
									<div class="flex justify-between text-xs mb-1">
										<span class="text-gray-600 dark:text-gray-400"
										>Release</span>
										<span class="text-blue-500">{{
												selectedEffect.params.release
											}}ms</span>
									</div>
									<input
										v-model="selectedEffect.params.release"
										type="range"
										min="10"
										max="1000"
										class="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg accent-blue-500"
									>
								</div>
							</div>
							<div>
								<div class="flex justify-between text-xs mb-1">
									<span class="text-gray-600 dark:text-gray-400"
									>Makeup Gain</span>
									<span class="text-blue-500">{{
											selectedEffect.params.makeupGain
										}}dB</span>
								</div>
								<input
									v-model="selectedEffect.params.makeupGain"
									type="range"
									min="0"
									max="30"
									class="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg accent-blue-500"
								>
							</div>
						</div>
					</template>

					<!-- Limiter Parameters -->
					<template v-if="selectedEffect.type === 'limiter'">
						<div class="space-y-3">
							<div>
								<div class="flex justify-between text-xs mb-1">
									<span class="text-gray-600 dark:text-gray-400"
									>Threshold</span>
									<span class="text-blue-500">{{
											selectedEffect.params.threshold
										}}dB</span>
								</div>
								<input
									v-model="selectedEffect.params.threshold"
									type="range"
									min="-20"
									max="0"
									class="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg accent-blue-500"
								>
							</div>
							<div>
								<div class="flex justify-between text-xs mb-1">
									<span class="text-gray-600 dark:text-gray-400">Release</span>
									<span class="text-blue-500">{{
											selectedEffect.params.release
										}}ms</span>
								</div>
								<input
									v-model="selectedEffect.params.release"
									type="range"
									min="1"
									max="500"
									class="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg accent-blue-500"
								>
							</div>
							<div>
								<div class="flex justify-between text-xs mb-1">
									<span class="text-gray-600 dark:text-gray-400"
									>Lookahead</span>
									<span class="text-blue-500">{{
											selectedEffect.params.lookahead
										}}ms</span>
								</div>
								<input
									v-model="selectedEffect.params.lookahead"
									type="range"
									min="0"
									max="20"
									class="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg accent-blue-500"
								>
							</div>
						</div>
					</template>

					<!-- Chorus Parameters -->
					<template v-if="selectedEffect.type === 'chorus'">
						<div class="space-y-3">
							<div>
								<div class="flex justify-between text-xs mb-1">
									<span class="text-gray-600 dark:text-gray-400">Rate</span>
									<span class="text-blue-500">{{
											selectedEffect.params.rate
										}}Hz</span>
								</div>
								<input
									v-model="selectedEffect.params.rate"
									type="range"
									min="0.1"
									max="10"
									step="0.1"
									class="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg accent-blue-500"
								>
							</div>
							<div>
								<div class="flex justify-between text-xs mb-1">
									<span class="text-gray-600 dark:text-gray-400">Depth</span>
									<span class="text-blue-500">{{
											selectedEffect.params.depth
										}}%</span>
								</div>
								<input
									v-model="selectedEffect.params.depth"
									type="range"
									min="0"
									max="100"
									class="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg accent-blue-500"
								>
							</div>
							<div>
								<div class="flex justify-between text-xs mb-1">
									<span class="text-gray-600 dark:text-gray-400">Mix</span>
									<span class="text-blue-500">{{
											selectedEffect.params.mix
										}}%</span>
								</div>
								<input
									v-model="selectedEffect.params.mix"
									type="range"
									min="0"
									max="100"
									class="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg accent-blue-500"
								>
							</div>
						</div>
					</template>

					<!-- Distortion Parameters -->
					<template v-if="selectedEffect.type === 'distortion'">
						<div class="space-y-3">
							<div>
								<div class="flex justify-between text-xs mb-1">
									<span class="text-gray-600 dark:text-gray-400">Drive</span>
									<span class="text-blue-500">{{
											selectedEffect.params.drive
										}}%</span>
								</div>
								<input
									v-model="selectedEffect.params.drive"
									type="range"
									min="0"
									max="100"
									class="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg accent-blue-500"
								>
							</div>
							<div>
								<div class="flex justify-between text-xs mb-1">
									<span class="text-gray-600 dark:text-gray-400">Tone</span>
									<span class="text-blue-500">{{
											selectedEffect.params.tone
										}}%</span>
								</div>
								<input
									v-model="selectedEffect.params.tone"
									type="range"
									min="0"
									max="100"
									class="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg accent-blue-500"
								>
							</div>
							<div>
								<div class="flex justify-between text-xs mb-1">
									<span class="text-gray-600 dark:text-gray-400">Mix</span>
									<span class="text-blue-500">{{
											selectedEffect.params.mix
										}}%</span>
								</div>
								<input
									v-model="selectedEffect.params.mix"
									type="range"
									min="0"
									max="100"
									class="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg accent-blue-500"
								>
							</div>
						</div>
					</template>
				</div>

				<div
					v-else
					class="flex-1 flex items-center justify-center text-gray-400"
				>
					<div class="text-center">
						<Icon name="mdi:tune" class="w-12 h-12 mb-2 opacity-30" />
						<p class="text-sm">Select an effect to edit</p>
					</div>
				</div>
			</div>
		</div>

		<!-- Presets -->
		<div class="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
			<div class="text-xs text-gray-500 dark:text-gray-400 font-medium mb-2">
				PRESETS
			</div>
			<div class="flex gap-2 flex-wrap">
				<button
					v-for='preset in [
						"Voice Enhancement",
						"Radio Voice",
						"Concert Hall",
						"Slapback Echo",
					]'
					:key="preset"
					class="px-3 py-1.5 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 text-xs rounded-lg transition-colors"
					@click="loadPreset(preset)"
				>
					{{ preset }}
				</button>
			</div>
		</div>

		<!-- Actions -->
		<div class="flex gap-2 pt-4 mt-4 border-t border-gray-200 dark:border-gray-700">
			<button
				class="flex-1 px-4 py-2 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-900 dark:text-white rounded-lg text-sm font-medium transition-colors"
				@click="emit('close')"
			>
				Cancel
			</button>
			<button
				class="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-2"
				:disabled="isProcessing || bypassAll"
				@click="handleApply"
			>
				<Icon
					v-if="isProcessing"
					name="mdi:loading"
					class="w-4 h-4 animate-spin"
				/>
				<Icon v-else name="mdi:check" class="w-4 h-4" />
				Apply Effects
			</button>
		</div>
	</div>
</template>
