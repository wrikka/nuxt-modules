<script setup lang="ts">
const {
	markers,
	regions,
	currentTime,
	duration,
	addMarker,
	removeMarker,
	addRegion,
	removeRegion,
	formatTime,
} = useAudioEditor();

const markerNameCounter = ref(1);
const regionNameCounter = ref(1);

const handleAddMarker = () => {
	addMarker(`Marker ${markerNameCounter.value}`, currentTime.value);
	markerNameCounter.value++;
};

const handleRemoveMarker = (markerId: string) => {
	removeMarker(markerId);
};

const handleAddRegion = () => {
	const startTime = currentTime.value;
	const endTime = Math.min(startTime + 5, duration.value);
	addRegion(`Region ${regionNameCounter.value}`, startTime, endTime);
	regionNameCounter.value++;
};

const handleRemoveRegion = (regionId: string) => {
	removeRegion(regionId);
};
</script>

<template>
	<div class="bg-gray-900 border-b border-gray-700 px-4 py-3">
		<div class="flex items-center justify-between mb-2">
			<span class="text-gray-400 text-sm font-medium">Markers & Regions</span>
			<div class="flex items-center gap-2">
				<button
					@click="handleAddMarker"
					class="flex items-center gap-1 px-2 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded text-xs transition-colors"
					title="Add Marker"
				>
					<svg
						xmlns="http://www.w3.org/2000/svg"
						class="h-3 w-3"
						fill="none"
						viewBox="0 0 24 24"
						stroke="currentColor"
					>
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M12 4v16m8-8H4"
						/>
					</svg>
					Marker
				</button>
				<button
					@click="handleAddRegion"
					class="flex items-center gap-1 px-2 py-1 bg-green-600 hover:bg-green-700 text-white rounded text-xs transition-colors"
					title="Add Region"
				>
					<svg
						xmlns="http://www.w3.org/2000/svg"
						class="h-3 w-3"
						fill="none"
						viewBox="0 0 24 24"
						stroke="currentColor"
					>
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M12 4v16m8-8H4"
						/>
					</svg>
					Region
				</button>
			</div>
		</div>
		<div class="flex gap-4 overflow-x-auto">
			<div
				v-if="markers.length === 0 && regions.length === 0"
				class="text-gray-500 text-xs"
			>
				No markers or regions
			</div>
			<div
				v-for="marker in markers"
				:key="marker.id"
				class="flex items-center gap-2 bg-gray-800 rounded px-2 py-1 whitespace-nowrap"
			>
				<div
					class="w-2 h-2 rounded-full"
					:style="{ backgroundColor: marker.color }"
				>
				</div>
				<span class="text-white text-xs">{{ marker.name }}</span>
				<span class="text-gray-400 text-xs">{{ formatTime(marker.time) }}</span>
				<button
					@click="handleRemoveMarker(marker.id)"
					class="text-gray-400 hover:text-red-500 transition-colors"
					title="Remove Marker"
				>
					<svg
						xmlns="http://www.w3.org/2000/svg"
						class="h-3 w-3"
						fill="none"
						viewBox="0 0 24 24"
						stroke="currentColor"
					>
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M6 18L18 6M6 6l12 12"
						/>
					</svg>
				</button>
			</div>
			<div
				v-for="region in regions"
				:key="region.id"
				class="flex items-center gap-2 bg-gray-800 rounded px-2 py-1 whitespace-nowrap border-l-2"
				:style="{ borderColor: region.color }"
			>
				<span class="text-white text-xs">{{ region.name }}</span>
				<span class="text-gray-400 text-xs">{{ formatTime(region.startTime) }} -
					{{ formatTime(region.endTime) }}</span>
				<button
					@click="handleRemoveRegion(region.id)"
					class="text-gray-400 hover:text-red-500 transition-colors"
					title="Remove Region"
				>
					<svg
						xmlns="http://www.w3.org/2000/svg"
						class="h-3 w-3"
						fill="none"
						viewBox="0 0 24 24"
						stroke="currentColor"
					>
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M6 18L18 6M6 6l12 12"
						/>
					</svg>
				</button>
			</div>
		</div>
	</div>
</template>
