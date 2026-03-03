<script setup lang="ts">
const enabled = defineModel<boolean>("enabled", { default: false });
const provider = defineModel<"aws" | "google" | "dropbox" | "onedrive">(
	"provider",
	{ default: "aws" },
);
const syncMode = defineModel<"realtime" | "onComplete" | "scheduled">(
	"syncMode",
	{ default: "onComplete" },
);
const compressionLevel = defineModel<number>("compression", { default: 75 });
const deleteAfterSync = defineModel<boolean>("deleteAfterSync", {
	default: false,
});

const providers = [
	{ id: "aws", name: "AWS S3", icon: "mdi:aws", color: "orange" },
	{
		id: "google",
		name: "Google Drive",
		icon: "mdi:google-drive",
		color: "blue",
	},
	{ id: "dropbox", name: "Dropbox", icon: "mdi:dropbox", color: "blue" },
	{
		id: "onedrive",
		name: "OneDrive",
		icon: "mdi:microsoft-onedrive",
		color: "blue",
	},
] as const;

const lastSyncStatus = ref("ready");
const storageUsed = ref(45);
const storageTotal = ref(100);
const recentUploads = ref([
	{
		name: "tutorial_001.mp4",
		size: "45.2 MB",
		status: "completed",
		time: "2 min ago",
	},
	{
		name: "interview_003.mp4",
		size: "128.5 MB",
		status: "syncing",
		progress: 67,
		time: "Now",
	},
]);
</script>

<template>
	<div class="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
		<div class="flex items-center justify-between mb-4">
			<div class="flex items-center gap-3">
				<div class="w-10 h-10 rounded-lg bg-cyan-100 dark:bg-cyan-900/30 flex items-center justify-center">
					<Icon
						name="mdi:cloud-upload"
						class="w-5 h-5 text-cyan-600 dark:text-cyan-400"
					/>
				</div>
				<div>
					<h3 class="font-semibold text-gray-900 dark:text-white">
						Auto-Cloud Backup
					</h3>
					<p class="text-sm text-gray-500 dark:text-gray-400">
						Automatic cloud synchronization
					</p>
				</div>
			</div>
			<label class="relative inline-flex items-center cursor-pointer">
				<input v-model="enabled" type="checkbox" class="sr-only peer">
				<div class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-cyan-300 dark:peer-focus:ring-cyan-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-cyan-600" />
			</label>
		</div>

		<div v-if="enabled" class="space-y-4">
			<div class="p-3 bg-cyan-50 dark:bg-cyan-900/20 rounded-lg">
				<div class="flex items-start gap-2">
					<Icon name="mdi:information" class="w-4 h-4 text-cyan-600 mt-0.5" />
					<p class="text-xs text-cyan-700 dark:text-cyan-300">
						Recordings are automatically backed up to your cloud storage. Never
						lose your content with automatic versioning and recovery.
					</p>
				</div>
			</div>

			<div>
				<label
					class="text-sm font-medium text-gray-700 dark:text-gray-300 block mb-2"
				>Cloud Provider</label>
				<div class="grid grid-cols-2 gap-2">
					<button
						v-for="p in providers"
						:key="p.id"
						:class="[
							'p-2 rounded-lg border text-left transition-all flex items-center gap-2',
							provider === p.id
								? `border-${p.color}-500 bg-${p.color}-50 dark:bg-${p.color}-900/20`
								: 'border-gray-200 dark:border-gray-700 hover:border-cyan-300',
						]"
						@click="provider = p.id"
					>
						<Icon
							:name="p.icon"
							:class="`w-5 h-5 ${
								provider === p.id ? `text-${p.color}-600` : 'text-gray-500'
							}`"
						/>
						<span
							class="text-sm font-medium"
							:class="provider === p.id
							? 'text-gray-900 dark:text-white'
							: 'text-gray-600'"
						>{{ p.name }}</span>
					</button>
				</div>
			</div>

			<div>
				<label
					class="text-sm font-medium text-gray-700 dark:text-gray-300 block mb-2"
				>Sync Mode</label>
				<select
					v-model="syncMode"
					class="w-full px-3 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white text-sm"
				>
					<option value="realtime">Real-time streaming</option>
					<option value="onComplete">After recording completes</option>
					<option value="scheduled">Scheduled (daily)</option>
				</select>
			</div>

			<div>
				<div class="flex justify-between text-sm mb-1">
					<span class="text-gray-700 dark:text-gray-300"
					>Compression Level</span>
					<span class="text-gray-500">{{ compressionLevel }}%</span>
				</div>
				<input
					v-model.number="compressionLevel"
					type="range"
					min="0"
					max="100"
					class="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700 accent-cyan-600"
				>
				<div class="flex justify-between text-xs text-gray-500 mt-1">
					<span>Original quality</span>
					<span>Maximum compression</span>
				</div>
			</div>

			<div class="flex items-center gap-2 p-2 rounded-lg border border-gray-200 dark:border-gray-700">
				<input
					v-model="deleteAfterSync"
					type="checkbox"
					class="w-4 h-4 text-cyan-600 rounded"
				>
				<span class="text-sm text-gray-700 dark:text-gray-300"
				>Delete local copy after successful sync</span>
			</div>

			<div class="border-t border-gray-200 dark:border-gray-700 pt-4">
				<h4 class="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
					Storage Usage
				</h4>
				<div class="flex justify-between text-sm mb-1">
					<span class="text-gray-600">{{ storageUsed }} GB used</span>
					<span class="text-gray-600">{{ storageTotal }} GB total</span>
				</div>
				<div class="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
					<div
						class="h-full bg-cyan-500 rounded-full transition-all"
						:style="{ width: `${(storageUsed / storageTotal) * 100}%` }"
					/>
				</div>
			</div>

			<div
				v-if="recentUploads.length"
				class="border-t border-gray-200 dark:border-gray-700 pt-4"
			>
				<h4 class="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
					Recent Uploads
				</h4>
				<div class="space-y-2">
					<div
						v-for="upload in recentUploads"
						:key="upload.name"
						class="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-700/50 rounded-lg"
					>
						<div class="flex items-center gap-2">
							<Icon
								:name="upload.status === 'completed'
								? 'mdi:check-circle'
								: 'mdi:sync'"
								:class="`w-4 h-4 ${
									upload.status === 'completed'
										? 'text-green-500'
										: 'text-blue-500 animate-spin'
								}`"
							/>
							<div>
								<div class="text-sm text-gray-900 dark:text-white">
									{{ upload.name }}
								</div>
								<div class="text-xs text-gray-500">
									{{ upload.size }} • {{ upload.time }}
								</div>
							</div>
						</div>
						<div v-if="upload.status === 'syncing'" class="w-16">
							<div class="w-full h-1.5 bg-gray-200 rounded-full overflow-hidden">
								<div
									class="h-full bg-blue-500 rounded-full"
									:style="{ width: `${upload.progress}%` }"
								/>
							</div>
						</div>
					</div>
				</div>
			</div>

			<div class="flex items-center gap-2 p-2 bg-green-50 dark:bg-green-900/20 rounded-lg">
				<Icon name="mdi:check-circle" class="w-4 h-4 text-green-600" />
				<span class="text-xs text-green-700 dark:text-green-300">Connected to {{
						providers.find(p => p.id === provider)?.name
					}} • {{ lastSyncStatus }}</span>
			</div>
		</div>
	</div>
</template>
