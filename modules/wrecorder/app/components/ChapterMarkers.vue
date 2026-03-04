<script setup lang="ts">
const props = defineProps<{
	recordingId: string;
}>();

const emit = defineEmits<{
	add: [time: number, label: string];
}>();

const currentTime = ref(0);
const duration = ref(0);
const newMarkerLabel = ref("");
const isAdding = ref(false);

const markers = ref<Array<{ id: string; time: number; label: string }>>([
	{ id: "1", time: 30, label: "Introduction" },
	{ id: "2", time: 120, label: "Main Content" },
	{ id: "3", time: 300, label: "Conclusion" },
]);

const formatTime = (seconds: number): string => {
	const mins = Math.floor(seconds / 60);
	const secs = Math.floor(seconds % 60);
	return `${mins}:${secs.toString().padStart(2, "0")}`;
};

const addMarker = () => {
	if (!newMarkerLabel.value.trim()) return;
	markers.value.push({
		id: crypto.randomUUID(),
		time: currentTime.value,
		label: newMarkerLabel.value,
	});
	markers.value.sort((a, b) => a.time - b.time);
	newMarkerLabel.value = "";
	isAdding.value = false;
	emit("add", currentTime.value, newMarkerLabel.value);
};

const deleteMarker = (id: string) => {
	markers.value = markers.value.filter((m) => m.id !== id);
};

const jumpToMarker = (time: number) => {
	currentTime.value = time;
};

const quickAdd = (label: string) => {
	newMarkerLabel.value = label;
	addMarker();
};

const quickLabels = [
	"Intro",
	"Key Point",
	"Demo",
	"Important",
	"Summary",
	"Q&A",
];
</script>

<template>
	<div class="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-lg">
		<div class="flex items-center justify-between mb-4">
			<h3 class="text-sm font-semibold text-gray-900 dark:text-white">
				Chapter Markers
			</h3>
			<button
				class="p-1.5 rounded-lg bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 hover:bg-purple-200 transition-colors"
				@click="isAdding = !isAdding"
			>
				<Icon :name="isAdding ? 'mdi:close' : 'mdi:plus'" class="w-4 h-4" />
			</button>
		</div>

		<!-- Add Marker Form -->
		<div
			v-if="isAdding"
			class="mb-4 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg space-y-2"
		>
			<div class="flex gap-2">
				<input
					v-model="newMarkerLabel"
					type="text"
					placeholder="Marker label..."
					class="flex-1 px-3 py-1.5 text-sm bg-white dark:bg-gray-600 border rounded"
					@keyup.enter="addMarker"
				/>
				<button
					class="px-3 py-1.5 bg-purple-600 text-white text-sm rounded hover:bg-purple-700 transition-colors"
					@click="addMarker"
				>
					Add
				</button>
			</div>
			<div class="flex flex-wrap gap-1">
				<button
					v-for="label in quickLabels"
					:key="label"
					class="px-2 py-0.5 text-xs bg-white dark:bg-gray-600 hover:bg-gray-100 dark:hover:bg-gray-500 rounded transition-colors"
					@click="quickAdd(label)"
				>
					{{ label }}
				</button>
			</div>
		</div>

		<!-- Markers List -->
		<div class="space-y-1 max-h-48 overflow-y-auto">
			<div
				v-for="(marker, index) in markers"
				:key="marker.id"
				class="flex items-center gap-2 p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 group transition-colors cursor-pointer"
				@click="jumpToMarker(marker.time)"
			>
				<div class="w-6 h-6 rounded-full bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 flex items-center justify-center text-xs font-medium">
					{{ index + 1 }}
				</div>
				<div class="flex-1 min-w-0">
					<p class="text-sm font-medium text-gray-900 dark:text-white truncate">
						{{ marker.label }}
					</p>
					<p class="text-xs text-gray-500">{{ formatTime(marker.time) }}</p>
				</div>
				<button
					class="opacity-0 group-hover:opacity-100 p-1 text-red-500 hover:bg-red-100 dark:hover:bg-red-900/30 rounded transition-all"
					@click.stop="deleteMarker(marker.id)"
				>
					<Icon name="mdi:delete" class="w-4 h-4" />
				</button>
			</div>
		</div>

		<!-- Timeline Preview -->
		<div class="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
			<div class="relative h-8 bg-gray-200 dark:bg-gray-700 rounded-lg overflow-hidden">
				<div
					v-for="marker in markers"
					:key="marker.id"
					class="absolute top-0 bottom-0 w-1 bg-purple-500"
					:style="{ left: `${(marker.time / duration) * 100}%` }"
					tooltip="marker.label"
				/>
				<div
					class="absolute top-0 bottom-0 w-0.5 bg-red-500 z-10"
					:style="{ left: `${(currentTime / duration) * 100}%` }"
				>
					<div class="absolute -top-1 -left-1 w-2 h-2 bg-red-500 rounded-full" />
				</div>
			</div>
		</div>
	</div>
</template>
