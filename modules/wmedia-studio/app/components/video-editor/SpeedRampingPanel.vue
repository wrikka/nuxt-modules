<script setup lang="ts">
const emit = defineEmits<{
	close: [];
	apply: [points: SpeedPoint[]];
}>();

interface SpeedPoint {
	time: number;
	speed: number;
	type: "normal" | "slow" | "fast" | "freeze";
}

const clipDuration = ref(30);
const speedPoints = ref<SpeedPoint[]>([
	{ time: 0, speed: 100, type: "normal" },
	{ time: 10, speed: 25, type: "slow" },
	{ time: 15, speed: 100, type: "normal" },
	{ time: 20, speed: 200, type: "fast" },
	{ time: 25, speed: 100, type: "normal" },
]);

const selectedPoint = ref<number | null>(null);
const svgRef = ref<SVGElement | null>(null);

const speedOptions = [
	{ value: 25, label: "0.25x", type: "slow" },
	{ value: 50, label: "0.5x", type: "slow" },
	{ value: 100, label: "1x", type: "normal" },
	{ value: 200, label: "2x", type: "fast" },
	{ value: 400, label: "4x", type: "fast" },
	{ value: 0, label: "Freeze", type: "freeze" },
];

const getPointColor = (type: SpeedPoint["type"]) => {
	const colors = {
		normal: "#3b82f6",
		slow: "#8b5cf6",
		fast: "#22c55e",
		freeze: "#ef4444",
	};
	return colors[type];
};

const addPoint = () => {
	const lastPoint = speedPoints.value[speedPoints.value.length - 1];
	const newTime = lastPoint
		? Math.min(lastPoint.time + 5, clipDuration.value)
		: 5;
	speedPoints.value.push({
		time: newTime,
		speed: 100,
		type: "normal",
	});
};

const removePoint = (index: number) => {
	if (speedPoints.value.length > 2) {
		speedPoints.value.splice(index, 1);
	}
};

const updatePointSpeed = (index: number, speed: number) => {
	const point = speedPoints.value[index];
	if (!point) return;
	point.speed = speed;
	const option = speedOptions.find(o => o.value === speed);
	point.type = (option?.type as SpeedPoint["type"]) || "normal";
};

const formatTime = (seconds: number) => {
	const mins = Math.floor(seconds / 60);
	const secs = Math.floor(seconds % 60);
	return `${mins}:${secs.toString().padStart(2, "0")}`;
};

const handleApply = () => {
	emit("apply", speedPoints.value);
};

// Generate curve path
const curvePath = computed(() => {
	const width = 300;
	const height = 150;
	const padding = 20;

	const points = speedPoints.value.map(p => ({
		x: padding + (p.time / clipDuration.value) * (width - padding * 2),
		y: height - padding - (p.speed / 400) * (height - padding * 2),
	}));

	if (points.length < 2) return "";
	const firstPoint = points[0];
	if (!firstPoint) return "";

	let path = `M ${firstPoint.x} ${firstPoint.y}`;
	for (let i = 1; i < points.length; i++) {
		const prev = points[i - 1];
		const curr = points[i];
		if (!prev || !curr) continue;
		const cpX = (prev.x + curr.x) / 2;
		path += ` C ${cpX} ${prev.y}, ${cpX} ${curr.y}, ${curr.x} ${curr.y}`;
	}
	return path;
});
</script>

