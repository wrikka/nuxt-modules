<script setup lang="ts">
const emit = defineEmits<
	{ close: []; upload: [files: string[]]; download: [files: string[]] }
>();
const cloudFiles = ref([{
	id: "1",
	name: "Project_Backup.zip",
	size: "1.2 GB",
	date: "2024-01-15",
	synced: true,
}, {
	id: "2",
	name: "Assets_Folder",
	size: "450 MB",
	date: "2024-01-14",
	synced: false,
}]);
const storageUsed = ref(45);
const storageTotal = ref(100);

const toggleSync = (id: string) => {
	const file = cloudFiles.value.find(f => f.id === id);
	if (file) file.synced = !file.synced;
};

const formatSize = (size: string) => size;
</script>
<template>
	<div class="cloud-storage bg-white dark:bg-gray-800 rounded-xl p-4 w-[500px] max-h-[80vh] flex flex-col shadow-lg border border-gray-200 dark:border-gray-700">
		<div class="flex items-center justify-between mb-4">
			<h3 class="text-gray-900 dark:text-white font-semibold flex items-center gap-2">
				<Icon name="mdi:cloud" class="w-5 h-5 text-blue-500" />
				Cloud Storage
			</h3>
			<button
				class="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
				@click="emit('close')"
			>
				<Icon name="mdi:close" class="w-5 h-5" />
			</button>
		</div>
		<div class="mb-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
			<div class="flex justify-between text-sm mb-1">
				<span class="text-gray-600 dark:text-gray-400">Storage Used</span>
				<span class="text-blue-500 font-medium">{{ storageUsed }} GB / {{
						storageTotal
					}} GB</span>
			</div>
			<div class="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
				<div
					class="h-full bg-blue-500 rounded-full transition-all"
					:style="{ width: `${(storageUsed / storageTotal) * 100}%` }"
				/>
			</div>
		</div>
		<div class="flex-1 overflow-y-auto">
			<div class="text-gray-500 dark:text-gray-400 text-xs mb-2 uppercase font-medium">
				Cloud Files
			</div>
			<div class="space-y-2">
				<div
					v-for="file in cloudFiles"
					:key="file.id"
					class="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-700/30 rounded-lg"
				>
					<Icon
						:name="file.name.endsWith('Folder') ? 'mdi:folder' : 'mdi:file'"
						class="w-5 h-5 text-gray-500 dark:text-gray-400"
					/>
					<div class="flex-1">
						<div class="text-gray-900 dark:text-white text-sm">
							{{ file.name }}
						</div>
						<div class="text-gray-500 dark:text-gray-400 text-xs">
							{{ file.size }} • {{ file.date }}
						</div>
					</div>
					<button
						class="text-xs px-2 py-1 rounded transition-colors"
						:class="file.synced
						? 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400'
						: 'bg-gray-200 dark:bg-gray-600 text-gray-600 dark:text-gray-400'"
						@click="toggleSync(file.id)"
					>
						{{ file.synced ? "Synced" : "Sync" }}
					</button>
				</div>
			</div>
		</div>
		<div class="mt-4 flex gap-2">
			<button
				class="flex-1 px-4 py-2 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-900 dark:text-white rounded-lg text-sm transition-colors"
				@click="emit('upload', [])"
			>
				Upload
			</button>
			<button
				class="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-colors"
				@click="emit('download', [])"
			>
				Download All
			</button>
		</div>
	</div>
</template>
