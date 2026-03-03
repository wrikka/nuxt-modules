<script setup lang="ts">
const emit = defineEmits<
	{ close: []; search: [query: string, filters: any] }
>();
const query = ref("");
const filters = ref({ type: "all", date: "any", sort: "relevance" });
const recentSearches = ref(["logo design", "intro video", "background music"]);
const search = () => emit("search", query.value, filters.value);
</script>
<template>
	<div class="search-filter bg-white dark:bg-gray-800 rounded-xl p-4 w-[500px] shadow-lg border border-gray-200 dark:border-gray-700">
		<div class="flex items-center justify-between mb-4">
			<h3 class="text-gray-900 dark:text-white font-semibold flex items-center gap-2">
				<Icon name="mdi:magnify" class="w-5 h-5 text-blue-500" />
				Search & Filter
			</h3>
			<button
				class="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
				@click="emit('close')"
			>
				<Icon name="mdi:close" class="w-5 h-5" />
			</button>
		</div>
		<div class="flex gap-2 mb-4">
			<input
				v-model="query"
				type="text"
				placeholder="Search..."
				class="flex-1 bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white px-3 py-2 rounded-lg text-sm border-0"
				@keydown.enter="search"
			/>
			<button
				class="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-colors"
				@click="search"
			>
				Search
			</button>
		</div>
		<div class="grid grid-cols-3 gap-2 mb-4">
			<select
				v-model="filters.type"
				class="bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white px-2 py-1.5 rounded-lg text-sm border-0"
			>
				<option value="all">All Types</option>
				<option>Projects</option>
				<option>Assets</option>
				<option>Templates</option>
			</select>
			<select
				v-model="filters.date"
				class="bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white px-2 py-1.5 rounded-lg text-sm border-0"
			>
				<option value="any">Any Time</option>
				<option>Today</option>
				<option>This Week</option>
				<option>This Month</option>
			</select>
			<select
				v-model="filters.sort"
				class="bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white px-2 py-1.5 rounded-lg text-sm border-0"
			>
				<option value="relevance">Relevance</option>
				<option>Date</option>
				<option>Name</option>
			</select>
		</div>
		<div v-if="recentSearches.length > 0">
			<div class="text-gray-500 dark:text-gray-400 text-xs mb-2 uppercase font-medium">
				Recent Searches
			</div>
			<div class="flex flex-wrap gap-2">
				<button
					v-for="s in recentSearches"
					:key="s"
					class="px-3 py-1 bg-gray-100 dark:bg-gray-700/50 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-full text-xs transition-colors"
					@click="query = s"
				>
					{{ s }}
				</button>
			</div>
		</div>
	</div>
</template>
