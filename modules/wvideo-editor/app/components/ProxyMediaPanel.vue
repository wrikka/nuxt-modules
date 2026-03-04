<script setup lang="ts">
const emit = defineEmits<{
	close: [];
	enable: [settings: ProxySettings];
}>();

interface ProxySettings {
	enabled: boolean;
	resolution: "720p" | "540p" | "360p";
	codec: "h264" | "prores";
	quality: "high" | "medium" | "low";
	autoGenerate: boolean;
}

const settings = ref<ProxySettings>({
	enabled: true,
	resolution: "720p",
	codec: "h264",
	quality: "medium",
	autoGenerate: true,
});

const mediaFiles = ref([
	{
		id: "1",
		name: "Interview_001.mov",
		size: "2.3 GB",
		hasProxy: true,
		proxySize: "450 MB",
	},
	{
		id: "2",
		name: "B_Roll_002.mp4",
		size: "1.8 GB",
		hasProxy: false,
		proxySize: null,
	},
	{
		id: "3",
		name: "Drone_Shot.mp4",
		size: "4.1 GB",
		hasProxy: true,
		proxySize: "890 MB",
	},
	{
		id: "4",
		name: "Slow_Mo_001.mov",
		size: "6.2 GB",
		hasProxy: false,
		proxySize: null,
	},
]);

const generating = ref<string[]>([]);

const generateProxy = async (fileId: string) => {
	generating.value.push(fileId);
	setTimeout(() => {
		generating.value = generating.value.filter(id => id !== fileId);
		const file = mediaFiles.value.find(f => f.id === fileId);
		if (file) {
			file.hasProxy = true;
			file.proxySize = "350 MB";
		}
	}, 2000);
};

const generateAllProxies = () => {
	const missing = mediaFiles.value.filter(f => !f.hasProxy);
	missing.forEach(f => generateProxy(f.id));
};
</script>

