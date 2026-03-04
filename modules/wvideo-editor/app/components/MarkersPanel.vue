<script setup lang="ts">
const emit = defineEmits<{
	close: [];
	addMarker: [marker: Marker];
	deleteMarker: [markerId: string];
	jumpToMarker: [time: number];
}>();

interface Marker {
	id: string;
	time: number;
	label: string;
	color: string;
	type: "chapter" | "marker" | "breakpoint";
}

const markers = ref<Marker[]>([
	{ id: "1", time: 0, label: "Intro", color: "#3b82f6", type: "chapter" },
	{
		id: "2",
		time: 15.5,
		label: "Title Sequence",
		color: "#22c55e",
		type: "chapter",
	},
	{
		id: "3",
		time: 45.0,
		label: "Main Content",
		color: "#f59e0b",
		type: "chapter",
	},
	{
		id: "4",
		time: 120.0,
		label: "Review Audio",
		color: "#ef4444",
		type: "marker",
	},
	{ id: "5", time: 180.0, label: "Outro", color: "#8b5cf6", type: "chapter" },
]);

const newMarkerLabel = ref("");
const newMarkerColor = ref("#3b82f6");
const newMarkerType = ref<"chapter" | "marker">("marker");
const currentTime = ref(30.0);

const colors = [
	{ value: "#3b82f6", label: "Blue" },
	{ value: "#22c55e", label: "Green" },
	{ value: "#f59e0b", label: "Yellow" },
	{ value: "#ef4444", label: "Red" },
	{ value: "#8b5cf6", label: "Purple" },
	{ value: "#ec4899", label: "Pink" },
];

const addMarker = () => {
	if (!newMarkerLabel.value.trim()) return;

	markers.value.push({
		id: Date.now().toString(),
		time: currentTime.value,
		label: newMarkerLabel.value,
		color: newMarkerColor.value,
		type: newMarkerType.value,
	});

	markers.value.sort((a, b) => a.time - b.time);
	newMarkerLabel.value = "";
};

const deleteMarker = (markerId: string) => {
	markers.value = markers.value.filter(m => m.id !== markerId);
	emit("deleteMarker", markerId);
};

const jumpToMarker = (time: number) => {
	currentTime.value = time;
	emit("jumpToMarker", time);
};

const formatTime = (seconds: number) => {
	const mins = Math.floor(seconds / 60);
	const secs = Math.floor(seconds % 60);
	return `${mins}:${secs.toString().padStart(2, "0")}`;
};
</script>

<template>
	<div class="markers-panel bg-white dark:bg-gray-800 rounded-xl p-4 w-[400px] max-h-[80vh] overflow-hidden flex flex-col shadow-lg border border-gray-200 dark:border-gray-700">
		<div class="flex items-center justify-between mb-4">
			<h3 class="text-gray-900 dark:text-white font-semibold flex items-center gap-2">
				<Icon name="mdi:flag" class="w-5 h-5 text-blue-500" />
				Markers & Chapters
			</h3>
			<button
				class="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors"
				@click="emit('close')"
			>
				<Icon name="mdi:close" class="w-5 h-5" />
			</button>
		</div>

		<!-- Add Marker -->
		<div class="mb-4 p-3 bg-gray-50 dark:bg-gray-700/30 rounded-lg">
			<div class="text-gray-700 dark:text-gray-300 text-sm mb-2 font-medium">
				Add Marker at {{ formatTime(currentTime) }}
			</div>
			<input
				v-model="newMarkerLabel"
				type="text"
				placeholder="Marker label"
				class="w-full bg-white dark:bg-gray-700 text-gray-900 dark:text-white px-3 py-2 rounded-lg text-sm mb-2 border-0"
				@keydown.enter="addMarker"
			>
			<div class="flex gap-2 mb-2">
				<select
					v-model="newMarkerType"
					class="flex-1 bg-white dark:bg-gray-700 text-gray-900 dark:text-white px-2 py-1.5 rounded-lg text-sm border-0"
				>
					<option value="marker">Marker</option>
					<option value="chapter">Chapter</option>
				</select>
				<div class="flex gap-1">
					<button
						v-for="color in colors"
						:key="color.value"
						class="w-6 h-6 rounded"
						:style="{ backgroundColor: color.value }"
						:class="newMarkerColor === color.value
						? 'ring-2 ring-gray-400 dark:ring-white'
						: ''"
						@click="newMarkerColor = color.value"
					/>
				</div>
			</div>
			<button
				class="w-full px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-colors"
				:disabled="!newMarkerLabel.trim()"
				@click="addMarker"
			>
				<Icon name="mdi:plus" class="w-4 h-4 inline mr-1" />
				Add Marker
			</button>
		</div>

		<!-- Markers List -->
		<div class="flex-1 overflow-y-auto">
			<div class="text-gray-500 dark:text-gray-400 text-xs mb-2">
				{{ markers.filter(m => m.type === "chapter").length }} chapters, {{
					markers.filter(m => m.type === "marker").length
				}} markers
			</div>
			<div class="space-y-1">
				<div
					v-for="marker in markers"
					:key="marker.id"
					class="flex items-center gap-2 p-2 rounded-lg group transition-colors"
					:class="marker.type === 'chapter'
					? 'bg-gray-100 dark:bg-gray-700/30'
					: 'bg-gray-50 dark:bg-gray-800/30'"
				>
					<div
						class="w-3 h-3 rounded-full"
						:style="{ backgroundColor: marker.color }"
					/>
					<div class="flex-1">
						<div class="flex items-center gap-2">
							<Icon
								:name="marker.type === 'chapter' ? 'mdi:bookmark' : 'mdi:pin'"
								:class="['w-3 h-3']"
								:style="{ color: marker.color }"
							/>
							<span class="text-gray-900 dark:text-white text-sm">{{
								marker.label
							}}</span>
						</div>
						<div class="text-gray-500 dark:text-gray-400 text-xs">
							{{ formatTime(marker.time) }}
						</div>
					</div>
					<button
						class="opacity-0 group-hover:opacity-100 p-1 text-gray-400 hover:text-blue-500 transition-all"
						@click="jumpToMarker(marker.time)"
					>
						<Icon name="mdi:play-circle" class="w-4 h-4" />
					</button>
					<button
						class="opacity-0 group-hover:opacity-100 p-1 text-gray-400 hover:text-red-500 transition-all"
						@click="deleteMarker(marker.id)"
					>
						<Icon name="mdi:delete" class="w-4 h-4" />
					</button>
				</div>
			</div>
		</div>

		<!-- Export Chapters -->
		<div
			v-if="markers.some(m => m.type === 'chapter')"
			class="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700"
		>
			<button class="w-full px-4 py-2 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-900 dark:text-white rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-2">
				<Icon name="mdi:download" class="w-4 h-4" />
				Export YouTube Chapters
			</button>
		</div>
	</div>
</template>
