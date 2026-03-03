<script setup lang="ts">
const enabled = defineModel<boolean>("enabled", { default: false });
const duckingAmount = defineModel<number>("amount", { default: 50 });
const attackTime = defineModel<number>("attack", { default: 100 });
const releaseTime = defineModel<number>("release", { default: 500 });
const threshold = defineModel<number>("threshold", { default: -30 });
const musicSource = defineModel<"system" | "file" | "streaming">("source", {
	default: "system",
});

const audioLevel = ref(0);
const isSpeaking = ref(false);

const musicSources = [
	{ value: "system", label: "System Audio", icon: "mdi:volume-high" },
	{ value: "file", label: "Audio File", icon: "mdi:music" },
	{ value: "streaming", label: "Streaming", icon: "mdi:radio" },
] as const;

onMounted(() => {
	const interval = setInterval(() => {
		audioLevel.value = Math.random() * 100;
		isSpeaking.value = audioLevel.value > 40;
	}, 100);
	onUnmounted(() => clearInterval(interval));
});
</script>

<template>
	<div class="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
		<div class="flex items-center justify-between mb-4">
			<div class="flex items-center gap-3">
				<div class="w-10 h-10 rounded-lg bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center">
					<Icon
						name="mdi:volume-minus"
						class="w-5 h-5 text-orange-600 dark:text-orange-400"
					/>
				</div>
				<div>
					<h3 class="font-semibold text-gray-900 dark:text-white">
						Audio Ducking
					</h3>
					<p class="text-sm text-gray-500 dark:text-gray-400">
						Auto-lower music when speaking
					</p>
				</div>
			</div>
			<label class="relative inline-flex items-center cursor-pointer">
				<input v-model="enabled" type="checkbox" class="sr-only peer">
				<div class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-orange-300 dark:peer-focus:ring-orange-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-orange-600" />
			</label>
		</div>

		<div v-if="enabled" class="space-y-4">
			<div class="p-3 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
				<div class="flex items-start gap-2">
					<Icon name="mdi:information" class="w-4 h-4 text-orange-600 mt-0.5" />
					<p class="text-xs text-orange-700 dark:text-orange-300">
						Automatically reduces background music volume when you speak,
						creating professional audio levels without manual mixing.
					</p>
				</div>
			</div>

			<div>
				<label
					class="text-sm font-medium text-gray-700 dark:text-gray-300 block mb-2"
				>Music Source</label>
				<div class="grid grid-cols-3 gap-2">
					<button
						v-for="src in musicSources"
						:key="src.value"
						:class="[
							'p-2 rounded-lg border text-center transition-all',
							musicSource === src.value
								? 'border-orange-500 bg-orange-50 dark:bg-orange-900/20'
								: 'border-gray-200 dark:border-gray-700 hover:border-orange-300',
						]"
						@click="musicSource = src.value"
					>
						<Icon
							:name="src.icon"
							class="w-5 h-5 mx-auto mb-1"
							:class="musicSource === src.value ? 'text-orange-600' : 'text-gray-500'"
						/>
						<div
							class="text-xs font-medium"
							:class="musicSource === src.value
							? 'text-gray-900 dark:text-white'
							: 'text-gray-600'"
						>
							{{ src.label }}
						</div>
					</button>
				</div>
			</div>

			<div>
				<div class="flex justify-between text-sm mb-1">
					<span class="text-gray-700 dark:text-gray-300">Ducking Amount</span>
					<span class="text-gray-500">{{ duckingAmount }}%</span>
				</div>
				<input
					v-model.number="duckingAmount"
					type="range"
					min="0"
					max="100"
					class="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700 accent-orange-600"
				>
				<p class="text-xs text-gray-500 mt-1">
					How much to reduce music volume
				</p>
			</div>

			<div>
				<div class="flex justify-between text-sm mb-1">
					<span class="text-gray-700 dark:text-gray-300">Threshold</span>
					<span class="text-gray-500">{{ threshold }} dB</span>
				</div>
				<input
					v-model.number="threshold"
					type="range"
					min="-60"
					max="0"
					class="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700 accent-orange-600"
				>
				<p class="text-xs text-gray-500 mt-1">
					Voice level that triggers ducking
				</p>
			</div>

			<div class="grid grid-cols-2 gap-3">
				<div>
					<div class="flex justify-between text-sm mb-1">
						<span class="text-gray-700 dark:text-gray-300">Attack</span>
						<span class="text-gray-500">{{ attackTime }}ms</span>
					</div>
					<input
						v-model.number="attackTime"
						type="range"
						min="10"
						max="500"
						step="10"
						class="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700 accent-orange-600"
					>
					<p class="text-xs text-gray-500">Speed to lower music</p>
				</div>
				<div>
					<div class="flex justify-between text-sm mb-1">
						<span class="text-gray-700 dark:text-gray-300">Release</span>
						<span class="text-gray-500">{{ releaseTime }}ms</span>
					</div>
					<input
						v-model.number="releaseTime"
						type="range"
						min="100"
						max="2000"
						step="100"
						class="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700 accent-orange-600"
					>
					<p class="text-xs text-gray-500">Speed to restore music</p>
				</div>
			</div>

			<div class="border-t border-gray-200 dark:border-gray-700 pt-4">
				<h4 class="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
					Audio Levels (Live)
				</h4>
				<div class="space-y-2">
					<div class="flex items-center gap-2">
						<span class="w-16 text-xs text-gray-500">Voice</span>
						<div class="flex-1 h-4 bg-gray-200 dark:bg-gray-700 rounded overflow-hidden">
							<div
								:class="`h-full ${
									isSpeaking ? 'bg-green-500' : 'bg-gray-400'
								} transition-all duration-100`"
								:style="{ width: `${audioLevel}%` }"
							/>
						</div>
						<span
							:class="`text-xs font-medium ${
								isSpeaking ? 'text-green-500' : 'text-gray-400'
							}`"
						>{{ isSpeaking ? "SPEAKING" : "SILENT" }}</span>
					</div>
					<div class="flex items-center gap-2">
						<span class="w-16 text-xs text-gray-500">Music</span>
						<div class="flex-1 h-4 bg-gray-200 dark:bg-gray-700 rounded overflow-hidden">
							<div
								class="h-full bg-orange-500 transition-all duration-300"
								:style="{
									width: `${isSpeaking ? 100 - duckingAmount : 100}%`,
									opacity: isSpeaking ? 0.5 : 1,
								}"
							/>
						</div>
						<span class="text-xs text-gray-500">{{
							isSpeaking ? `${100 - duckingAmount}%` : "100%"
						}}</span>
					</div>
				</div>
			</div>

			<div class="flex items-center gap-2 p-2 bg-green-50 dark:bg-green-900/20 rounded-lg">
				<Icon name="mdi:check-circle" class="w-4 h-4 text-green-600" />
				<span class="text-xs text-green-700 dark:text-green-300"
				>Ducking active • Voice detected</span>
			</div>
		</div>
	</div>
</template>
