<script setup lang="ts">
import { computed, onMounted, ref } from "vue";
import type { ContentItem } from "../../../../shared/types/index";

const props = defineProps<{
	contents?: ContentItem[];
}>();

const emit = defineEmits<{
	select: [content: ContentItem];
	create: [];
	edit: [content: ContentItem];
	delete: [content: ContentItem];
}>();

const searchQuery = ref("");
const selectedCategory = ref<string | null>(null);
const sortBy = ref<"title" | "updatedAt" | "order">("updatedAt");
const sortOrder = ref<"asc" | "desc">("desc");
const loading = ref(false);

const categories = computed(() => {
	const cats = new Set<string>();
	props.contents?.forEach((c) => {
		if (c.category) cats.add(c.category);
	});
	return Array.from(cats);
});

const filteredContents = computed(() => {
	let items = [...(props.contents || [])];

	if (searchQuery.value) {
		const query = searchQuery.value.toLowerCase();
		items = items.filter(
			(c) =>
				c.title?.toLowerCase().includes(query)
				|| c.description?.toLowerCase().includes(query)
				|| c.tags?.some((t) => t.toLowerCase().includes(query)),
		);
	}

	if (selectedCategory.value) {
		items = items.filter((c) => c.category === selectedCategory.value);
	}

	items.sort((a, b) => {
		let comparison = 0;
		if (sortBy.value === "title") {
			comparison = (a.title || "").localeCompare(b.title || "");
		} else if (sortBy.value === "updatedAt") {
			comparison = new Date(a.updatedAt || 0).getTime()
				- new Date(b.updatedAt || 0).getTime();
		} else {
			comparison = (a.order || 0) - (b.order || 0);
		}
		return sortOrder.value === "asc" ? comparison : -comparison;
	});

	return items;
});

const stats = computed(() => ({
	total: props.contents?.length || 0,
	categories: categories.value.length,
	recentUpdates: props.contents?.filter((c) => {
		if (!c.updatedAt) return false;
		const date = new Date(c.updatedAt);
		const weekAgo = new Date();
		weekAgo.setDate(weekAgo.getDate() - 7);
		return date > weekAgo;
	}).length || 0,
}));

const formatDate = (dateStr?: string) => {
	if (!dateStr) return "N/A";
	return new Date(dateStr).toLocaleDateString("th-TH", {
		year: "numeric",
		month: "short",
		day: "numeric",
	});
};
</script>

<template>
	<div class="content-dashboard">
		<div class="dashboard-header">
			<div class="header-title">
				<h2>Content Dashboard</h2>
				<button
					class="btn btn-primary"
					@click="emit('create')"
				>
					+ New Content
				</button>
			</div>

			<div class="stats-grid">
				<div class="stat-card">
					<span class="stat-value">{{ stats.total }}</span>
					<span class="stat-label">Total Contents</span>
				</div>
				<div class="stat-card">
					<span class="stat-value">{{ stats.categories }}</span>
					<span class="stat-label">Categories</span>
				</div>
				<div class="stat-card">
					<span class="stat-value">{{ stats.recentUpdates }}</span>
					<span class="stat-label">Updated This Week</span>
				</div>
			</div>
		</div>

		<div class="dashboard-toolbar">
			<div class="search-box">
				<input
					v-model="searchQuery"
					type="text"
					class="search-input"
					placeholder="Search contents..."
				/>
			</div>

			<div class="filter-group">
				<select
					v-model="selectedCategory"
					class="filter-select"
				>
					<option :value="null">All Categories</option>
					<option
						v-for="cat in categories"
						:key="cat"
						:value="cat"
					>
						{{ cat }}
					</option>
				</select>

				<select
					v-model="sortBy"
					class="filter-select"
				>
					<option value="updatedAt">Sort by Date</option>
					<option value="title">Sort by Title</option>
					<option value="order">Sort by Order</option>
				</select>

				<button
					class="sort-toggle"
					@click="sortOrder = sortOrder === 'asc' ? 'desc' : 'asc'"
				>
					{{ sortOrder === "asc" ? "↑" : "↓" }}
				</button>
			</div>
		</div>

		<div class="content-grid">
			<div
				v-if="loading"
				class="loading-state"
			>
				Loading contents...
			</div>

			<div
				v-else-if="filteredContents.length === 0"
				class="empty-state"
			>
				<p>No contents found</p>
				<button
					class="btn btn-secondary"
					@click="emit('create')"
				>
					Create your first content
				</button>
			</div>

			<div
				v-else
				class="content-list"
			>
				<div
					v-for="content in filteredContents"
					:key="content._path"
					class="content-card"
					@click="emit('select', content)"
				>
					<div class="card-header">
						<span
							v-if="content.category"
							class="card-category"
						>
							{{ content.category }}
						</span>
						<span class="card-date">{{ formatDate(content.updatedAt) }}</span>
					</div>

					<h3 class="card-title">{{ content.title || "Untitled" }}</h3>

					<p class="card-description">
						{{ content.description || "No description" }}
					</p>

					<div
						v-if="content.tags?.length"
						class="card-tags"
					>
						<span
							v-for="tag in content.tags.slice(0, 3)"
							:key="tag"
							class="tag"
						>
							{{ tag }}
						</span>
						<span
							v-if="content.tags.length > 3"
							class="tag-more"
						>
							+{{ content.tags.length - 3 }}
						</span>
					</div>

					<div class="card-actions">
						<button
							class="action-btn"
							@click.stop="emit('edit', content)"
						>
							Edit
						</button>
						<button
							class="action-btn action-btn-danger"
							@click.stop="emit('delete', content)"
						>
							Delete
						</button>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<style scoped>
