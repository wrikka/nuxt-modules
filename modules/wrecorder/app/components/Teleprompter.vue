<script setup lang="ts">
const script = defineModel<string>("script", { default: "" });
const fontSize = defineModel<number>("fontSize", { default: 24 });
const scrollSpeed = defineModel<number>("scrollSpeed", { default: 50 });
const isPlaying = defineModel<boolean>("isPlaying", { default: false });
const textColor = defineModel<string>("textColor", { default: "#ffffff" });
const backgroundOpacity = defineModel<number>("backgroundOpacity", {
	default: 0.7,
});

const scrollPosition = ref(0);
let scrollInterval: NodeJS.Timeout | null = null;

const startScrolling = () => {
	if (scrollInterval) return;
	isPlaying.value = true;
	scrollInterval = setInterval(() => {
		scrollPosition.value += scrollSpeed.value / 10;
	}, 100);
};

const stopScrolling = () => {
	isPlaying.value = false;
	if (scrollInterval) {
		clearInterval(scrollInterval);
		scrollInterval = null;
	}
};

const resetScroll = () => {
	scrollPosition.value = 0;
};

const sampleScripts = [
	"Welcome to today's tutorial! In this video, we'll explore...",
	"Hello everyone! Today I'm going to show you how to...",
	"Hi there! Welcome back to my channel. In this video...",
];

const loadSample = (index: number) => {
	const sample = sampleScripts[index];
	if (sample) {
		script.value = sample;
	}
	resetScroll();
};

onUnmounted(() => {
	stopScrolling();
});
</script>

<template>
	<div class="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg space-y-4">
		<div class="flex items-center justify-between">
			<h3 class="text-lg font-semibold text-gray-900 dark:text-white">
				Teleprompter
			</h3>
			<div class="flex gap-2">
				<button
					class="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
					:class="isPlaying ? 'text-red-500' : 'text-green-500'"
					@click="isPlaying ? stopScrolling() : startScrolling()"
				>
					<Icon :name="isPlaying ? 'mdi:pause' : 'mdi:play'" class="w-5 h-5" />
				</button>
				<button
					class="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-500 transition-colors"
					@click="resetScroll"
				>
					<Icon name="mdi:restart" class="w-5 h-5" />
				</button>
			</div>
		</div>

		<!-- Preview -->
		<div
			class="relative h-48 rounded-lg overflow-hidden"
			:style="{ backgroundColor: `rgba(0,0,0,${backgroundOpacity})` }"
		>
			<div class="absolute inset-0 overflow-hidden p-4">
				<div
					class="transition-transform duration-100"
					:style="{
						transform: `translateY(-${scrollPosition}px)`,
						fontSize: `${fontSize}px`,
						color: textColor,
					}"
				>
					{{ script }}
				</div>
			</div>
			<!-- Center Reading Line -->
			<div class="absolute left-0 right-0 top-1/2 h-0.5 bg-purple-500/50" />
		</div>

		<!-- Controls -->
		<div class="space-y-3">
			<div>
				<label class="text-sm text-gray-600 dark:text-gray-400">Script</label>
				<textarea
					v-model="script"
					rows="4"
					class="w-full mt-1 px-3 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white text-sm"
					placeholder="Paste your script here..."
				/>
			</div>

			<div class="grid grid-cols-2 gap-3">
				<div>
					<label class="text-sm text-gray-600 dark:text-gray-400"
					>Font Size: {{ fontSize }}px</label>
					<input
						v-model.number="fontSize"
						type="range"
						min="12"
						max="72"
						class="w-full mt-1"
					/>
				</div>
				<div>
					<label class="text-sm text-gray-600 dark:text-gray-400">Speed: {{
							scrollSpeed
						}}</label>
					<input
						v-model.number="scrollSpeed"
						type="range"
						min="10"
						max="200"
						class="w-full mt-1"
					/>
				</div>
			</div>

			<div class="grid grid-cols-2 gap-3">
				<div>
					<label class="text-sm text-gray-600 dark:text-gray-400"
					>Text Color</label>
					<div class="flex items-center gap-2 mt-1">
						<input v-model="textColor" type="color" class="w-8 h-8 rounded" />
						<input
							v-model="textColor"
							type="text"
							class="flex-1 px-2 py-1 text-sm bg-gray-50 dark:bg-gray-700 border rounded"
						/>
					</div>
				</div>
				<div>
					<label class="text-sm text-gray-600 dark:text-gray-400"
					>Background Opacity: {{
							Math.round(backgroundOpacity * 100)
						}}%</label>
					<input
						v-model.number="backgroundOpacity"
						type="range"
						min="0"
						max="1"
						step="0.1"
						class="w-full mt-1"
					/>
				</div>
			</div>

			<div>
				<label class="text-sm text-gray-600 dark:text-gray-400 mb-2 block"
				>Quick Samples</label>
				<div class="flex gap-2">
					<button
						v-for="(sample, i) in sampleScripts"
						:key="i"
						class="px-3 py-1 text-xs bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded transition-colors"
						@click="loadSample(i)"
					>
						Sample {{ i + 1 }}
					</button>
				</div>
			</div>
		</div>
	</div>
</template>
