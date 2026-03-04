<script setup lang="ts">
const emit = defineEmits<{
	close: [];
	pauseRender: [];
	resumeRender: [];
	cancelRender: [];
}>();

interface RenderJob {
	id: string;
	name: string;
	progress: number;
	status: "queued" | "rendering" | "paused" | "completed";
	startTime: Date;
	estimatedEnd: Date;
	frames: { current: number; total: number };
}

const activeJobs = ref<RenderJob[]>([
	{
		id: "1",
		name: "Project_Master_v1.mp4",
		progress: 45,
		status: "rendering",
		startTime: new Date(),
		estimatedEnd: new Date(Date.now() + 10 * 60 * 1000),
		frames: { current: 1350, total: 3000 },
	},
	{
		id: "2",
		name: "Social_Preview_1080p.mp4",
		progress: 0,
		status: "queued",
		startTime: new Date(),
		estimatedEnd: new Date(Date.now() + 5 * 60 * 1000),
		frames: { current: 0, total: 1500 },
	},
]);

const systemStatus = ref({
	cpu: 75,
	memory: 60,
	disk: 45,
	gpu: 80,
});

const formatTime = (date: Date) => {
	return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
};

const getRemainingTime = (job: RenderJob) => {
	if (job.status === "completed") return "Done";
	if (job.status === "queued") return "Waiting...";

	const elapsed = Date.now() - job.startTime.getTime();
	const total = elapsed / (job.progress / 100);
	const remaining = total - elapsed;

	const mins = Math.floor(remaining / 60000);
	const secs = Math.floor((remaining % 60000) / 1000);
	return `${mins}m ${secs}s`;
};

const pauseJob = (jobId: string) => {
	const job = activeJobs.value.find(j => j.id === jobId);
	if (job) {
		job.status = "paused";
		emit("pauseRender");
	}
};

const resumeJob = (jobId: string) => {
	const job = activeJobs.value.find(j => j.id === jobId);
	if (job) {
		job.status = "rendering";
		emit("resumeRender");
	}
};

const cancelJob = (jobId: string) => {
	activeJobs.value = activeJobs.value.filter(j => j.id !== jobId);
	emit("cancelRender");
};

// Simulate progress
onMounted(() => {
	const interval = setInterval(() => {
		activeJobs.value.forEach(job => {
			if (job.status === "rendering" && job.progress < 100) {
				job.progress = Math.min(100, job.progress + 0.5);
				job.frames.current = Math.floor(
					job.frames.total * (job.progress / 100),
				);
				if (job.progress >= 100) {
					job.status = "completed";
				}
			}
		});

		// Update system stats
		systemStatus.value.cpu = 60 + Math.random() * 30;
		systemStatus.value.memory = 50 + Math.random() * 25;
		systemStatus.value.gpu = 70 + Math.random() * 20;
	}, 1000);

	onUnmounted(() => clearInterval(interval));
});
</script>

