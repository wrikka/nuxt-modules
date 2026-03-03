<script setup lang="ts">
import { computed, onMounted, ref } from "vue";
import { useMediaLibrary } from "~/composables/useMediaLibrary";

const { folders, selectedFolderId, loadFolders, createFolder, deleteFolder } =
	useMediaLibrary();

const expandedFolders = ref<Set<string>>(new Set());
const showCreateModal = ref(false);
const newFolderName = ref("");
const newFolderParentId = ref<string | undefined>();

const rootFolders = computed(() => folders.value.filter((f) => !f.parentId));

const getFolderChildren = (parentId: string) => {
	return folders.value.filter((f) => f.parentId === parentId);
};

const toggleExpand = (folderId: string) => {
	if (expandedFolders.value.has(folderId)) {
		expandedFolders.value.delete(folderId);
	} else {
		expandedFolders.value.add(folderId);
	}
};

const selectFolder = (folderId: string | null) => {
	selectedFolderId.value = folderId;
};

const openCreateModal = (parentId?: string) => {
	newFolderName.value = "";
	newFolderParentId.value = parentId;
	showCreateModal.value = true;
};

const handleCreateFolder = async () => {
	if (!newFolderName.value.trim()) return;

	try {
		await createFolder(newFolderName.value.trim(), newFolderParentId.value);
		showCreateModal.value = false;
		await loadFolders();
	} catch (err) {
		console.error("Failed to create folder:", err);
	}
};

const handleDeleteFolder = async (folderId: string) => {
	if (
		confirm(
			"Are you sure you want to delete this folder? All files in this folder will also be deleted.",
		)
	) {
		try {
			await deleteFolder(folderId);
			await loadFolders();
		} catch (err) {
			console.error("Failed to delete folder:", err);
		}
	}
};

onMounted(() => {
	loadFolders();
});
</script>

<template>
	<div class="folder-tree">
		<div class="mb-4 flex items-center justify-between">
			<h3 class="text-sm font-semibold text-gray-900 dark:text-white">
				Folders
			</h3>
			<button
				@click="openCreateModal()"
				class="rounded-md p-1 text-gray-500 hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-gray-300"
				title="Create Folder"
			>
				<i class="i-mdi-folder-plus" />
			</button>
		</div>

		<div
			v-if="folders.length === 0"
			class="py-4 text-center text-sm text-gray-500 dark:text-gray-400"
		>
			No folders yet
		</div>

		<div v-else class="space-y-1">
			<button
				@click="selectFolder(null)"
				:class="selectedFolderId === null
				? 'bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'
				: 'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700'"
				class="flex w-full items-center gap-2 rounded-md px-3 py-2 text-sm"
			>
				<i class="i-mdi-folder" />
				<span>All Files</span>
			</button>

			<FolderTreeItem
				v-for="folder in rootFolders"
				:key="folder.id"
				:folder="folder"
				:children="getFolderChildren(folder.id)"
				:expanded="expandedFolders.has(folder.id)"
				:selected="selectedFolderId === folder.id"
				@toggle="toggleExpand"
				@select="selectFolder"
				@create="openCreateModal"
				@delete="handleDeleteFolder"
			/>
		</div>

		<div
			v-if="showCreateModal"
			class="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
			@click.self="showCreateModal = false"
		>
			<div class="w-full max-w-md rounded-lg bg-white p-6 shadow-lg dark:bg-gray-800">
				<h3 class="mb-4 text-lg font-semibold text-gray-900 dark:text-white">
					Create New Folder
				</h3>
				<input
					v-model="newFolderName"
					type="text"
					placeholder="Folder name"
					class="mb-4 w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
					@keyup.enter="handleCreateFolder"
				/>
				<div class="flex justify-end gap-2">
					<button
						@click="showCreateModal = false"
						class="rounded-md px-4 py-2 text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700"
					>
						Cancel
					</button>
					<button
						@click="handleCreateFolder"
						class="rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
					>
						Create
					</button>
				</div>
			</div>
		</div>
	</div>
</template>
