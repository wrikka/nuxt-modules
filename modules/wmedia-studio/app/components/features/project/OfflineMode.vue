<script setup lang="ts">
const isOffline = ref(false);
const syncStatus = ref<"synced" | "syncing" | "pending">("synced");
const offlineData = ref({
	projectsAvailable: 12,
	cachedAssets: 156,
	lastSync: "2 minutes ago",
	pendingChanges: 3,
});
const toggleOffline = () => {
	isOffline.value = !isOffline.value;
	syncStatus.value = isOffline.value ? "pending" : "syncing";
	setTimeout(() => syncStatus.value = "synced", 1500);
};
</script>

<template>
	<div class="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
		<div class="flex items-center justify-between mb-6">
			<h3 class="text-lg font-semibold text-gray-900 dark:text-white">
				Offline Mode
			</h3>
			<button
				@click="toggleOffline"
				:class="isOffline ? 'bg-orange-500' : 'bg-green-500'"
				class="px-3 py-1 rounded-full text-white text-sm flex items-center gap-1"
			>
				<Icon :name="isOffline ? 'mdi:wifi-off' : 'mdi:wifi'" class="w-4 h-4" />
				{{ isOffline ? "Offline" : "Online" }}
			</button>
		</div>

		<div class="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg mb-4">
			<div class="flex items-center justify-between mb-3">
				<span class="text-sm text-gray-600">Sync Status</span>
				<span
					:class="{
						'text-green-500': syncStatus === 'synced',
						'text-blue-500': syncStatus === 'syncing',
						'text-orange-500': syncStatus === 'pending',
					}"
					class="text-sm font-medium capitalize flex items-center gap-1"
				>
					<Icon
						v-if="syncStatus === 'syncing'"
						name="mdi:loading"
						class="w-4 h-4 animate-spin"
					/>
					{{ syncStatus }}
				</span>
			</div>
			<div class="h-2 bg-gray-200 rounded-full overflow-hidden">
				<div
					class="h-full transition-all duration-500"
					:class="syncStatus === 'synced'
					? 'bg-green-500 w-full'
					: syncStatus === 'syncing'
					? 'bg-blue-500 w-2/3'
					: 'bg-orange-500 w-1/3'"
				/>
			</div>
		</div>

		<div class="grid grid-cols-2 gap-3">
			<div class="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg text-center">
				<Icon name="mdi:folder" class="w-6 h-6 text-blue-500 mx-auto mb-1" />
				<p class="text-lg font-bold">{{ offlineData.projectsAvailable }}</p>
				<p class="text-xs text-gray-500">Projects Cached</p>
			</div>
			<div class="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg text-center">
				<Icon name="mdi:image" class="w-6 h-6 text-purple-500 mx-auto mb-1" />
				<p class="text-lg font-bold">{{ offlineData.cachedAssets }}</p>
				<p class="text-xs text-gray-500">Assets Cached</p>
			</div>
			<div class="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg text-center">
				<Icon name="mdi:clock" class="w-6 h-6 text-green-500 mx-auto mb-1" />
				<p class="text-sm font-medium">{{ offlineData.lastSync }}</p>
				<p class="text-xs text-gray-500">Last Sync</p>
			</div>
			<div class="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg text-center">
				<Icon name="mdi:sync" class="w-6 h-6 text-orange-500 mx-auto mb-1" />
				<p class="text-lg font-bold">{{ offlineData.pendingChanges }}</p>
				<p class="text-xs text-gray-500">Pending Changes</p>
			</div>
		</div>
	</div>
</template>
