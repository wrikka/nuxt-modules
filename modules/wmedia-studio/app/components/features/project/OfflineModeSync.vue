<script setup lang="ts">
interface SyncItem {
	id: string;
	name: string;
	type: "project" | "asset" | "template";
	size: string;
	localVersion: number;
	remoteVersion: number;
	status: "synced" | "pending" | "conflict" | "offline";
	lastSync: Date;
}

const isOnline = ref(true);
const syncEnabled = ref(true);
const autoSync = ref(true);
const syncProgress = ref(0);
const isSyncing = ref(false);
const pendingChanges = ref(12);
const storageUsed = ref("2.4 GB");
const storageAvailable = ref("10 GB");

const syncItems = ref<SyncItem[]>([
	{
		id: "1",
		name: "Summer Campaign",
		type: "project",
		size: "450 MB",
		localVersion: 5,
		remoteVersion: 5,
		status: "synced",
		lastSync: new Date("2024-01-16 10:30"),
	},
	{
		id: "2",
		name: "Logo Assets",
		type: "asset",
		size: "12 MB",
		localVersion: 3,
		remoteVersion: 2,
		status: "pending",
		lastSync: new Date("2024-01-16 09:15"),
	},
	{
		id: "3",
		name: "Social Templates",
		type: "template",
		size: "85 MB",
		localVersion: 2,
		remoteVersion: 2,
		status: "synced",
		lastSync: new Date("2024-01-15 16:45"),
	},
	{
		id: "4",
		name: "Product Video",
		type: "project",
		size: "1.2 GB",
		localVersion: 8,
		remoteVersion: 7,
		status: "conflict",
		lastSync: new Date("2024-01-14 11:20"),
	},
	{
		id: "5",
		name: "Brand Guidelines",
		type: "asset",
		size: "25 MB",
		localVersion: 1,
		remoteVersion: 0,
		status: "offline",
		lastSync: new Date("2024-01-10 14:00"),
	},
]);

function toggleOnline() {
	isOnline.value = !isOnline.value;
}

function startSync() {
	isSyncing.value = true;
	syncProgress.value = 0;

	const interval = setInterval(() => {
		syncProgress.value += 10;
		if (syncProgress.value >= 100) {
			clearInterval(interval);
			isSyncing.value = false;
			pendingChanges.value = 0;
			syncItems.value.forEach(item => {
				if (item.status === "pending") item.status = "synced";
			});
		}
	}, 300);
}

function resolveConflict(item: SyncItem) {
	item.status = "synced";
	item.localVersion = Math.max(item.localVersion, item.remoteVersion);
	item.remoteVersion = item.localVersion;
}

function formatDate(date: Date): string {
	return new Intl.DateTimeFormat("en-US", {
		month: "short",
		day: "numeric",
		hour: "2-digit",
		minute: "2-digit",
	}).format(date);
}
</script>

