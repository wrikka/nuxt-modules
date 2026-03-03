<script setup lang="ts">
import type { ExportOptions, ProjectExport } from "#shared/types/project";
import { ref } from "vue";

const props = defineProps<{
	projectId: string;
	loading?: boolean;
	recentExports?: ProjectExport[];
}>();

const emit = defineEmits<{
	export: [options: ExportOptions];
	cancel: [];
}>();

const exportOptions = ref<ExportOptions>({
	format: "png",
	quality: 90,
	scale: 1,
	transparent: false,
	width: 1920,
	height: 1080,
});

const handleExport = () => {
	emit("export", exportOptions.value);
};

const getFormatIcon = (format: string) => {
	const icons: Record<string, string> = {
		json: "i-mdi-code-json",
		pdf: "i-mdi-file-pdf-box",
		png: "i-mdi-image",
		mp4: "i-mdi-video",
		wav: "i-mdi-music",
		mp3: "i-mdi-music",
	};
	return icons[format] || "i-mdi-file";
};

const getStatusClass = (status: string) => {
	const classes: Record<string, string> = {
		pending:
			"bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400",
		processing:
			"bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
		completed:
			"bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
		failed: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
	};
	return classes[status] || "";
};

const formatDate = (date: Date) => {
	return new Intl.DateTimeFormat("en-US", {
		month: "short",
		day: "numeric",
		year: "numeric",
		hour: "2-digit",
		minute: "2-digit",
	}).format(new Date(date));
};
</script>

<template>
	<div class="project-export space-y-6">
		<div>
			<h3 class="text-lg font-semibold text-gray-900 dark:text-white">
				Export Project
			</h3>
			<p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
				Choose export format and options
			</p>
		</div>

		<div>
			<label
				for="format"
				class="block text-sm font-medium text-gray-700 dark:text-gray-300"
			>Format</label>
			<select
				id="format"
				v-model="exportOptions.format"
				class="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
			>
				<option value="json">JSON (Project Data)</option>
				<option value="pdf">PDF Document</option>
				<option value="png">PNG Image</option>
				<option value="mp4">MP4 Video</option>
				<option value="wav">WAV Audio</option>
				<option value="mp3">MP3 Audio</option>
			</select>
		</div>

		<div
			v-if="exportOptions.format === 'png' || exportOptions.format === 'pdf'"
			class="space-y-4"
		>
			<div>
				<label
					for="quality"
					class="block text-sm font-medium text-gray-700 dark:text-gray-300"
				>Quality</label>
				<input
					id="quality"
					v-model.number="exportOptions.quality"
					type="range"
					min="1"
					max="100"
					class="mt-1 w-full"
				/>
				<div class="text-sm text-gray-500 dark:text-gray-400">
					{{ exportOptions.quality }}%
				</div>
			</div>
			<div>
				<label
					for="scale"
					class="block text-sm font-medium text-gray-700 dark:text-gray-300"
				>Scale</label>
				<input
					id="scale"
					v-model.number="exportOptions.scale"
					type="number"
					min="0.1"
					step="0.1"
					class="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
				/>
			</div>
			<div class="flex items-center">
				<input
					id="transparent"
					v-model="exportOptions.transparent"
					type="checkbox"
					class="rounded border-gray-300 text-blue-600 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700"
				/>
				<label
					for="transparent"
					class="ml-2 text-sm text-gray-700 dark:text-gray-300"
				>Transparent Background</label>
			</div>
		</div>

		<div v-if="exportOptions.format === 'mp4'" class="space-y-4">
			<div>
				<label
					for="videoWidth"
					class="block text-sm font-medium text-gray-700 dark:text-gray-300"
				>Width</label>
				<input
					id="videoWidth"
					v-model.number="exportOptions.width"
					type="number"
					min="100"
					class="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
				/>
			</div>
			<div>
				<label
					for="videoHeight"
					class="block text-sm font-medium text-gray-700 dark:text-gray-300"
				>Height</label>
				<input
					id="videoHeight"
					v-model.number="exportOptions.height"
					type="number"
					min="100"
					class="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
				/>
			</div>
		</div>

		<div>
			<h4 class="text-base font-medium text-gray-900 dark:text-white">
				Recent Exports
			</h4>
			<div
				v-if="recentExports && recentExports.length > 0"
				class="mt-3 space-y-2"
			>
				<div
					v-for="exp in recentExports"
					:key="exp.id"
					class="flex items-center justify-between rounded-md border border-gray-200 p-3 dark:border-gray-700"
				>
					<div class="flex items-center gap-3">
						<i
							:class="getFormatIcon(exp.format)"
							class="text-2xl text-gray-500"
						/>
						<div>
							<p class="text-sm font-medium text-gray-900 dark:text-white">
								{{ exp.format.toUpperCase() }}
							</p>
							<p class="text-xs text-gray-500 dark:text-gray-400">
								{{ formatDate(exp.createdAt) }}
							</p>
						</div>
					</div>
					<div class="flex items-center gap-2">
						<span
							class="px-2 py-0.5 rounded-full text-xs"
							:class="getStatusClass(exp.status)"
						>{{ exp.status }}</span>
						<a
							v-if="exp.url"
							:href="exp.url"
							download
							class="p-1 text-blue-500 hover:bg-blue-50 rounded"
						>
							<i class="i-mdi-download" />
						</a>
					</div>
				</div>
			</div>
			<div v-else class="mt-3 text-sm text-gray-500 dark:text-gray-400">
				No recent exports
			</div>
		</div>

		<div class="flex justify-end gap-3">
			<button
				type="button"
				@click="$emit('cancel')"
				class="rounded-md border border-gray-300 px-4 py-2 text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700"
			>
				Cancel
			</button>
			<button
				type="button"
				@click="handleExport"
				:disabled="loading"
				class="rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 disabled:opacity-50 disabled:hover:bg-blue-600"
			>
				<i v-if="loading" class="i-mdi-loading animate-spin mr-2" />
				{{ loading ? "Exporting..." : "Export" }}
			</button>
		</div>
	</div>
</template>