<template>
	<div class="background-render-panel bg-white dark:bg-gray-800 rounded-xl p-4 w-[450px] max-h-[80vh] overflow-hidden flex flex-col shadow-lg border border-gray-200 dark:border-gray-700">
		<div class="flex items-center justify-between mb-4">
			<h3 class="text-gray-900 dark:text-white font-semibold flex items-center gap-2">
				<Icon name="mdi:film" class="w-5 h-5 text-blue-500" />
				Background Render
			</h3>
			<button
				class="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors"
				@click="emit('close')"
			>
				<Icon name="mdi:close" class="w-5 h-5" />
			</button>
		</div>

		<!-- System Status -->
		<div class="mb-4 p-3 bg-gray-50 dark:bg-gray-700/30 rounded-lg">
			<div class="text-gray-500 dark:text-gray-400 text-xs mb-2 uppercase font-medium">
				System Resources
			</div>
			<div class="grid grid-cols-4 gap-2 text-center">
				<div>
					<div
						class="text-lg font-bold"
						:class="systemStatus.cpu > 80 ? 'text-red-500' : 'text-blue-500'"
					>
						{{ Math.round(systemStatus.cpu) }}%
					</div>
					<div class="text-gray-500 text-xs">CPU</div>
				</div>
				<div>
					<div
						class="text-lg font-bold"
						:class="systemStatus.memory > 80 ? 'text-red-500' : 'text-purple-500'"
					>
						{{ Math.round(systemStatus.memory) }}%
					</div>
					<div class="text-gray-500 text-xs">RAM</div>
				</div>
				<div>
					<div class="text-lg font-bold text-green-500">
						{{ Math.round(systemStatus.disk) }}%
					</div>
					<div class="text-gray-500 text-xs">Disk</div>
				</div>
				<div>
					<div
						class="text-lg font-bold"
						:class="systemStatus.gpu > 80 ? 'text-red-500' : 'text-yellow-500'"
					>
						{{ Math.round(systemStatus.gpu) }}%
					</div>
					<div class="text-gray-500 text-xs">GPU</div>
				</div>
			</div>
		</div>

		<!-- Active Jobs -->
		<div class="flex-1 overflow-y-auto">
			<div class="text-gray-500 dark:text-gray-400 text-xs mb-2 uppercase font-medium">
				Render Queue ({{ activeJobs.length }})
			</div>
			<div class="space-y-3">
				<div
					v-for="job in activeJobs"
					:key="job.id"
					class="p-3 bg-gray-50 dark:bg-gray-700/30 rounded-lg"
				>
					<div class="flex items-center justify-between mb-2">
						<div class="flex items-center gap-2">
							<Icon
								:name="job.status === 'rendering'
								? 'mdi:loading'
								: job.status === 'paused'
								? 'mdi:pause'
								: job.status === 'completed'
								? 'mdi:check-circle'
								: 'mdi:timer-sand'"
								:class="[
									job.status === 'rendering'
										? 'text-blue-500 animate-spin'
										: job.status === 'paused'
										? 'text-yellow-500'
										: job.status === 'completed'
										? 'text-green-500'
										: 'text-gray-400',
									'w-4 h-4',
								]"
							/>
							<span
								class="text-gray-900 dark:text-white text-sm font-medium truncate"
							>{{ job.name }}</span>
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
								v-else-if="job.status === 'paused'"
								class="p-1 text-gray-400 hover:text-green-500 transition-colors"
								@click="resumeJob(job.id)"
							>
								<Icon name="mdi:play" class="w-4 h-4" />
							</button>
							<button
								class="p-1 text-gray-400 hover:text-red-500 transition-colors"
								@click="cancelJob(job.id)"
							>
								<Icon name="mdi:close" class="w-4 h-4" />
							</button>
						</div>
					</div>

					<!-- Progress -->
					<div v-if="job.status !== 'queued'" class="mb-2">
						<div class="flex items-center justify-between text-xs mb-1">
							<span class="text-gray-500 dark:text-gray-400">{{
									job.progress.toFixed(0)
								}}%</span>
							<span class="text-gray-500 dark:text-gray-400">
								Frame {{ job.frames.current }} / {{ job.frames.total }}
							</span>
						</div>
						<div class="h-2 bg-gray-200 dark:bg-gray-600 rounded-full overflow-hidden">
							<div
								class="h-full bg-blue-500 rounded-full transition-all duration-300"
								:style="{ width: `${job.progress}%` }"
							/>
						</div>
					</div>

					<!-- Time Info -->
					<div class="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
						<span>Started: {{ formatTime(job.startTime) }}</span>
						<span :class="job.status === 'rendering' ? 'text-blue-500' : ''">
							{{ getRemainingTime(job) }}
						</span>
					</div>
				</div>
			</div>
		</div>

		<!-- Info -->
		<div class="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
			<div class="flex items-start gap-2">
				<Icon name="mdi:information" class="w-4 h-4 text-blue-500 mt-0.5" />
				<p class="text-blue-600 dark:text-blue-300 text-xs">
					Background rendering allows you to continue editing while exporting.
					Renders are saved to the project output folder.
				</p>
			</div>
		</div>
	</div>
</template>
