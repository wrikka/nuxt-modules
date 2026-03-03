<script setup lang="ts">
const emit = defineEmits<{
	close: [];
	startTracking: [region: TrackingRegion];
	stopTracking: [];
}>();

interface TrackingRegion {
	x: number;
	y: number;
	width: number;
	height: number;
}

const isTracking = ref(false);
const trackingRegion = ref<TrackingRegion>({
	x: 50,
	y: 50,
	width: 100,
	height: 100,
});
const selectedObject = ref<string | null>(null);
const trackingPoints = ref<Array<{ x: number; y: number }>>([]);

const objects = ref([
	{ id: "1", name: "Face", confidence: 98 },
	{ id: "2", name: "Car", confidence: 95 },
	{ id: "3", name: "Object", confidence: 87 },
]);

const startTracking = () => {
	isTracking.value = true;
	emit("startTracking", trackingRegion.value);

	// Simulate tracking points
	let frame = 0;
	const interval = setInterval(() => {
		if (!isTracking.value) {
			clearInterval(interval);
			return;
		}
		frame++;
		trackingPoints.value.push({
			x: trackingRegion.value.x + Math.sin(frame * 0.1) * 10,
			y: trackingRegion.value.y + Math.cos(frame * 0.1) * 5,
		});
		if (trackingPoints.value.length > 50) {
			trackingPoints.value.shift();
		}
	}, 100);
};

const stopTracking = () => {
	isTracking.value = false;
	trackingPoints.value = [];
	emit("stopTracking");
};
</script>

