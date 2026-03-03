<script setup lang="ts">
const emit = defineEmits<{
	apply: [];
	dismiss: [];
}>();

const suggestions = [
	{ type: "folder", name: "Social Media Posts", count: 12, icon: "📱" },
	{ type: "folder", name: "Brand Assets", count: 8, icon: "🎨" },
	{ type: "tag", name: "Marketing", count: 15, icon: "🏷️" },
];
</script>

<template>
	<div class="bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20 border border-purple-200 dark:border-purple-800 rounded-xl p-4 mb-6">
		<div class="flex items-start gap-4">
			<div class="w-10 h-10 bg-gradient-to-br from-purple-500 to-blue-500 rounded-lg flex items-center justify-center text-xl">
				🤖
			</div>
			<div class="flex-1">
				<h3 class="font-semibold text-gray-900 dark:text-white">
					AI Organization Suggestions
				</h3>
				<p class="text-sm text-gray-600 dark:text-gray-400 mt-1">
					We found {{ suggestions.length }} ways to organize your projects
					better
				</p>
				<div class="flex flex-wrap gap-2 mt-3">
					<span
						v-for="suggestion in suggestions"
						:key="suggestion.name"
						class="inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm bg-white dark:bg-gray-800 border border-purple-200 dark:border-purple-700"
					>
						<span>{{ suggestion.icon }}</span>
						<span class="text-gray-700 dark:text-gray-300">{{
							suggestion.name
						}}</span>
						<span class="text-xs text-gray-500">({{ suggestion.count }})</span>
					</span>
				</div>
			</div>
			<div class="flex items-center gap-2">
				<button
					class="px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors text-sm font-medium"
					@click="emit('apply')"
				>
					Apply All
				</button>
				<button
					class="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
					@click="emit('dismiss')"
				>
					<svg
						class="w-5 h-5"
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
		</div>
	</div>
</template>
