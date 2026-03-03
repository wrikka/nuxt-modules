<script setup lang="ts">
import type { Template } from "#shared/types";

const props = defineProps<{
	template?: Template;
	brandKit?: {
		colors: string[];
		fonts: string[];
		logos: string[];
	};
}>();

const emit = defineEmits<{
	(e: "close"): void;
	(e: "apply", suggestions: AlignmentSuggestion[]): void;
}>();

interface AlignmentSuggestion {
	id: string;
	type: "color" | "font" | "logo" | "spacing" | "tone";
	title: string;
	description: string;
	current: string;
	recommended: string;
	severity: "high" | "medium" | "low" | "good";
}

const analysisProgress = ref(0);
const isAnalyzing = ref(true);
const suggestions = ref<AlignmentSuggestion[]>([]);
const showApplied = ref(false);

const analyzeAlignment = async () => {
	isAnalyzing.value = true;
	analysisProgress.value = 0;

	// Simulate analysis
	for (let i = 0; i <= 100; i += 10) {
		await new Promise(r => setTimeout(r, 100));
		analysisProgress.value = i;
	}

	// Generate mock suggestions
	suggestions.value = [
		{
			id: "1",
			type: "color",
			title: "Background Color",
			description:
				"Template uses a blue background, but your brand prefers neutral tones",
			current: "#3B82F6",
			recommended: "#F3F4F6",
			severity: "medium",
		},
		{
			id: "2",
			type: "font",
			title: "Typography",
			description:
				"Template uses Arial, but your brand guidelines specify Inter",
			current: "Arial",
			recommended: "Inter",
			severity: "high",
		},
		{
			id: "3",
			type: "logo",
			title: "Logo Placement",
			description: "Template has space for logo in the corner - perfect match",
			current: "Empty",
			recommended: "Your logo here",
			severity: "good",
		},
		{
			id: "4",
			type: "tone",
			title: "Visual Tone",
			description:
				"Template's playful style matches your brand's friendly approach",
			current: "Playful",
			recommended: "Playful ✓",
			severity: "good",
		},
	];

	isAnalyzing.value = false;
};

const alignmentScore = computed(() => {
	if (suggestions.value.length === 0) return 0;
	const goodCount = suggestions.value.filter(s => s.severity === "good").length;
	return Math.round((goodCount / suggestions.value.length) * 100);
});

const getSeverityColor = (severity: string) => {
	switch (severity) {
		case "high":
			return "text-red-600 bg-red-100 dark:bg-red-900/30";
		case "medium":
			return "text-yellow-600 bg-yellow-100 dark:bg-yellow-900/30";
		case "low":
			return "text-blue-600 bg-blue-100 dark:bg-blue-900/30";
		case "good":
			return "text-green-600 bg-green-100 dark:bg-green-900/30";
		default:
			return "text-gray-600 bg-gray-100";
	}
};

const getTypeIcon = (type: string) => {
	switch (type) {
		case "color":
			return "i-mdi-palette";
		case "font":
			return "i-mdi-format-font";
		case "logo":
			return "i-mdi-image";
		case "spacing":
			return "i-mdi-ruler";
		case "tone":
			return "i-mdi-music-note";
		default:
			return "i-mdi-check";
	}
};

const applyAll = () => {
	showApplied.value = true;
	emit("apply", suggestions.value);
	setTimeout(() => showApplied.value = false, 3000);
};

