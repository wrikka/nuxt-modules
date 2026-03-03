<script setup lang="ts">
const selectedTemplate = defineModel<string>("template", {
	default: "youtube-1080",
});

const templates = [
	{
		id: "youtube-1080",
		name: "YouTube 1080p",
		icon: "mdi:youtube",
		description: "Optimized for YouTube uploads",
		settings: { resolution: 1080, fps: 30, bitrate: 8000, format: "MP4" },
		color: "red",
	},
	{
		id: "youtube-4k",
		name: "YouTube 4K",
		icon: "mdi:youtube",
		description: "High quality 4K content",
		settings: { resolution: 2160, fps: 60, bitrate: 35000, format: "MP4" },
		color: "red",
	},
	{
		id: "tiktok",
		name: "TikTok/Reels",
		icon: "mdi:music",
		description: "9:16 vertical format",
		settings: {
			resolution: 1080,
			fps: 30,
			bitrate: 4000,
			format: "MP4",
			ratio: "9:16",
		},
		color: "pink",
	},
	{
		id: "podcast",
		name: "Podcast Audio",
		icon: "mdi:podcast",
		description: "Audio-focused with static image",
		settings: { audioBitrate: 192, format: "MP3", sample: "48kHz" },
		color: "purple",
	},
	{
		id: "webinar",
		name: "Webinar/Meeting",
		icon: "mdi:video",
		description: "Screen + camera optimized",
		settings: { resolution: 720, fps: 30, bitrate: 2500, format: "MP4" },
		color: "blue",
	},
	{
		id: "twitch",
		name: "Twitch Streaming",
		icon: "mdi:twitch",
		description: "Streaming optimized settings",
		settings: { resolution: 1080, fps: 60, bitrate: 6000, format: "MKV" },
		color: "purple",
	},
	{
		id: "course",
		name: "Online Course",
		icon: "mdi:school",
		description: "Educational content settings",
		settings: { resolution: 1080, fps: 30, bitrate: 5000, format: "MP4" },
		color: "green",
	},
	{
		id: "interview",
		name: "Interview",
		icon: "mdi:account-voice",
		description: "Dual camera + high audio",
		settings: { resolution: 1080, fps: 30, bitrate: 6000, format: "MP4" },
		color: "orange",
	},
] as const;

const emit = defineEmits<{
	apply: [settings: Record<string, unknown>];
}>();

const applyTemplate = (template: typeof templates[number]) => {
	emit("apply", template.settings);
};
</script>

<template>
	<div class="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
		<div class="flex items-center justify-between mb-4">
			<div class="flex items-center gap-3">
				<div class="w-10 h-10 rounded-lg bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center">
					<Icon
						name="mdi:content-save"
						class="w-5 h-5 text-indigo-600 dark:text-indigo-400"
					/>
				</div>
				<div>
					<h3 class="font-semibold text-gray-900 dark:text-white">
						Recording Templates
					</h3>
					<p class="text-sm text-gray-500 dark:text-gray-400">
						Pre-configured settings for different use cases
					</p>
				</div>
			</div>
		</div>

		<div class="grid grid-cols-2 gap-3">
			<button
				v-for="template in templates"
				:key="template.id"
				:class="[
					'p-3 rounded-lg border text-left transition-all',
					selectedTemplate === template.id
						? `border-${template.color}-500 bg-${template.color}-50 dark:bg-${template.color}-900/20 ring-1 ring-${template.color}-500`
						: 'border-gray-200 dark:border-gray-700 hover:border-indigo-300',
				]"
				@click="selectedTemplate = template.id;
				applyTemplate(template);"
			>
				<div class="flex items-start justify-between mb-2">
					<Icon
						:name="template.icon"
						:class="`w-5 h-5 text-${template.color}-600`"
					/>
					<span
						v-if="selectedTemplate === template.id"
						class="text-xs font-medium px-2 py-0.5 bg-indigo-100 dark:bg-indigo-900/50 text-indigo-700 rounded-full"
					>Active</span>
				</div>
				<div class="text-sm font-medium text-gray-900 dark:text-white">
					{{ template.name }}
				</div>
				<div class="text-xs text-gray-500">{{ template.description }}</div>
				<div class="mt-2 flex flex-wrap gap-1">
					<span
						class="px-1.5 py-0.5 text-[10px] bg-gray-100 dark:bg-gray-700 rounded text-gray-600"
					>{{
							(template.settings as any).resolution
							|| (template.settings as any).audioBitrate
						}}p</span>
					<span
						class="px-1.5 py-0.5 text-[10px] bg-gray-100 dark:bg-gray-700 rounded text-gray-600"
					>{{ (template.settings as any).fps || 30 }}fps</span>
					<span
						class="px-1.5 py-0.5 text-[10px] bg-gray-100 dark:bg-gray-700 rounded text-gray-600"
					>{{
							(template.settings as any).bitrate
							|| (template.settings as any).audioBitrate
						}}kbps</span>
				</div>
			</button>
		</div>

		<button class="w-full mt-4 py-2 px-4 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg text-sm text-gray-500 hover:border-indigo-400 hover:text-indigo-600 transition-colors flex items-center justify-center gap-2">
			<Icon name="mdi:plus" class="w-4 h-4" />
			Create Custom Template
		</button>
	</div>
</template>
