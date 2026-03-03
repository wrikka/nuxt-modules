<script setup lang="ts">
interface DataPoint {
	date: string;
	value: number;
}

interface Props {
	data: DataPoint[];
	title?: string;
	color?: string;
	height?: number;
}

const props = withDefaults(defineProps<Props>(), {
	color: "#3b82f6",
	height: 200,
});

const padding = { top: 20, right: 20, bottom: 30, left: 40 };

const chartWidth = computed(() => 800);
const chartHeight = computed(() => props.height);

const innerWidth = computed(() =>
	chartWidth.value - padding.left - padding.right
);
const innerHeight = computed(() =>
	chartHeight.value - padding.top - padding.bottom
);

const xScale = computed(() => {
	const dates = props.data.map(d => new Date(d.date).getTime());
	const min = Math.min(...dates);
	const max = Math.max(...dates);
	return {
		min,
		max,
		scale: (val: number) => ((val - min) / (max - min)) * innerWidth.value,
	};
});

const yScale = computed(() => {
	const values = props.data.map(d => d.value);
	const max = Math.max(...values) * 1.1;
	const min = Math.min(...values) * 0.9;
	return {
		min,
		max,
		scale: (val: number) =>
			innerHeight.value - ((val - min) / (max - min)) * innerHeight.value,
	};
});

const pathD = computed(() => {
	if (!props.data.length) return "";
	return props.data.map((d, i) => {
		const x = padding.left + xScale.value.scale(new Date(d.date).getTime());
		const y = padding.top + yScale.value.scale(d.value);
		return `${i === 0 ? "M" : "L"} ${x} ${y}`;
	}).join(" ");
});

const areaPathD = computed(() => {
	if (!props.data.length) return "";
	const linePath = pathD.value;
	const lastX = padding.left
		+ xScale.value.scale(
			new Date(props.data[props.data.length - 1]!.date).getTime(),
		);
	const firstX = padding.left
		+ xScale.value.scale(new Date(props.data[0]!.date).getTime());
	const bottomY = padding.top + innerHeight.value;
	return `${linePath} L ${lastX} ${bottomY} L ${firstX} ${bottomY} Z`;
});

const gridLines = computed(() => {
	const lines = [];
	for (let i = 0; i <= 5; i++) {
		const y = padding.top + (innerHeight.value / 5) * i;
		const value = yScale.value.max
			- ((yScale.value.max - yScale.value.min) / 5) * i;
		lines.push({ y, value: Math.round(value) });
	}
	return lines;
});

const xLabels = computed(() => {
	const labels = [];
	const step = Math.ceil(props.data.length / 6);
	for (let i = 0; i < props.data.length; i += step) {
		const d = props.data[i]!;
		const x = padding.left + xScale.value.scale(new Date(d.date).getTime());
		labels.push({
			x,
			label: new Date(d.date).toLocaleDateString("en-US", {
				month: "short",
				day: "numeric",
			}),
		});
	}
	return labels;
});
</script>

<template>
	<div class="w-full">
		<h3
			v-if="title"
			class="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3"
		>
			{{ title }}
		</h3>
		<div class="relative overflow-hidden rounded-lg bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
			<svg
				:viewBox="`0 0 ${chartWidth} ${chartHeight}`"
				class="w-full"
				preserveAspectRatio="none"
			>
				<!-- Grid lines -->
				<line
					v-for="line in gridLines"
					:key="line.y"
					:x1="padding.left"
					:y1="line.y"
					:x2="chartWidth - padding.right"
					:y2="line.y"
					stroke="#e5e7eb"
					stroke-dasharray="2,2"
					class="dark:stroke-gray-700"
				/>

				<!-- Area -->
				<path
					v-if="areaPathD"
					:d="areaPathD"
					:fill="color"
					fill-opacity="0.1"
				/>

				<!-- Line -->
				<path
					v-if="pathD"
					:d="pathD"
					fill="none"
					:stroke="color"
					stroke-width="2"
					stroke-linecap="round"
					stroke-linejoin="round"
				/>

				<!-- Data points -->
				<circle
					v-for="(d, i) in data"
					:key="i"
					:cx="padding.left + xScale.scale(new Date(d.date).getTime())"
					:cy="padding.top + yScale.scale(d.value)"
					r="4"
					:fill="color"
					class="hover:r-6 transition-all cursor-pointer"
				>
					<title>
						{{ new Date(d.date).toLocaleDateString() }}: {{ d.value }}
					</title>
				</circle>

				<!-- Y-axis labels -->
				<text
					v-for="line in gridLines"
					:key="`y-${line.y}`"
					:x="padding.left - 5"
					:y="line.y + 4"
					text-anchor="end"
					class="text-xs fill-gray-500 dark:fill-gray-400"
				>
					{{ line.value }}
				</text>

				<!-- X-axis labels -->
				<text
					v-for="label in xLabels"
					:key="label.label"
					:x="label.x"
					:y="chartHeight - 5"
					text-anchor="middle"
					class="text-xs fill-gray-500 dark:fill-gray-400"
				>
					{{ label.label }}
				</text>
			</svg>
		</div>
	</div>
</template>
