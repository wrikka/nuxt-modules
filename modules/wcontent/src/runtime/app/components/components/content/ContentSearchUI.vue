<script setup lang="ts">
import { computed, ref, watch } from "vue";
import type {
	SearchIndexItem,
	SearchOptions,
	SearchResult,
} from "../../../../shared/types/search";
import { useSearch } from "../../../composables/useSearch";

const props = defineProps<{
	placeholder?: string;
	showFilters?: boolean;
	categories?: string[];
}>();

const emit = defineEmits<{
	select: [item: SearchIndexItem];
	clear: [];
}>();

const { search } = useSearch();

const query = ref("");
const selectedTags = ref<string[]>([]);
const selectedCategory = ref<string | null>(null);
const isSearching = ref(false);
const results = ref<SearchResult | null>(null);
const error = ref<string | null>(null);
const showAdvancedFilters = ref(false);

const tagInput = ref("");
const recentSearches = ref<string[]>([]);
const searchHistory = ref<string[]>([]);

const hasResults = computed(() => {
	return results.value && results.value.items.length > 0;
});

const availableTags = computed(() => {
	const tags = new Set<string>();
	results.value?.items.forEach((item) => {
		item.tags.forEach((tag) => tags.add(tag));
	});
	return Array.from(tags);
});

const handleSearch = async () => {
	if (!query.value.trim()) {
		results.value = null;
		return;
	}

	isSearching.value = true;
	error.value = null;

	try {
		const options: SearchOptions = {
			query: query.value,
			tags: selectedTags.value.length > 0 ? selectedTags.value : undefined,
			category: selectedCategory.value || undefined,
			limit: 20,
		};

		results.value = await search(options);

		if (!recentSearches.value.includes(query.value)) {
			recentSearches.value = [query.value, ...recentSearches.value.slice(0, 4)];
		}
	} catch (e: any) {
		error.value = e.message || "Search failed";
	} finally {
		isSearching.value = false;
	}
};

const clearSearch = () => {
	query.value = "";
	selectedTags.value = [];
	selectedCategory.value = null;
	results.value = null;
	error.value = null;
	emit("clear");
};

const addTag = () => {
	const tag = tagInput.value.trim().toLowerCase();
	if (tag && !selectedTags.value.includes(tag)) {
		selectedTags.value.push(tag);
	}
	tagInput.value = "";
};

const removeTag = (tag: string) => {
	selectedTags.value = selectedTags.value.filter((t) => t !== tag);
};

const toggleCategory = (category: string) => {
	selectedCategory.value = selectedCategory.value === category
		? null
		: category;
};

const formatDate = (timestamp: number) => {
	return new Date(timestamp).toLocaleDateString("th-TH", {
		year: "numeric",
		month: "short",
		day: "numeric",
	});
};

const highlightQuery = (text: string) => {
	if (!query.value) return text;
	const regex = new RegExp(`(${query.value})`, "gi");
	return text.replace(regex, "<mark>$1</mark>");
};

let searchTimeout: ReturnType<typeof setTimeout>;
watch(query, () => {
	clearTimeout(searchTimeout);
	searchTimeout = setTimeout(handleSearch, 300);
});

watch([selectedTags, selectedCategory], () => {
	if (query.value.trim()) {
		handleSearch();
	}
});
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
					@keydown.enter="handleSearch"
				/>
				<button
					v-if="query"
					class="clear-btn"
					@click="clearSearch"
				>
					×
				</button>
			</div>

			<button
				class="filter-toggle"
				:class="{ active: showAdvancedFilters }"
				@click="showAdvancedFilters = !showAdvancedFilters"
			>
				Filters
			</button>
		</div>

		<div
			v-if="showAdvancedFilters"
			class="advanced-filters"
		>
			<div class="filter-section">
				<label>Tags</label>
				<div class="tags-input-wrapper">
					<span
						v-for="tag in selectedTags"
						:key="tag"
						class="selected-tag"
					>
						{{ tag }}
						<button
							class="tag-remove"
							@click="removeTag(tag)"
						>
							×
						</button>
					</span>
					<input
						v-model="tagInput"
						type="text"
						class="tag-input"
						placeholder="Add tag..."
						@keydown.enter.prevent="addTag"
						@blur="addTag"
					/>
				</div>
				<div
					v-if="availableTags.length > 0"
					class="suggested-tags"
				>
					<span class="suggestion-label">Suggested:</span>
					<button
						v-for="tag in availableTags.slice(0, 5)"
						:key="tag"
						class="suggested-tag"
						:class="{ active: selectedTags.includes(tag) }"
						@click="selectedTags.includes(tag)
						? removeTag(tag)
						: selectedTags.push(tag)"
					>
						{{ tag }}
					</button>
				</div>
			</div>

			<div
				v-if="categories?.length"
				class="filter-section"
			>
				<label>Category</label>
				<div class="category-buttons">
					<button
						v-for="cat in categories"
						:key="cat"
						class="category-btn"
						:class="{ active: selectedCategory === cat }"
						@click="toggleCategory(cat)"
					>
						{{ cat }}
					</button>
				</div>
			</div>
		</div>

		<div
			v-if="recentSearches.length > 0 && !query"
			class="recent-searches"
		>
			<h4>Recent Searches</h4>
			<div class="recent-list">
				<button
					v-for="recent in recentSearches"
					:key="recent"
					class="recent-item"
					@click="query = recent"
				>
					{{ recent }}
				</button>
			</div>
		</div>

		<div
			v-if="isSearching"
			class="loading-state"
		>
			Searching...
		</div>

		<div
			v-else-if="error"
			class="error-state"
		>
			{{ error }}
		</div>

		<div
			v-else-if="query && !hasResults"
			class="empty-state"
		>
			No results found for "{{ query }}"
		</div>

		<div
			v-else-if="hasResults"
			class="search-results"
		>
			<div class="results-header">
				<span class="results-count">
					{{ results?.total }} result{{ results?.total !== 1 ? "s" : "" }}
				</span>
				<span class="results-query">for "{{ results?.query }}"</span>
			</div>

			<div class="results-list">
				<div
					v-for="item in results?.items"
					:key="item.id"
					class="result-item"
					@click="emit('select', item)"
				>
					<div class="result-main">
						<h4
							class="result-title"
							v-html="highlightQuery(item.title)"
						/>
						<p
							class="result-content"
							v-html="highlightQuery(item.content.slice(0, 150) + '...')"
						/>
					</div>

					<div class="result-meta">
						<span
							v-if="item.category"
							class="result-category"
						>
							{{ item.category }}
						</span>
						<div
							v-if="item.tags.length"
							class="result-tags"
						>
							<span
								v-for="tag in item.tags.slice(0, 3)"
								:key="tag"
								class="tag"
							>
								{{ tag }}
							</span>
						</div>
						<span class="result-date">{{ formatDate(item.updatedAt) }}</span>
						<span class="result-author">by {{ item.author }}</span>
					</div>
				</div>
			</div>
		</div>
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

