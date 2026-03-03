<script setup lang="ts">
const enabled = defineModel<boolean>("enabled", { default: false });
const targetWPM = defineModel<number>("targetWPM", { default: 150 });
const showRealTime = defineModel<boolean>("showRealTime", { default: true });
const showGraph = defineModel<boolean>("showGraph", { default: true });
const warnOnFast = defineModel<boolean>("warnOnFast", { default: true });
const warnOnSlow = defineModel<boolean>("warnOnSlow", { default: true });

const currentWPM = ref(142);
const avgWPM = ref(145);
const maxWPM = ref(180);
const minWPM = ref(120);
const totalWords = ref(342);
const speakingTime = ref("02:24");

const paceHistory = ref([
	120,
	130,
	145,
	160,
	155,
	140,
	135,
	150,
	165,
	145,
	130,
	140,
	142,
]);

const paceStatus = computed(() => {
	if (currentWPM.value > targetWPM.value + 30) return "fast";
	if (currentWPM.value < targetWPM.value - 30) return "slow";
	return "good";
});

const getPaceColor = (wpm: number) => {
	if (wpm > targetWPM.value + 30) return "text-red-500";
	if (wpm < targetWPM.value - 30) return "text-yellow-500";
	return "text-green-500";
};
</script>

<template>
	<div class="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
		<div class="flex items-center justify-between mb-4">
			<div class="flex items-center gap-3">
				<div class="w-10 h-10 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
					<Icon
						name="mdi:speedometer"
						class="w-5 h-5 text-blue-600 dark:text-blue-400"
					/>
				</div>
				<div>
					<h3 class="font-semibold text-gray-900 dark:text-white">
						Speaking Pace Analysis
					</h3>
					<p class="text-sm text-gray-500 dark:text-gray-400">
						Real-time WPM tracking & feedback
					</p>
				</div>
			</div>
			<label class="relative inline-flex items-center cursor-pointer">
				<input v-model="enabled" type="checkbox" class="sr-only peer">
				<div class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600" />
			</label>
		</div>

		<div v-if="enabled" class="space-y-4">
			<div class="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
				<div class="flex items-start gap-2">
					<Icon name="mdi:information" class="w-4 h-4 text-blue-600 mt-0.5" />
					<p class="text-xs text-blue-700 dark:text-blue-300">
						Track your speaking pace in real-time. Optimal presentation pace is
						130-160 WPM. Get instant feedback to improve your delivery.
					</p>
				</div>
			</div>

			<div class="grid grid-cols-2 gap-3">
				<div class="p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg text-center">
					<div class="text-3xl font-bold" :class="getPaceColor(currentWPM)">
						{{ currentWPM }}
					</div>
					<div class="text-xs text-gray-500">Current WPM</div>
				</div>
				<div class="p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg text-center">
					<div class="text-3xl font-bold text-gray-700 dark:text-gray-300">
						{{ avgWPM }}
					</div>
					<div class="text-xs text-gray-500">Average WPM</div>
				</div>
			</div>

			<div>
				<div class="flex justify-between text-sm mb-1">
					<span class="text-gray-700 dark:text-gray-300">Target WPM</span>
					<span class="text-gray-500">{{ targetWPM }}</span>
				</div>
				<input
					v-model.number="targetWPM"
					type="range"
					min="80"
					max="250"
					class="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700 accent-blue-600"
				>
				<div class="flex justify-between text-xs text-gray-500 mt-1">
					<span>Slow (80)</span>
					<span>Fast (250)</span>
				</div>
			</div>

			<div
				v-if="showGraph"
				class="border-t border-gray-200 dark:border-gray-700 pt-4"
			>
				<h4 class="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
					Pace History
				</h4>
				<div class="h-24 flex items-end gap-1">
					<div
						v-for="(wpm, i) in paceHistory"
						:key="i"
						class="flex-1 rounded-t transition-all"
						:class="wpm > targetWPM + 30
						? 'bg-red-400'
						: wpm < targetWPM - 30
						? 'bg-yellow-400'
						: 'bg-green-400'"
						:style="{ height: `${(wpm / 200) * 100}%` }"
					/>
				</div>
				<div class="flex justify-between text-xs text-gray-500 mt-1">
					<span>0s</span>
					<span>30s</span>
					<span>1m</span>
					<span>1m30s</span>
					<span>2m</span>
				</div>
			</div>

			<div class="grid grid-cols-4 gap-2 text-center">
				<div>
					<div class="text-lg font-semibold text-gray-900 dark:text-white">
						{{ totalWords }}
					</div>
					<div class="text-xs text-gray-500">Words</div>
				</div>
				<div>
					<div class="text-lg font-semibold text-gray-900 dark:text-white">
						{{ speakingTime }}
					</div>
					<div class="text-xs text-gray-500">Duration</div>
				</div>
				<div>
					<div class="text-lg font-semibold text-red-500">{{ maxWPM }}</div>
					<div class="text-xs text-gray-500">Max</div>
				</div>
				<div>
					<div class="text-lg font-semibold text-yellow-500">{{ minWPM }}</div>
					<div class="text-xs text-gray-500">Min</div>
				</div>
			</div>

			<div
				v-if="showRealTime"
				class="flex items-center gap-2 p-2 rounded-lg"
				:class="paceStatus === 'good'
				? 'bg-green-50 dark:bg-green-900/20'
				: paceStatus === 'fast'
				? 'bg-red-50 dark:bg-red-900/20'
				: 'bg-yellow-50 dark:bg-yellow-900/20'"
			>
				<Icon
					:name="paceStatus === 'good'
					? 'mdi:check-circle'
					: paceStatus === 'fast'
					? 'mdi:alert'
					: 'mdi:alert'"
					:class="`w-4 h-4 ${
						paceStatus === 'good'
							? 'text-green-600'
							: paceStatus === 'fast'
							? 'text-red-600'
							: 'text-yellow-600'
					}`"
				/>
				<span
					:class="`text-xs ${
						paceStatus === 'good'
							? 'text-green-700'
							: paceStatus === 'fast'
							? 'text-red-700'
							: 'text-yellow-700'
					}`"
				>
					{{
						paceStatus === "good"
						? "Great pace! Keep it up."
						: paceStatus === "fast"
						? "Speaking too fast. Slow down."
						: "Speaking slowly. Pick up the pace."
					}}
				</span>
			</div>

			<div class="space-y-2">
				<label class="flex items-center gap-2 cursor-pointer">
					<input
						v-model="warnOnFast"
						type="checkbox"
						class="w-4 h-4 text-blue-600 rounded"
					>
					<span class="text-sm text-gray-700 dark:text-gray-300"
					>Warn when speaking too fast</span>
				</label>
				<label class="flex items-center gap-2 cursor-pointer">
					<input
						v-model="warnOnSlow"
						type="checkbox"
						class="w-4 h-4 text-blue-600 rounded"
					>
					<span class="text-sm text-gray-700 dark:text-gray-300"
					>Warn when speaking too slow</span>
				</label>
			</div>
		</div>
	</div>
</template>
