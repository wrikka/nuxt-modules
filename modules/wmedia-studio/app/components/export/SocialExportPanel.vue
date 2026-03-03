<script setup lang="ts">
interface Props {
	isOpen: boolean;
}

const props = defineProps<Props>();
const emit = defineEmits<{
	(event: "close"): void;
}>();

const platforms = [
	{
		id: "youtube",
		name: "YouTube",
		presets: [
			{ name: "YouTube 1080p", res: "1920x1080", fps: 30, aspect: "16:9" },
			{ name: "YouTube 4K", res: "3840x2160", fps: 30, aspect: "16:9" },
			{ name: "YouTube Shorts", res: "1080x1920", fps: 60, aspect: "9:16" },
		],
	},
	{
		id: "instagram",
		name: "Instagram",
		presets: [
			{ name: "Feed", res: "1080x1080", fps: 30, aspect: "1:1" },
			{ name: "Reels", res: "1080x1920", fps: 60, aspect: "9:16" },
			{ name: "Stories", res: "1080x1920", fps: 30, aspect: "9:16" },
		],
	},
	{
		id: "tiktok",
		name: "TikTok",
		presets: [
			{ name: "TikTok", res: "1080x1920", fps: 60, aspect: "9:16" },
		],
	},
	{
		id: "twitter",
		name: "Twitter/X",
		presets: [
			{ name: "Landscape", res: "1280x720", fps: 30, aspect: "16:9" },
			{ name: "Square", res: "720x720", fps: 30, aspect: "1:1" },
		],
	},
];

const selectedPlatform = ref("youtube");
const selectedPreset = ref<string | null>(null);

const selectPreset = (presetName: string) => {
	selectedPreset.value = presetName;
};

const onExport = () => {
	emit("close");
};
</script>

<template>
	<ModalDialog
		:is-open="props.isOpen"
		title="Social Media Export"
		@close="emit('close')"
	>
		<div class="space-y-5">
			<p class="text-sm text-gray-600 dark:text-gray-400">
				One-click export optimized for each social media platform.
			</p>

			<!-- Platform Tabs -->
			<div class="flex gap-2">
				<button
					v-for="platform in platforms"
					:key="platform.id"
					class="px-4 py-2 rounded-lg text-sm font-medium transition-colors"
					:class="selectedPlatform === platform.id
					? 'bg-blue-500 text-white'
					: 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300'"
					@click="selectedPlatform = platform.id"
				>
					<Icon
						:name="`mdi:${platform.id === 'twitter' ? 'twitter' : platform.id}`"
						class="w-4 h-4 inline mr-1"
					/>
					{{ platform.name }}
				</button>
			</div>

			<!-- Presets -->
			<div class="space-y-2">
				<h4 class="font-medium text-gray-900 dark:text-white">Presets</h4>
				<div class="grid gap-2">
					<button
						v-for="preset in platforms.find(p => p.id === selectedPlatform)?.presets"
						:key="preset.name"
						class="flex items-center gap-3 p-3 rounded-lg border-2 text-left transition-colors"
						:class="selectedPreset === preset.name
						? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
						: 'border-gray-200 dark:border-gray-700 hover:border-gray-300'"
						@click="selectPreset(preset.name)"
					>
						<div class="w-12 h-8 bg-gray-200 dark:bg-gray-700 rounded flex items-center justify-center text-xs font-medium">
							{{ preset.aspect }}
						</div>
						<div class="flex-1">
							<p class="font-medium text-sm text-gray-900 dark:text-white">
								{{ preset.name }}
							</p>
							<p class="text-xs text-gray-500">
								{{ preset.res }} @ {{ preset.fps }}fps
							</p>
						</div>
						<div
							class="w-5 h-5 rounded-full border-2 flex items-center justify-center"
							:class="selectedPreset === preset.name
							? 'border-blue-500 bg-blue-500'
							: 'border-gray-300'"
						>
							<Icon
								v-if="selectedPreset === preset.name"
								name="mdi:check"
								class="w-3 h-3 text-white"
							/>
						</div>
					</button>
				</div>
			</div>

			<!-- Additional Options -->
			<div class="bg-gray-100 dark:bg-gray-800 rounded-lg p-3 space-y-2">
				<label class="flex items-center gap-2">
					<input type="checkbox" checked class="rounded" />
					<span class="text-sm text-gray-700 dark:text-gray-300"
					>Add platform watermark</span>
				</label>
				<label class="flex items-center gap-2">
					<input type="checkbox" checked class="rounded" />
					<span class="text-sm text-gray-700 dark:text-gray-300"
					>Optimize compression</span>
				</label>
			</div>

			<button
				class="w-full px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 disabled:opacity-50"
				:disabled="!selectedPreset"
				@click="onExport"
			>
				<Icon name="mdi:export" class="w-4 h-4 inline mr-2" />
				Export for {{ selectedPlatform }}
			</button>
		</div>
	</ModalDialog>
</template>