<template>
	<div class="offline-mode-sync">
		<h2 class="text-2xl font-bold mb-4">
			<Icon name="mdi:cloud-sync" class="mr-2" />
			Offline Mode with Sync
		</h2>
		<p class="text-gray-500 mb-6">Work offline, auto-sync when reconnected</p>

		<!-- Connection Status -->
		<div class="grid grid-cols-3 gap-4 mb-6">
			<div
				class="rounded-lg p-4"
				:class="isOnline ? 'bg-green-50' : 'bg-yellow-50'"
			>
				<div class="flex items-center gap-3">
					<Icon
						:name="isOnline ? 'mdi:wifi' : 'mdi:wifi-off'"
						class="text-2xl"
						:class="isOnline ? 'text-green-600' : 'text-yellow-600'"
					/>
					<div>
						<p
							class="font-medium"
							:class="isOnline ? 'text-green-700' : 'text-yellow-700'"
						>
							{{ isOnline ? "Online" : "Offline Mode" }}
						</p>
						<p class="text-sm text-gray-500">
							{{ isOnline ? "Connected to server" : "Working locally" }}
						</p>
					</div>
				</div>
			</div>

			<div class="bg-blue-50 rounded-lg p-4">
				<div class="flex items-center gap-3">
					<Icon name="mdi:sync" class="text-2xl text-blue-600" />
					<div>
						<p class="font-medium text-blue-700">
							{{ pendingChanges }} Pending
						</p>
						<p class="text-sm text-gray-500">Changes to sync</p>
					</div>
				</div>
			</div>

			<div class="bg-gray-50 rounded-lg p-4">
				<div class="flex items-center gap-3">
					<Icon name="mdi:harddisk" class="text-2xl text-gray-600" />
					<div>
						<p class="font-medium">
							{{ storageUsed }} / {{ storageAvailable }}
						</p>
						<p class="text-sm text-gray-500">Local storage used</p>
					</div>
				</div>
			</div>
		</div>

		<!-- Sync Settings -->
		<div class="bg-gray-50 rounded-lg p-4 mb-6">
			<h3 class="font-semibold mb-4">Sync Settings</h3>
			<div class="grid grid-cols-2 gap-4">
				<label class="flex items-center gap-3">
					<input v-model="syncEnabled" type="checkbox" class="rounded" />
					<div>
						<span class="font-medium">Enable Cloud Sync</span>
						<p class="text-sm text-gray-500">
							Automatically sync changes to cloud
						</p>
					</div>
				</label>
				<label class="flex items-center gap-3">
					<input
						v-model="autoSync"
						type="checkbox"
						class="rounded"
						:disabled="!syncEnabled"
					/>
					<div>
						<span class="font-medium">Auto Sync</span>
						<p class="text-sm text-gray-500">Sync when connection available</p>
					</div>
				</label>
			</div>
		</div>

		<!-- Sync Progress -->
		<div v-if="isSyncing" class="bg-blue-50 rounded-lg p-4 mb-6">
			<div class="flex items-center justify-between mb-2">
				<span class="font-medium">Syncing...</span>
				<span class="text-sm">{{ syncProgress }}%</span>
			</div>
			<div class="w-full bg-blue-200 rounded-full h-2">
				<div
					class="bg-blue-600 h-2 rounded-full transition-all"
					:style="{ width: `${syncProgress}%` }"
				/>
			</div>
		</div>

		<!-- Sync Actions -->
		<div class="flex gap-3 mb-6">
			<button
				@click="toggleOnline"
				class="px-4 py-2 border rounded-lg hover:bg-gray-50"
			>
				<Icon :name="isOnline ? 'mdi:wifi-off' : 'mdi:wifi'" class="mr-1" />
				{{ isOnline ? "Go Offline" : "Go Online" }}
			</button>
			<button
				@click="startSync"
				:disabled="isSyncing || !isOnline || pendingChanges === 0"
				class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
			>
				<Icon v-if="isSyncing" name="mdi:loading" class="mr-1 animate-spin" />
				<Icon v-else name="mdi:sync" class="mr-1" />
				Sync Now
			</button>
			<button class="px-4 py-2 border rounded-lg hover:bg-gray-50">
				<Icon name="mdi:cog" class="mr-1" />
				Sync Settings
			</button>
		</div>

		<!-- Sync Items List -->
		<div class="bg-gray-50 rounded-lg p-4">
			<h3 class="font-semibold mb-4">Sync Status</h3>
			<div class="space-y-2">
				<div
					v-for="item in syncItems"
					:key="item.id"
					class="flex items-center gap-4 p-3 bg-white rounded-lg"
				>
					<div
						class="w-10 h-10 rounded-lg flex items-center justify-center"
						:class="item.type === 'project'
						? 'bg-purple-100 text-purple-600'
						: item.type === 'asset'
						? 'bg-blue-100 text-blue-600'
						: 'bg-green-100 text-green-600'"
					>
						<Icon
							:name="item.type === 'project'
							? 'mdi:movie'
							: item.type === 'asset'
							? 'mdi:folder-image'
							: 'mdi:file-document'"
						/>
					</div>

					<div class="flex-1">
						<div class="flex items-center gap-2">
							<span class="font-medium">{{ item.name }}</span>
							<span
								class="text-xs px-2 py-0.5 rounded"
								:class="{
									'bg-green-100 text-green-700': item.status === 'synced',
									'bg-yellow-100 text-yellow-700': item.status === 'pending',
									'bg-red-100 text-red-700': item.status === 'conflict',
									'bg-gray-100 text-gray-700': item.status === 'offline',
								}"
							>
								{{ item.status }}
							</span>
						</div>
						<div class="text-sm text-gray-500">
							{{ item.size }} • v{{ item.localVersion }} local / v{{
								item.remoteVersion
							}} remote
						</div>
					</div>

					<div class="text-sm text-gray-500">
						{{ item.lastSync ? formatDate(item.lastSync) : "Never" }}
					</div>

					<div v-if="item.status === 'conflict'" class="flex gap-2">
						<button
							@click="resolveConflict(item)"
							class="text-xs bg-blue-600 text-white px-2 py-1 rounded"
						>
							Use Local
						</button>
						<button
							@click="resolveConflict(item)"
							class="text-xs border px-2 py-1 rounded"
						>
							Use Remote
						</button>
					</div>

					<button v-else class="p-1 hover:bg-gray-100 rounded">
						<Icon name="mdi:dots-vertical" />
					</button>
				</div>
			</div>
		</div>
	</div>
</template>

<style scoped>
.offline-mode-sync {
	padding: 1.5rem;
}
</style>
