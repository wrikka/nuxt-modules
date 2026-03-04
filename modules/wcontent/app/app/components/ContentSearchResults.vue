<script setup lang="ts">
import type { SearchIndexItem, SearchResult } from "../../shared/types/search";

interface Props {
	results: SearchResult | null;
	highlightQuery: (text: string) => string;
	formatDate: (timestamp: number) => string;
}

defineProps<Props>();

const emit = defineEmits<{
	select: [item: SearchIndexItem];
}>();
</script>

<template>
	<div v-if="results && results.items.length > 0" class="search-results">
		<div class="results-header">
			<span class="results-count">
				{{ results.total }} result{{ results.total !== 1 ? "s" : "" }}
			</span>
			<span class="results-query">for "{{ results.query }}"</span>
		</div>

		<div class="results-list">
			<div
				v-for="item in results.items"
				:key="item.id"
				class="result-item"
				@click="emit('select', item)"
			>
				<div class="result-main">
					<h4 class="result-title" v-html="highlightQuery(item.title)" />
					<p class="result-content" v-html="highlightQuery(item.content.slice(0, 150) + '...')" />
				</div>

				<div class="result-meta">
					<span v-if="item.category" class="result-category">
						{{ item.category }}
					</span>
					<div v-if="item.tags.length" class="result-tags">
						<span v-for="tag in item.tags.slice(0, 3)" :key="tag" class="tag">
							{{ tag }}
						</span>
					</div>
					<span class="result-date">{{ formatDate(item.updatedAt) }}</span>
					<span class="result-author">by {{ item.author }}</span>
				</div>
			</div>
		</div>
	</div>
</template>

<style scoped>
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
