<script setup lang="ts">
interface Props {
	isOpen: boolean;
}

const props = defineProps<Props>();
const emit = defineEmits<{
	(event: "close"): void;
}>();

const seoData = reactive({
	title: "How to Edit Videos Like a Pro - Complete Tutorial",
	description:
		"Learn professional video editing techniques with this comprehensive guide covering everything from basics to advanced effects.",
	tags: ["video editing", "tutorial", "premiere pro", " filmmaking"],
	category: "Education",
	privacy: "public",
});

const suggestions = ref({
	title: {
		score: 85,
		tips: ["Add year 2024", "Include \"beginner friendly\""],
	},
	description: {
		score: 72,
		tips: ["Add timestamps", "Include keywords early"],
	},
	tags: { score: 60, tips: ["Add 5 more tags", "Include trending terms"] },
});

const isOptimizing = ref(false);

const onOptimize = () => {
	isOptimizing.value = true;
	setTimeout(() => {
		isOptimizing.value = false;
	}, 2000);
};

const removeTag = (index: number) => {
	seoData.tags.splice(index, 1);
};

const newTag = ref("");
const addTag = () => {
	if (newTag.value.trim()) {
		seoData.tags.push(newTag.value.trim());
		newTag.value = "";
	}
};
</script>

<template>
	<ModalDialog
		:is-open="props.isOpen"
		title="Video SEO Optimizer"
		@close="emit('close')"
	>
		<div class="space-y-5">
			<p class="text-sm text-gray-600 dark:text-gray-400">
				AI-powered suggestions for titles, tags, and descriptions to maximize
				visibility.
			</p>

			<!-- Title -->
			<div>
				<div class="flex items-center justify-between mb-1">
					<label class="text-sm font-medium text-gray-700 dark:text-gray-300"
					>Title</label>
					<span
						class="text-xs"
						:class="suggestions.title.score > 80
						? 'text-green-500'
						: suggestions.title.score > 60
						? 'text-yellow-500'
						: 'text-red-500'"
					>
						Score: {{ suggestions.title.score }}/100
					</span>
				</div>
				<input
					v-model="seoData.title"
					type="text"
					class="w-full px-3 py-2 border rounded-lg dark:bg-gray-800 dark:border-gray-700"
				/>
				<div
					v-if="suggestions.title.tips.length"
					class="mt-1 flex flex-wrap gap-1"
				>
					<span
						v-for="tip in suggestions.title.tips"
						:key="tip"
						class="text-xs px-2 py-0.5 bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-200 rounded"
					>
						<Icon name="mdi:lightbulb" class="w-3 h-3 inline mr-1" />
						{{ tip }}
					</span>
				</div>
			</div>

			<!-- Description -->
			<div>
				<div class="flex items-center justify-between mb-1">
					<label class="text-sm font-medium text-gray-700 dark:text-gray-300"
					>Description</label>
					<span
						class="text-xs"
						:class="suggestions.description.score > 80
						? 'text-green-500'
						: suggestions.description.score > 60
						? 'text-yellow-500'
						: 'text-red-500'"
					>
						Score: {{ suggestions.description.score }}/100
					</span>
				</div>
				<textarea
					v-model="seoData.description"
					rows="3"
					class="w-full px-3 py-2 border rounded-lg dark:bg-gray-800 dark:border-gray-700"
				/>
			</div>

			<!-- Tags -->
			<div>
				<div class="flex items-center justify-between mb-1">
					<label class="text-sm font-medium text-gray-700 dark:text-gray-300"
					>Tags ({{ seoData.tags.length }})</label>
					<span
						class="text-xs"
						:class="suggestions.tags.score > 80
						? 'text-green-500'
						: suggestions.tags.score > 60
						? 'text-yellow-500'
						: 'text-red-500'"
					>
						Score: {{ suggestions.tags.score }}/100
					</span>
				</div>
				<div class="flex flex-wrap gap-2 mb-2">
					<span
						v-for="(tag, i) in seoData.tags"
						:key="i"
						class="inline-flex items-center gap-1 px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200 rounded-full text-sm"
					>
						{{ tag }}
						<button class="hover:text-red-500" @click="removeTag(i)">
							<Icon name="mdi:close" class="w-3 h-3" />
						</button>
					</span>
				</div>
				<div class="flex gap-2">
					<input
						v-model="newTag"
						type="text"
						placeholder="Add tag..."
						class="flex-1 px-3 py-1.5 border rounded-lg text-sm dark:bg-gray-800 dark:border-gray-700"
						@keyup.enter="addTag"
					/>
					<button
						class="px-3 py-1.5 bg-blue-500 text-white rounded-lg text-sm"
						@click="addTag"
					>
						Add
					</button>
				</div>
			</div>

			<!-- Overall Score -->
			<div class="bg-gray-100 dark:bg-gray-800 rounded-lg p-4">
				<div class="flex items-center justify-between">
					<div>
						<h4 class="font-medium text-gray-900 dark:text-white">
							Overall SEO Score
						</h4>
						<p class="text-sm text-gray-500">
							Based on title, description, and tags
						</p>
					</div>
					<div
						class="w-16 h-16 rounded-full border-4 flex items-center justify-center"
						:class="(suggestions.title.score + suggestions.description.score
									+ suggestions.tags.score) / 3 > 75
						? 'border-green-500 text-green-500'
						: 'border-yellow-500 text-yellow-500'"
					>
						<span class="text-lg font-bold">{{
							Math.round(
								(suggestions.title.score + suggestions.description.score
									+ suggestions.tags.score) / 3,
							)
						}}</span>
					</div>
				</div>
			</div>

			<button
				class="w-full px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 disabled:opacity-50"
				:disabled="isOptimizing"
				@click="onOptimize"
			>
				<Icon
					v-if="isOptimizing"
					name="mdi:loading"
					class="w-4 h-4 animate-spin inline mr-2"
				/>
				<Icon v-else name="mdi:magic" class="w-4 h-4 inline mr-2" />
				{{ isOptimizing ? "Optimizing..." : "AI Optimize All" }}
			</button>
		</div>
	</ModalDialog>
</template>
