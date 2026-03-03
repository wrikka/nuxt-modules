<script setup lang="ts">
const emit = defineEmits<{
	close: [];
	startExport: [jobs: ExportJob[]];
}>();

interface ExportJob {
	id: string;
	name: string;
	format: "mp4" | "mov" | "webm";
	resolution: "1080p" | "4k" | "720p";
	status: "queued" | "rendering" | "completed" | "failed";
	progress: number;
	estimatedTime: string;
}

const jobs = ref<ExportJob[]>([
	{
		id: "1",
		name: "Master_Export_v1",
		format: "mp4",
		resolution: "1080p",
		status: "rendering",
		progress: 45,
		estimatedTime: "2:30 remaining",
	},
	{
		id: "2",
		name: "Social_Square",
		format: "mp4",
		resolution: "1080p",
		status: "queued",
		progress: 0,
		estimatedTime: "Pending",
	},
	{
		id: "3",
		name: "Draft_Preview",
		format: "webm",
		resolution: "720p",
		status: "completed",
		progress: 100,
		estimatedTime: "Done",
	},
]);

const newJobName = ref("");
const newJobFormat = ref<"mp4" | "mov" | "webm">("mp4");
const newJobResolution = ref<"1080p" | "4k" | "720p">("1080p");

const addJob = () => {
	if (!newJobName.value) return;

	jobs.value.push({
		id: Date.now().toString(),
		name: newJobName.value,
		format: newJobFormat.value,
		resolution: newJobResolution.value,
		status: "queued",
		progress: 0,
		estimatedTime: "Pending",
	});

	newJobName.value = "";
};

const removeJob = (jobId: string) => {
	jobs.value = jobs.value.filter(j => j.id !== jobId);
};

const pauseJob = (jobId: string) => {
	const job = jobs.value.find(j => j.id === jobId);
	if (job) {
		job.status = "queued";
	}
};

const resumeJob = (jobId: string) => {
	const job = jobs.value.find(j => j.id === jobId);
	if (job) {
		job.status = "rendering";
	}
};

const startAll = () => {
	emit("startExport", jobs.value.filter(j => j.status === "queued"));
	jobs.value.forEach(job => {
		if (job.status === "queued") {
			job.status = "rendering";
		}
	});
};

const getStatusIcon = (status: ExportJob["status"]): string => {
	const icons: Record<string, string> = {
		queued: "i-ph-hourglass",
		rendering: "i-ph-spinner",
		completed: "i-ph-check-circle",
		failed: "i-ph-x-circle",
	};
	return icons[status] ?? "i-ph-question";
};

const getStatusColor = (status: ExportJob["status"]) => {
	const colors: Record<string, string> = {
		queued: "text-gray-400",
		rendering: "text-blue-400",
		completed: "text-green-400",
		failed: "text-red-400",
	};
	return colors[status];
};
</script>

