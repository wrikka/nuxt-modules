<script setup lang="ts">
import { computed, onMounted, ref } from "vue";
import { useMediaLibrary } from "~/composables/useMediaLibrary";

const { assets } = useMediaLibrary();

const totalStorage = ref(0);
const usedStorage = ref(0);
const loading = ref(false);

const usagePercentage = computed(() => {
	if (totalStorage.value === 0) return 0;
	return Math.round((usedStorage.value / totalStorage.value) * 100);
});

const remainingStorage = computed(() => {
	return totalStorage.value - usedStorage.value;
});

const formatFileSize = (bytes: number): string => {
	if (bytes === 0) return "0 Bytes";
	const k = 1024;
	const sizes = ["Bytes", "KB", "MB", "GB", "TB"];
	const i = Math.floor(Math.log(bytes) / Math.log(k));
	return `${Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${
		sizes[i]
	}`;
};

const loadStorageInfo = async () => {
	loading.value = true;
	try {
		const response = await $fetch<{ total: number; used: number }>(
			"/api/storage",
		);
		totalStorage.value = response.total;
		usedStorage.value = response.used;
	} catch (err) {
		console.error("Failed to load storage info:", err);
	} finally {
		loading.value = false;
	}
};

onMounted(() => {
	loadStorageInfo();
});
</script>

<template>
	<div class="storage-usage rounded-lg bg-white p-4 shadow-sm dark:bg-gray-800">
		<div class="mb-3 flex items-center justify-between">
			<h3 class="text-sm font-semibold text-gray-900 dark:text-white">
				Storage Usage
			</h3>
			<i class="i-mdi-harddisk text-gray-400" />
		</div>

		<div v-if="loading" class="flex items-center justify-center py-4">
			<i class="i-mdi-loading animate-spin text-blue-500" />
		</div>

		<div v-else>
			<div class="mb-2">
				<div class="flex justify-between text-sm">
					<span class="text-gray-600 dark:text-gray-400">Used</span>
					<span class="font-medium text-gray-900 dark:text-white">{{
						formatFileSize(usedStorage)
					}}</span>
				</div>
				<div class="mt-1 h-2 w-full overflow-hidden rounded-full bg-gray-200 dark:bg-gray-700">
					<div
						class="h-full rounded-full bg-blue-600 transition-all"
						:style="{ width: `${usagePercentage}%` }"
					/>
				</div>
			</div>

			<div class="space-y-1 text-xs text-gray-500 dark:text-gray-400">
				<div class="flex justify-between">
					<span>Remaining</span>
					<span>{{ formatFileSize(remainingStorage) }}</span>
				</div>
				<div class="flex justify-between">
					<span>Total</span>
					<span>{{ formatFileSize(totalStorage) }}</span>
				</div>
			</div>

			<div
				v-if="usagePercentage > 90"
				class="mt-3 rounded-md bg-red-50 p-2 text-xs text-red-700 dark:bg-red-900/20 dark:text-red-400"
			>
				<i class="i-mdi-alert mr-1" />
				Storage is almost full ({{ usagePercentage }}% used)
			</div>
		</div>
	</div>
</template>
