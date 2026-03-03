<script setup lang="ts">
const emit = defineEmits<{ close: []; apply: [keyframes: any[]] }>();
const keyframes = ref([{ time: 0, speed: 100 }, { time: 2, speed: 400 }, {
	time: 4,
	speed: 100,
}]);
const selectedKeyframe = ref<number | null>(null);
const easing = ref("smooth");

const easings = ["linear", "smooth", "ease-in", "ease-out", "bounce"];

const addKeyframe = () => {
	const last = keyframes.value[keyframes.value.length - 1];
	if (last) {
		keyframes.value.push({ time: last.time + 1, speed: 100 });
	}
};

const removeKeyframe = (index: number) => {
	if (keyframes.value.length > 2) {
		keyframes.value.splice(index, 1);
	}
};

const apply = () => emit("apply", keyframes.value);
</script>

<template>
	<div class="speed-ramping bg-white dark:bg-gray-800 rounded-xl p-4 w-[500px] shadow-lg border border-gray-200 dark:border-gray-700">
		<div class="flex items-center justify-between mb-4">
			<h3 class="text-gray-900 dark:text-white font-semibold flex items-center gap-2">
				<Icon name="mdi:gauge" class="w-5 h-5 text-blue-500" />
				Speed Ramping
			</h3>
			<button
				class="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
				@click="emit('close')"
			>
				<Icon name="mdi:close" class="w-5 h-5" />
			</button>
		</div>
		<div class="h-32 bg-gray-100 dark:bg-gray-900 rounded-lg mb-4 relative">
			<svg class="w-full h-full">
				<path
					:d="`M ${
						keyframes.map((k, i) =>
							`${(k.time / 5) * 100}% ${100 - k.speed / 5}%`
						).join(' L ')
					}`"
					stroke="#3b82f6"
					stroke-width="2"
					fill="none"
				/>
				<circle
					v-for="(k, i) in keyframes"
					:key="i"
					:cx="`${(k.time / 5) * 100}%`"
					:cy="`${100 - k.speed / 5}%`"
					r="4"
					fill="#3b82f6"
					class="cursor-pointer"
					@click="selectedKeyframe = i"
				/>
			</svg>
		</div>
		<div class="mb-4">
			<label
				class="text-gray-500 dark:text-gray-400 text-xs mb-1 block uppercase font-medium"
			>Easing</label>
			<select
				v-model="easing"
				class="w-full bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white px-3 py-2 rounded-lg text-sm border-0"
			>
				<option v-for="e in easings" :key="e" :value="e">{{ e }}</option>
			</select>
		</div>
		<div class="max-h-40 overflow-y-auto space-y-2 mb-4">
			<div
				v-for="(k, i) in keyframes"
				:key="i"
				class="flex items-center gap-2 p-2 rounded-lg transition-all"
				:class="selectedKeyframe === i
				? 'bg-blue-100 dark:bg-blue-900/30 ring-1 ring-blue-500'
				: 'bg-gray-50 dark:bg-gray-700/30'"
			>
				<div class="text-gray-500 dark:text-gray-400 text-xs w-8">
					#{{ i + 1 }}
				</div>
				<div class="flex-1 grid grid-cols-2 gap-2">
					<div>
						<input
							v-model="k.time"
							type="number"
							step="0.1"
							class="w-full bg-white dark:bg-gray-600 text-gray-900 dark:text-white px-2 py-1 rounded text-sm border-0"
						/>
					</div>
					<div class="flex items-center gap-1">
						<input
							v-model="k.speed"
							type="number"
							class="w-full bg-white dark:bg-gray-600 text-gray-900 dark:text-white px-2 py-1 rounded text-sm border-0"
						/><span class="text-gray-500 dark:text-gray-400 text-xs">%</span>
					</div>
				</div>
				<button
					v-if="keyframes.length > 2"
					class="text-gray-400 hover:text-red-500"
					@click="removeKeyframe(i)"
				>
					<Icon name="mdi:delete" class="w-4 h-4" />
				</button>
			</div>
		</div>
		<button
			class="w-full mb-4 px-4 py-2 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-900 dark:text-white rounded-lg text-sm transition-colors"
			@click="addKeyframe"
		>
			Add Keyframe
		</button>
		<button
			class="w-full px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-colors"
			@click="apply"
		>
			Apply Speed Ramp
		</button>
	</div>
</template>