<template>
	<div class="batch-export-panel bg-white dark:bg-gray-800 rounded-xl p-4 w-[500px] max-h-[80vh] overflow-hidden flex flex-col shadow-lg border border-gray-200 dark:border-gray-700">
		<div class="flex items-center justify-between mb-4">
			<h3 class="text-gray-900 dark:text-white font-semibold flex items-center gap-2">
				<Icon name="mdi:layers" class="w-5 h-5 text-blue-500" />
				Batch Export Queue
			</h3>
			<button
				class="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors"
				@click="emit('close')"
			>
				<Icon name="mdi:close" class="w-5 h-5" />
			</button>
		</div>

		<!-- Add New Job -->
		<div class="mb-4 p-3 bg-gray-50 dark:bg-gray-700/30 rounded-lg">
			<div class="text-gray-700 dark:text-gray-300 text-sm mb-2 font-medium">
				Add Export Job
			</div>
			<div class="space-y-2">
				<input
					v-model="newJobName"
					type="text"
					placeholder="Job name"
					class="w-full bg-white dark:bg-gray-700 text-gray-900 dark:text-white px-3 py-2 rounded-lg text-sm border-0"
				>
				<div class="flex gap-2">
					<select
						v-model="newJobFormat"
						class="flex-1 bg-white dark:bg-gray-700 text-gray-900 dark:text-white px-3 py-2 rounded-lg text-sm border-0"
					>
						<option value="mp4">MP4 (H.264)</option>
						<option value="mov">MOV (ProRes)</option>
						<option value="webm">WebM</option>
					</select>
					<select
						v-model="newJobResolution"
						class="flex-1 bg-white dark:bg-gray-700 text-gray-900 dark:text-white px-3 py-2 rounded-lg text-sm border-0"
					>
						<option value="4k">4K UHD</option>
						<option value="1080p">1080p HD</option>
						<option value="720p">720p</option>
					</select>
				</div>
				<button
					class="w-full px-3 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-200 dark:disabled:bg-gray-700 disabled:text-gray-400 text-white rounded-lg text-sm font-medium transition-colors"
					:disabled="!newJobName"
					@click="addJob"
				>
					Add to Queue
				</button>
			</div>
		</div>

		<!-- Queue List -->
		<div class="flex-1 overflow-y-auto mb-4">
			<div class="flex items-center justify-between mb-2">
				<span class="text-gray-700 dark:text-gray-300 text-sm">
					Queue ({{ jobs.filter(j => j.status !== "completed").length }} active)
				</span>
				<button
					class="text-xs px-2 py-1 bg-green-100 dark:bg-green-900/30 hover:bg-green-200 dark:hover:bg-green-900/50 text-green-600 dark:text-green-400 rounded transition-colors"
					@click="startAll"
				>
					Start All
				</button>
			</div>

			<div class="space-y-2">
				<div
					v-for="job in jobs"
					:key="job.id"
					class="p-3 bg-gray-50 dark:bg-gray-700/30 rounded-lg"
				>
					<div class="flex items-center justify-between mb-2">
						<div class="flex items-center gap-2">
							<span
								:class="[
									getStatusIcon(job.status),
									getStatusColor(job.status),
									'w-4 h-4',
									job.status === 'rendering' && 'animate-spin',
								]"
							/>
							<span class="text-gray-900 dark:text-white text-sm font-medium">{{
								job.name
							}}</span>
						</div>
						<div class="flex items-center gap-1">
							<button
								v-if="job.status === 'rendering'"
								class="p-1 text-gray-400 hover:text-yellow-500 transition-colors"
								@click="pauseJob(job.id)"
							>
								<Icon name="mdi:pause" class="w-4 h-4" />
							</button>
							<button
								v-if="job.status === 'queued'"
								class="p-1 text-gray-400 hover:text-green-500 transition-colors"
								@click="resumeJob(job.id)"
							>
								<Icon name="mdi:play" class="w-4 h-4" />
							</button>
							<button
								class="p-1 text-gray-400 hover:text-red-500 transition-colors"
								@click="removeJob(job.id)"
							>
								<Icon name="mdi:delete" class="w-4 h-4" />
							</button>
						</div>
					</div>

					<div class="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400 mb-2">
						<span class="px-1.5 py-0.5 bg-gray-200 dark:bg-gray-600 rounded">{{
							job.format.toUpperCase()
						}}</span>
						<span class="px-1.5 py-0.5 bg-gray-200 dark:bg-gray-600 rounded">{{
							job.resolution
						}}</span>
						<span class="ml-auto">{{ job.estimatedTime }}</span>
					</div>

					<!-- Progress Bar -->
					<div
						v-if="job.status === 'rendering'"
						class="h-1.5 bg-gray-200 dark:bg-gray-600 rounded-full overflow-hidden"
					>
						<div
							class="h-full bg-blue-500 rounded-full transition-all duration-300"
							:style="{ width: `${job.progress}%` }"
						/>
					</div>
				</div>
			</div>
		</div>

		<!-- Stats -->
		<div class="p-3 bg-gray-100 dark:bg-gray-700/30 rounded-lg text-xs">
			<div class="flex justify-between text-gray-500 dark:text-gray-400">
				<span>Total Jobs: {{ jobs.length }}</span>
				<span>Completed: {{
						jobs.filter(j => j.status === "completed").length
					}}</span>
			</div>
		</div>
	</div>
</template>
