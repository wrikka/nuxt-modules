<script setup lang="ts">
interface FormatStat {
	format: string;
	count: number;
	percentage: number;
}

const props = defineProps<{
	stats: FormatStat[];
}>();

const sortedStats = computed(() =>
	[...props.stats].sort((a, b) => b.count - a.count)
);

const formatIcons: Record<string, string> = {
	"PNG": "i-mdi-image",
	"JPG": "i-mdi-image",
	"JPEG": "i-mdi-image",
	"SVG": "i-mdi-svg",
	"GIF": "i-mdi-gif",
	"MP4": "i-mdi-video",
	"MOV": "i-mdi-video",
	"AVI": "i-mdi-video",
	"WEBM": "i-mdi-video",
	"MP3": "i-mdi-music",
	"WAV": "i-mdi-waveform",
	"PDF": "i-mdi-file-pdf",
};

const formatColors: Record<string, string> = {
	"PNG": "bg-green-100 text-green-600",
	"JPG": "bg-green-100 text-green-600",
	"JPEG": "bg-green-100 text-green-600",
	"SVG": "bg-orange-100 text-orange-600",
	"GIF": "bg-purple-100 text-purple-600",
	"MP4": "bg-blue-100 text-blue-600",
	"MOV": "bg-blue-100 text-blue-600",
	"AVI": "bg-blue-100 text-blue-600",
	"WEBM": "bg-blue-100 text-blue-600",
	"MP3": "bg-pink-100 text-pink-600",
	"WAV": "bg-pink-100 text-pink-600",
	"PDF": "bg-red-100 text-red-600",
};

function getIcon(format: string): string {
	return formatIcons[format.toUpperCase()] || "i-mdi-file";
}

function getColor(format: string): string {
	return formatColors[format.toUpperCase()] || "bg-gray-100 text-gray-600";
}
</script>

<template>
	<div class="rounded-lg border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
		<h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">
			Export Format Statistics
		</h3>

		<div class="space-y-3">
			<div
				v-for="stat in sortedStats"
				:key="stat.format"
				class="flex items-center gap-4"
			>
				<div
					class="w-12 h-12 rounded-lg flex items-center justify-center shrink-0"
					:class="getColor(stat.format)"
				>
					<i :class="getIcon(stat.format)" class="text-xl" />
				</div>
				<div class="flex-1">
					<div class="flex justify-between mb-1">
						<span class="font-medium text-gray-900 dark:text-white">{{
							stat.format.toUpperCase()
						}}</span>
						<span class="text-sm text-gray-600 dark:text-gray-400">{{
								stat.count
							}} exports</span>
					</div>
					<div class="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
						<div
							class="h-full bg-blue-500 rounded-full transition-all"
							:style="{ width: `${stat.percentage}%` }"
						/>
					</div>
				</div>
				<div class="text-right w-16">
					<span class="font-medium text-gray-900 dark:text-white">{{
							stat.percentage
						}}%</span>
				</div>
			</div>
		</div>

		<div
			v-if="stats.length === 0"
			class="text-center py-8 text-gray-500 dark:text-gray-400"
		>
			<i class="i-mdi-file-export text-3xl mb-2" />
			<p>No export data available</p>
		</div>
	</div>
</template>
