<script setup lang="ts">
const emit = defineEmits<
	{ close: []; apply: [transition: string, duration: number] }
>();
const selectedTransition = ref("fade");
const duration = ref(0.5);
const direction = ref("left");

const transitions = [
	{ id: "fade", name: "Fade", icon: "mdi:layers" },
	{ id: "slide", name: "Slide", icon: "mdi:arrow-left-right" },
	{ id: "wipe", name: "Wipe", icon: "mdi:brush" },
	{ id: "dissolve", name: "Dissolve", icon: "mdi:water" },
	{ id: "zoom", name: "Zoom", icon: "mdi:magnify-plus" },
	{ id: "flip", name: "Flip", icon: "mdi:flip-horizontal" },
	{ id: "cube", name: "Cube", icon: "mdi:cube-outline" },
	{ id: "morph", name: "Morph", icon: "mdi:magic-staff" },
];

const directions = ["left", "right", "up", "down", "center", "random"];

const apply = () => emit("apply", selectedTransition.value, duration.value);
</script>

<template>
	<div class="transition-builder bg-white dark:bg-gray-800 rounded-xl p-4 w-[500px] shadow-lg border border-gray-200 dark:border-gray-700">
		<div class="flex items-center justify-between mb-4">
			<h3 class="text-gray-900 dark:text-white font-semibold flex items-center gap-2">
				<Icon name="mdi:arrow-left-right" class="w-5 h-5 text-purple-500" />
				Transition Builder
			</h3>
			<button
				class="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
				@click="emit('close')"
			>
				<Icon name="mdi:close" class="w-5 h-5" />
			</button>
		</div>

		<div class="aspect-video bg-gray-100 dark:bg-gray-700 rounded-lg mb-4 flex items-center justify-center relative overflow-hidden">
			<div class="flex w-full h-full">
				<div class="flex-1 bg-gray-200 dark:bg-gray-600 flex items-center justify-center text-gray-500 dark:text-gray-400 text-sm">
					Clip A
				</div>
				<div class="w-px bg-white/20" />
				<div class="flex-1 bg-gray-200 dark:bg-gray-600 flex items-center justify-center text-gray-500 dark:text-gray-400 text-sm">
					Clip B
				</div>
			</div>
			<div class="absolute inset-0 flex items-center justify-center">
				<div class="px-3 py-1.5 bg-purple-600 text-white text-xs rounded-lg font-medium">
					{{ transitions.find(t => t.id === selectedTransition)?.name }}
				</div>
			</div>
		</div>

		<div class="mb-4">
			<label
				class="text-gray-500 dark:text-gray-400 text-xs mb-2 block uppercase tracking-wider font-medium"
			>Transition Type</label>
			<div class="grid grid-cols-4 gap-2">
				<button
					v-for="t in transitions"
					:key="t.id"
					class="p-2 rounded-lg text-center transition-all"
					:class="selectedTransition === t.id
					? 'bg-purple-100 dark:bg-purple-900/30 ring-1 ring-purple-500'
					: 'bg-gray-50 dark:bg-gray-700/50 hover:bg-gray-100 dark:hover:bg-gray-700'"
					@click="selectedTransition = t.id"
				>
					<Icon
						:name="t.icon"
						class="w-5 h-5 mx-auto mb-1"
						:class="selectedTransition === t.id ? 'text-purple-500' : 'text-gray-400'"
					/>
					<div class="text-gray-700 dark:text-gray-300 text-xs">
						{{ t.name }}
					</div>
				</button>
			</div>
		</div>

		<div class="mb-4">
			<div class="flex justify-between text-sm mb-1">
				<span class="text-gray-600 dark:text-gray-400">Duration</span>
				<span class="text-purple-500 font-medium">{{ duration }}s</span>
			</div>
			<input
				v-model="duration"
				type="range"
				min="0.1"
				max="3"
				step="0.1"
				class="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer accent-purple-500"
			/>
		</div>

		<div class="mb-4">
			<label
				class="text-gray-500 dark:text-gray-400 text-xs mb-2 block uppercase tracking-wider font-medium"
			>Direction</label>
			<div class="flex gap-2">
				<button
					v-for="d in directions"
					:key="d"
					class="flex-1 p-2 rounded-lg text-center text-xs capitalize transition-all"
					:class="direction === d
					? 'bg-purple-500 text-white'
					: 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600'"
					@click="direction = d"
				>
					{{ d }}
				</button>
			</div>
		</div>

		<button
			class="w-full px-4 py-2.5 bg-purple-600 hover:bg-purple-700 text-white rounded-lg text-sm font-medium transition-colors"
			@click="apply"
		>
			Apply Transition
		</button>
	</div>
</template>