<template>
	<div class="proxy-panel bg-white dark:bg-gray-800 rounded-xl p-4 w-[500px] max-h-[80vh] overflow-hidden flex flex-col shadow-lg border border-gray-200 dark:border-gray-700">
		<div class="flex items-center justify-between mb-4">
			<h3 class="text-gray-900 dark:text-white font-semibold flex items-center gap-2">
				<Icon name="mdi:content-copy" class="w-5 h-5 text-blue-500" />
				Proxy Media
			</h3>
			<button
				class="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors"
				@click="emit('close')"
			>
				<Icon name="mdi:close" class="w-5 h-5" />
			</button>
		</div>

		<!-- Enable Toggle -->
		<div class="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/30 rounded-lg mb-4">
			<div>
				<span class="text-gray-900 dark:text-white text-sm font-medium"
				>Use Proxy Media</span>
				<p class="text-gray-500 dark:text-gray-400 text-xs">
					Lower resolution for smoother playback
				</p>
			</div>
			<button
				class="relative w-12 h-6 rounded-full transition-colors"
				:class="settings.enabled ? 'bg-blue-500' : 'bg-gray-300 dark:bg-gray-600'"
				@click="settings.enabled = !settings.enabled"
			>
				<div
					class="absolute top-1 w-4 h-4 bg-white rounded-full transition-all"
					:class="settings.enabled ? 'left-7' : 'left-1'"
				/>
			</button>
		</div>

		<!-- Settings -->
		<div class="grid grid-cols-2 gap-3 mb-4">
			<div>
				<label
					class="text-gray-500 dark:text-gray-400 text-xs mb-1 block uppercase font-medium"
				>Resolution</label>
				<select
					v-model="settings.resolution"
					class="w-full bg-white dark:bg-gray-700 text-gray-900 dark:text-white px-3 py-2 rounded-lg text-sm border-0"
				>
					<option value="720p">720p HD</option>
					<option value="540p">540p</option>
					<option value="360p">360p</option>
				</select>
			</div>
			<div>
				<label
					class="text-gray-500 dark:text-gray-400 text-xs mb-1 block uppercase font-medium"
				>Codec</label>
				<select
					v-model="settings.codec"
					class="w-full bg-white dark:bg-gray-700 text-gray-900 dark:text-white px-3 py-2 rounded-lg text-sm border-0"
				>
					<option value="h264">H.264</option>
					<option value="prores">ProRes Proxy</option>
				</select>
			</div>
		</div>

		<!-- Auto Generate -->
		<div class="flex items-center gap-2 mb-4 p-2 bg-gray-50 dark:bg-gray-700/30 rounded-lg">
			<input
				id="auto-generate"
				v-model="settings.autoGenerate"
				type="checkbox"
				class="w-4 h-4 rounded border-gray-300 text-blue-500 focus:ring-blue-500"
			>
			<label
				for="auto-generate"
				class="text-gray-700 dark:text-gray-300 text-sm"
			>Auto-generate proxies on import</label>
		</div>

		<!-- File List -->
		<div class="flex-1 overflow-y-auto mb-4">
			<div class="flex items-center justify-between mb-2">
				<span class="text-gray-700 dark:text-gray-300 text-sm font-medium"
				>Media Files</span>
				<button
					class="text-xs px-2 py-1 bg-blue-100 dark:bg-blue-900/30 hover:bg-blue-200 dark:hover:bg-blue-900/50 text-blue-600 dark:text-blue-400 rounded transition-colors"
					@click="generateAllProxies"
				>
					Generate All
				</button>
			</div>
			<div class="space-y-1">
				<div
					v-for="file in mediaFiles"
					:key="file.id"
					class="flex items-center gap-3 p-2 bg-gray-50 dark:bg-gray-700/30 rounded-lg"
				>
					<div
						class="w-8 h-8 rounded flex items-center justify-center"
						:class="file.hasProxy
						? 'bg-green-100 dark:bg-green-900/30'
						: 'bg-gray-200 dark:bg-gray-600'"
					>
						<Icon
							:name="file.hasProxy ? 'mdi:check' : 'mdi:file-video'"
							:class="[
								file.hasProxy
									? 'text-green-600 dark:text-green-400'
									: 'text-gray-500 dark:text-gray-400',
								'w-4 h-4',
							]"
						/>
					</div>
					<div class="flex-1 min-w-0">
						<div class="text-gray-900 dark:text-white text-sm truncate">
							{{ file.name }}
						</div>
						<div class="text-gray-500 dark:text-gray-400 text-xs">
							Original: {{ file.size }}
							<span
								v-if="file.hasProxy"
								class="text-green-600 dark:text-green-400"
							>
								• Proxy: {{ file.proxySize }}</span>
						</div>
					</div>
					<button
						v-if="!file.hasProxy"
						class="px-2 py-1 bg-gray-200 dark:bg-gray-600 hover:bg-gray-300 dark:hover:bg-gray-500 text-gray-700 dark:text-white text-xs rounded transition-colors"
						:disabled="generating.includes(file.id)"
						@click="generateProxy(file.id)"
					>
						<Icon
							v-if="generating.includes(file.id)"
							name="mdi:loading"
							class="w-3 h-3 animate-spin"
						/>
						<span v-else>Create</span>
					</button>
				</div>
			</div>
		</div>

		<!-- Storage Info -->
		<div class="p-3 bg-gray-100 dark:bg-gray-700/30 rounded-lg mb-4">
			<div class="flex items-center justify-between text-sm">
				<span class="text-gray-500 dark:text-gray-400">Storage Saved</span>
				<span class="text-green-600 dark:text-green-400 font-medium">~75%</span>
			</div>
			<div class="mt-2 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
				<div class="h-full bg-green-500 rounded-full" style="width: 75%" />
			</div>
		</div>

		<!-- Actions -->
		<div class="flex gap-2 pt-4 border-t border-gray-200 dark:border-gray-700">
			<button
				class="px-3 py-2 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-900 dark:text-white rounded-lg text-sm font-medium transition-colors"
				@click="emit('close')"
			>
				Close
			</button>
			<button
				class="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-colors"
				@click="emit('enable', settings)"
			>
				Apply Settings
			</button>
		</div>
	</div>
</template>