onMounted(() => {
	analyzeAlignment();
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
					<div class="flex items-center gap-4">
						<h2 class="text-xl font-semibold text-gray-900 dark:text-white">
							Brand Alignment Check
						</h2>
						<span
							v-if="!isAnalyzing"
							class="px-3 py-1 rounded-full text-sm font-medium"
							:class="alignmentScore >= 80
							? 'bg-green-100 text-green-700 dark:bg-green-900/30'
							: alignmentScore >= 60
							? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30'
							: 'bg-red-100 text-red-700 dark:bg-red-900/30'"
						>
							{{ alignmentScore }}% Match
						</span>
					</div>
					<button
						class="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
						@click="emit('close')"
					>
						<i class="i-mdi-close text-gray-600 dark:text-gray-400" />
					</button>
				</div>

				<!-- Analysis Progress -->
				<div
					v-if="isAnalyzing"
					class="flex-1 flex flex-col items-center justify-center p-8"
				>
					<div class="w-64 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden mb-4">
						<div
							class="h-full bg-blue-600 transition-all duration-300"
							:style="`width: ${analysisProgress}%`"
						/>
					</div>
					<p class="text-lg font-medium text-gray-900 dark:text-white">
						Analyzing brand alignment...
					</p>
					<p class="text-sm text-gray-500 mt-2">
						{{ analysisProgress }}% complete
					</p>
				</div>

				<!-- Results -->
				<div v-else class="flex-1 flex overflow-hidden">
					<!-- Left: Template Preview -->
					<div class="w-1/3 border-r border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 p-6">
						<h3 class="text-sm font-medium text-gray-500 dark:text-gray-400 mb-4">
							Template Preview
						</h3>
						<div class="rounded-xl overflow-hidden shadow-lg mb-4">
							<img
								:src="template?.thumbnail || ''"
								:alt="template?.name || ''"
								class="w-full aspect-video object-cover"
							/>
						</div>
						<h4 class="font-semibold text-gray-900 dark:text-white">
							{{ template?.name || "Template" }}
						</h4>
						<p class="text-sm text-gray-500 mt-1">
							{{ template?.category || "General" }}
						</p>

						<div class="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
							<h4 class="text-sm font-medium text-blue-900 dark:text-blue-300 mb-2">
								Your Brand Kit
							</h4>
							<div class="flex gap-2 mb-2">
								<div
									v-for='color in brandKit?.colors || ["#3B82F6", "#10B981", "#F59E0B"]'
									:key="color"
									class="w-6 h-6 rounded-full border border-gray-300"
									:style="`background-color: ${color}`"
								/>
							</div>
							<p class="text-xs text-blue-700 dark:text-blue-400">
								{{ brandKit?.fonts?.length || 2 }} brand fonts configured
							</p>
						</div>
					</div>

					<!-- Right: Suggestions -->
					<div class="flex-1 overflow-y-auto p-6">
						<div class="max-w-3xl mx-auto space-y-4">
							<div class="flex items-center justify-between mb-6">
								<h3 class="text-lg font-medium text-gray-900 dark:text-white">
									Alignment Report ({{ suggestions.length }} items)
								</h3>
								<button
									v-if="suggestions.some(s => s.severity !== 'good')"
									class="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-colors"
									@click="applyAll"
								>
									<i class="i-mdi-auto-fix mr-1" />
									Auto-Align All
								</button>
							</div>

							<div
								v-for="suggestion in suggestions"
								:key="suggestion.id"
								class="p-4 border rounded-xl transition-colors"
								:class="suggestion.severity === 'good'
								? 'border-green-200 dark:border-green-800 bg-green-50/50 dark:bg-green-900/10'
								: 'border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-700'"
							>
								<div class="flex items-start gap-4">
									<div
										class="w-10 h-10 rounded-lg flex items-center justify-center shrink-0"
										:class="getSeverityColor(suggestion.severity)"
									>
										<i :class="getTypeIcon(suggestion.type)" />
									</div>
									<div class="flex-1">
										<div class="flex items-center gap-2">
											<h4 class="font-medium text-gray-900 dark:text-white">
												{{ suggestion.title }}
											</h4>
											<span
												class="px-2 py-0.5 text-xs rounded-full font-medium"
												:class="getSeverityColor(suggestion.severity)"
											>
												{{
													suggestion.severity === "good"
													? "Aligned"
													: suggestion.severity
												}}
											</span>
										</div>
										<p class="text-sm text-gray-600 dark:text-gray-400 mt-1">
											{{ suggestion.description }}
										</p>
										<div
											v-if="suggestion.severity !== 'good'"
											class="mt-3 flex items-center gap-4 text-sm"
										>
											<div class="flex items-center gap-2">
												<span class="text-gray-500">Current:</span>
												<span
													class="px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded text-gray-700 dark:text-gray-300"
												>
													{{ suggestion.current }}
												</span>
											</div>
											<i class="i-mdi-arrow-right text-gray-400" />
											<div class="flex items-center gap-2">
												<span class="text-gray-500">Recommended:</span>
												<span
													class="px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 rounded"
												>
													{{ suggestion.recommended }}
												</span>
											</div>
										</div>
									</div>
									<button
										v-if="suggestion.severity !== 'good'"
										class="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg text-blue-600"
										title="Apply this suggestion"
									>
										<i class="i-mdi-check-circle" />
									</button>
								</div>
							</div>

							<!-- Summary Card -->
							<div class="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl mt-6">
								<div class="flex items-center gap-3">
									<div
										class="w-12 h-12 rounded-full flex items-center justify-center text-xl font-bold"
										:class="alignmentScore >= 80
										? 'bg-green-500 text-white'
										: alignmentScore >= 60
										? 'bg-yellow-500 text-white'
										: 'bg-red-500 text-white'"
									>
										{{ alignmentScore }}%
									</div>
									<div>
										<h4 class="font-medium text-gray-900 dark:text-white">
											Overall Brand Alignment
										</h4>
										<p class="text-sm text-gray-500">
											{{
												alignmentScore >= 80
												? "Great match! This template aligns well with your brand."
												: alignmentScore >= 60
												? "Good match with minor adjustments needed."
												: "Significant misalignment detected. Consider customizing."
											}}
										</p>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>

				<!-- Success Toast -->
				<Transition name="fade">
					<div
						v-if="showApplied"
						class="absolute bottom-6 left-1/2 -translate-x-1/2 px-6 py-3 bg-green-600 text-white rounded-lg shadow-lg flex items-center gap-2"
					>
						<i class="i-mdi-check-circle" />
						Brand alignment applied successfully!
					</div>
				</Transition>
			</div>
		</div>
	</Teleport>
</template>

<style scoped>
.fade-enter-active,
.fade-leave-active {
	transition: opacity 0.3s;
}
.fade-enter-from,
.fade-leave-to {
	opacity: 0;
}
</style>
