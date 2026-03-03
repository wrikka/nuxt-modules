<script setup lang="ts">
import type { LibraryMediaFolder as MediaFolder } from "~/composables/useMediaLibrary";

defineProps<{
	folder: MediaFolder;
	children: MediaFolder[];
	expanded: boolean;
	selected: boolean;
}>();

defineEmits<{
	toggle: [folderId: string];
	select: [folderId: string];
	create: [parentId: string];
	delete: [folderId: string];
}>();
</script>

<template>
	<div class="folder-item">
		<div class="flex items-center">
			<button
				@click="$emit('toggle', folder.id)"
				class="mr-1 rounded p-0.5 text-gray-400 hover:bg-gray-100 hover:text-gray-600 dark:hover:bg-gray-700 dark:hover:text-gray-300"
			>
				<i
					:class="children.length > 0
					? (expanded ? 'i-mdi-chevron-down' : 'i-mdi-chevron-right')
					: 'i-mdi-minus opacity-0'"
					class="text-xs"
				/>
			</button>
			<button
				@click="$emit('select', folder.id)"
				:class="selected
				? 'bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'
				: 'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700'"
				class="flex flex-1 items-center gap-2 rounded-md px-2 py-1.5 text-sm"
			>
				<i :class="expanded ? 'i-mdi-folder-open' : 'i-mdi-folder'" />
				<span class="truncate">{{ folder.name }}</span>
			</button>
			<div class="flex items-center gap-0.5 opacity-0 group-hover:opacity-100">
				<button
					@click="$emit('create', folder.id)"
					class="rounded p-0.5 text-gray-400 hover:bg-gray-100 hover:text-gray-600 dark:hover:bg-gray-700 dark:hover:text-gray-300"
					title="Create Subfolder"
				>
					<i class="i-mdi-folder-plus text-xs" />
				</button>
				<button
					@click="$emit('delete', folder.id)"
					class="rounded p-0.5 text-gray-400 hover:bg-gray-100 hover:text-red-600 dark:hover:bg-gray-700 dark:hover:text-red-400"
					title="Delete Folder"
				>
					<i class="i-mdi-delete text-xs" />
				</button>
			</div>
		</div>
		<div v-if="expanded && children.length > 0" class="ml-4 mt-1 space-y-1">
			<FolderTreeItem
				v-for="child in children"
				:key="child.id"
				:folder="child"
				:children="children.filter((c) => c.parentId === child.id)"
				:expanded="false"
				:selected="false"
				@toggle="$emit('toggle', $event)"
				@select="$emit('select', $event)"
				@create="$emit('create', $event)"
				@delete="$emit('delete', $event)"
			/>
		</div>
	</div>
</template>
