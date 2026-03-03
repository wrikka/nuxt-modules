<script setup lang="ts">
import type { MediaItem } from "#shared/types/media";
import { computed, ref } from "vue";
import { useMediaLibrary } from "~/composables/useMediaLibrary";

const { selectedAssets, deleteMultipleAssets, loadAssets } = useMediaLibrary();

const showMoveModal = ref(false);
const targetFolderId = ref<string | null>(null);

const selectedCount = computed(() => selectedAssets.value.size);

const handleBulkDelete = async () => {
	if (selectedCount.value === 0) return;

	if (
		confirm(`Are you sure you want to delete ${selectedCount.value} file(s)?`)
	) {
		try {
			const assetIds = Array.from(selectedAssets.value);
			await deleteMultipleAssets(assetIds);
			await loadAssets();
		} catch (err) {
			console.error("Failed to delete files:", err);
		}
	}
};

const handleBulkDownload = async () => {
	if (selectedCount.value === 0) return;

	const assetIds = Array.from(selectedAssets.value);
	await loadAssets();
	const { assets: allAssets } = useMediaLibrary();
	const assets = allAssets.value.filter((a: MediaItem) =>
		assetIds.includes(a.id)
	);

	assets.forEach((asset) => {
		const link = document.createElement("a");
		link.href = asset.url;
		link.download = asset.name;
		link.click();
	});
};

const handleBulkMove = async () => {
	if (selectedCount.value === 0) return;

	showMoveModal.value = true;
};

const confirmBulkMove = async () => {
	try {
		const assetIds = Array.from(selectedAssets.value);
		for (const assetId of assetIds) {
			await $fetch(`/api/assets/${assetId}`, {
				method: "PATCH",
				body: { folderId: targetFolderId.value },
			});
		}
		showMoveModal.value = false;
		targetFolderId.value = null;
		await loadAssets();
	} catch (err) {
		console.error("Failed to move files:", err);
	}
};
</script>

<template>
	<div class="bulk-actions">
		<div
			v-if="selectedCount > 0"
			class="mb-4 rounded-lg bg-blue-50 p-4 dark:bg-blue-900/20"
		>
			<div class="flex items-center justify-between">
				<div class="flex items-center gap-2">
					<i class="i-mdi-check-circle text-blue-600 dark:text-blue-400" />
					<span class="text-sm font-medium text-blue-900 dark:text-blue-100">{{
							selectedCount
						}} file(s) selected</span>
				</div>
				<div class="flex gap-2">
					<button
						@click="handleBulkDownload"
						class="rounded-md bg-white px-3 py-1.5 text-sm text-gray-700 hover:bg-gray-100 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
					>
						<i class="i-mdi-download mr-1" />
						Download
					</button>
					<button
						@click="handleBulkMove"
						class="rounded-md bg-white px-3 py-1.5 text-sm text-gray-700 hover:bg-gray-100 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
					>
						<i class="i-mdi-folder-move mr-1" />
						Move
					</button>
					<button
						@click="handleBulkDelete"
						class="rounded-md bg-red-600 px-3 py-1.5 text-sm text-white hover:bg-red-700"
					>
						<i class="i-mdi-delete mr-1" />
						Delete
					</button>
				</div>
			</div>
		</div>

		<div
			v-if="showMoveModal"
			class="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
			@click.self="showMoveModal = false"
		>
			<div class="w-full max-w-md rounded-lg bg-white p-6 shadow-lg dark:bg-gray-800">
				<h3 class="mb-4 text-lg font-semibold text-gray-900 dark:text-white">
					Move {{ selectedCount }} File(s)
				</h3>
				<div class="mb-4">
					<label
						class="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300"
					>Target Folder</label>
					<select
						v-model="targetFolderId"
						class="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
					>
						<option :value="null">Root</option>
					</select>
				</div>
				<div class="flex justify-end gap-2">
					<button
						@click="showMoveModal = false"
						class="rounded-md px-4 py-2 text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700"
					>
						Cancel
					</button>
					<button
						@click="confirmBulkMove"
						class="rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
					>
						Move
					</button>
				</div>
			</div>
		</div>
	</div>
</template>
