<script setup lang="ts">
interface Props {
	isOpen: boolean;
}

const props = defineProps<Props>();
const emit = defineEmits<{
	(event: "close"): void;
}>();

const presets = [
	{
		id: "1",
		name: "Modern Clean",
		style: "Sans-serif, high contrast",
		language: "Auto",
	},
	{
		id: "2",
		name: "Cinematic",
		style: "Yellow text, black background",
		language: "Auto",
	},
	{
		id: "3",
		name: "Minimal",
		style: "White text, no background",
		language: "Auto",
	},
];

const settings = reactive({
	selectedPreset: "1",
	fontSize: 24,
	position: "bottom",
	burnIn: true,
	outline: true,
	shadow: true,
});

const isGenerating = ref(false);
const progress = ref(0);

const onGenerate = () => {
	isGenerating.value = true;
	progress.value = 0;
	const interval = setInterval(() => {
		progress.value += 10;
		if (progress.value >= 100) {
			clearInterval(interval);
			isGenerating.value = false;
		}
	}, 200);
};
</script>

<template>
	<ModalDialog
		:is-open="props.isOpen"
		title="Auto-Subtitle Burn-in"
		@close="emit('close')"
	>
		<div class="space-y-5">
			<p class="text-sm text-gray-600 dark:text-gray-400">
				Generate and burn subtitles directly into your video with style
				templates.
			</p>

			<!-- Style Presets -->
			<div>
				<h4 class="font-medium text-gray-900 dark:text-white mb-2">
					Style Preset
				</h4>
				<div class="space-y-2">
					<button
						v-for="preset in presets"
						:key="preset.id"
						class="w-full flex items-center gap-3 p-3 rounded-lg text-left border-2 transition-colors"
						:class="settings.selectedPreset === preset.id
						? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
						: 'border-gray-200 dark:border-gray-700 hover:border-gray-300'"
						@click="settings.selectedPreset = preset.id"
					>
						<div class="w-16 h-10 bg-gray-800 rounded flex items-center justify-center">
							<span class="text-xs text-white">Aa</span>
						</div>
						<div class="flex-1">
							<p class="font-medium text-sm text-gray-900 dark:text-white">
								{{ preset.name }}
							</p>
							<p class="text-xs text-gray-500">{{ preset.style }}</p>
						</div>
						<div
							class="w-4 h-4 rounded-full border-2"
							:class="settings.selectedPreset === preset.id
							? 'border-blue-500 bg-blue-500'
							: 'border-gray-300'"
						>
							<Icon
								v-if="settings.selectedPreset === preset.id"
								name="mdi:check"
								class="w-3 h-3 text-white"
							/>
						</div>
					</button>
				</div>
			</div>

			<!-- Settings -->
			<div class="space-y-3">
				<div>
					<label
						class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
					>
						Font Size: {{ settings.fontSize }}px
					</label>
					<input
						v-model="settings.fontSize"
						type="range"
						min="12"
						max="48"
						class="w-full"
					/>
				</div>
				<div>
					<label
						class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
					>Position</label>
					<div class="grid grid-cols-3 gap-2">
						<button
							v-for='pos in ["top", "middle", "bottom"]'
							:key="pos"
							class="px-3 py-2 rounded-lg text-sm capitalize"
							:class="settings.position === pos
							? 'bg-blue-500 text-white'
							: 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300'"
							@click="settings.position = pos"
						>
							{{ pos }}
						</button>
					</div>
				</div>
				<div class="flex gap-4">
					<label class="flex items-center gap-2">
						<input v-model="settings.outline" type="checkbox" class="rounded" />
						<span class="text-sm text-gray-700 dark:text-gray-300"
						>Outline</span>
					</label>
					<label class="flex items-center gap-2">
						<input v-model="settings.shadow" type="checkbox" class="rounded" />
						<span class="text-sm text-gray-700 dark:text-gray-300">Shadow</span>
					</label>
				</div>
			</div>

			<!-- Progress -->
			<div
				v-if="isGenerating"
				class="bg-gray-100 dark:bg-gray-800 rounded-lg p-3"
			>
				<div class="flex items-center justify-between mb-2">
					<span class="text-sm text-gray-700 dark:text-gray-300"
					>Generating subtitles...</span>
					<span class="text-sm font-medium">{{ progress }}%</span>
				</div>
				<div class="h-2 bg-gray-200 rounded-full overflow-hidden">
					<div
						class="h-full bg-blue-500 rounded-full transition-all"
						:style="{ width: `${progress}%` }"
					/>
				</div>
			</div>

			<button
				class="w-full px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 disabled:opacity-50"
				:disabled="isGenerating"
				@click="onGenerate"
			>
				<Icon
					v-if="isGenerating"
					name="mdi:loading"
					class="w-4 h-4 animate-spin inline mr-2"
				/>
				{{ isGenerating ? "Generating..." : "Generate & Burn Subtitles" }}
			</button>
		</div>
	</ModalDialog>
</template>
