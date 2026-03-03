<script setup lang="ts">
const props = defineProps<{
	tags: string[];
	allTags?: string[];
}>();

const emit = defineEmits<{
	add: [tag: string];
	remove: [tag: string];
	close: [];
}>();

const newTag = ref("");
const predefinedColors = [
	{
		name: "Blue",
		class: "bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300",
	},
	{
		name: "Green",
		class: "bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300",
	},
	{
		name: "Yellow",
		class:
			"bg-yellow-100 dark:bg-yellow-900 text-yellow-700 dark:text-yellow-300",
	},
	{
		name: "Red",
		class: "bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-300",
	},
	{
		name: "Purple",
		class:
			"bg-purple-100 dark:bg-purple-900 text-purple-700 dark:text-purple-300",
	},
	{
		name: "Pink",
		class: "bg-pink-100 dark:bg-pink-900 text-pink-700 dark:text-pink-300",
	},
	{
		name: "Gray",
		class: "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300",
	},
];

const addTag = () => {
	if (newTag.value.trim() && !props.tags.includes(newTag.value.trim())) {
		emit("add", newTag.value.trim());
		newTag.value = "";
	}
};

const handleKeydown = (e: KeyboardEvent) => {
	if (e.key === "Enter") {
		addTag();
	}
};
</script>

<template>
	<div class="fixed inset-0 z-50 flex items-center justify-center p-4">
		<!-- Backdrop -->
		<div class="absolute inset-0 bg-black/70" @click="emit('close')" />

		<!-- Modal -->
		<div class="relative bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-md w-full">
			<div class="p-6">
				<div class="flex items-center justify-between mb-6">
					<h2 class="text-xl font-bold text-gray-900 dark:text-white">
						Manage Tags
					</h2>
					<button
						class="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
						@click="emit('close')"
					>
						<svg
							class="w-5 h-5 text-gray-500"
							fill="none"
							stroke="currentColor"
							viewBox="0 0 24 24"
						>
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M6 18L18 6M6 6l12 12"
							/>
						</svg>
					</button>
				</div>

				<!-- Add New Tag -->
				<div class="flex gap-2 mb-4">
					<input
						v-model="newTag"
						type="text"
						placeholder="Add new tag..."
						class="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
						@keydown="handleKeydown"
					/>
					<button
						class="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors font-medium"
						@click="addTag"
					>
						Add
					</button>
				</div>

				<!-- Current Tags -->
				<div class="mb-4">
					<h3 class="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
						Current Tags
					</h3>
					<div class="flex flex-wrap gap-2">
						<span
							v-for="(tag, index) in tags"
							:key="tag"
							class="inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm"
							:class="predefinedColors[index % predefinedColors.length]?.class"
						>
							{{ tag }}
							<button
								class="ml-1 hover:opacity-70"
								@click="emit('remove', tag)"
							>
								<svg
									class="w-3 h-3"
									fill="none"
									stroke="currentColor"
									viewBox="0 0 24 24"
								>
									<path
										stroke-linecap="round"
										stroke-linejoin="round"
										stroke-width="2"
										d="M6 18L18 6M6 6l12 12"
									/>
								</svg>
							</button>
						</span>
						<span
							v-if="tags.length === 0"
							class="text-sm text-gray-500 dark:text-gray-400"
						>
							No tags added yet
						</span>
					</div>
				</div>

				<!-- Suggested Tags -->
				<div v-if="allTags && allTags.length > 0">
					<h3 class="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
						Suggested Tags
					</h3>
					<div class="flex flex-wrap gap-2">
						<button
							v-for="tag in allTags.filter(t => !tags.includes(t)).slice(0, 10)"
							:key="tag"
							class="px-3 py-1 rounded-full text-sm border border-gray-300 dark:border-gray-600 hover:border-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 text-gray-700 dark:text-gray-300 transition-colors"
							@click="emit('add', tag)"
						>
							+ {{ tag }}
						</button>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>
