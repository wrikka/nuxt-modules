<script setup lang="ts">
export interface ChartData {
	labels: string[];
	datasets: {
		label: string;
		data: number[];
		color: string;
	}[];
}

export interface ChartConfig {
	type: "bar" | "line" | "pie" | "doughnut" | "radar";
	width: number;
	height: number;
	title: string;
	showLegend: boolean;
	showGrid: boolean;
	data: ChartData;
}

const props = defineProps<{
	config: ChartConfig;
}>();

const emit = defineEmits<{
	(e: "update:config", value: ChartConfig): void;
	(e: "generate"): void;
}>();

const updateConfig = (updates: Partial<ChartConfig>) => {
	emit("update:config", { ...props.config, ...updates });
};

const chartTypes = [
	{ value: "bar", label: "Bar Chart", icon: "📊" },
	{ value: "line", label: "Line Chart", icon: "📈" },
	{ value: "pie", label: "Pie Chart", icon: "🥧" },
	{ value: "doughnut", label: "Doughnut", icon: "🍩" },
	{ value: "radar", label: "Radar", icon: "🕸️" },
];

const sampleData = {
	labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
	datasets: [
		{
			label: "Revenue",
			data: [12000, 19000, 15000, 25000, 22000, 30000],
			color: "#3B82F6",
		},
		{
			label: "Expenses",
			data: [8000, 12000, 10000, 15000, 14000, 18000],
			color: "#EF4444",
		},
	],
};
</script>