.advanced-filters {
	padding: 1rem;
	border-bottom: 1px solid #e5e7eb;
	background: #f9fafb;
}

.filter-section {
	margin-bottom: 1rem;
}

.filter-section:last-child {
	margin-bottom: 0;
}

.filter-section label {
	display: block;
	margin-bottom: 0.5rem;
	font-size: 0.875rem;
	font-weight: 500;
	color: #374151;
}

.tags-input-wrapper {
	display: flex;
	flex-wrap: wrap;
	gap: 0.5rem;
	padding: 0.5rem;
	border: 1px solid #d1d5db;
	border-radius: 0.375rem;
	background: #fff;
}

.selected-tag {
	display: inline-flex;
	align-items: center;
	gap: 0.25rem;
	padding: 0.25rem 0.5rem;
	background: #dbeafe;
	color: #1d4ed8;
	border-radius: 0.25rem;
	font-size: 0.875rem;
}

.tag-remove {
	background: none;
	border: none;
	color: #1d4ed8;
	cursor: pointer;
	font-size: 1rem;
	line-height: 1;
}

.tag-input {
	flex: 1;
	min-width: 100px;
	border: none;
	outline: none;
	font-size: 0.875rem;
}

.suggested-tags {
	display: flex;
	flex-wrap: wrap;
	gap: 0.5rem;
	margin-top: 0.5rem;
	align-items: center;
}

.suggestion-label {
	font-size: 0.75rem;
	color: #9ca3af;
}

.suggested-tag {
	padding: 0.25rem 0.5rem;
	border: 1px solid #e5e7eb;
	border-radius: 0.25rem;
	background: #fff;
	font-size: 0.75rem;
	cursor: pointer;
	transition: all 0.2s;
}

.suggested-tag.active {
	background: #dbeafe;
	border-color: #3b82f6;
	color: #1d4ed8;
}

.category-buttons {
	display: flex;
	flex-wrap: wrap;
	gap: 0.5rem;
}

.category-btn {
	padding: 0.375rem 0.75rem;
	border: 1px solid #e5e7eb;
	border-radius: 0.25rem;
	background: #fff;
	font-size: 0.875rem;
	cursor: pointer;
	transition: all 0.2s;
}

.category-btn.active {
	background: #3b82f6;
	border-color: #3b82f6;
	color: #fff;
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

.search-results {
	padding: 1rem;
}

.results-header {
	margin-bottom: 1rem;
	padding-bottom: 0.75rem;
	border-bottom: 1px solid #f3f4f6;
}

.results-count {
	font-weight: 600;
	color: #111827;
}

.results-query {
	margin-left: 0.25rem;
	color: #6b7280;
}

.results-list {
	display: flex;
	flex-direction: column;
	gap: 0.75rem;
}

.result-item {
	padding: 1rem;
	border: 1px solid #e5e7eb;
	border-radius: 0.5rem;
	cursor: pointer;
	transition: all 0.2s;
}

.result-item:hover {
	border-color: #3b82f6;
	box-shadow: 0 2px 4px -1px rgba(0, 0, 0, 0.06);
}

.result-main {
	margin-bottom: 0.75rem;
}

.result-title {
	margin: 0 0 0.5rem;
	font-size: 1rem;
	font-weight: 600;
	color: #111827;
}

.result-title :deep(mark) {
	background: #fef08a;
	padding: 0 0.125rem;
	border-radius: 0.125rem;
}

.result-content {
	margin: 0;
	font-size: 0.875rem;
	color: #6b7280;
	line-height: 1.5;
}

.result-content :deep(mark) {
	background: #fef08a;
	padding: 0 0.125rem;
	border-radius: 0.125rem;
}

.result-meta {
	display: flex;
	flex-wrap: wrap;
	gap: 0.5rem;
	align-items: center;
}

.result-category {
	padding: 0.125rem 0.5rem;
	background: #dbeafe;
	color: #1d4ed8;
	border-radius: 0.25rem;
	font-size: 0.75rem;
	font-weight: 500;
}

.result-tags {
	display: flex;
	gap: 0.25rem;
}

.result-tags .tag {
	padding: 0.125rem 0.375rem;
	background: #f3f4f6;
	color: #374151;
	border-radius: 0.25rem;
	font-size: 0.75rem;
}

.result-date,
.result-author {
	font-size: 0.75rem;
	color: #9ca3af;
}
</style>
