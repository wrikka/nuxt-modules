<script setup lang="ts">
const emit = defineEmits<{ close: []; startExport: [jobId: string] }>();
const queue = ref([
	{ id: "1", name: "Project_A.mp4", status: "rendering", progress: 45 },
	{ id: "2", name: "Project_B.mov", status: "queued", progress: 0 },
	{ id: "3", name: "Project_C.gif", status: "completed", progress: 100 },
]);
const isProcessing = ref(true);
setInterval(() => {
	const job = queue.value.find(j => j.status === "rendering");
	if (job) {
		job.progress += 2;
		if (job.progress >= 100) {
			job.status = "completed";
			const next = queue.value.find(j => j.status === "queued");
			if (next) next.status = "rendering";
		}
	}
}, 1000);
const cancelJob = (id: string) => {
	queue.value = queue.value.filter(j => j.id !== id);
};
</script>
<template>
	<div class="export-queue bg-gray-800 rounded-lg p-4 w-[500px] max-h-[80vh] flex flex-col">
		<div class="flex items-center justify-between mb-4">
			<h3 class="text-white font-semibold flex items-center gap-2">
				<Icon name="i-ph-queue" class="w-5 h-5" />Export Queue
			</h3>
			<button class="text-gray-400 hover:text-white" @click="emit('close')">
				<Icon name="i-ph-x" class="w-4 h-4" />
			</button>
		</div>
		<div class="flex-1 overflow-y-auto space-y-3">
			<div
				v-for="job in queue"
				:key="job.id"
				class="p-3 bg-gray-700/50 rounded-lg"
			>
				<div class="flex items-center justify-between mb-2">
					<span class="text-white text-sm">{{ job.name }}</span>
					<button
						class="text-gray-400 hover:text-red-400"
						@click="cancelJob(job.id)"
					>
						<Icon name="i-ph-x" class="w-4 h-4" />
					</button>
				</div>
				<div class="flex items-center gap-2">
					<div class="flex-1 h-2 bg-gray-600 rounded-full">
						<div
							class="h-full rounded-full transition-all"
							:class="job.status === 'completed' ? 'bg-green-500' : 'bg-blue-500'"
							:style="{ width: `${job.progress}%` }"
						/>
					</div><span
						class="text-xs w-12 text-right"
						:class="job.status === 'completed' ? 'text-green-400' : 'text-blue-400'"
					>{{
						job.status === "completed"
						? "Done"
						: `${job.progress.toFixed(0)}%`
					}}</span>
				</div>
			</div>
		</div>
		<div class="mt-4 p-3 bg-gray-700/30 rounded-lg">
			<div class="flex items-center justify-between text-sm">
				<span class="text-gray-400">{{
						queue.filter(j => j.status === "completed").length
					}} completed</span><span class="text-gray-400">{{
						queue.filter(j => j.status !== "completed").length
					}} pending</span>
			</div>
		</div>
	</div>
</template>
