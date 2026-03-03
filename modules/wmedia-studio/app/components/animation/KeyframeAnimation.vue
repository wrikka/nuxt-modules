<script setup lang="ts">
const emit = defineEmits<{ close: []; apply: [keyframes: any[]] }>();
const properties = ref([
	{ name: "Position", icon: "i-ph-arrows-out-cardinal" },
	{ name: "Scale", icon: "i-ph-corners-out" },
	{ name: "Rotation", icon: "iph-arrows-clockwise" },
	{ name: "Opacity", icon: "i-ph-eye" },
]);
const selectedProperty = ref("Position");
const keyframes = ref([{ time: 0, value: 0 }, { time: 1, value: 100 }, {
	time: 2,
	value: 50,
}]);
const easing = ref("ease-in-out");

const easings = [
	"linear",
	"ease-in",
	"ease-out",
	"ease-in-out",
	"bounce",
	"elastic",
];

const addKeyframe = () => {
	keyframes.value.push({ time: keyframes.value.length, value: 0 });
};

const removeKeyframe = (index: number) => {
	if (keyframes.value.length > 2) {
		keyframes.value.splice(index, 1);
	}
};

const apply = () => emit("apply", keyframes.value);
</script>

<template>
	<div class="keyframe-animation bg-white dark:bg-gray-800 rounded-xl p-4 w-[500px] max-h-[80vh] flex flex-col shadow-lg border border-gray-200 dark:border-gray-700">
		<div class="flex items-center justify-between mb-4">
			<h3 class="text-gray-900 dark:text-white font-semibold flex items-center gap-2">
				<Icon name="mdi:key" class="w-5 h-5 text-blue-500" />
				Keyframe Animation
			</h3>
			<button
				class="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
				@click="emit('close')"
			>
				<Icon name="mdi:close" class="w-5 h-5" />
			</button>
		</div>
		<div class="flex gap-2 mb-4 overflow-x-auto">
			<button
				v-for="p in properties"
				:key="p.name"
				class="px-3 py-2 rounded-lg flex items-center gap-2 whitespace-nowrap transition-all"
				:class="selectedProperty === p.name
				? 'bg-blue-500 text-white'
				: 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'"
				@click="selectedProperty = p.name"
			>
				<span :class="[p.icon, 'w-4 h-4']" />
				<span class="text-sm">{{ p.name }}</span>
			</button>
		</div>
		<div class="h-24 bg-gray-100 dark:bg-gray-900 rounded-lg mb-4 relative overflow-hidden">
			<svg class="w-full h-full absolute inset-0">
				<path
					:d="`M ${
						keyframes.map((k, i) =>
							`${(k.time / (keyframes.length - 1 || 1)) * 100}% ${
								100 - k.value
							}%`
						).join(' L ')
					}`"
					stroke="#3b82f6"
					stroke-width="2"
					fill="none"
				/>
				<circle
					v-for="(k, i) in keyframes"
					:key="i"
					:cx="`${(k.time / (keyframes.length - 1 || 1)) * 100}%`"
					:cy="`${100 - k.value}%`"
					r="5"
					fill="#3b82f6"
					stroke="white"
					stroke-width="2"
					class="cursor-pointer"
				/>
			</svg>
		</div>
		<div class="mb-4">
			<label
				class="text-gray-500 dark:text-gray-400 text-xs mb-1 block uppercase font-medium"
			>Easing Function</label>
			<select
				v-model="easing"
				class="w-full bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white px-3 py-2 rounded-lg text-sm border-0"
			>
				<option v-for="e in easings" :key="e" :value="e">{{ e }}</option>
			</select>
		</div>
		<div class="flex-1 overflow-y-auto space-y-2 mb-4">
			<div
				v-for="(k, i) in keyframes"
				:key="i"
				class="flex items-center gap-2 p-2 rounded-lg bg-gray-50 dark:bg-gray-700/30"
			>
				<div class="text-gray-500 dark:text-gray-400 text-xs w-8">
					{{ i + 1 }}
				</div>
				<div class="flex-1 grid grid-cols-2 gap-2">
					<div>
						<label class="text-gray-500 dark:text-gray-400 text-xs"
						>Time (s)</label>
						<input
							v-model="k.time"
							type="number"
							step="0.1"
							class="w-full bg-white dark:bg-gray-600 text-gray-900 dark:text-white px-2 py-1 rounded text-sm border-0"
						/>
					</div>
					<div>
						<label class="text-gray-500 dark:text-gray-400 text-xs"
						>Value</label>
						<input
							v-model="k.value"
							type="number"
							class="w-full bg-white dark:bg-gray-600 text-gray-900 dark:text-white px-2 py-1 rounded text-sm border-0"
						/>
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
			Apply Animation
		</button>
	</div>
</template>
