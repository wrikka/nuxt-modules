<script setup lang="ts">
interface Props {
	selectedTags: string[];
	availableTags: string[];
	selectedCategory: string | null;
	categories?: string[];
}

defineProps<Props>();

const emit = defineEmits<{
	"update:selectedTags": [tags: string[]];
	"update:selectedCategory": [category: string | null];
	addTag: [tag: string];
	removeTag: [tag: string];
	toggleCategory: [category: string];
}>();

const onTagInput = (e: KeyboardEvent) => {
	if (e.key === "Enter") {
		e.preventDefault();
		const input = e.target as HTMLInputElement;
		emit("addTag", input.value);
		input.value = "";
	}
};

const onTagBlur = (e: FocusEvent) => {
	const input = e.target as HTMLInputElement;
	if (input.value.trim()) {
		emit("addTag", input.value);
		input.value = "";
	}
};
</script>

<template>
	<div class="advanced-filters">
		<div class="filter-section">
			<label>Tags</label>
			<div class="tags-input-wrapper">
				<span v-for="tag in selectedTags" :key="tag" class="selected-tag">
					{{ tag }}
					<button class="tag-remove" @click="emit('removeTag', tag)">×</button>
				</span>
				<input
					type="text"
					class="tag-input"
					placeholder="Add tag..."
					@keydown.enter.prevent="onTagInput"
					@blur="onTagBlur"
				/>
			</div>
			<div v-if="availableTags.length > 0" class="suggested-tags">
				<span class="suggestion-label">Suggested:</span>
				<button
					v-for="tag in availableTags.slice(0, 5)"
					:key="tag"
					class="suggested-tag"
					:class="{ active: selectedTags.includes(tag) }"
					@click="selectedTags.includes(tag) ? emit('removeTag', tag) : emit('addTag', tag)"
				>
					{{ tag }}
				</button>
			</div>
		</div>

		<div v-if="categories?.length" class="filter-section">
			<label>Category</label>
			<div class="category-buttons">
				<button
					v-for="cat in categories"
					:key="cat"
					class="category-btn"
					:class="{ active: selectedCategory === cat }"
					@click="emit('toggleCategory', cat)"
				>
					{{ cat }}
				</button>
			</div>
		</div>
	</div>
</template>

<style scoped>
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
</style>
