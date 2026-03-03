<script setup lang="ts">
import type { Template } from "#shared/types";

const props = defineProps<{
	template?: Template;
}>();

const emit = defineEmits<{
	(e: "close"): void;
}>();

const isAnalyzing = ref(true);
const analysisResults = ref({
	loadTime: 0,
	fileSize: 0,
	imageOptimization: 0,
	fontCount: 0,
	layerCount: 0,
	complexity: "low",
	recommendations: [] as string[],
});

const runAnalysis = async () => {
	isAnalyzing.value = true;

	await new Promise(r => setTimeout(r, 1500));

	analysisResults.value = {
		loadTime: Math.random() * 2 + 0.5,
		fileSize: Math.random() * 5 + 1,
		imageOptimization: Math.floor(Math.random() * 30 + 70),
		fontCount: Math.floor(Math.random() * 5 + 1),
		layerCount: Math.floor(Math.random() * 50 + 10),
		complexity: Math.random() > 0.7
			? "high"
			: Math.random() > 0.4
			? "medium"
			: "low",
		recommendations: [
			"Compress background image to reduce file size by 40%",
			"Convert text layers to paths for faster rendering",
			"Remove unused font variations",
			"Enable lazy loading for heavy assets",
		].slice(0, Math.floor(Math.random() * 3 + 1)),
	};

	isAnalyzing.value = false;
};

const getScoreColor = (score: number) => {
	if (score >= 90) return "text-green-600";
	if (score >= 70) return "text-yellow-600";
	return "text-red-600";
};

const getScoreBg = (score: number) => {
	if (score >= 90) return "bg-green-100 dark:bg-green-900/30";
	if (score >= 70) return "bg-yellow-100 dark:bg-yellow-900/30";
	return "bg-red-100 dark:bg-red-900/30";
};

const overallScore = computed(() => {
	const { imageOptimization, loadTime } = analysisResults.value;
	const loadScore = Math.max(0, 100 - (loadTime * 30));
	return Math.round((imageOptimization + loadScore) / 2);
});

onMounted(() => {
	runAnalysis();
});
</script>

