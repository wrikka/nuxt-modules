<script setup lang="ts">
const props = defineProps<{
	isOpen: boolean;
	items: {
		id: string;
		name: string;
		type: "file" | "folder";
		size?: string;
		modified: string;
	}[];
	currentPath: string;
}>();

const emit = defineEmits<{
	close: [];
	navigate: [path: string];
	select: [itemId: string];
	upload: [files: FileList];
	createFolder: [name: string];
}>();

const viewMode = ref<"grid" | "list">("list");
const searchQuery = ref("");
const showCreateFolder = ref(false);
const newFolderName = ref("");

const filteredItems = computed(() => {
	if (!searchQuery.value) return props.items;
	return props.items.filter(i =>
		i.name.toLowerCase().includes(searchQuery.value.toLowerCase())
	);
});

const breadcrumbs = computed(() => {
	return props.currentPath.split("/").filter(Boolean);
});

const createFolder = () => {
	if (newFolderName.value.trim()) {
		emit("createFolder", newFolderName.value.trim());
		newFolderName.value = "";
		showCreateFolder.value = false;
	}
};

const handleFileUpload = (event: Event) => {
	const target = event.target as HTMLInputElement;
	if (target.files) {
		emit("upload", target.files);
	}
};
</script>

<template>
	<div
		v-if="isOpen"
		class="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
		@click.self="emit('close')"
	>
		<div class="bg-white dark:bg-gray-800 rounded-2xl w-full max-w-3xl h-[80vh] shadow-2xl overflow-hidden flex flex-col">
			<!-- Header -->
			<div class="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
				<div class="flex items-center gap-4">
					<h3 class="text-lg font-semibold text-gray-900 dark:text-white">
						File Browser
					</h3>
					<!-- Breadcrumbs -->
					<div class="flex items-center gap-1 text-sm text-gray-500">
						<button @click="emit('navigate', '/')" class="hover:text-gray-700">
							Home
						</button>
						<span
							v-for="(crumb, i) in breadcrumbs"
							:key="i"
							class="flex items-center"
						>
							<Icon name="mdi:chevron-right" class="w-4 h-4 mx-1" />
							<button
								@click="emit('navigate', '/' + breadcrumbs.slice(0, i + 1).join('/'))"
								class="hover:text-gray-700"
							>
								{{ crumb }}
							</button>
						</span>
					</div>
				</div>
				<button
					@click="emit('close')"
					class="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
				>
					<Icon name="mdi:close" class="w-5 h-5" />
				</button>
			</div>

			<!-- Toolbar -->
			<div class="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700 gap-4">
				<div class="relative flex-1">
					<Icon
						name="mdi:magnify"
						class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400"
					/>
					<input
						v-model="searchQuery"
						type="text"
						placeholder="Search files..."
						class="w-full pl-9 pr-4 py-2 bg-gray-100 dark:bg-gray-700 rounded-lg"
					/>
				</div>
				<div class="flex items-center gap-2">
					<button
						@click="showCreateFolder = true"
						class="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
						title="New Folder"
					>
						<Icon name="mdi:folder-plus" class="w-5 h-5" />
					</button>
					<input
						type="file"
						multiple
						class="hidden"
						id="file-upload"
						@change="handleFileUpload"
					/>
					<label
						for="file-upload"
						class="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg cursor-pointer"
						title="Upload"
					>
						<Icon name="mdi:upload" class="w-5 h-5" />
					</label>
					<div class="flex bg-gray-100 dark:bg-gray-700 rounded-lg p-1">
						<button
							@click="viewMode = 'grid'"
							:class="[
								'p-1.5 rounded',
								viewMode === 'grid'
									? 'bg-white dark:bg-gray-600 shadow-sm'
									: '',
							]"
						>
							<Icon name="mdi:grid" class="w-4 h-4" />
						</button>
						<button
							@click="viewMode = 'list'"
							:class="[
								'p-1.5 rounded',
								viewMode === 'list'
									? 'bg-white dark:bg-gray-600 shadow-sm'
									: '',
							]"
						>
							<Icon name="mdi:format-list-bulleted" class="w-4 h-4" />
						</button>
					</div>
				</div>
			</div>

			<!-- File List -->
			<div class="flex-1 overflow-y-auto p-4">
				<!-- Grid View -->
				<div
					v-if="viewMode === 'grid'"
					class="grid grid-cols-4 md:grid-cols-6 gap-4"
				>
					<div
						v-for="item in filteredItems"
						:key="item.id"
						@click="item.type === 'folder'
						? emit('navigate', props.currentPath + '/' + item.name)
						: emit('select', item.id)"
						class="group cursor-pointer"
					>
						<div class="aspect-square bg-gray-100 dark:bg-gray-700 rounded-xl flex items-center justify-center mb-2 group-hover:bg-gray-200 dark:group-hover:bg-gray-600 transition-colors">
							<Icon
								:name="item.type === 'folder' ? 'mdi:folder' : 'mdi:file'"
								:class="item.type === 'folder' ? 'text-yellow-500' : 'text-blue-500'"
								class="w-12 h-12"
							/>
						</div>
						<p class="text-sm text-gray-900 dark:text-white text-center truncate">
							{{ item.name }}
						</p>
					</div>
				</div>

				<!-- List View -->
				<div v-else class="divide-y divide-gray-100 dark:divide-gray-700">
					<div
						v-for="item in filteredItems"
						:key="item.id"
						@click="item.type === 'folder'
						? emit('navigate', props.currentPath + '/' + item.name)
						: emit('select', item.id)"
						class="flex items-center gap-3 p-3 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg cursor-pointer"
					>
						<Icon
							:name="item.type === 'folder' ? 'mdi:folder' : 'mdi:file'"
							:class="item.type === 'folder' ? 'text-yellow-500' : 'text-blue-500'"
							class="w-5 h-5"
						/>
						<span class="flex-1 text-gray-900 dark:text-white">{{
							item.name
						}}</span>
						<span v-if="item.size" class="text-sm text-gray-500">{{
							item.size
						}}</span>
						<span class="text-sm text-gray-500">{{ item.modified }}</span>
					</div>
				</div>
			</div>

			<!-- Create Folder Dialog -->
			<div
				v-if="showCreateFolder"
				class="absolute inset-x-0 bottom-0 bg-white dark:bg-gray-800 p-4 border-t border-gray-200 dark:border-gray-700 shadow-lg"
			>
				<div class="flex gap-2">
					<input
						v-model="newFolderName"
						type="text"
						placeholder="Folder name"
						class="flex-1 px-3 py-2 bg-gray-100 dark:bg-gray-700 rounded-lg"
						@keyup.enter="createFolder"
					/>
					<button
						@click="createFolder"
						:disabled="!newFolderName.trim()"
						class="px-4 py-2 bg-blue-500 text-white rounded-lg disabled:opacity-50"
					>
						Create
					</button>
					<button
						@click="showCreateFolder = false"
						class="px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg"
					>
						Cancel
					</button>
				</div>
			</div>
		</div>
	</div>
</template>