<template>
	<div class="speed-ramping-panel bg-white dark:bg-gray-800 rounded-xl p-4 w-[420px] flex flex-col shadow-lg border border-gray-200 dark:border-gray-700">
		<div class="flex items-center justify-between mb-4">
			<h3 class="text-gray-900 dark:text-white font-semibold flex items-center gap-2">
				<Icon name="mdi:gauge" class="w-5 h-5 text-blue-500" />
				Speed Ramping
			</h3>
			<button
				class="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors"
				@click="emit('close')"
			>
				<Icon name="mdi:close" class="w-5 h-5" />
			</button>
		</div>

		<!-- Speed Curve -->
		<div class="mb-4">
			<label
				class="text-gray-700 dark:text-gray-300 text-sm mb-2 block font-medium"
			>Speed Curve</label>
			<div class="h-40 bg-gray-100 dark:bg-gray-900 rounded-lg relative p-4">
				<svg ref="svgRef" class="w-full h-full" viewBox="0 0 300 150">
					<!-- Grid -->
					<g class="stroke-gray-300 dark:stroke-gray-700" stroke-width="1">
						<line x1="20" y1="20" x2="20" y2="130" />
						<line x1="20" y1="130" x2="280" y2="130" />
						<!-- Speed markers -->
						<line x1="15" y1="20" x2="25" y2="20" stroke="#22c55e" />
						<line x1="15" y1="75" x2="25" y2="75" stroke="#3b82f6" />
						<line x1="15" y1="110" x2="25" y2="110" stroke="#8b5cf6" />
					</g>

					<!-- Labels -->
					<text x="5" y="24" fill="#22c55e" font-size="10">4x</text>
					<text x="5" y="79" fill="#3b82f6" font-size="10">1x</text>
					<text x="5" y="114" fill="#8b5cf6" font-size="10">0.25x</text>

					<!-- Speed curve -->
					<path
						:path="curvePath"
						fill="none"
						stroke="#3b82f6"
						stroke-width="3"
					/>

					<!-- Points -->
					<circle
						v-for="(point, i) in speedPoints"
						:key="i"
						:cx="20 + (point.time / clipDuration) * 260"
						:cy="130 - (point.speed / 400) * 110"
						r="6"
						:fill="getPointColor(point.type)"
						stroke="white"
						stroke-width="2"
						class="cursor-pointer hover:r-8"
						@click="selectedPoint = i"
					/>
				</svg>
			</div>
		</div>

		<!-- Speed Points List -->
		<div class="flex-1 overflow-y-auto max-h-48 mb-4">
			<label
				class="text-gray-700 dark:text-gray-300 text-sm mb-2 block font-medium"
			>Speed Points</label>
			<div class="space-y-2">
				<div
					v-for="(point, index) in speedPoints"
					:key="index"
					class="flex items-center gap-2 p-2 rounded-lg transition-colors"
					:class="selectedPoint === index
					? 'bg-blue-100 dark:bg-blue-900/30 ring-1 ring-blue-500'
					: 'bg-gray-50 dark:bg-gray-700/30'"
				>
					<div
						class="w-3 h-3 rounded-full"
						:style="{ backgroundColor: getPointColor(point.type) }"
					/>
					<span class="text-gray-500 dark:text-gray-400 text-sm w-12">{{
						formatTime(point.time)
					}}</span>
					<select
						:value="point.speed"
						class="flex-1 bg-white dark:bg-gray-700 text-gray-900 dark:text-white px-2 py-1 rounded text-sm border-0"
						@change="updatePointSpeed(
							index,
							Number(($event.target as HTMLSelectElement).value),
						)"
					>
						<option
							v-for="opt in speedOptions"
							:key="opt.value"
							:value="opt.value"
						>
							{{ opt.label }} - {{ opt.type }}
						</option>
					</select>
					<button
						class="p-1 text-gray-400 hover:text-red-500 transition-colors"
						:disabled="speedPoints.length <= 2"
						@click="removePoint(index)"
					>
						<Icon name="mdi:delete" class="w-4 h-4" />
					</button>
				</div>
			</div>
		</div>

		<!-- Legend -->
		<div class="flex gap-4 mb-4 text-xs">
			<div class="flex items-center gap-1">
				<div class="w-2 h-2 rounded-full bg-green-500" />
				<span class="text-gray-500 dark:text-gray-400">Fast</span>
			</div>
			<div class="flex items-center gap-1">
				<div class="w-2 h-2 rounded-full bg-blue-500" />
				<span class="text-gray-500 dark:text-gray-400">Normal</span>
			</div>
			<div class="flex items-center gap-1">
				<div class="w-2 h-2 rounded-full bg-purple-500" />
				<span class="text-gray-500 dark:text-gray-400">Slow</span>
			</div>
			<div class="flex items-center gap-1">
				<div class="w-2 h-2 rounded-full bg-red-500" />
				<span class="text-gray-500 dark:text-gray-400">Freeze</span>
			</div>
		</div>

		<!-- Actions -->
		<div class="flex gap-2 pt-4 border-t border-gray-200 dark:border-gray-700">
			<button
				class="px-3 py-2 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-900 dark:text-white rounded-lg text-sm font-medium transition-colors flex items-center gap-2"
				@click="addPoint"
			>
				<Icon name="mdi:plus" class="w-4 h-4" />
				Add Point
			</button>
			<button
				class="flex-1 px-4 py-2 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-900 dark:text-white rounded-lg text-sm font-medium transition-colors"
				@click="emit('close')"
			>
				Cancel
			</button>
			<button
				class="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-colors"
				@click="handleApply"
			>
				Apply Speed Ramp
			</button>
		</div>
	</div>
</template>