<template>
	<div class="motion-tracking-panel bg-white dark:bg-gray-800 rounded-xl p-4 w-[380px] flex flex-col shadow-lg border border-gray-200 dark:border-gray-700">
		<div class="flex items-center justify-between mb-4">
			<h3 class="text-gray-900 dark:text-white font-semibold flex items-center gap-2">
				<Icon name="mdi:target" class="w-5 h-5 text-blue-500" />
				Motion Tracking
			</h3>
			<button
				class="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors"
				@click="emit('close')"
			>
				<Icon name="mdi:close" class="w-5 h-5" />
			</button>
		</div>

		<!-- Tracking Status -->
		<div
			class="mb-4 p-3 rounded-lg flex items-center justify-between"
			:class="isTracking
			? 'bg-green-50 dark:bg-green-900/30 border border-green-200 dark:border-green-600/50'
			: 'bg-gray-50 dark:bg-gray-700/30'"
		>
			<div class="flex items-center gap-2">
				<div
					class="w-3 h-3 rounded-full"
					:class="isTracking ? 'bg-green-500 animate-pulse' : 'bg-gray-400'"
				/>
				<span
					class="text-sm"
					:class="isTracking
					? 'text-green-600 dark:text-green-400'
					: 'text-gray-500 dark:text-gray-400'"
				>
					{{ isTracking ? "Tracking Active" : "Not Tracking" }}
				</span>
			</div>
			<button
				class="px-3 py-1 rounded text-sm font-medium transition-colors"
				:class="isTracking
				? 'bg-red-500 hover:bg-red-600 text-white'
				: 'bg-blue-500 hover:bg-blue-600 text-white'"
				@click="isTracking ? stopTracking() : startTracking()"
			>
				{{ isTracking ? "Stop" : "Start" }}
			</button>
		</div>

		<!-- Detected Objects -->
		<div class="mb-4">
			<label
				class="text-gray-700 dark:text-gray-300 text-sm mb-2 block font-medium"
			>Detected Objects</label>
			<div class="space-y-1">
				<button
					v-for="obj in objects"
					:key="obj.id"
					class="w-full flex items-center justify-between p-2 rounded-lg transition-colors"
					:class="selectedObject === obj.id
					? 'bg-blue-100 dark:bg-blue-900/30 ring-1 ring-blue-500'
					: 'bg-gray-50 dark:bg-gray-700/30 hover:bg-gray-100 dark:hover:bg-gray-700'"
					@click="selectedObject = obj.id"
				>
					<div class="flex items-center gap-2">
						<Icon
							name="mdi:selection"
							class="w-4 h-4 text-gray-500 dark:text-gray-400"
						/>
						<span class="text-gray-900 dark:text-white text-sm">{{
							obj.name
						}}</span>
					</div>
					<span
						class="text-xs px-2 py-0.5 rounded-full"
						:class="obj.confidence > 90
						? 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400'
						: 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-600 dark:text-yellow-400'"
					>
						{{ obj.confidence }}%
					</span>
				</button>
			</div>
		</div>

		<!-- Region Settings -->
		<div class="mb-4">
			<label
				class="text-gray-700 dark:text-gray-300 text-sm mb-2 block font-medium"
			>Tracking Region</label>
			<div class="grid grid-cols-2 gap-2">
				<div class="p-2 bg-gray-50 dark:bg-gray-700/30 rounded">
					<div class="text-gray-500 dark:text-gray-400 text-xs mb-1">
						X Position
					</div>
					<div class="text-gray-900 dark:text-white text-sm font-mono">
						{{ Math.round(trackingRegion.x) }}px
					</div>
				</div>
				<div class="p-2 bg-gray-50 dark:bg-gray-700/30 rounded">
					<div class="text-gray-500 dark:text-gray-400 text-xs mb-1">
						Y Position
					</div>
					<div class="text-gray-900 dark:text-white text-sm font-mono">
						{{ Math.round(trackingRegion.y) }}px
					</div>
				</div>
				<div class="p-2 bg-gray-50 dark:bg-gray-700/30 rounded">
					<div class="text-gray-500 dark:text-gray-400 text-xs mb-1">Width</div>
					<div class="text-gray-900 dark:text-white text-sm font-mono">
						{{ trackingRegion.width }}px
					</div>
				</div>
				<div class="p-2 bg-gray-50 dark:bg-gray-700/30 rounded">
					<div class="text-gray-500 dark:text-gray-400 text-xs mb-1">
						Height
					</div>
					<div class="text-gray-900 dark:text-white text-sm font-mono">
						{{ trackingRegion.height }}px
					</div>
				</div>
			</div>
		</div>

		<!-- Tracking Path Visualization -->
		<div class="mb-4">
			<label
				class="text-gray-700 dark:text-gray-300 text-sm mb-2 block font-medium"
			>Tracking Path</label>
			<div class="h-32 bg-gray-100 dark:bg-gray-900 rounded-lg relative overflow-hidden">
				<svg class="absolute inset-0 w-full h-full">
					<!-- Tracking path -->
					<polyline
						v-if="trackingPoints.length > 1"
						:points="trackingPoints.map(p =>
							`${(p.x / 200) * 100},${(p.y / 150) * 100}`
						).join(' ')"
						fill="none"
						stroke="#3b82f6"
						stroke-width="2"
					/>
					<!-- Current position -->
					<circle
						:cx="(trackingRegion.x / 200) * 100"
						:cy="(trackingRegion.y / 150) * 100"
						r="4"
						fill="#22c55e"
					/>
				</svg>
				<div
					v-if="!isTracking"
					class="absolute inset-0 flex items-center justify-center text-gray-500 text-xs"
				>
					No tracking data
				</div>
			</div>
		</div>

		<!-- Attachments -->
		<div class="mb-4">
			<label
				class="text-gray-700 dark:text-gray-300 text-sm mb-2 block font-medium"
			>Attached Items</label>
			<div class="flex gap-2">
				<button class="flex-1 py-2 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 text-sm rounded-lg transition-colors flex items-center justify-center gap-2">
					<Icon name="mdi:format-text" class="w-4 h-4" />
					Text
				</button>
				<button class="flex-1 py-2 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 text-sm rounded-lg transition-colors flex items-center justify-center gap-2">
					<Icon name="mdi:image" class="w-4 h-4" />
					Image
				</button>
				<button class="flex-1 py-2 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 text-sm rounded-lg transition-colors flex items-center justify-center gap-2">
					<Icon name="mdi:sparkles" class="w-4 h-4" />
					Effect
				</button>
			</div>
		</div>

		<!-- Actions -->
		<div class="flex gap-2 pt-4 border-t border-gray-200 dark:border-gray-700">
			<button
				class="flex-1 px-4 py-2 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-900 dark:text-white rounded-lg text-sm font-medium transition-colors"
				@click="emit('close')"
			>
				Close
			</button>
			<button
				class="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-colors"
				@click="emit('close')"
			>
				Apply Tracking
			</button>
		</div>
	</div>
</template>
