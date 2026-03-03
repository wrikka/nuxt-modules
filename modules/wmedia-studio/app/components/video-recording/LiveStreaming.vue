<script setup lang="ts">
const enabled = defineModel<boolean>("enabled", { default: false });
const streamTitle = defineModel<string>("title", { default: "" });
const selectedPlatform = defineModel<string>("platform", {
	default: "youtube",
});
const streamKey = defineModel<string>("key", { default: "" });
const rtmpUrl = defineModel<string>("rtmpUrl", { default: "" });
const quality = defineModel<"720p30" | "720p60" | "1080p30" | "1080p60">(
	"quality",
	{ default: "1080p30" },
);
const bitrate = defineModel<number>("bitrate", { default: 4500 });

const platforms = [
	{ id: "youtube", name: "YouTube Live", icon: "mdi:youtube", color: "red" },
	{ id: "twitch", name: "Twitch", icon: "mdi:twitch", color: "purple" },
	{
		id: "facebook",
		name: "Facebook Live",
		icon: "mdi:facebook",
		color: "blue",
	},
	{ id: "rtmp", name: "Custom RTMP", icon: "mdi:cast", color: "gray" },
] as const;

const qualityOptions = [
	{ value: "720p30", label: "720p 30fps", bitrate: 2500 },
	{ value: "720p60", label: "720p 60fps", bitrate: 3500 },
	{ value: "1080p30", label: "1080p 30fps", bitrate: 4500 },
	{ value: "1080p60", label: "1080p 60fps", bitrate: 6000 },
] as const;

const isStreaming = ref(false);
const viewerCount = ref(0);
const streamDuration = ref("00:00:00");

watch(quality, (newVal) => {
	const option = qualityOptions.find(o => o.value === newVal);
	if (option) bitrate.value = option.bitrate;
});
</script>

<template>
	<div class="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
		<div class="flex items-center justify-between mb-4">
			<div class="flex items-center gap-3">
				<div class="w-10 h-10 rounded-lg bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
					<Icon
						name="mdi:broadcast"
						class="w-5 h-5 text-red-600 dark:text-red-400"
					/>
				</div>
				<div>
					<h3 class="font-semibold text-gray-900 dark:text-white">
						Live Streaming
					</h3>
					<p class="text-sm text-gray-500 dark:text-gray-400">
						Stream to multiple platforms
					</p>
				</div>
			</div>
			<label class="relative inline-flex items-center cursor-pointer">
				<input v-model="enabled" type="checkbox" class="sr-only peer">
				<div class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-red-300 dark:peer-focus:ring-red-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-red-600" />
			</label>
		</div>

		<div v-if="enabled" class="space-y-4">
			<div
				v-if="isStreaming"
				class="p-4 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-200 dark:border-red-800"
			>
				<div class="flex items-center gap-2 mb-2">
					<span class="relative flex h-3 w-3">
						<span
							class="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"
						></span>
						<span
							class="relative inline-flex rounded-full h-3 w-3 bg-red-500"
						></span>
					</span>
					<span class="font-semibold text-red-700 dark:text-red-300">LIVE</span>
					<span class="text-sm text-red-600 dark:text-red-400">{{
						streamDuration
					}}</span>
				</div>
				<div class="flex items-center gap-4 text-sm">
					<div class="flex items-center gap-1">
						<Icon name="mdi:account" class="w-4 h-4 text-gray-500" />
						<span class="text-gray-700 dark:text-gray-300">{{ viewerCount }}
							viewers</span>
					</div>
					<div class="flex items-center gap-1">
						<Icon name="mdi:speedometer" class="w-4 h-4 text-gray-500" />
						<span class="text-gray-700 dark:text-gray-300">{{ bitrate }}
							kbps</span>
					</div>
				</div>
			</div>

			<div>
				<label
					class="text-sm font-medium text-gray-700 dark:text-gray-300 block mb-2"
				>Stream Title</label>
				<input
					v-model="streamTitle"
					type="text"
					placeholder="Enter stream title..."
					class="w-full px-3 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:ring-2 focus:ring-red-500"
				>
			</div>

			<div>
				<label
					class="text-sm font-medium text-gray-700 dark:text-gray-300 block mb-2"
				>Platform</label>
				<div class="grid grid-cols-2 gap-2">
					<button
						v-for="platform in platforms"
						:key="platform.id"
						:class="[
							'flex items-center gap-2 p-2 rounded-lg border text-left transition-all',
							selectedPlatform === platform.id
								? `border-${platform.color}-500 bg-${platform.color}-50 dark:bg-${platform.color}-900/20`
								: 'border-gray-200 dark:border-gray-700 hover:border-gray-300',
						]"
						@click="selectedPlatform = platform.id"
					>
						<Icon
							:name="platform.icon"
							:class="`w-5 h-5 ${
								selectedPlatform === platform.id
									? `text-${platform.color}-600`
									: 'text-gray-500'
							}`"
						/>
						<span
							class="text-sm font-medium"
							:class="selectedPlatform === platform.id
							? 'text-gray-900 dark:text-white'
							: 'text-gray-600 dark:text-gray-400'"
						>{{ platform.name }}</span>
					</button>
				</div>
			</div>

			<div v-if="selectedPlatform === 'rtmp'" class="space-y-3">
				<div>
					<label
						class="text-sm font-medium text-gray-700 dark:text-gray-300 block mb-1"
					>RTMP URL</label>
					<input
						v-model="rtmpUrl"
						type="text"
						placeholder="rtmp://server.com/live"
						class="w-full px-3 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white text-sm"
					>
				</div>
				<div>
					<label
						class="text-sm font-medium text-gray-700 dark:text-gray-300 block mb-1"
					>Stream Key</label>
					<input
						v-model="streamKey"
						type="password"
						placeholder="Enter stream key..."
						class="w-full px-3 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white text-sm"
					>
				</div>
			</div>

			<div v-else>
				<label
					class="text-sm font-medium text-gray-700 dark:text-gray-300 block mb-1"
				>Stream Key</label>
				<input
					v-model="streamKey"
					type="password"
					placeholder="Enter stream key..."
					class="w-full px-3 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white text-sm"
				>
				<p class="text-xs text-gray-500 mt-1">
					Get this from your {{
						platforms.find(p => p.id === selectedPlatform)?.name
					}} dashboard
				</p>
			</div>

			<div>
				<label
					class="text-sm font-medium text-gray-700 dark:text-gray-300 block mb-2"
				>Quality</label>
				<select
					v-model="quality"
					class="w-full px-3 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white"
				>
					<option
						v-for="opt in qualityOptions"
						:key="opt.value"
						:value="opt.value"
					>
						{{ opt.label }} ({{ opt.bitrate }} kbps)
					</option>
				</select>
			</div>

			<div class="flex gap-2">
				<button
					v-if="!isStreaming"
					class="flex-1 py-2 px-4 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
				>
					<Icon name="mdi:play" class="w-5 h-5" />
					Start Streaming
				</button>
				<button
					v-else
					class="flex-1 py-2 px-4 bg-gray-600 hover:bg-gray-700 text-white rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
				>
					<Icon name="mdi:stop" class="w-5 h-5" />
					Stop Streaming
				</button>
			</div>

			<div class="flex items-center gap-2 p-2 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
				<Icon name="mdi:connection" class="w-4 h-4 text-green-500" />
				<span class="text-xs text-gray-600 dark:text-gray-400"
				>Connection healthy • 45ms latency</span>
			</div>
		</div>
	</div>
</template>
