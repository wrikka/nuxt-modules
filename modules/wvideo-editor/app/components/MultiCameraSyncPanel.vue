<script setup lang="ts">
interface Camera {
	id: string;
	name: string;
	thumbnail: string;
	duration: number;
}

interface Props {
	cameras: Camera[];
}

interface Emits {
	close: [];
	sync: [cameraIds: string[]];
}

const props = defineProps<Props>();
const emit = defineEmits<Emits>();

const selectedCameras = ref<string[]>([]);
const syncMethod = ref<"audio" | "timecode" | "manual">("audio");
const isSyncing = ref(false);
const syncProgress = ref(0);

const toggleCamera = (cameraId: string) => {
	const index = selectedCameras.value.indexOf(cameraId);
	if (index > -1) {
		selectedCameras.value.splice(index, 1);
	} else {
		selectedCameras.value.push(cameraId);
	}
};

const handleSync = async () => {
	if (selectedCameras.value.length < 2) return;

	isSyncing.value = true;
	syncProgress.value = 0;

	// Simulate sync progress
	const interval = setInterval(() => {
		syncProgress.value += 10;
		if (syncProgress.value >= 100) {
			clearInterval(interval);
			isSyncing.value = false;
			emit("sync", selectedCameras.value);
		}
	}, 200);
};

const formatDuration = (seconds: number) => {
	const mins = Math.floor(seconds / 60);
	const secs = Math.floor(seconds % 60);
	return `${mins}:${secs.toString().padStart(2, "0")}`;
};
</script>

<template>
	<div class="multicam-panel bg-white dark:bg-gray-800 rounded-xl p-4 w-[500px] max-h-[80vh] overflow-hidden flex flex-col shadow-lg border border-gray-200 dark:border-gray-700">
		<div class="flex items-center justify-between mb-4">
			<h3 class="text-gray-900 dark:text-white font-semibold flex items-center gap-2">
				<Icon name="mdi:video" class="w-5 h-5 text-blue-500" />
				Multi-Camera Sync
			</h3>
			<button
				class="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors"
				@click="emit('close')"
			>
				<Icon name="mdi:close" class="w-5 h-5" />
			</button>
		</div>

		<!-- Sync Method -->
		<div class="mb-4 p-3 bg-gray-50 dark:bg-gray-700/30 rounded-lg">
			<div class="text-gray-700 dark:text-gray-300 text-sm mb-2 font-medium">
				Sync Method
			</div>
			<div class="flex gap-2">
				<button
					v-for='method in [
						{ id: "audio", label: "Audio Waveform", icon: "mdi:waveform" },
						{ id: "timecode", label: "Timecode", icon: "mdi:clock" },
						{ id: "manual", label: "Manual", icon: "mdi:hand-front-right" },
					]'
					:key="method.id"
					class="flex-1 flex flex-col items-center gap-1 px-3 py-2 rounded-lg transition-colors"
					:class="syncMethod === method.id
					? 'bg-blue-600 text-white'
					: 'bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600'"
					@click="syncMethod = method.id as any"
				>
					<span :class="[method.icon, 'w-5 h-5']" />
					<span class="text-xs">{{ method.label }}</span>
				</button>
			</div>
		</div>

		<!-- Camera List -->
		<div class="flex-1 overflow-y-auto space-y-2 mb-4">
			<div class="text-gray-700 dark:text-gray-300 text-sm mb-2 font-medium">
				Select Cameras ({{ selectedCameras.length }} selected)
			</div>
			<div
				v-for="camera in cameras"
				:key="camera.id"
				class="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-700/30 rounded-lg cursor-pointer transition-colors hover:bg-gray-100 dark:hover:bg-gray-700"
				:class="selectedCameras.includes(camera.id) ? 'ring-2 ring-blue-500' : ''"
				@click="toggleCamera(camera.id)"
			>
				<div
					class="w-5 h-5 rounded border-2 flex items-center justify-center transition-colors"
					:class="selectedCameras.includes(camera.id)
					? 'bg-blue-500 border-blue-500'
					: 'border-gray-300 dark:border-gray-500'"
				>
					<Icon
						v-if="selectedCameras.includes(camera.id)"
						name="mdi:check"
						class="w-3 h-3 text-white"
					/>
				</div>
				<img
					:src="camera.thumbnail"
					class="w-16 h-12 object-cover rounded"
					:alt="camera.name"
				>
				<div class="flex-1">
					<div class="text-gray-900 dark:text-white text-sm font-medium">
						{{ camera.name }}
					</div>
					<div class="text-gray-500 dark:text-gray-400 text-xs">
						Duration: {{ formatDuration(camera.duration) }}
					</div>
				</div>
			</div>
		</div>

		<!-- Sync Progress -->
		<div v-if="isSyncing" class="mb-4">
			<div class="flex items-center justify-between text-sm mb-2">
				<span class="text-gray-700 dark:text-gray-300">Syncing cameras...</span>
				<span class="text-blue-500">{{ syncProgress }}%</span>
			</div>
			<div class="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
				<div
					class="h-full bg-blue-500 rounded-full transition-all duration-200"
					:style="{ width: `${syncProgress}%` }"
				/>
			</div>
		</div>

		<!-- Footer -->
		<div class="pt-4 border-t border-gray-200 dark:border-gray-700">
			<button
				class="w-full px-4 py-2 rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
				:class="selectedCameras.length >= 2 && !isSyncing
				? 'bg-blue-600 hover:bg-blue-700 text-white'
				: 'bg-gray-200 dark:bg-gray-700 text-gray-400 cursor-not-allowed'"
				:disabled="selectedCameras.length < 2 || isSyncing"
				@click="handleSync"
			>
				<Icon v-if="!isSyncing" name="mdi:source-branch" class="w-4 h-4" />
				<Icon v-else name="mdi:loading" class="w-4 h-4 animate-spin" />
				{{ isSyncing ? "Syncing..." : "Sync Selected Cameras" }}
			</button>
		</div>
	</div>
</template>