<template>
	<div class="space-y-3">
		<label class="text-xs text-gray-600 dark:text-gray-400 mb-1 block"
		>Chart Generator</label>

		<div class="grid grid-cols-5 gap-1">
			<button
				v-for="type in chartTypes"
				:key="type.value"
				type="button"
				class="p-2 rounded border text-xs text-center transition-colors"
				:class="config.type === type.value
				? 'bg-blue-50 dark:bg-blue-900/20 border-blue-300 dark:border-blue-700'
				: 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'"
				@click="updateConfig({ type: type.value as ChartConfig['type'] })"
			>
				<div class="text-lg mb-1">{{ type.icon }}</div>
				<div class="text-gray-700 dark:text-gray-300">{{ type.label }}</div>
			</button>
		</div>

		<div>
			<label class="text-xs text-gray-600 dark:text-gray-400"
			>Chart Title</label>
			<input
				type="text"
				:value="config.title"
				class="w-full px-2 py-1.5 text-sm border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
				placeholder="Enter chart title..."
				@input="updateConfig({ title: ($event.target as HTMLInputElement).value })"
			>
		</div>

		<div class="grid grid-cols-2 gap-2">
			<div>
				<label class="text-xs text-gray-600 dark:text-gray-400"
				>Width (px)</label>
				<input
					type="number"
					:value="config.width"
					min="100"
					max="2000"
					class="w-full px-2 py-1.5 text-sm border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
					@input="updateConfig({
						width: Number(($event.target as HTMLInputElement).value),
					})"
				>
			</div>
			<div>
				<label class="text-xs text-gray-600 dark:text-gray-400"
				>Height (px)</label>
				<input
					type="number"
					:value="config.height"
					min="100"
					max="2000"
					class="w-full px-2 py-1.5 text-sm border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
					@input="updateConfig({
						height: Number(($event.target as HTMLInputElement).value),
					})"
				>
			</div>
		</div>

		<div class="flex items-center gap-4">
			<label
				class="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 cursor-pointer"
			>
				<input
					type="checkbox"
					:checked="config.showLegend"
					class="rounded border-gray-300 dark:border-gray-600"
					@change="updateConfig({
						showLegend: ($event.target as HTMLInputElement).checked,
					})"
				>
				Show Legend
			</label>
			<label
				class="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 cursor-pointer"
			>
				<input
					type="checkbox"
					:checked="config.showGrid"
					class="rounded border-gray-300 dark:border-gray-600"
					@change="updateConfig({
						showGrid: ($event.target as HTMLInputElement).checked,
					})"
				>
				Show Grid
			</label>
		</div>

		<div class="space-y-2">
			<label class="text-xs text-gray-600 dark:text-gray-400"
			>Data Preview</label>
			<div class="p-3 bg-gray-50 dark:bg-gray-800 rounded border border-gray-200 dark:border-gray-700">
				<div class="text-xs text-gray-500 mb-2">
					Labels: {{ sampleData.labels.join(", ") }}
				</div>
				<div
					v-for="(dataset, i) in sampleData.datasets"
					:key="i"
					class="flex items-center gap-2 mb-1"
				>
					<div
						class="w-3 h-3 rounded"
						:style="{ backgroundColor: dataset.color }"
					/>
					<span class="text-xs text-gray-600 dark:text-gray-400">{{
							dataset.label
						}}:</span>
					<span class="text-xs text-gray-500">{{
						dataset.data.join(", ")
					}}</span>
				</div>
			</div>
		</div>

		<div class="flex items-center justify-center p-4 bg-gray-50 dark:bg-gray-800 rounded">
			<div class="relative" :style="{ width: '200px', height: '120px' }">
				<svg viewBox="0 0 200 120" class="w-full h-full">
					<rect width="200" height="120" fill="white" stroke="#E5E7EB" />
					<template v-if="config.type === 'bar'">
						<g v-for="(value, i) in [40, 65, 50, 85, 75, 100]" :key="i">
							<rect
								:x="20 + i * 30"
								:y="100 - value"
								width="20"
								:height="value"
								fill="#3B82F6"
								opacity="0.8"
							/>
						</g>
						<line
							x1="15"
							y1="100"
							x2="185"
							y2="100"
							stroke="#9CA3AF"
							stroke-width="1"
						/>
						<line
							x1="15"
							y1="20"
							x2="15"
							y2="100"
							stroke="#9CA3AF"
							stroke-width="1"
						/>
					</template>
					<template v-else-if="config.type === 'line'">
						<polyline
							points="20,60 50,35 80,50 110,15 140,25 170,5"
							fill="none"
							stroke="#3B82F6"
							stroke-width="2"
						/>
						<g v-for="(y, i) in [60, 35, 50, 15, 25, 5]" :key="i">
							<circle :cx="20 + i * 30" :cy="y" r="3" fill="#3B82F6" />
						</g>
					</template>
					<template
						v-else-if="config.type === 'pie' || config.type === 'doughnut'"
					>
						<circle cx="100" cy="60" r="40" fill="#3B82F6" />
						<path d="M100,60 L100,20 A40,40 0 0,1 140,60 Z" fill="#EF4444" />
						<path d="M100,60 L140,60 A40,40 0 0,1 100,100 Z" fill="#10B981" />
						<path d="M100,60 L100,100 A40,40 0 0,1 60,60 Z" fill="#F59E0B" />
						<circle
							v-if="config.type === 'doughnut'"
							cx="100"
							cy="60"
							r="20"
							fill="white"
						/>
					</template>
					<template v-else-if="config.type === 'radar'">
						<polygon
							points="100,20 140,45 130,90 70,90 60,45"
							fill="rgba(59, 130, 246, 0.3)"
							stroke="#3B82F6"
							stroke-width="2"
						/>
						<g
							v-for="(point, i) in [[100, 20], [140, 45], [130, 90], [70, 90], [60, 45]]"
							:key="i"
						>
							<circle :cx="point[0]" :cy="point[1]" r="3" fill="#3B82F6" />
						</g>
					</template>
				</svg>
			</div>
		</div>

		<button
			type="button"
			class="w-full py-2 bg-blue-500 text-white text-sm rounded hover:bg-blue-600 transition-colors flex items-center justify-center gap-1"
			@click="$emit('generate')"
		>
			<svg
				class="w-4 h-4"
				fill="none"
				stroke="currentColor"
				viewBox="0 0 24 24"
			>
				<path
					stroke-linecap="round"
					stroke-linejoin="round"
					stroke-width="2"
					d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
				/>
			</svg>
			Create Chart
		</button>
	</div>
</template>
