<script setup lang="ts">
const enabled = defineModel<boolean>("enabled", { default: false });
const selectedTransition = defineModel<string>("transition", {
	default: "fade",
});
const transitionDuration = defineModel<number>("duration", { default: 1000 });
const autoTransition = defineModel<boolean>("auto", { default: false });
const autoTransitionInterval = defineModel<number>("interval", { default: 30 });

const transitions = [
	{ id: "cut", name: "Cut", icon: "mdi:content-cut", category: "Basic" },
	{ id: "fade", name: "Fade", icon: "mdi:fade", category: "Basic" },
	{ id: "dissolve", name: "Dissolve", icon: "mdi:blur", category: "Basic" },
	{
		id: "wipe-left",
		name: "Wipe Left",
		icon: "mdi:arrow-left",
		category: "Directional",
	},
	{
		id: "wipe-right",
		name: "Wipe Right",
		icon: "mdi:arrow-right",
		category: "Directional",
	},
	{
		id: "slide-up",
		name: "Slide Up",
		icon: "mdi:arrow-up",
		category: "Directional",
	},
	{
		id: "slide-down",
		name: "Slide Down",
		icon: "mdi:arrow-down",
		category: "Directional",
	},
	{
		id: "zoom-in",
		name: "Zoom In",
		icon: "mdi:magnify-plus",
		category: "Zoom",
	},
	{
		id: "zoom-out",
		name: "Zoom Out",
		icon: "mdi:magnify-minus",
		category: "Zoom",
	},
	{
		id: "pixelate",
		name: "Pixelate",
		icon: "mdi:checkerboard",
		category: "Creative",
	},
	{
		id: "glitch",
		name: "Glitch",
		icon: "mdi:lightning-bolt",
		category: "Creative",
	},
	{ id: "spin", name: "Spin", icon: "mdi:rotate-right", category: "Creative" },
] as const;

const categories = [...new Set(transitions.map(t => t.category))];
const selectedCategory = ref("All");

const filteredTransitions = computed(() => {
	if (selectedCategory.value === "All") return transitions;
	return transitions.filter(t => t.category === selectedCategory.value);
});

const segments = ref([
	{ id: 1, name: "Intro", duration: 10, transition: "fade" },
	{ id: 2, name: "Main Content", duration: 120, transition: "cut" },
	{ id: 3, name: "Outro", duration: 15, transition: "fade" },
]);
</script>

