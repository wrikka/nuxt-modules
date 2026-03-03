<script setup lang="ts">
interface ActivityData {
	date: string;
	count: number;
}

interface Props {
	data: ActivityData[];
	title?: string;
}

const props = defineProps<Props>();

const months = [
	"Jan",
	"Feb",
	"Mar",
	"Apr",
	"May",
	"Jun",
	"Jul",
	"Aug",
	"Sep",
	"Oct",
	"Nov",
	"Dec",
];
const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

const heatmapData = computed(() => {
	const endDate = new Date();
	const startDate = new Date();
	startDate.setMonth(startDate.getMonth() - 12);

	const weeks: { date: Date; count: number }[][] = [];
	let currentWeek: { date: Date; count: number }[] = [];

	const dataMap = new Map(props.data.map(d => [d.date, d.count]));

	for (let d = new Date(startDate); d <= endDate; d.setDate(d.getDate() + 1)) {
		const dateStr = d.toISOString().split("T")[0]!;
		const count = dataMap.get(dateStr) ?? 0;

		if (d.getDay() === 0 && currentWeek.length > 0) {
			weeks.push(currentWeek);
			currentWeek = [];
		}

		currentWeek.push({ date: new Date(d), count });
	}

	if (currentWeek.length > 0) {
		weeks.push(currentWeek);
	}

	return weeks;
});

const maxCount = computed(() => {
	const counts = props.data.map(d => d.count);
	return Math.max(...counts, 1);
});

function getColor(count: number): string {
	if (count === 0) return "bg-gray-100 dark:bg-gray-800";
	const intensity = count / maxCount.value;
	if (intensity <= 0.25) return "bg-green-200 dark:bg-green-900/40";
	if (intensity <= 0.5) return "bg-green-300 dark:bg-green-700/50";
	if (intensity <= 0.75) return "bg-green-400 dark:bg-green-600/60";
	return "bg-green-500 dark:bg-green-500";
}

function formatDate(date: Date): string {
	return date.toLocaleDateString("en-US", {
		month: "short",
		day: "numeric",
		year: "numeric",
	});
}
</script>

<template>
	<div class="w-full">
		<h3
			v-if="title"
			class="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3"
		>
			{{ title }}
		</h3>
		<div class="overflow-x-auto">
			<div class="flex gap-1 min-w-max">
				<!-- Day labels -->
				<div class="flex flex-col gap-1 mr-2">
					<div
						v-for="day in days"
						:key="day"
						class="h-3 text-xs text-gray-500 dark:text-gray-400 w-8"
					>
						{{ day.charAt(0) }}
					</div>
				</div>

				<!-- Heatmap grid -->
				<div class="flex gap-1">
					<div
						v-for="(week, weekIndex) in heatmapData"
						:key="weekIndex"
						class="flex flex-col gap-1"
					>
						<div
							v-for="(day, dayIndex) in week"
							:key="`${weekIndex}-${dayIndex}`"
							class="w-3 h-3 rounded-sm"
							:class="getColor(day.count)"
							title="{{ formatDate(day.date) }}: {{ day.count }} activities"
						/>
					</div>
				</div>
			</div>

			<!-- Legend -->
			<div class="flex items-center gap-2 mt-4 text-xs text-gray-500 dark:text-gray-400">
				<span>Less</span>
				<div class="flex gap-1">
					<div class="w-3 h-3 rounded-sm bg-gray-100 dark:bg-gray-800" />
					<div class="w-3 h-3 rounded-sm bg-green-200 dark:bg-green-900/40" />
					<div class="w-3 h-3 rounded-sm bg-green-300 dark:bg-green-700/50" />
					<div class="w-3 h-3 rounded-sm bg-green-400 dark:bg-green-600/60" />
					<div class="w-3 h-3 rounded-sm bg-green-500 dark:bg-green-500" />
				</div>
				<span>More</span>
			</div>
		</div>
	</div>
</template>
