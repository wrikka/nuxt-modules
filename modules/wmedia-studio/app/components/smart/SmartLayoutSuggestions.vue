<script setup lang="ts">
interface Props {
	isOpen: boolean;
}

const props = defineProps<Props>();
const emit = defineEmits<{
	close: [];
	applySuggestion: [suggestion: string];
}>();

const suggestions = ref([
	{
		id: "spacing",
		title: "Improve Spacing",
		description:
			"Elements look cramped. Try increasing the gap between items to 24px for better breathing room.",
		confidence: 0.92,
		icon: "mdi:arrow-all",
		color: "blue",
	},
	{
		id: "alignment",
		title: "Fix Alignment",
		description:
			"The text and image aren't aligned properly. Use vertical-align: middle or flexbox centering.",
		confidence: 0.88,
		icon: "mdi:format-align-center",
		color: "green",
	},
	{
		id: "contrast",
		title: "Color Contrast Issue",
		description:
			"Text color doesn't have enough contrast against background. Consider using darker text (#1F2937).",
		confidence: 0.85,
		icon: "mdi:eye",
		color: "orange",
	},
	{
		id: "hierarchy",
		title: "Visual Hierarchy",
		description:
			"Make the heading larger (32px) to establish clear visual hierarchy with the body text.",
		confidence: 0.81,
		icon: "mdi:layers",
		color: "purple",
	},
]);

const activeSuggestion = ref<string | null>(null);

const applySuggestion = (id: string) => {
	emit("applySuggestion", id);
	activeSuggestion.value = null;
};
</script>

<template>
	<div
		v-if="isOpen"
		class="fixed left-1/2 -translate-x-1/2 top-20 w-96 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl shadow-2xl z-50 overflow-hidden"
	>
		<!-- Header -->
		<div class="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-purple-500 to-blue-500">
			<div class="flex items-center gap-2">
				<Icon name="mdi:sparkles" class="w-5 h-5 text-white" />
				<h3 class="font-semibold text-white">Smart Layout Suggestions</h3>
			</div>
			<button
				class="p-1.5 hover:bg-white/20 rounded-lg transition-colors"
				@click="emit('close')"
			>
				<Icon name="mdi:close" class="w-4 h-4 text-white" />
			</button>
		</div>

		<!-- Suggestions List -->
		<div class="max-h-80 overflow-y-auto">
			<div
				v-for="suggestion in suggestions"
				:key="suggestion.id"
				class="border-b border-gray-100 dark:border-gray-800 last:border-0"
			>
				<div
					class="p-4 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
					@click="activeSuggestion = activeSuggestion === suggestion.id
					? null
					: suggestion.id"
				>
					<div class="flex items-start gap-3">
						<div
							:class="[
								'w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0',
								suggestion.color === 'blue'
								&& 'bg-blue-100 dark:bg-blue-900/30 text-blue-600',
								suggestion.color === 'green'
								&& 'bg-green-100 dark:bg-green-900/30 text-green-600',
								suggestion.color === 'orange'
								&& 'bg-orange-100 dark:bg-orange-900/30 text-orange-600',
								suggestion.color === 'purple'
								&& 'bg-purple-100 dark:bg-purple-900/30 text-purple-600',
							]"
						>
							<Icon :name="suggestion.icon" class="w-5 h-5" />
						</div>
						<div class="flex-1 min-w-0">
							<div class="flex items-center justify-between">
								<h4 class="font-medium text-gray-900 dark:text-white text-sm">
									{{ suggestion.title }}
								</h4>
								<span class="text-xs text-gray-400">{{
										Math.round(suggestion.confidence * 100)
									}}%</span>
							</div>
							<p class="text-xs text-gray-500 dark:text-gray-400 mt-1 line-clamp-2">
								{{ suggestion.description }}
							</p>
						</div>
						<Icon
							name="mdi:chevron-down"
							class="w-4 h-4 text-gray-400 transition-transform"
							:class="activeSuggestion === suggestion.id && 'rotate-180'"
						/>
					</div>
				</div>

				<!-- Expanded Actions -->
				<div v-if="activeSuggestion === suggestion.id" class="px-4 pb-4">
					<div class="pl-13 ml-10 flex gap-2">
						<button
							class="flex-1 px-3 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg text-sm transition-colors"
							@click="applySuggestion(suggestion.id)"
						>
							Apply Suggestion
						</button>
						<button class="px-3 py-2 border border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg text-sm transition-colors">
							Ignore
						</button>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>