.content-dashboard {
	display: flex;
	flex-direction: column;
	gap: 1.5rem;
	padding: 1.5rem;
}

.dashboard-header {
	display: flex;
	flex-direction: column;
	gap: 1rem;
}

.header-title {
	display: flex;
	justify-content: space-between;
	align-items: center;
}

.header-title h2 {
	margin: 0;
	font-size: 1.5rem;
	font-weight: 700;
}

.stats-grid {
	display: grid;
	grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
	gap: 1rem;
}

.stat-card {
	display: flex;
	flex-direction: column;
	padding: 1rem;
	background: #f9fafb;
	border-radius: 0.5rem;
	border: 1px solid #e5e7eb;
}

.stat-value {
	font-size: 1.5rem;
	font-weight: 700;
	color: #3b82f6;
}

.stat-label {
	font-size: 0.875rem;
	color: #6b7280;
}

.dashboard-toolbar {
	display: flex;
	justify-content: space-between;
	align-items: center;
	gap: 1rem;
	flex-wrap: wrap;
}

.search-box {
	flex: 1;
	min-width: 200px;
	max-width: 400px;
}

.search-input {
	width: 100%;
	padding: 0.75rem 1rem;
	border: 1px solid #d1d5db;
	border-radius: 0.5rem;
	font-size: 1rem;
}

.search-input:focus {
	outline: none;
	border-color: #3b82f6;
	box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

.filter-group {
	display: flex;
	gap: 0.5rem;
	align-items: center;
}

.filter-select {
	padding: 0.75rem 1rem;
	border: 1px solid #d1d5db;
	border-radius: 0.5rem;
	background: #fff;
	font-size: 0.875rem;
	cursor: pointer;
}

.sort-toggle {
	padding: 0.75rem;
	border: 1px solid #d1d5db;
	border-radius: 0.5rem;
	background: #fff;
	cursor: pointer;
	font-size: 1rem;
}

.content-grid {
	min-height: 300px;
}

.loading-state,
.empty-state {
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	padding: 3rem;
	text-align: center;
	color: #6b7280;
}

.content-list {
	display: grid;
	grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
	gap: 1rem;
}

.content-card {
	display: flex;
	flex-direction: column;
	padding: 1rem;
	background: #fff;
	border: 1px solid #e5e7eb;
	border-radius: 0.5rem;
	cursor: pointer;
	transition: all 0.2s;
}

.content-card:hover {
	border-color: #3b82f6;
	box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
}

.card-header {
	display: flex;
	justify-content: space-between;
	align-items: center;
	margin-bottom: 0.5rem;
}

.card-category {
	padding: 0.25rem 0.5rem;
	background: #dbeafe;
	color: #1d4ed8;
	border-radius: 0.25rem;
	font-size: 0.75rem;
	font-weight: 500;
}

.card-date {
	font-size: 0.75rem;
	color: #9ca3af;
}

.card-title {
	margin: 0 0 0.5rem;
	font-size: 1.125rem;
	font-weight: 600;
	color: #111827;
}

.card-description {
	margin: 0 0 0.75rem;
	font-size: 0.875rem;
	color: #6b7280;
	line-height: 1.5;
	display: -webkit-box;
	-webkit-line-clamp: 2;
	-webkit-box-orient: vertical;
	overflow: hidden;
}

.card-tags {
	display: flex;
	flex-wrap: wrap;
	gap: 0.25rem;
	margin-bottom: 0.75rem;
}

.tag {
	padding: 0.125rem 0.5rem;
	background: #f3f4f6;
	color: #374151;
	border-radius: 0.25rem;
	font-size: 0.75rem;
}

.tag-more {
	padding: 0.125rem 0.5rem;
	background: #e5e7eb;
	color: #6b7280;
	border-radius: 0.25rem;
	font-size: 0.75rem;
}

.card-actions {
	display: flex;
	gap: 0.5rem;
	margin-top: auto;
	padding-top: 0.75rem;
	border-top: 1px solid #f3f4f6;
}

.action-btn {
	padding: 0.375rem 0.75rem;
	border: 1px solid #d1d5db;
	border-radius: 0.25rem;
	background: #fff;
	font-size: 0.875rem;
	cursor: pointer;
	transition: all 0.2s;
}

.action-btn:hover {
	background: #f3f4f6;
}

.action-btn-danger {
	color: #dc2626;
	border-color: #fecaca;
}

.action-btn-danger:hover {
	background: #fef2f2;
}

.btn {
	padding: 0.5rem 1rem;
	border-radius: 0.375rem;
	font-weight: 500;
	cursor: pointer;
	transition: all 0.2s;
}

.btn-primary {
	background: #3b82f6;
	border: 1px solid #3b82f6;
	color: #fff;
}

.btn-primary:hover {
	background: #2563eb;
}

.btn-secondary {
	background: #fff;
	border: 1px solid #d1d5db;
	color: #374151;
}

.btn-secondary:hover {
	background: #f3f4f6;
}
</style>
