<script setup lang="ts">
import { computed, onMounted, ref, watch } from "vue";
import type { ContentItem } from "../../../../shared/types/index";

const props = defineProps<{
	content?: ContentItem;
	mode?: "create" | "edit";
}>();

const emit = defineEmits<{
	save: [content: Partial<ContentItem>];
	cancel: [];
	preview: [];
}>();

const title = ref(props.content?.title || "");
const description = ref(props.content?.description || "");
const body = ref(props.content?.body || "");
const tags = ref<string[]>(props.content?.tags || []);
const category = ref(props.content?.category || "");
const tagInput = ref("");
const isPreview = ref(false);
const isSaving = ref(false);

const hasChanges = computed(() => {
	if (!props.content) return true;
	return (
		title.value !== props.content.title
		|| description.value !== props.content.description
		|| body.value !== props.content.body
		|| JSON.stringify(tags.value) !== JSON.stringify(props.content.tags)
		|| category.value !== props.content.category
	);
});

const addTag = () => {
	const tag = tagInput.value.trim();
	if (tag && !tags.value.includes(tag)) {
		tags.value.push(tag);
	}
	tagInput.value = "";
};

const removeTag = (tag: string) => {
	tags.value = tags.value.filter((t) => t !== tag);
};

const handleSave = async () => {
	if (!title.value.trim()) return;

	isSaving.value = true;
	try {
		emit("save", {
			title: title.value,
			description: description.value,
			body: body.value,
			tags: tags.value,
			category: category.value,
		});
	} finally {
		isSaving.value = false;
	}
};

const togglePreview = () => {
	isPreview.value = !isPreview.value;
	emit("preview");
};
</script>

<template>
	<div class="content-editor">
		<div class="editor-toolbar">
			<div class="toolbar-left">
				<button
					class="toolbar-btn"
					:class="{ active: !isPreview }"
					@click="isPreview = false"
				>
					Edit
				</button>
				<button
					class="toolbar-btn"
					:class="{ active: isPreview }"
					@click="togglePreview"
				>
					Preview
				</button>
			</div>
			<div class="toolbar-right">
				<span
					v-if="hasChanges"
					class="unsaved-badge"
				>
					Unsaved changes
				</span>
			</div>
		</div>

		<div class="editor-main">
			<div
				v-if="!isPreview"
				class="editor-form"
			>
				<div class="form-group">
					<label for="title">Title</label>
					<input
						id="title"
						v-model="title"
						type="text"
						class="form-input"
						placeholder="Enter title..."
					/>
				</div>

				<div class="form-group">
					<label for="description">Description</label>
					<textarea
						id="description"
						v-model="description"
						class="form-textarea"
						rows="3"
						placeholder="Enter description..."
					/>
				</div>

				<div class="form-group">
					<label for="category">Category</label>
					<input
						id="category"
						v-model="category"
						type="text"
						class="form-input"
						placeholder="Enter category..."
					/>
				</div>

				<div class="form-group">
					<label>Tags</label>
					<div class="tags-container">
						<span
							v-for="tag in tags"
							:key="tag"
							class="tag"
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
				</div>

				<div class="form-group">
					<label for="body">Content (Markdown)</label>
					<textarea
						id="body"
						v-model="body"
						class="form-textarea body-editor"
						placeholder="Write your content in markdown..."
					/>
				</div>
			</div>

			<div
				v-else
				class="editor-preview"
			>
				<h1 class="preview-title">{{ title || "Untitled" }}</h1>
				<p class="preview-description">{{ description }}</p>
				<div class="preview-meta">
					<span
						v-if="category"
						class="preview-category"
					>
						{{ category }}
					</span>
					<span
						v-for="tag in tags"
						:key="tag"
						class="preview-tag"
					>
						{{ tag }}
					</span>
				</div>
				<div class="preview-body">
					{{ body }}
				</div>
			</div>
		</div>

		<div class="editor-footer">
			<button
				class="btn btn-secondary"
				@click="emit('cancel')"
			>
				Cancel
			</button>
			<button
				class="btn btn-primary"
				:disabled="!title.trim() || isSaving"
				@click="handleSave"
			>
				{{ isSaving ? "Saving..." : mode === "create" ? "Create" : "Save" }}
			</button>
		</div>
	</div>
