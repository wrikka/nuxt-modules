<template>
	<div class="p-8 max-w-4xl mx-auto">
		<h1 class="text-3xl font-bold mb-6">Content Module Example</h1>

		<div class="grid gap-4">
			<div class="p-4 bg-gray-100 rounded-lg">
				<h2 class="text-xl font-semibold mb-2">Search</h2>
				<input
					v-model="searchQuery"
					type="text"
					placeholder="Search content..."
					class="w-full p-2 border rounded"
				/>
				<button
					class="mt-2 px-4 py-2 bg-blue-500 text-white rounded"
					@click="performSearch"
				>
					Search
				</button>
				<ul v-if="searchResults.length" class="mt-2">
					<li v-for="result in searchResults" :key="result.id" class="py-1">
						{{ result.title }}
					</li>
				</ul>
			</div>

			<div class="p-4 bg-gray-100 rounded-lg">
				<h2 class="text-xl font-semibold mb-2">Table of Contents</h2>
				<button
					class="px-4 py-2 bg-green-500 text-white rounded"
					@click="loadTableOfContents"
				>
					Load TOC
				</button>
				<ul v-if="toc.length" class="mt-2">
					<li v-for="item in toc" :key="item.id" class="py-1">
						{{ item.text }}
					</li>
				</ul>
			</div>

			<div class="p-4 bg-gray-100 rounded-lg">
				<h2 class="text-xl font-semibold mb-2">Reading Progress</h2>
				<p>Progress: {{ readingProgress }}%</p>
				<div class="w-full bg-gray-300 rounded-full h-4 mt-2">
					<div
						class="bg-blue-500 h-4 rounded-full"
						:style="{ width: `${readingProgress}%` }"
					>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
const { search } = useContent();
const { toc, loadTableOfContents: loadToc } = useTableOfContents();
const { progress } = useReadingProgress();

const searchQuery = ref("");
const searchResults = ref<Array<{ id: string; title: string }>>([]);
const readingProgress = computed(() => Math.round(progress.value * 100));

const performSearch = async () => {
	if (searchQuery.value.trim()) {
		const results = await search(searchQuery.value);
		searchResults.value = results || [];
	}
};

const loadTableOfContents = async () => {
	await loadToc();
};
</script>
