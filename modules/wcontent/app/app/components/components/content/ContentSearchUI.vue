<script setup lang="ts">
import { useContentSearch } from "@wrikka/composables";
import type { SearchIndexItem } from "../../../../shared/types/search";
import ContentSearchFilters from "./ContentSearchFilters.vue";
import ContentSearchResults from "./ContentSearchResults.vue";

const props = defineProps<{
	placeholder?: string;
	showFilters?: boolean;
	categories?: string[];
}>();

const emit = defineEmits<{
	select: [item: SearchIndexItem];
	clear: [];
}>();

const {
	query,
	selectedTags,
	selectedCategory,
	isSearching,
	results,
	error,
	recentSearches,
	hasResults,
	availableTags,
	performSearch,
	clearSearch,
	addTag,
	removeTag,
	toggleCategory,
	setQuery,
	highlightQuery,
	formatDate,
} = useContentSearch();

const showAdvancedFilters = ref(false);

const onClear = () => {
	clearSearch();
	emit("clear");
};

const onSelect = (item: SearchIndexItem) => {
	emit("select", item);
};
</script>

<template>
	<div class="content-search-ui">
		<div class="search-header">
			<div class="search-input-wrapper">
				<span class="search-icon">🔍</span>
				<input
					v-model="query"
					type="text"
					class="search-input"
					:placeholder="placeholder || 'Search contents...'"
					@keydown.enter="performSearch"
				/>
				<button v-if="query" class="clear-btn" @click="onClear">×</button>
			</div>

			<button
				class="filter-toggle"
				:class="{ active: showAdvancedFilters }"
				@click="showAdvancedFilters = !showAdvancedFilters"
			>
				Filters
			</button>
		</div>

		<ContentSearchFilters
			v-if="showAdvancedFilters"
			:selected-tags="selectedTags"
			:available-tags="availableTags"
			:selected-category="selectedCategory"
			:categories="categories"
			@add-tag="addTag"
			@remove-tag="removeTag"
			@toggle-category="toggleCategory"
		/>

		<div v-if="recentSearches.length > 0 && !query" class="recent-searches">
			<h4>Recent Searches</h4>
			<div class="recent-list">
				<button
					v-for="recent in recentSearches"
					:key="recent"
					class="recent-item"
					@click="setQuery(recent)"
				>
					{{ recent }}
				</button>
			</div>
		</div>

		<div v-if="isSearching" class="loading-state">Searching...</div>

		<div v-else-if="error" class="error-state">{{ error }}</div>

		<div v-else-if="query && !hasResults" class="empty-state">
			No results found for "{{ query }}"
		</div>

		<ContentSearchResults
			v-else-if="hasResults"
			:results="results"
			:highlight-query="highlightQuery"
			:format-date="formatDate"
			@select="onSelect"
		/>
	</div>
</template>

<style scoped>
.content-search-ui {
	display: flex;
	flex-direction: column;
	background: #fff;
	border: 1px solid #e5e7eb;
	border-radius: 0.5rem;
	overflow: hidden;
}

.search-header {
	display: flex;
	gap: 0.5rem;
	padding: 1rem;
	border-bottom: 1px solid #e5e7eb;
}

.search-input-wrapper {
	flex: 1;
	display: flex;
	align-items: center;
	gap: 0.5rem;
	padding: 0.5rem 0.75rem;
	border: 1px solid #d1d5db;
	border-radius: 0.5rem;
	background: #f9fafb;
}

.search-input-wrapper:focus-within {
	border-color: #3b82f6;
	box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

.search-icon {
	font-size: 1rem;
}

.search-input {
	flex: 1;
	border: none;
	background: transparent;
	font-size: 1rem;
	outline: none;
}

.clear-btn {
	width: 24px;
	height: 24px;
	border: none;
	background: #e5e7eb;
	border-radius: 50%;
	cursor: pointer;
	font-size: 1rem;
	line-height: 1;
	color: #6b7280;
}

.clear-btn:hover {
	background: #d1d5db;
}

.filter-toggle {
	padding: 0.5rem 1rem;
	border: 1px solid #d1d5db;
	border-radius: 0.5rem;
	background: #fff;
	cursor: pointer;
	font-weight: 500;
	transition: all 0.2s;
}

.filter-toggle.active {
	background: #dbeafe;
	border-color: #3b82f6;
	color: #1d4ed8;
}

.recent-searches {
	padding: 1rem;
	border-bottom: 1px solid #e5e7eb;
}

.recent-searches h4 {
	margin: 0 0 0.5rem;
	font-size: 0.875rem;
	font-weight: 500;
	color: #6b7280;
}

.recent-list {
	display: flex;
	flex-wrap: wrap;
	gap: 0.5rem;
}

.recent-item {
	padding: 0.25rem 0.75rem;
	border: 1px solid #e5e7eb;
	border-radius: 0.25rem;
	background: #f9fafb;
	font-size: 0.875rem;
	cursor: pointer;
	transition: all 0.2s;
}

.recent-item:hover {
	background: #f3f4f6;
}

.loading-state,
.error-state,
.empty-state {
	padding: 2rem;
	text-align: center;
	color: #6b7280;
}

.error-state {
	color: #dc2626;
}
</style>
