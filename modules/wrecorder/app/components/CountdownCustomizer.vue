<script setup lang="ts">
const countdownDuration = defineModel<number>("countdownDuration", {
	default: 3,
});
const countdownStyle = defineModel<"default" | "modern" | "minimal" | "fun">(
	"countdownStyle",
	{ default: "default" },
);
const countdownSound = defineModel<boolean>("countdownSound", {
	default: true,
});
const countdownColor = defineModel<string>("countdownColor", {
	default: "#ffffff",
});

const durationOptions = [
	{ value: 0, label: "None" },
	{ value: 3, label: "3 seconds" },
	{ value: 5, label: "5 seconds" },
	{ value: 10, label: "10 seconds" },
];

const styleOptions: Array<
	{ id: "default" | "modern" | "minimal" | "fun"; name: string; icon: string }
> = [
	{ id: "default", name: "Classic", icon: "mdi:numeric" },
	{ id: "modern", name: "Modern", icon: "mdi:loading" },
	{ id: "minimal", name: "Minimal", icon: "mdi:circle-outline" },
	{ id: "fun", name: "Fun", icon: "mdi:emoticon-excited" },
];

const previewCount = ref(3);
let previewInterval: NodeJS.Timeout | null = null;

const startPreview = () => {
	previewCount.value = countdownDuration.value;
	previewInterval = setInterval(() => {
		previewCount.value--;
		if (previewCount.value <= 0) {
			previewCount.value = countdownDuration.value;
		}
	}, 1000);
};

const stopPreview = () => {
	if (previewInterval) {
		clearInterval(previewInterval);
		previewInterval = null;
	}
};

onUnmounted(stopPreview);
</script>

<template>
	<div class="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-lg">
		<h3 class="text-sm font-semibold text-gray-900 dark:text-white mb-4">
			Countdown Timer
		</h3>

		<div class="space-y-4">
			<!-- Duration -->
			<div>
				<label class="text-xs text-gray-600 dark:text-gray-400 block mb-2"
				>Duration</label>
				<div class="flex gap-2">
					<button
						v-for="opt in durationOptions"
						:key="opt.value"
						:class="[
							'flex-1 py-2 px-3 rounded-lg border text-sm font-medium transition-all',
							countdownDuration === opt.value
								? 'border-purple-500 bg-purple-50 dark:bg-purple-900/20 text-purple-700 dark:text-purple-300'
								: 'border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:border-purple-300',
						]"
						@click="countdownDuration = opt.value"
					>
						{{ opt.label }}
					</button>
				</div>
			</div>

			<!-- Style -->
			<div v-if="countdownDuration > 0">
				<label class="text-xs text-gray-600 dark:text-gray-400 block mb-2"
				>Style</label>
				<div class="grid grid-cols-4 gap-2">
					<button
						v-for="style in styleOptions"
						:key="style.id"
						:class="[
							'p-2 rounded-lg border text-center transition-all',
							countdownStyle === style.id
								? 'border-purple-500 bg-purple-50 dark:bg-purple-900/20'
								: 'border-gray-200 dark:border-gray-700 hover:border-purple-300',
						]"
						@click="countdownStyle = style.id"
					>
						<Icon
							:name="style.icon"
							class="w-5 h-5 mx-auto mb-1"
							:class="countdownStyle === style.id
							? 'text-purple-500'
							: 'text-gray-400'"
						/>
						<p class="text-xs">{{ style.name }}</p>
					</button>
				</div>
			</div>

			<!-- Color & Sound -->
			<div v-if="countdownDuration > 0" class="flex items-center gap-4">
				<div class="flex items-center gap-2">
					<label class="text-xs text-gray-600 dark:text-gray-400">Color</label>
					<input
						v-model="countdownColor"
						type="color"
						class="w-8 h-8 rounded"
					/>
				</div>
				<label class="flex items-center gap-2 cursor-pointer">
					<input
						v-model="countdownSound"
						type="checkbox"
						class="w-4 h-4 text-purple-600 rounded"
					/>
					<span class="text-sm text-gray-700 dark:text-gray-300"
					>Beep sound</span>
				</label>
			</div>

			<!-- Preview -->
			<div
				v-if="countdownDuration > 0"
				class="bg-gray-900 rounded-lg p-8 text-center"
			>
				<div
					class="text-8xl font-bold"
					:style="{ color: countdownColor }"
				>
					{{ previewCount }}
				</div>
				<button
					class="mt-4 px-4 py-2 bg-gray-800 hover:bg-gray-700 text-white rounded-lg text-sm"
					@mousedown="startPreview"
					@mouseup="stopPreview"
					@mouseleave="stopPreview"
				>
					Hold to Preview
				</button>
			</div>
		</div>
	</div>
</template>