<template>
	<Teleport to="body">
		<div
			class="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm"
			@click.self="emit('close')"
		>
			<div class="absolute inset-4 md:inset-10 bg-white dark:bg-gray-800 rounded-2xl overflow-hidden flex flex-col">
				<!-- Header -->
				<div class="flex items-center justify-between px-6 py-4 border-b border-gray-200 dark:border-gray-700">
					<div class="flex items-center gap-3">
						<div class="w-10 h-10 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center">
							<i class="i-mdi-speedometer text-green-600 text-xl" />
						</div>
						<div>
							<h2 class="text-xl font-semibold text-gray-900 dark:text-white">
								Performance Analysis
							</h2>
							<p class="text-sm text-gray-500">
								Optimize template loading and rendering
							</p>
						</div>
					</div>
					<div class="flex items-center gap-2">
						<button
							class="px-4 py-2 text-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
							@click="runAnalysis"
						>
							<i class="i-mdi-refresh mr-1" />
							Re-run
						</button>
						<button
							class="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
							@click="emit('close')"
						>
							<i class="i-mdi-close text-gray-600 dark:text-gray-400" />
						</button>
					</div>
				</div>

				<!-- Analyzing State -->
				<div
					v-if="isAnalyzing"
					class="flex-1 flex flex-col items-center justify-center"
				>
					<div class="w-16 h-16 border-4 border-gray-200 border-t-blue-600 rounded-full animate-spin mb-4" />
					<p class="text-lg font-medium text-gray-900 dark:text-white">
						Analyzing template performance...
					</p>
				</div>

				<!-- Results -->
				<div v-else class="flex-1 flex overflow-hidden">
					<!-- Left: Metrics -->
					<div class="w-1/3 border-r border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 p-6 overflow-y-auto">
						<!-- Overall Score -->
						<div class="text-center mb-6">
							<div
								class="w-24 h-24 mx-auto rounded-full flex items-center justify-center text-3xl font-bold mb-2"
								:class="getScoreBg(overallScore) + ' ' + getScoreColor(overallScore)"
							>
								{{ overallScore }}
							</div>
							<p class="text-sm font-medium text-gray-700 dark:text-gray-300">
								Overall Score
							</p>
							<p class="text-xs text-gray-500 mt-1">
								{{
									overallScore >= 90
									? "Excellent"
									: overallScore >= 70
									? "Good"
									: "Needs Improvement"
								}}
							</p>
						</div>

						<!-- Metric Cards -->
						<div class="space-y-3">
							<div class="p-4 bg-white dark:bg-gray-800 rounded-xl">
								<div class="flex items-center justify-between">
									<div class="flex items-center gap-2">
										<i class="i-mdi-clock-fast text-blue-500" />
										<span
											class="text-sm font-medium text-gray-700 dark:text-gray-300"
										>Load Time</span>
									</div>
									<span
										class="text-lg font-semibold"
										:class="analysisResults.loadTime < 1
										? 'text-green-600'
										: analysisResults.loadTime < 2
										? 'text-yellow-600'
										: 'text-red-600'"
									>
										{{ analysisResults.loadTime.toFixed(2) }}s
									</span>
								</div>
								<div class="mt-2 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
									<div
										class="h-full bg-blue-600"
										:style="`width: ${
											Math.max(0, 100 - analysisResults.loadTime * 30)
										}%`"
									/>
								</div>
							</div>

							<div class="p-4 bg-white dark:bg-gray-800 rounded-xl">
								<div class="flex items-center justify-between">
									<div class="flex items-center gap-2">
										<i class="i-mdi-file-document text-purple-500" />
										<span
											class="text-sm font-medium text-gray-700 dark:text-gray-300"
										>File Size</span>
									</div>
									<span
										class="text-lg font-semibold"
										:class="analysisResults.fileSize < 2
										? 'text-green-600'
										: analysisResults.fileSize < 4
										? 'text-yellow-600'
										: 'text-red-600'"
									>
										{{ analysisResults.fileSize.toFixed(1) }}MB
									</span>
								</div>
							</div>

							<div class="p-4 bg-white dark:bg-gray-800 rounded-xl">
								<div class="flex items-center justify-between">
									<div class="flex items-center gap-2">
										<i class="i-mdi-image text-green-500" />
										<span
											class="text-sm font-medium text-gray-700 dark:text-gray-300"
										>Image Optimization</span>
									</div>
									<span
										class="text-lg font-semibold"
										:class="getScoreColor(analysisResults.imageOptimization)"
									>
										{{ analysisResults.imageOptimization }}%
									</span>
								</div>
							</div>

							<div class="p-4 bg-white dark:bg-gray-800 rounded-xl">
								<div class="flex items-center gap-2 mb-2">
									<i class="i-mdi-layers text-orange-500" />
									<span
										class="text-sm font-medium text-gray-700 dark:text-gray-300"
									>Template Complexity</span>
								</div>
								<div class="flex items-center gap-2">
									<span
										class="px-2 py-1 rounded-full text-xs font-medium"
										:class="{
											'bg-green-100 text-green-700':
												analysisResults.complexity === 'low',
											'bg-yellow-100 text-yellow-700':
												analysisResults.complexity === 'medium',
											'bg-red-100 text-red-700':
												analysisResults.complexity === 'high',
										}"
									>
										{{ analysisResults.complexity }}
									</span>
									<span class="text-xs text-gray-500">
										{{ analysisResults.layerCount }} layers, {{
											analysisResults.fontCount
										}} fonts
									</span>
								</div>
							</div>
						</div>
					</div>

					<!-- Right: Recommendations -->
					<div class="flex-1 p-6 overflow-y-auto">
						<h3 class="text-lg font-medium text-gray-900 dark:text-white mb-4">
							Optimization Recommendations
						</h3>

						<div class="space-y-4">
							<div
								v-for="(rec, index) in analysisResults.recommendations"
								:key="index"
								class="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl flex items-start gap-3"
							>
								<div class="w-8 h-8 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center shrink-0">
									<i class="i-mdi-lightbulb text-blue-600" />
								</div>
								<div class="flex-1">
									<p class="text-gray-700 dark:text-gray-300">{{ rec }}</p>
									<button class="mt-2 text-sm text-blue-600 hover:text-blue-700 font-medium">
										Apply optimization
									</button>
								</div>
							</div>

							<div
								v-if="analysisResults.recommendations.length === 0"
								class="p-6 text-center"
							>
								<i class="i-mdi-check-circle text-green-500 text-4xl mb-3" />
								<p class="text-gray-600 dark:text-gray-400">
									Great job! No optimizations needed.
								</p>
							</div>
						</div>

						<!-- Best Practices -->
						<div class="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl">
							<h4 class="font-medium text-blue-900 dark:text-blue-300 mb-3">
								<i class="i-mdi-book-open mr-1" />
								Performance Best Practices
							</h4>
							<ul class="space-y-2 text-sm text-blue-700 dark:text-blue-400">
								<li class="flex items-start gap-2">
									<i class="i-mdi-check text-green-500 mt-0.5" />
									Use WebP format for images when possible
								</li>
								<li class="flex items-start gap-2">
									<i class="i-mdi-check text-green-500 mt-0.5" />
									Limit to 3 font families maximum
								</li>
								<li class="flex items-start gap-2">
									<i class="i-mdi-check text-green-500 mt-0.5" />
									Flatten complex vector paths
								</li>
								<li class="flex items-start gap-2">
									<i class="i-mdi-check text-green-500 mt-0.5" />
									Remove hidden/unused layers
								</li>
							</ul>
						</div>
					</div>
				</div>
			</div>
		</div>
	</Teleport>
</template>
