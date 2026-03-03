<script setup lang="ts">
interface Props {
	isOpen: boolean;
}

const props = defineProps<Props>();
const emit = defineEmits<{
	(event: "close"): void;
}>();

const syncStatus = ref<"synced" | "syncing" | "offline">("synced");
const storageUsed = ref(4.2);
const storageTotal = ref(10);
const lastSync = ref("2 minutes ago");

const projects = ref([
	{
		id: "1",
		name: "Project Alpha",
		status: "synced",
		size: "245 MB",
		lastModified: "1 hour ago",
	},
	{
		id: "2",
		name: "Video Tutorial",
		status: "syncing",
		size: "1.2 GB",
		lastModified: "Just now",
	},
	{
		id: "3",
		name: "Podcast Episode 5",
		status: "synced",
		size: "890 MB",
		lastModified: "3 hours ago",
	},
	{
		id: "4",
		name: "Demo Reel 2024",
		status: "pending",
		size: "2.1 GB",
		lastModified: "Yesterday",
	},
]);

const settings = reactive({
	autoSync: true,
	syncOnSave: true,
	offlineMode: false,
	compression: true,
});

const onSyncNow = () => {
	syncStatus.value = "syncing";
	setTimeout(() => {
		syncStatus.value = "synced";
		lastSync.value = "Just now";
	}, 2000);
};
</script>

<template>
	<ModalDialog
		:is-open="props.isOpen"
		title="Cloud Project Sync"
		@close="emit('close')"
	>
		<div class="space-y-5">
			<p class="text-sm text-gray-600 dark:text-gray-400">
				Auto-save and sync projects to cloud storage across all your devices.
			</p>

			<!-- Status Card -->
			<div class="bg-gray-100 dark:bg-gray-800 rounded-lg p-4">
				<div class="flex items-center justify-between">
					<div class="flex items-center gap-3">
						<div
							class="w-10 h-10 rounded-full flex items-center justify-center"
							:class="{
								'bg-green-100 dark:bg-green-900/30 text-green-600':
									syncStatus === 'synced',
								'bg-blue-100 dark:bg-blue-900/30 text-blue-600':
									syncStatus === 'syncing',
								'bg-gray-100 dark:bg-gray-700 text-gray-600':
									syncStatus === 'offline',
							}"
						>
							<Icon
								:name="syncStatus === 'synced'
								? 'mdi:cloud-check'
								: syncStatus === 'syncing'
								? 'mdi:cloud-sync'
								: 'mdi:cloud-off'"
								class="w-5 h-5"
								:class="{ 'animate-spin': syncStatus === 'syncing' }"
							/>
						</div>
						<div>
							<p class="font-medium text-gray-900 dark:text-white">
								{{
									syncStatus === "synced"
									? "All synced"
									: syncStatus === "syncing"
									? "Syncing..."
									: "Offline"
								}}
							</p>
							<p class="text-xs text-gray-500">Last sync: {{ lastSync }}</p>
						</div>
					</div>
					<button
						class="px-3 py-1.5 bg-blue-500 text-white rounded-lg text-sm hover:bg-blue-600 disabled:opacity-50"
						:disabled="syncStatus === 'syncing'"
						@click="onSyncNow"
					>
						<Icon
							v-if="syncStatus === 'syncing'"
							name="mdi:loading"
							class="w-4 h-4 animate-spin inline mr-1"
						/>
						{{ syncStatus === "syncing" ? "Syncing" : "Sync Now" }}
					</button>
				</div>

				<!-- Storage Bar -->
				<div class="mt-4">
					<div class="flex items-center justify-between text-xs mb-1">
						<span class="text-gray-600 dark:text-gray-400">Storage</span>
						<span class="text-gray-900 dark:text-white">{{ storageUsed }} GB /
							{{ storageTotal }} GB</span>
					</div>
					<div class="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
						<div
							class="h-full bg-blue-500 rounded-full"
							:style="{ width: `${(storageUsed / storageTotal) * 100}%` }"
						/>
					</div>
				</div>
			</div>

			<!-- Project List -->
			<div>
				<h4 class="font-medium text-gray-900 dark:text-white mb-3">Projects</h4>
				<div class="space-y-2">
					<div
						v-for="project in projects"
						:key="project.id"
						class="flex items-center gap-3 p-3 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700"
					>
						<Icon
							:name="project.status === 'synced'
							? 'mdi:cloud-check'
							: project.status === 'syncing'
							? 'mdi:loading'
							: 'mdi:clock'"
							class="w-4 h-4"
							:class="{
								'text-green-500': project.status === 'synced',
								'text-blue-500 animate-spin': project.status === 'syncing',
								'text-gray-400': project.status === 'pending',
							}"
						/>
						<div class="flex-1">
							<p class="font-medium text-sm text-gray-900 dark:text-white">
								{{ project.name }}
							</p>
							<p class="text-xs text-gray-500">
								{{ project.size }} • {{ project.lastModified }}
							</p>
						</div>
						<span
							class="text-xs px-2 py-1 rounded-full capitalize"
							:class="{
								'bg-green-100 text-green-800': project.status === 'synced',
								'bg-blue-100 text-blue-800': project.status === 'syncing',
								'bg-gray-100 text-gray-600': project.status === 'pending',
							}"
						>
							{{ project.status }}
						</span>
					</div>
				</div>
			</div>

			<!-- Settings -->
			<div class="space-y-2">
				<label class="flex items-center gap-3">
					<input v-model="settings.autoSync" type="checkbox" class="rounded" />
					<span class="text-sm text-gray-700 dark:text-gray-300"
					>Auto-sync when online</span>
				</label>
				<label class="flex items-center gap-3">
					<input
						v-model="settings.syncOnSave"
						type="checkbox"
						class="rounded"
					/>
					<span class="text-sm text-gray-700 dark:text-gray-300"
					>Sync on save</span>
				</label>
				<label class="flex items-center gap-3">
					<input
						v-model="settings.compression"
						type="checkbox"
						class="rounded"
					/>
					<span class="text-sm text-gray-700 dark:text-gray-300"
					>Compress before upload</span>
				</label>
			</div>
		</div>
	</ModalDialog>
</template>
