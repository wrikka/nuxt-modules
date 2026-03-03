<script setup lang="ts">
const props = defineProps<{
	isOpen: boolean;
	items: { id: string; name: string; size: number; type: string }[];
}>();

const emit = defineEmits<{
	close: [];
	upload: [files: FileList];
	delete: [itemId: string];
}>();

const isDragging = ref(false);

const handleDrop = (e: DragEvent) => {
	isDragging.value = false;
	if (e.dataTransfer?.files) {
		emit("upload", e.dataTransfer.files);
	}
};

const handleFileInput = (event: Event) => {
	const target = event.target as HTMLInputElement;
	if (target.files) {
		emit("upload", target.files);
	}
};

const formatSize = (bytes: number) => {
	if (bytes === 0) return "0 B";
	const k = 1024;
	const sizes = ["B", "KB", "MB", "GB"];
	const i = Math.floor(Math.log(bytes) / Math.log(k));
	return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
};
</script>

<template>
	<div
		v-if="isOpen"
		class="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
		@click.self="emit('close')"
	>
		<div class="bg-white dark:bg-gray-800 rounded-2xl w-full max-w-2xl h-[70vh] shadow-2xl flex flex-col">
			<div class="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
				<h3 class="text-lg font-semibold text-gray-900 dark:text-white">
					Media Library
				</h3>
				<button @click="emit('close')" class="p-2 hover:bg-gray-100 rounded-lg">
					<Icon name="mdi:close" class="w-5 h-5" />
				</button>
			</div>

			<!-- Drop Zone -->
			<div
				class="m-4 p-8 border-2 border-dashed rounded-xl text-center transition-colors"
				:class="isDragging
				? 'border-blue-500 bg-blue-50'
				: 'border-gray-300 dark:border-gray-600'"
				@dragover.prevent="isDragging = true"
				@dragleave="isDragging = false"
				@drop.prevent="handleDrop"
			>
				<Icon
					name="mdi:cloud-upload"
					class="w-12 h-12 text-gray-400 mx-auto mb-2"
				/>
				<p class="text-gray-600 dark:text-gray-400">
					Drop files here or click to browse
				</p>
				<input
					type="file"
					multiple
					class="hidden"
					@change="handleFileInput"
					id="file-upload"
				/>
				<label
					for="file-upload"
					class="mt-2 inline-block px-4 py-2 bg-blue-500 text-white rounded-lg cursor-pointer"
				>Browse Files</label>
			</div>

			<!-- File List -->
			<div class="flex-1 overflow-y-auto px-4 pb-4">
				<div v-if="items.length === 0" class="text-center py-8 text-gray-500">
					No files uploaded yet
				</div>
				<div v-else class="space-y-2">
					<div
						v-for="item in items"
						:key="item.id"
						class="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg"
					>
						<span
							:class="[
								'w-10 h-10 rounded-lg flex items-center justify-center',
								item.type.startsWith('image/')
									? 'bg-purple-100 text-purple-600'
									: item.type.startsWith('video/')
									? 'bg-red-100 text-red-600'
									: 'bg-blue-100 text-blue-600',
							]"
						>
							<Icon
								v-if="item.type.startsWith('image/')"
								name="mdi:image"
								class="w-5 h-5"
							/>
							<Icon
								v-else-if="item.type.startsWith('video/')"
								name="mdi:video"
								class="w-5 h-5"
							/>
							<Icon v-else name="mdi:file" class="w-5 h-5" />
						</span>
						<div class="flex-1 min-w-0">
							<p class="font-medium text-gray-900 dark:text-white truncate">
								{{ item.name }}
							</p>
							<p class="text-xs text-gray-500">{{ formatSize(item.size) }}</p>
						</div>
						<button
							@click="emit('delete', item.id)"
							class="p-2 hover:bg-red-100 text-red-500 rounded-lg"
						>
							<Icon name="mdi:delete" class="w-4 h-4" />
						</button>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>
