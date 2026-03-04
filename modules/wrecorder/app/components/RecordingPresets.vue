<script setup lang="ts">
const props = defineProps<{
	modelValue: string;
}>();

const emit = defineEmits<{
	"update:modelValue": [value: string];
	apply: [preset: RecordingPreset];
}>();

interface RecordingPreset {
	id: string;
	name: string;
	icon: string;
	resolution: number;
	fps: number;
	bitrate: number;
	audioEnabled: boolean;
	virtualBackground: boolean;
}

const presets: RecordingPreset[] = [
	{
		id: "youtube-1080",
		name: "YouTube 1080p",
		icon: "mdi:youtube",
		resolution: 1080,
		fps: 30,
		bitrate: 8000,
		audioEnabled: true,
		virtualBackground: false,
	},
	{
		id: "youtube-4k",
		name: "YouTube 4K",
		icon: "mdi:youtube",
		resolution: 2160,
		fps: 30,
		bitrate: 20000,
		audioEnabled: true,
		virtualBackground: false,
	},
	{
		id: "tiktok",
		name: "TikTok/Reels",
		icon: "mdi:music",
		resolution: 1080,
		fps: 30,
		bitrate: 4000,
		audioEnabled: true,
		virtualBackground: true,
	},
	{
		id: "quick-meeting",
		name: "Quick Meeting",
		icon: "mdi:video",
		resolution: 720,
		fps: 24,
		bitrate: 2500,
		audioEnabled: true,
		virtualBackground: true,
	},
	{
		id: "demo",
		name: "Screen Demo",
		icon: "mdi:monitor",
		resolution: 1080,
		fps: 30,
		bitrate: 6000,
		audioEnabled: true,
		virtualBackground: false,
	},
	{
		id: "gaming",
		name: "Gaming",
		icon: "mdi:gamepad-variant",
		resolution: 1080,
		fps: 60,
		bitrate: 12000,
		audioEnabled: true,
		virtualBackground: false,
	},
];

const selectedPreset = computed(() =>
	presets.find((p) => p.id === props.modelValue)
);
</script>

<template>
	<div class="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-lg">
		<h3 class="text-sm font-semibold text-gray-900 dark:text-white mb-4">
			Recording Presets
		</h3>

		<div class="grid grid-cols-2 gap-2">
			<button
				v-for="preset in presets"
				:key="preset.id"
				:class="[
					'p-3 rounded-lg border text-left transition-all',
					modelValue === preset.id
						? 'border-purple-500 bg-purple-50 dark:bg-purple-900/20'
						: 'border-gray-200 dark:border-gray-700 hover:border-purple-300',
				]"
				@click='emit("update:modelValue", preset.id);
				emit("apply", preset);'
			>
				<div class="flex items-start gap-2">
					<Icon
						:name="preset.icon"
						class="w-5 h-5 mt-0.5"
						:class="modelValue === preset.id ? 'text-purple-500' : 'text-gray-400'"
					/>
					<div>
						<p class="font-medium text-sm text-gray-900 dark:text-white">
							{{ preset.name }}
						</p>
						<p class="text-xs text-gray-500">
							{{ preset.resolution }}p • {{ preset.fps }}fps • {{
								preset.bitrate / 1000
							}}Mbps
						</p>
					</div>
				</div>
			</button>
		</div>
	</div>
</template>
