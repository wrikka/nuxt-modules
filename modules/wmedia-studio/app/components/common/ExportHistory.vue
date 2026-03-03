<script setup lang="ts">
const props = defineProps<{
	isOpen: boolean;
	exports: {
		id: string;
		name: string;
		format: string;
		size: string;
		status: "pending" | "processing" | "completed" | "failed";
		progress?: number;
		thumbnail?: string;
		createdAt: string;
	}[];
}>();

const emit = defineEmits<{
	close: [];
	download: [exportId: string];
	delete: [exportId: string];
	retry: [exportId: string];
}>();

const formatIcons: Record<string, string> = {
	mp4: "mdi:video",
	webm: "mdi:video",
	png: "mdi:image",
	jpg: "mdi:image",
	gif: "mdi:image",
	mp3: "mdi:music",
	wav: "mdi:music",
	pdf: "mdi:file-document",
};

const statusColors = {
	pending: "text-yellow-500",
	processing: "text-blue-500",
	completed: "text-green-500",
	failed: "text-red-500",
};

const activeTab = ref<"all" | "completed" | "processing">("all");

const filteredExports = computed(() => {
	if (activeTab.value === "all") return props.exports;
	return props.exports.filter(e => e.status === activeTab.value);
});
</script>

<template>
	<div
		v-if="isOpen"
		class="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
		@click.self="emit('close')"
	>
		<div class="bg-white dark:bg-gray-800 rounded-2xl w-full max-w-3xl h-[80vh] shadow-2xl flex flex-col">
			<div class="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
				<h3 class="text-lg font-semibold text-gray-900 dark:text-white">
					Export History
				</h3>
				<button
					@click="emit('close')"
					class="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
				>
					<Icon name="mdi:close" class="w-5 h-5" />
				</button>
			</div>

			<div class="flex border-b border-gray-200 dark:border-gray-700">
				<button
					v-for='tab in ["all", "completed", "processing"] as const'
					:key="tab"
					@click="activeTab = tab"
					:class="[
						'flex-1 py-3 text-sm font-medium capitalize',
						activeTab === tab
							? 'text-blue-500 border-b-2 border-blue-500'
							: 'text-gray-500',
					]"
				>
					{{ tab }}
					<span
						class="ml-1 text-xs bg-gray-100 dark:bg-gray-700 px-1.5 py-0.5 rounded-full"
					>
						{{
							tab === "all"
							? exports.length
							: exports.filter(e => e.status === tab).length
						}}
					</span>
				</button>
			</div>

			<div class="flex-1 overflow-y-auto p-4">
				<div class="space-y-3">
					<div
						v-for="exportItem in filteredExports"
						:key="exportItem.id"
						class="flex items-center gap-4 p-3 bg-gray-50 dark:bg-gray-700 rounded-xl"
					>
						<div class="w-16 h-16 bg-gray-200 dark:bg-gray-600 rounded-lg flex items-center justify-center overflow-hidden flex-shrink-0">
							<img
								v-if="exportItem.thumbnail"
								:src="exportItem.thumbnail"
								class="w-full h-full object-cover"
							/>
							<Icon
								v-else
								:name="formatIcons[exportItem.format] || 'mdi:file'"
								class="w-6 h-6 text-gray-400"
							/>
						</div>

						<div class="flex-1 min-w-0">
							<p class="font-medium text-gray-900 dark:text-white truncate">
								{{ exportItem.name }}
							</p>
							<div class="flex items-center gap-2 text-sm text-gray-500">
								<span class="uppercase">{{ exportItem.format }}</span>
								<span>·</span>
								<span>{{ exportItem.size }}</span>
								<span>·</span>
								<span
									:class="['capitalize', statusColors[exportItem.status]]"
								>{{ exportItem.status }}</span>
							</div>

							<!-- Progress bar for processing -->
							<div
								v-if="exportItem.status === 'processing'
								&& exportItem.progress !== undefined"
								class="mt-2"
							>
								<div class="h-1.5 bg-gray-200 dark:bg-gray-600 rounded-full overflow-hidden">
									<div
										class="h-full bg-blue-500 rounded-full transition-all"
										:style="{ width: `${exportItem.progress}%` }"
									/>
								</div>
								<p class="text-xs text-gray-500 mt-1">
									{{ exportItem.progress }}%
								</p>
							</div>
						</div>

						<div class="flex items-center gap-1">
							<button
								v-if="exportItem.status === 'completed'"
								@click="emit('download', exportItem.id)"
								class="p-2 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg text-blue-500"
								title="Download"
							>
								<Icon name="mdi:download" class="w-5 h-5" />
							</button>
							<button
								v-if="exportItem.status === 'failed'"
								@click="emit('retry', exportItem.id)"
								class="p-2 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg text-yellow-500"
								title="Retry"
							>
								<Icon name="mdi:refresh" class="w-5 h-5" />
							</button>
							<button
								@click="emit('delete', exportItem.id)"
								class="p-2 hover:bg-red-100 dark:hover:bg-red-900/30 rounded-lg text-red-500"
								title="Delete"
							>
								<Icon name="mdi:delete" class="w-5 h-5" />
							</button>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>