<template>
	<div class="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
		<div class="flex items-center justify-between mb-4">
			<div class="flex items-center gap-3">
				<div class="w-10 h-10 rounded-lg bg-violet-100 dark:bg-violet-900/30 flex items-center justify-center">
					<Icon
						name="mdi:transition"
						class="w-5 h-5 text-violet-600 dark:text-violet-400"
					/>
				</div>
				<div>
					<h3 class="font-semibold text-gray-900 dark:text-white">
						Scene Transitions
					</h3>
					<p class="text-sm text-gray-500 dark:text-gray-400">
						Smooth transitions between segments
					</p>
				</div>
			</div>
			<label class="relative inline-flex items-center cursor-pointer">
				<input v-model="enabled" type="checkbox" class="sr-only peer">
				<div class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-violet-300 dark:peer-focus:ring-violet-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-violet-600" />
			</label>
		</div>

		<div v-if="enabled" class="space-y-4">
			<div class="p-3 bg-violet-50 dark:bg-violet-900/20 rounded-lg">
				<div class="flex items-start gap-2">
					<Icon name="mdi:information" class="w-4 h-4 text-violet-600 mt-0.5" />
					<p class="text-xs text-violet-700 dark:text-violet-300">
						Add professional transitions between recording segments. Trigger
						manually with hotkeys or set automatic transitions.
					</p>
				</div>
			</div>

			<div>
				<label
					class="text-sm font-medium text-gray-700 dark:text-gray-300 block mb-2"
				>Category Filter</label>
				<div class="flex flex-wrap gap-1">
					<button
						v-for='cat in ["All", ...categories]'
						:key="cat"
						:class="[
							'px-3 py-1 rounded-full text-xs font-medium transition-colors',
							selectedCategory === cat
								? 'bg-violet-100 dark:bg-violet-900/30 text-violet-700'
								: 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-200',
						]"
						@click="selectedCategory = cat"
					>
						{{ cat }}
					</button>
				</div>
			</div>

			<div class="grid grid-cols-3 gap-2">
				<button
					v-for="trans in filteredTransitions"
					:key="trans.id"
					:class="[
						'p-2 rounded-lg border text-center transition-all',
						selectedTransition === trans.id
							? 'border-violet-500 bg-violet-50 dark:bg-violet-900/20'
							: 'border-gray-200 dark:border-gray-700 hover:border-violet-300',
					]"
					@click="selectedTransition = trans.id"
				>
					<Icon
						:name="trans.icon"
						class="w-5 h-5 mx-auto mb-1"
						:class="selectedTransition === trans.id
						? 'text-violet-600'
						: 'text-gray-500'"
					/>
					<div
						class="text-xs font-medium"
						:class="selectedTransition === trans.id
						? 'text-gray-900 dark:text-white'
						: 'text-gray-600'"
					>
						{{ trans.name }}
					</div>
				</button>
			</div>

			<div>
				<div class="flex justify-between text-sm mb-1">
					<span class="text-gray-700 dark:text-gray-300"
					>Transition Duration</span>
					<span class="text-gray-500">{{ transitionDuration }}ms</span>
				</div>
				<input
					v-model.number="transitionDuration"
					type="range"
					min="100"
					max="3000"
					step="100"
					class="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700 accent-violet-600"
				>
			</div>

			<div class="flex items-center gap-2 p-2 rounded-lg border border-gray-200 dark:border-gray-700">
				<input
					v-model="autoTransition"
					type="checkbox"
					class="w-4 h-4 text-violet-600 rounded"
				>
				<div class="flex-1">
					<span class="text-sm font-medium text-gray-700 dark:text-gray-300"
					>Auto-transition</span>
					<p class="text-xs text-gray-500">Switch scenes automatically</p>
				</div>
			</div>

			<div v-if="autoTransition" class="pl-6">
				<div class="flex justify-between text-sm mb-1">
					<span class="text-gray-700 dark:text-gray-300">Interval</span>
					<span class="text-gray-500">{{ autoTransitionInterval }}s</span>
				</div>
				<input
					v-model.number="autoTransitionInterval"
					type="range"
					min="5"
					max="300"
					step="5"
					class="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700 accent-violet-600"
				>
			</div>

			<div class="border-t border-gray-200 dark:border-gray-700 pt-4">
				<h4 class="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
					Recording Segments
				</h4>
				<div class="space-y-2">
					<div
						v-for="(segment, index) in segments"
						:key="segment.id"
						class="flex items-center gap-2 p-2 bg-gray-50 dark:bg-gray-700/50 rounded-lg"
					>
						<span
							class="w-6 h-6 rounded-full bg-violet-100 dark:bg-violet-900/30 flex items-center justify-center text-xs font-bold text-violet-600"
						>{{ index + 1 }}</span>
						<div class="flex-1">
							<div class="text-sm font-medium text-gray-900 dark:text-white">
								{{ segment.name }}
							</div>
							<div class="text-xs text-gray-500">
								{{ segment.duration }}s • {{ segment.transition }}
							</div>
						</div>
						<button class="p-1 hover:bg-gray-200 dark:hover:bg-gray-600 rounded">
							<Icon name="mdi:cog" class="w-4 h-4 text-gray-500" />
						</button>
					</div>
				</div>
			</div>

			<div class="flex gap-2">
				<button class="flex-1 py-2 px-3 bg-violet-600 hover:bg-violet-700 text-white rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-1">
					<Icon name="mdi:play" class="w-4 h-4" />
					Preview Transition
				</button>
				<button class="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
					<Icon name="mdi:keyboard" class="w-4 h-4" />
				</button>
			</div>
		</div>
	</div>
</template>
