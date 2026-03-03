<script setup lang="ts">
interface Props {
	isOpen: boolean;
}

const props = defineProps<Props>();
const emit = defineEmits<{
	(event: "close"): void;
}>();

const variants = ref([
	{
		id: "A",
		name: "Variant A",
		ctr: 4.2,
		impressions: 1250,
		clicks: 53,
		selected: true,
	},
	{
		id: "B",
		name: "Variant B",
		ctr: 3.8,
		impressions: 1200,
		clicks: 46,
		selected: false,
	},
	{
		id: "C",
		name: "Variant C",
		ctr: 5.1,
		impressions: 1180,
		clicks: 60,
		selected: false,
	},
]);

const isGenerating = ref(false);

const onGenerateVariants = () => {
	isGenerating.value = true;
	setTimeout(() => {
		isGenerating.value = false;
	}, 3000);
};

const predictedWinner = computed(() => {
	return variants.value.reduce((
		prev,
		current,
	) => (current.ctr > prev.ctr ? current : prev));
});
</script>

<template>
	<ModalDialog
		:is-open="props.isOpen"
		title="AI Thumbnail A/B Test"
		@close="emit('close')"
	>
		<div class="space-y-5">
			<p class="text-sm text-gray-600 dark:text-gray-400">
				Generate thumbnail variants and get AI predictions on click-through
				rates.
			</p>

			<!-- Generate Button -->
			<button
				class="w-full px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 disabled:opacity-50"
				:disabled="isGenerating"
				@click="onGenerateVariants"
			>
				<Icon
					v-if="isGenerating"
					name="mdi:loading"
					class="w-4 h-4 animate-spin inline mr-2"
				/>
				<Icon v-else name="mdi:sparkles" class="w-4 h-4 inline mr-2" />
				{{ isGenerating ? "Generating Variants..." : "Generate AI Variants" }}
			</button>

			<!-- Variants -->
			<div class="grid grid-cols-3 gap-3">
				<div
					v-for="variant in variants"
					:key="variant.id"
					class="relative rounded-lg overflow-hidden border-2 transition-all"
					:class="variant.selected
					? 'border-blue-500'
					: 'border-gray-200 dark:border-gray-700'"
				>
					<div class="aspect-video bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
						<Icon name="mdi:image" class="w-8 h-8 text-gray-400" />
						<span
							class="absolute top-2 left-2 px-2 py-1 bg-black/50 text-white text-xs rounded"
						>{{ variant.name }}</span>
					</div>
					<div class="p-2 bg-gray-50 dark:bg-gray-800">
						<div class="flex items-center justify-between">
							<span class="text-sm font-medium">{{ variant.ctr }}% CTR</span>
							<span class="text-xs text-gray-500">{{ variant.clicks }}/{{
									variant.impressions
								}}</span>
						</div>
						<div
							v-if="variant.id === predictedWinner.id"
							class="mt-1 text-xs text-green-600 font-medium"
						>
							<Icon name="mdi:trophy" class="w-3 h-3 inline mr-1" />
							Predicted Winner
						</div>
					</div>
				</div>
			</div>

			<!-- Stats -->
			<div class="bg-gray-100 dark:bg-gray-800 rounded-lg p-4">
				<h4 class="font-medium text-gray-900 dark:text-white mb-3">
					Performance Prediction
				</h4>
				<div class="space-y-2">
					<div class="flex items-center justify-between">
						<span class="text-sm text-gray-600 dark:text-gray-400"
						>Predicted CTR Range</span>
						<span class="text-sm font-medium">3.8% - 5.1%</span>
					</div>
					<div class="flex items-center justify-between">
						<span class="text-sm text-gray-600 dark:text-gray-400"
						>Confidence Score</span>
						<span class="text-sm font-medium">87%</span>
					</div>
					<div class="flex items-center justify-between">
						<span class="text-sm text-gray-600 dark:text-gray-400"
						>Recommended Variant</span>
						<span class="text-sm font-medium text-green-600">{{
							predictedWinner.name
						}}</span>
					</div>
				</div>
			</div>
		</div>
	</ModalDialog>
</template>
