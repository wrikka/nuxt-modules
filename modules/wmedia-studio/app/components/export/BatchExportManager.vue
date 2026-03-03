<script setup lang="ts">
interface Props {
	isOpen: boolean;
}

const props = defineProps<Props>();
const emit = defineEmits<{
	close: [];
}>();

interface ExportJob {
	id: string;
	name: string;
	format: string;
	resolution: string;
	status: "pending" | "processing" | "completed" | "failed";
	progress: number;
	estimatedTime: string;
}

const exportQueue = ref<ExportJob[]>([
	{
		id: "1",
		name: "Project_Main",
		format: "MP4",
		resolution: "1920x1080",
		status: "processing",
		progress: 65,
		estimatedTime: "2 min",
	},
	{
		id: "2",
		name: "Project_Main_4K",
		format: "MP4",
		resolution: "3840x2160",
		status: "pending",
		progress: 0,
		estimatedTime: "8 min",
	},
	{
		id: "3",
		name: "Project_Social",
		format: "MP4",
		resolution: "1080x1920",
		status: "pending",
		progress: 0,
		estimatedTime: "1 min",
	},
]);

const presets = [
	{
		name: "YouTube 1080p",
		format: "MP4",
		resolution: "1920x1080",
		fps: 30,
		codec: "H.264",
	},
	{
		name: "YouTube 4K",
		format: "MP4",
		resolution: "3840x2160",
		fps: 30,
		codec: "H.264",
	},
	{
		name: "Instagram Reels",
		format: "MP4",
		resolution: "1080x1920",
		fps: 30,
		codec: "H.264",
	},
	{
		name: "TikTok",
		format: "MP4",
		resolution: "1080x1920",
		fps: 60,
		codec: "H.264",
	},
	{
		name: "Twitter/X",
		format: "MP4",
		resolution: "1280x720",
		fps: 30,
		codec: "H.264",
	},
];

const addToQueue = (preset: typeof presets[0]) => {
	const newJob: ExportJob = {
		id: Math.random().toString(36).substr(2, 9),
		name: `Export_${preset.name.replace(/\s+/g, "_")}`,
		format: preset.format,
		resolution: preset.resolution,
		status: "pending",
		progress: 0,
		estimatedTime: "Pending",
	};
	exportQueue.value.push(newJob);
};

const removeJob = (id: string) => {
	exportQueue.value = exportQueue.value.filter(j => j.id !== id);
};

const startQueue = () => {
	exportQueue.value.forEach(job => {
		if (job.status === "pending") {
			job.status = "processing";
		}
	});
};
</script>

<template>
	<ModalDialog
		:is-open="props.isOpen"
		title="Batch Export Manager"
		@close="emit('close')"
	>
		<div class="space-y-6">
			<!-- Queue Status -->
			<div class="bg-gray-100 dark:bg-gray-800 rounded-lg p-4">
				<div class="flex items-center justify-between mb-3">
					<h4 class="font-medium text-gray-900 dark:text-white">
						Export Queue ({{ exportQueue.length }})
					</h4>
					<button
						class="text-sm text-blue-500 hover:text-blue-600"
						@click="startQueue"
					>
						<Icon name="mdi:play" class="w-4 h-4 inline mr-1" />
						Start All
					</button>
				</div>
				<div class="space-y-2 max-h-48 overflow-y-auto">
					<div
						v-for="job in exportQueue"
						:key="job.id"
						class="flex items-center gap-3 p-3 bg-white dark:bg-gray-700 rounded-lg"
					>
						<div
							class="w-10 h-10 rounded-lg flex items-center justify-center"
							:class="{
								'bg-yellow-100 dark:bg-yellow-900/30': job.status === 'pending',
								'bg-blue-100 dark:bg-blue-900/30': job.status === 'processing',
								'bg-green-100 dark:bg-green-900/30': job.status === 'completed',
							}"
						>
							<Icon
								:name="job.status === 'processing'
								? 'mdi:loading'
								: job.status === 'completed'
								? 'mdi:check'
								: 'mdi:clock'"
								class="w-5 h-5"
								:class="{
									'text-yellow-600': job.status === 'pending',
									'text-blue-600 animate-spin': job.status === 'processing',
									'text-green-600': job.status === 'completed',
								}"
							/>
						</div>
						<div class="flex-1 min-w-0">
							<p class="text-sm font-medium text-gray-900 dark:text-white truncate">
								{{ job.name }}
							</p>
							<p class="text-xs text-gray-500">
								{{ job.format }} • {{ job.resolution }} • {{
									job.estimatedTime
								}}
							</p>
						</div>
						<div v-if="job.status === 'processing'" class="w-20">
							<div class="h-2 bg-gray-200 rounded-full overflow-hidden">
								<div
									class="h-full bg-blue-500 rounded-full"
									:style="{ width: `${job.progress}%` }"
								/>
							</div>
							<span class="text-xs text-gray-500">{{ job.progress }}%</span>
						</div>
						<button
							class="text-gray-400 hover:text-red-500"
							@click="removeJob(job.id)"
						>
							<Icon name="mdi:close" class="w-4 h-4" />
						</button>
					</div>
				</div>
			</div>

			<!-- Presets -->
			<div>
				<h4 class="font-medium text-gray-900 dark:text-white mb-3">
					Quick Add Presets
				</h4>
				<div class="grid grid-cols-2 gap-3">
					<button
						v-for="preset in presets"
						:key="preset.name"
						class="p-3 text-left rounded-lg border border-gray-200 dark:border-gray-700 hover:border-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors"
						@click="addToQueue(preset)"
					>
						<div class="flex items-center justify-between">
							<span class="font-medium text-gray-900 dark:text-white text-sm">{{
								preset.name
							}}</span>
							<Icon name="mdi:plus" class="w-4 h-4 text-blue-500" />
						</div>
						<p class="text-xs text-gray-500 mt-1">
							{{ preset.resolution }} @ {{ preset.fps }}fps
						</p>
					</button>
				</div>
			</div>
		</div>
	</ModalDialog>
</template>
