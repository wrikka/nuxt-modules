<script setup lang="ts">
interface DataItem {
	label: string;
	value: number;
	color?: string;
}

interface Props {
	data: DataItem[];
	title?: string;
	size?: number;
}

const props = withDefaults(defineProps<Props>(), {
	size: 200,
});

const colors = [
	"#3b82f6", // blue
	"#8b5cf6", // purple
	"#10b981", // green
	"#f59e0b", // yellow
	"#ef4444", // red
	"#ec4899", // pink
	"#06b6d4", // cyan
	"#84cc16", // lime
];

const total = computed(() => props.data.reduce((sum, d) => sum + d.value, 0));

const slices = computed(() => {
	let currentAngle = 0;
	return props.data.map((d, i) => {
		const percentage = d.value / total.value;
		const angle = percentage * 360;
		const startAngle = currentAngle;
		const endAngle = currentAngle + angle;
		currentAngle = endAngle;

		return {
			...d,
			percentage: Math.round(percentage * 100),
			color: d.color || colors[i % colors.length],
			startAngle,
			endAngle,
		};
	});
});

function getSlicePath(startAngle: number, endAngle: number, radius: number) {
	const center = props.size / 2;
	const start = polarToCartesian(center, center, radius, endAngle);
	const end = polarToCartesian(center, center, radius, startAngle);
	const largeArcFlag = endAngle - startAngle <= 180 ? "0" : "1";

	return [
		"M",
		center,
		center,
		"L",
		start.x,
		start.y,
		"A",
		radius,
		radius,
		0,
		largeArcFlag,
		0,
		end.x,
		end.y,
		"Z",
	].join(" ");
}

function polarToCartesian(
	centerX: number,
	centerY: number,
	radius: number,
	angleInDegrees: number,
) {
	const angleInRadians = (angleInDegrees - 90) * Math.PI / 180;
	return {
		x: centerX + radius * Math.cos(angleInRadians),
		y: centerY + radius * Math.sin(angleInRadians),
	};
}

function getLabelPosition(angle: number, radius: number) {
	const center = props.size / 2;
	return polarToCartesian(center, center, radius, angle);
}
</script>

<template>
	<div class="flex flex-col items-center">
		<h3
			v-if="title"
			class="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3"
		>
			{{ title }}
		</h3>
		<div class="flex items-center gap-6">
			<svg :width="size" :height="size" class="shrink-0">
				<path
					v-for="slice in slices"
					:key="slice.label"
					:d="getSlicePath(slice.startAngle, slice.endAngle, size / 2 - 2)"
					:fill="slice.color"
					stroke="white"
					stroke-width="2"
					class="dark:stroke-gray-800 hover:opacity-80 transition-opacity cursor-pointer"
				>
					<title>
						{{ slice.label }}: {{ slice.value }} ({{ slice.percentage }}%)
					</title>
				</path>
				<!-- Donut hole -->
				<circle
					:cx="size / 2"
					:cy="size / 2"
					:r="size / 4"
					fill="white"
					class="dark:fill-gray-800"
				/>
			</svg>

			<!-- Legend -->
			<div class="flex flex-col gap-2 text-sm">
				<div
					v-for="slice in slices"
					:key="`legend-${slice.label}`"
					class="flex items-center gap-2"
				>
					<div
						class="w-3 h-3 rounded-full"
						:style="{ backgroundColor: slice.color }"
					/>
					<span class="text-gray-600 dark:text-gray-400">{{
						slice.label
					}}</span>
					<span class="text-gray-900 dark:text-gray-100 font-medium">{{
							slice.percentage
						}}%</span>
				</div>
			</div>
		</div>
	</div>
</template>
