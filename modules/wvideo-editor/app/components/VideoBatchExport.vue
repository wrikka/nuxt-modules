<script setup lang="ts">
import type { Recording } from "~/types";

const props = defineProps<{
	recordings: Array<{ id: string; name: string; blob: Blob; duration: number }>;
}>();

const emit = defineEmits<{
	export: [
		recordings: typeof props.recordings,
		options: { format: string; quality: string },
	];
}>();

const isOpen = ref(false);
const selectedIds = ref<Set<string>>(new Set());
const format = ref("mp4");
const quality = ref("high");

const toggleAll = () => {
	if (selectedIds.value.size === props.recordings.length) {
		selectedIds.value.clear();
	} else {
		selectedIds.value = new Set(props.recordings.map((r) => r.id));
	}
};

const toggleSelection = (id: string) => {
	if (selectedIds.value.has(id)) {
		selectedIds.value.delete(id);
	} else {
		selectedIds.value.add(id);
	}
};

const handleExport = () => {
	const selected = props.recordings.filter((r) => selectedIds.value.has(r.id));
	emit("export", selected, { format: format.value, quality: quality.value });
	isOpen.value = false;
};

const formatTime = (seconds: number): string => {
	const mins = Math.floor(seconds / 60);
	const secs = Math.floor(seconds % 60);
	return `${mins}:${secs.toString().padStart(2, "0")}`;
};

const formatSize = (bytes: number): string => {
	if (bytes === 0) return "0 B";
	const k = 1024;
	const sizes = ["B", "KB", "MB", "GB"];
	const i = Math.floor(Math.log(bytes) / Math.log(k));
	return `${parseFloat((bytes / k ** i).toFixed(1))} ${sizes[i]}`;
};
</script>

<template>
	<div>
		<button
			class="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-medium transition-colors flex items-center gap-2"
			@click="isOpen = true"
		>
			<Icon name="mdi:download-multiple" class="w-5 h-5" />
			Batch Export
			<span
				v-if="selectedIds.size > 0"
				class="px-2 py-0.5 bg-purple-800 rounded-full text-xs"
			>
				{{ selectedIds.size }}
			</span>
		</button>

		<TransitionRoot appear :show="isOpen" as="template">
			<Dialog as="div" class="relative z-50" @close="isOpen = false">
				<div class="fixed inset-0 bg-black/50" />
				<div class="fixed inset-0 overflow-y-auto">
					<div class="flex min-h-full items-center justify-center p-4">
						<DialogPanel
							class="w-full max-w-2xl bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-xl"
						>
							<DialogTitle
								class="text-xl font-semibold text-gray-900 dark:text-white mb-4"
							>
								Batch Export
							</DialogTitle>

							<div class="space-y-4">
								<!-- Select All -->
								<div class="flex items-center justify-between">
									<label class="flex items-center gap-2 cursor-pointer">
										<input
											type="checkbox"
											:checked="selectedIds.size === recordings.length
											&& recordings.length > 0"
											:indeterminate="selectedIds.size > 0
											&& selectedIds.size < recordings.length"
											class="w-4 h-4 text-purple-600 rounded"
											@change="toggleAll"
										/>
										<span class="text-sm text-gray-700 dark:text-gray-300">
											Select All ({{ selectedIds.size }}/{{
												recordings.length
											}})
										</span>
									</label>
								</div>

								<!-- Recordings List -->
								<div class="max-h-64 overflow-y-auto border border-gray-200 dark:border-gray-700 rounded-lg">
									<div
										v-for="recording in recordings"
										:key="recording.id"
										class="flex items-center gap-3 p-3 border-b border-gray-200 dark:border-gray-700 last:border-0 hover:bg-gray-50 dark:hover:bg-gray-700"
									>
										<input
											type="checkbox"
											:checked="selectedIds.has(recording.id)"
											class="w-4 h-4 text-purple-600 rounded"
											@change="toggleSelection(recording.id)"
										/>
										<Icon name="mdi:video" class="w-5 h-5 text-gray-400" />
										<div class="flex-1 min-w-0">
											<p class="text-sm font-medium text-gray-900 dark:text-white truncate">
												{{ recording.name }}
											</p>
											<p class="text-xs text-gray-500">
												{{ formatTime(recording.duration) }} • {{
													formatSize(recording.blob.size)
												}}
											</p>
										</div>
									</div>
								</div>

								<!-- Export Settings -->
								<div class="grid grid-cols-2 gap-3">
									<div>
										<label
											class="text-xs text-gray-600 dark:text-gray-400 block mb-1"
										>Format</label>
										<select
												v-model="format"
												class="w-full px-3 py-2 text-sm bg-gray-50 dark:bg-gray-700 border rounded"
											>
												<option value="mp4">MP4</option>
												<option value="webm">WebM</option>
												<option value="mov">MOV</option>
												<option value="gif">GIF</option>
											</select>
										</div>
									<div>
										<label
											class="text-xs text-gray-600 dark:text-gray-400 block mb-1"
										>Quality</label>
										<select
												v-model="quality"
												class="w-full px-3 py-2 text-sm bg-gray-50 dark:bg-gray-700 border rounded"
											>
												<option value="low">Low</option>
												<option value="medium">Medium</option>
												<option value="high">High</option>
												<option value="ultra">Ultra</option>
											</select>
										</div>
								</div>

								<!-- Actions -->
								<div class="flex justify-end gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
									<button
										class="px-4 py-2 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
										@click="isOpen = false"
									>
										Cancel
									</button>
									<button
										class="px-6 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-medium disabled:opacity-50"
										:disabled="selectedIds.size === 0"
										@click="handleExport"
									>
										Export {{ selectedIds.size }} Recording(s)
									</button>
								</div>
							</div>
						</DialogPanel>
					</div>
				</div>
			</Dialog>
		</TransitionRoot>
	</div>
</template>