</template>

<style scoped>
.content-editor {
	display: flex;
	flex-direction: column;
	height: 100%;
	border: 1px solid #e5e7eb;
	border-radius: 0.5rem;
	background: #fff;
}

.editor-toolbar {
	display: flex;
	justify-content: space-between;
	align-items: center;
	padding: 0.75rem 1rem;
	border-bottom: 1px solid #e5e7eb;
	background: #f9fafb;
}

.toolbar-left {
	display: flex;
	gap: 0.5rem;
}

.toolbar-btn {
	padding: 0.5rem 1rem;
	border: 1px solid #d1d5db;
	border-radius: 0.375rem;
	background: #fff;
	cursor: pointer;
	transition: all 0.2s;
}

.toolbar-btn.active {
	background: #3b82f6;
	border-color: #3b82f6;
	color: #fff;
}

.unsaved-badge {
	padding: 0.25rem 0.5rem;
	background: #fef3c7;
	color: #92400e;
	border-radius: 0.25rem;
	font-size: 0.75rem;
}

.editor-main {
	flex: 1;
	overflow: auto;
	padding: 1rem;
}

.editor-form {
	display: flex;
	flex-direction: column;
	gap: 1rem;
}

.form-group {
	display: flex;
	flex-direction: column;
	gap: 0.5rem;
}

.form-group label {
	font-weight: 500;
	color: #374151;
}

.form-input {
	padding: 0.75rem;
	border: 1px solid #d1d5db;
	border-radius: 0.375rem;
	font-size: 1rem;
}

.form-input:focus {
	outline: none;
	border-color: #3b82f6;
	box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

.form-textarea {
	padding: 0.75rem;
	border: 1px solid #d1d5db;
	border-radius: 0.375rem;
	font-size: 1rem;
	resize: vertical;
}

.body-editor {
	min-height: 300px;
	font-family: monospace;
}

.tags-container {
	display: flex;
	flex-wrap: wrap;
	gap: 0.5rem;
	align-items: center;
	padding: 0.5rem;
	border: 1px solid #d1d5db;
	border-radius: 0.375rem;
}

.tag {
	display: inline-flex;
	align-items: center;
	gap: 0.25rem;
	padding: 0.25rem 0.5rem;
	background: #e0f2fe;
	color: #0369a1;
	border-radius: 0.25rem;
	font-size: 0.875rem;
}

.tag-remove {
	background: none;
	border: none;
	color: #0369a1;
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

.editor-preview {
	padding: 1rem;
}

.preview-title {
	font-size: 1.5rem;
	font-weight: 700;
	margin-bottom: 0.5rem;
}

.preview-description {
	color: #6b7280;
	margin-bottom: 1rem;
}

.preview-meta {
	display: flex;
	flex-wrap: wrap;
	gap: 0.5rem;
	margin-bottom: 1rem;
}

.preview-category {
	padding: 0.25rem 0.5rem;
	background: #dbeafe;
	color: #1d4ed8;
	border-radius: 0.25rem;
	font-size: 0.875rem;
}

.preview-tag {
	padding: 0.25rem 0.5rem;
	background: #f3f4f6;
	color: #374151;
	border-radius: 0.25rem;
	font-size: 0.75rem;
}

.preview-body {
	white-space: pre-wrap;
	font-family: inherit;
}

.editor-footer {
	display: flex;
	justify-content: flex-end;
	gap: 0.75rem;
	padding: 1rem;
	border-top: 1px solid #e5e7eb;
	background: #f9fafb;
}

.btn {
	padding: 0.5rem 1rem;
	border-radius: 0.375rem;
	font-weight: 500;
	cursor: pointer;
	transition: all 0.2s;
}

.btn:disabled {
	opacity: 0.5;
	cursor: not-allowed;
}

.btn-secondary {
	background: #fff;
	border: 1px solid #d1d5db;
	color: #374151;
}

.btn-secondary:hover:not(:disabled) {
	background: #f3f4f6;
}

.btn-primary {
	background: #3b82f6;
	border: 1px solid #3b82f6;
	color: #fff;
}

.btn-primary:hover:not(:disabled) {
	background: #2563eb;
}
</style>
