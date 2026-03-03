<script setup lang="ts">
const props = defineProps<{
	recordings: Array<{
		id: string;
		duration: number;
		blob: Blob;
		timestamp: number;
		source?: string;
	}>;
}>();

// Calculate stats
const totalDuration = computed(() =>
	props.recordings.reduce((sum, r) => sum + r.duration, 0)
);
const totalSize = computed(() =>
	props.recordings.reduce((sum, r) => sum + r.blob.size, 0)
);
const totalCount = computed(() => props.recordings.length);

const averageDuration = computed(() =>
	totalCount.value > 0 ? totalDuration.value / totalCount.value : 0
);

const formatDuration = (seconds: number): string => {
	const hours = Math.floor(seconds / 3600);
	const mins = Math.floor((seconds % 3600) / 60);
	if (hours > 0) return `${hours}h ${mins}m`;
	return `${mins}m ${Math.floor(seconds % 60)}s`;
};

const formatSize = (bytes: number): string => {
	if (bytes === 0) return "0 B";
	const k = 1024;
	const sizes = ["B", "KB", "MB", "GB"];
	const i = Math.floor(Math.log(bytes) / Math.log(k));
	return `${parseFloat((bytes / k ** i).toFixed(1))} ${sizes[i]}`;
};

// Usage by source
const sourceStats = computed(() => {
	const stats: Record<string, { count: number; duration: number }> = {};
	props.recordings.forEach((r) => {
		const source = r.source || "screen";
		if (!stats[source]) {
			stats[source] = { count: 0, duration: 0 };
		}
		stats[source].count++;
		stats[source].duration += r.duration;
	});
	return stats;
});

// Weekly activity (mock data)
const weeklyData = [
	{ day: "Mon", count: 3, duration: 45 },
	{ day: "Tue", count: 5, duration: 78 },
	{ day: "Wed", count: 2, duration: 30 },
	{ day: "Thu", count: 4, duration: 62 },
	{ day: "Fri", count: 6, duration: 95 },
	{ day: "Sat", count: 1, duration: 20 },
	{ day: "Sun", count: 0, duration: 0 },
];

const maxWeeklyDuration = Math.max(...weeklyData.map((d) => d.duration));
</script>

<template>
	<div class="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
		<h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">
			Recording Stats
		</h3>

		<!-- Key Metrics -->
		<div class="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
			<div class="bg-purple-50 dark:bg-purple-900/20 rounded-lg p-4">
				<div class="flex items-center gap-2 mb-1">
					<Icon
						name="mdi:video"
						class="w-5 h-5 text-purple-600 dark:text-purple-400"
					/>
					<span class="text-sm text-gray-600 dark:text-gray-400"
					>Recordings</span>
				</div>
				<p class="text-2xl font-bold text-purple-700 dark:text-purple-300">
					{{ totalCount }}
				</p>
			</div>

			<div class="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4">
				<div class="flex items-center gap-2 mb-1">
					<Icon
						name="mdi:clock"
						class="w-5 h-5 text-blue-600 dark:text-blue-400"
					/>
					<span class="text-sm text-gray-600 dark:text-gray-400"
					>Total Time</span>
				</div>
				<p class="text-2xl font-bold text-blue-700 dark:text-blue-300">
					{{ formatDuration(totalDuration) }}
				</p>
			</div>

			<div class="bg-green-50 dark:bg-green-900/20 rounded-lg p-4">
				<div class="flex items-center gap-2 mb-1">
					<Icon
						name="mdi:harddisk"
						class="w-5 h-5 text-green-600 dark:text-green-400"
					/>
					<span class="text-sm text-gray-600 dark:text-gray-400"
					>Storage Used</span>
				</div>
				<p class="text-2xl font-bold text-green-700 dark:text-green-300">
					{{ formatSize(totalSize) }}
				</p>
			</div>

			<div class="bg-orange-50 dark:bg-orange-900/20 rounded-lg p-4">
				<div class="flex items-center gap-2 mb-1">
					<Icon
						name="mdi:timer"
						class="w-5 h-5 text-orange-600 dark:text-orange-400"
					/>
					<span class="text-sm text-gray-600 dark:text-gray-400"
					>Avg Length</span>
				</div>
				<p class="text-2xl font-bold text-orange-700 dark:text-orange-300">
					{{ formatDuration(averageDuration) }}
				</p>
			</div>
		</div>

		<!-- Source Breakdown -->
		<div class="grid grid-cols-1 lg:grid-cols-2 gap-4">
			<!-- By Source -->
			<div class="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4">
				<h4 class="text-sm font-medium text-gray-900 dark:text-white mb-3">
					By Source
				</h4>
				<div class="space-y-2">
					<div
						v-for="(stats, source) in sourceStats"
						:key="source"
						class="flex items-center justify-between p-2 bg-white dark:bg-gray-700 rounded"
					>
						<div class="flex items-center gap-2">
							<Icon
								:name="source === 'camera'
								? 'mdi:camera'
								: source === 'both'
								? 'mdi:video'
								: 'mdi:monitor'"
								class="w-4 h-4 text-gray-500"
							/>
							<span
								class="text-sm capitalize text-gray-700 dark:text-gray-300"
							>{{ source }}</span>
						</div>
						<div class="text-right">
							<p class="text-sm font-medium text-gray-900 dark:text-white">
								{{ stats.count }}
							</p>
							<p class="text-xs text-gray-500">
								{{ formatDuration(stats.duration) }}
							</p>
						</div>
					</div>
				</div>
			</div>

			<!-- Weekly Activity -->
			<div class="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4">
				<h4 class="text-sm font-medium text-gray-900 dark:text-white mb-3">
					Weekly Activity
				</h4>
				<div class="flex items-end gap-2 h-32">
					<div
						v-for="day in weeklyData"
						:key="day.day"
						class="flex-1 flex flex-col items-center gap-1"
					>
						<div
							class="w-full bg-purple-500 rounded-t transition-all"
							:style="{ height: `${(day.duration / maxWeeklyDuration) * 100}%` }"
						/>
						<span class="text-xs text-gray-500">{{ day.day }}</span>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>
