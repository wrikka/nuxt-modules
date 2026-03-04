<script setup lang="ts">
import type { Recording, RecordingExportOptions } from "~/types";

const props = defineProps<{
	recordings?: Recording[];
}>();

const editor = useVideoEditor();

// Initialize recordings if provided
onMounted(() => {
	if (props.recordings?.length) {
		props.recordings.forEach((r) => editor.addRecording(r));
	} else {
		editor.loadAllRecordings();
	}
});

const handleExport = async (recording: Recording, options: RecordingExportOptions) => {
	await editor.handleExport(recording, options);
};

const handleTrimSave = async (blob: Blob, name: string) => {
	await editor.handleTrimSave(blob, name);
};

const formatFileSize = (bytes: number): string => {
	if (bytes === 0) return "0 B";
	const k = 1024;
	const sizes = ["B", "KB", "MB", "GB"];
	const i = Math.floor(Math.log(bytes) / Math.log(k));
	return `${parseFloat((bytes / k ** i).toFixed(2))} ${sizes[i]}`;
};

const formatTime = (seconds: number): string => {
	const mins = Math.floor(seconds / 60);
	const secs = Math.floor(seconds % 60);
	return `${mins}:${secs.toString().padStart(2, "0")}`;
};
</script>

<template>
	<div class="wvideo-editor space-y-6">
		<!-- Header -->
		<div class="flex items-center justify-between">
			<div>
				<h2 class="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
					<Icon name="mdi:film-edit" class="w-7 h-7 text-purple-500" />
					Video Editor
				</h2>
				<p class="text-gray-500 dark:text-gray-400 text-sm mt-1">
					Trim, export, and manage your recordings
				</p>
			</div>

			<!-- Stats -->
			<div class="flex items-center gap-4 text-sm">
				<div class="px-3 py-1.5 bg-gray-100 dark:bg-gray-800 rounded-lg">
					<span class="text-gray-500 dark:text-gray-400">Total: </span>
					<span class="font-medium text-gray-900 dark:text-white">{{ editor.recordings.value.length }}</span>
				</div>
				<div class="px-3 py-1.5 bg-gray-100 dark:bg-gray-800 rounded-lg">
					<span class="text-gray-500 dark:text-gray-400">Size: </span>
					<span class="font-medium text-gray-900 dark:text-white">
						{{ formatFileSize(editor.recordings.value.reduce((acc, r) => acc + r.blob.size, 0)) }}
					</span>
				</div>
				<div class="px-3 py-1.5 bg-gray-100 dark:bg-gray-800 rounded-lg">
					<span class="text-gray-500 dark:text-gray-400">Duration: </span>
					<span class="font-medium text-gray-900 dark:text-white">
						{{ formatTime(editor.recordings.value.reduce((acc, r) => acc + r.duration, 0)) }}
					</span>
				</div>
			</div>
		</div>

		<!-- Main Content -->
		<div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
			<!-- Recordings List -->
			<div class="lg:col-span-2">
				<VideoRecordingsList
					:recordings="editor.recordings.value"
					@preview="editor.previewRecording"
					@edit="editor.openTrimEditor"
					@export="editor.openExportDialog"
					@delete="editor.deleteRecording"
				/>
			</div>

			<!-- Sidebar -->
			<div class="lg:col-span-1 space-y-4">
				<!-- Batch Export -->
				<VideoBatchExport
					:recordings="editor.recordings.value"
					@export="console.log"
				/>

				<!-- Quick Actions -->
				<div class="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4">
					<h4 class="font-medium text-gray-900 dark:text-white mb-3">Quick Actions</h4>
					<div class="space-y-2">
						<button
							class="w-full flex items-center gap-2 px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
							@click="editor.loadAllRecordings"
						>
							<Icon name="mdi:refresh" class="w-4 h-4" />
							Refresh
						</button>
						<button
							class="w-full flex items-center gap-2 px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
							@click="editor.recordings.value.forEach(r => editor.downloadRecording(r))"
							:disabled="editor.recordings.value.length === 0"
						>
							<Icon name="mdi:download" class="w-4 h-4" />
							Download All
						</button>
						<button
							class="w-full flex items-center gap-2 px-3 py-2 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
							@click="editor.recordings.value.forEach(r => editor.deleteRecording(r))"
							:disabled="editor.recordings.value.length === 0"
						>
							<Icon name="mdi:delete-sweep" class="w-4 h-4" />
							Clear All
						</button>
					</div>
				</div>
			</div>
		</div>

		<!-- Trim Editor Dialog -->
		<VideoTrimEditor
			v-if="editor.selectedRecording.value"
			:recording="editor.selectedRecording.value"
			:is-open="editor.showTrimEditor.value"
			@close="editor.showTrimEditor.value = false"
			@save="handleTrimSave"
		/>

		<!-- Export Dialog -->
		<VideoExportDialog
			v-if="editor.selectedRecording.value"
			:recording="editor.selectedRecording.value"
			:is-open="editor.showExportDialog.value"
			@close="editor.showExportDialog.value = false"
			@export="handleExport(editor.selectedRecording.value!, $event)"
		/>
	</div>
</template>
