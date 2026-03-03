<script setup lang="ts">
import { ref, computed } from '#imports';
import type { FlagAnnotation, AnnotationType, AnnotationAuthor } from '#feature-flags/types';

const props = defineProps<{
  flagKey: string;
}>();

const annotations = ref<FlagAnnotation[]>([]);
const isLoading = ref(false);
const newAnnotation = ref('');
const newAnnotationType = ref<AnnotationType>('note');
const showAddForm = ref(false);

const types: { key: AnnotationType; label: string; icon: string }[] = [
  { key: 'note', label: 'Note', icon: '📝' },
  { key: 'warning', label: 'Warning', icon: '⚠️' },
  { key: 'todo', label: 'TODO', icon: '✅' },
  { key: 'question', label: 'Question', icon: '❓' },
  { key: 'decision', label: 'Decision', icon: '💡' },
];

const loadAnnotations = () => {
  isLoading.value = true;

  setTimeout(() => {
    const authors: AnnotationAuthor[] = [
      { id: '1', name: 'John Doe', email: 'john@example.com' },
      { id: '2', name: 'Jane Smith', email: 'jane@example.com' },
    ];

    annotations.value = [
      {
        id: '1',
        flagKey: props.flagKey,
        type: 'note',
        content: 'This flag is being used for the new dashboard rollout. Proceed with caution when disabling.',
        author: authors[0],
        createdAt: Date.now() - 86400000 * 2,
        updatedAt: Date.now() - 86400000 * 2,
        isPinned: true,
        isResolved: false,
        replies: [],
      },
      {
        id: '2',
        flagKey: props.flagKey,
        type: 'todo',
        content: 'Need to clean up this flag after Q1 release',
        author: authors[1],
        createdAt: Date.now() - 86400000,
        updatedAt: Date.now() - 86400000,
        isPinned: false,
        isResolved: false,
        replies: [
          { id: 'r1', content: 'I can help with this', author: authors[0], createdAt: Date.now() - 3600000 },
        ],
      },
    ];

    isLoading.value = false;
  }, 300);
};

const addAnnotation = () => {
  if (!newAnnotation.value.trim()) return;

  const author: AnnotationAuthor = {
    id: 'current',
    name: 'Current User',
  };

  annotations.value.unshift({
    id: `ann-${Date.now()}`,
    flagKey: props.flagKey,
    type: newAnnotationType.value,
    content: newAnnotation.value,
    author,
    createdAt: Date.now(),
    updatedAt: Date.now(),
    isPinned: false,
    isResolved: false,
    replies: [],
  });

  newAnnotation.value = '';
  showAddForm.value = false;
};

const togglePin = (id: string) => {
  const ann = annotations.value.find((a) => a.id === id);
  if (ann) {
    ann.isPinned = !ann.isPinned;
    ann.updatedAt = Date.now();
  }
};

const toggleResolve = (id: string) => {
  const ann = annotations.value.find((a) => a.id === id);
  if (ann) {
    ann.isResolved = !ann.isResolved;
    ann.updatedAt = Date.now();
  }
};

const deleteAnnotation = (id: string) => {
  const index = annotations.value.findIndex((a) => a.id === id);
  if (index !== -1) {
    annotations.value.splice(index, 1);
  }
};

const getTypeIcon = (type: AnnotationType) => {
  return types.find((t) => t.key === type)?.icon || '📝';
};

const getTypeColor = (type: AnnotationType) => {
  const colors: Record<AnnotationType, string> = {
    note: '#6b7280',
    warning: '#f59e0b',
    todo: '#3b82f6',
    question: '#8b5cf6',
    decision: '#10b981',
  };
  return colors[type] || '#6b7280';
};

const formatDate = (timestamp: number) => {
  const date = new Date(timestamp);
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  const days = Math.floor(diff / 86400000);

  if (days === 0) return 'Today';
  if (days === 1) return 'Yesterday';
  if (days < 7) return `${days} days ago`;
  return date.toLocaleDateString();
};

const sortedAnnotations = computed(() => {
  return [...annotations.value].sort((a, b) => {
    if (a.isPinned && !b.isPinned) return -1;
    if (!a.isPinned && b.isPinned) return 1;
    return b.createdAt - a.createdAt;
  });
});
</script>

<template>
  <div class="fa-container">
    <div class="fa-header">
      <h3>Annotations</h3>
      <span class="fa-flag-key">{{ flagKey }}</span>
    </div>

    <div class="fa-actions">
      <button
        v-if="!showAddForm"
        class="fa-btn fa-btn-primary"
        @click="showAddForm = true"
      >
        + Add Note
      </button>
    </div>

    <div v-if="showAddForm" class="fa-add-form">
      <div class="fa-type-selector">
        <button
          v-for="t in types"
          :key="t.key"
          class="fa-type-btn"
          :class="{ 'fa-active': newAnnotationType === t.key }"
          @click="newAnnotationType = t.key"
        >
          {{ t.icon }} {{ t.label }}
        </button>
      </div>
      <textarea
        v-model="newAnnotation"
        placeholder="Write your note..."
        rows="3"
      />
      <div class="fa-form-actions">
        <button class="fa-btn" @click="showAddForm = false">Cancel</button>
        <button class="fa-btn fa-btn-primary" @click="addAnnotation">Save</button>
      </div>
    </div>

    <div v-if="annotations.length === 0 && !isLoading" class="fa-empty">
      <button class="fa-btn fa-btn-primary" @click="loadAnnotations">
        Load Annotations
      </button>
    </div>

    <div v-else class="fa-list">
      <div
        v-for="ann in sortedAnnotations"
        :key="ann.id"
        class="fa-item"
        :class="{ 'fa-pinned': ann.isPinned, 'fa-resolved': ann.isResolved }"
      >
        <div class="fa-item-header">
          <span
            class="fa-type-icon"
            :style="{ background: getTypeColor(ann.type) }"
          >
            {{ getTypeIcon(ann.type) }}
          </span>
          <div class="fa-item-meta">
            <span class="fa-author">{{ ann.author.name }}</span>
            <span class="fa-date">{{ formatDate(ann.createdAt) }}</span>
          </div>
          <div class="fa-item-actions">
            <button
              class="fa-btn-icon"
              :class="{ 'fa-active': ann.isPinned }"
              title="Pin"
              @click="togglePin(ann.id)"
            >
              📌
            </button>
            <button
              class="fa-btn-icon"
              :class="{ 'fa-active': ann.isResolved }"
              title="Resolve"
              @click="toggleResolve(ann.id)"
            >
              ✓
            </button>
            <button
              class="fa-btn-icon fa-danger"
              title="Delete"
              @click="deleteAnnotation(ann.id)"
            >
              ×
            </button>
          </div>
        </div>

        <div class="fa-content">{{ ann.content }}</div>

        <div v-if="ann.replies.length > 0" class="fa-replies">
          <div
            v-for="reply in ann.replies"
            :key="reply.id"
            class="fa-reply"
          >
            <span class="fa-reply-author">{{ reply.author.name }}</span>
            <span class="fa-reply-content">{{ reply.content }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.fa-container {
  font-family: system-ui, -apple-system, sans-serif;
  padding: 1rem;
}

.fa-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.75rem;
}

.fa-header h3 {
  margin: 0;
  font-size: 1.125rem;
}

.fa-flag-key {
  font-family: monospace;
  font-size: 0.875rem;
  background: #e5e7eb;
  padding: 0.25rem 0.5rem;
  border-radius: 0.25rem;
}

.fa-actions {
  margin-bottom: 0.75rem;
}

.fa-btn {
  padding: 0.5rem 1rem;
  border: 1px solid #d1d5db;
  border-radius: 0.375rem;
  background: white;
  cursor: pointer;
  font-size: 0.875rem;
}

.fa-btn-primary {
  background: #3b82f6;
  color: white;
  border-color: #3b82f6;
}

.fa-btn-icon {
  background: transparent;
  border: none;
  cursor: pointer;
  padding: 0.25rem;
  font-size: 0.875rem;
  opacity: 0.5;
}

.fa-btn-icon:hover,
.fa-btn-icon.fa-active {
  opacity: 1;
}

.fa-btn-icon.fa-danger:hover {
  color: #ef4444;
}

.fa-add-form {
  background: #f9fafb;
  border-radius: 0.5rem;
  padding: 0.75rem;
  margin-bottom: 1rem;
}

.fa-type-selector {
  display: flex;
  gap: 0.5rem;
  margin-bottom: 0.5rem;
}

.fa-type-btn {
  padding: 0.25rem 0.5rem;
  border: 1px solid #e5e7eb;
  border-radius: 0.375rem;
  background: white;
  cursor: pointer;
  font-size: 0.75rem;
}

.fa-type-btn.fa-active {
  background: #3b82f6;
  color: white;
  border-color: #3b82f6;
}

.fa-add-form textarea {
  width: 100%;
  padding: 0.5rem;
  border: 1px solid #d1d5db;
  border-radius: 0.375rem;
  font-size: 0.875rem;
  resize: vertical;
  margin-bottom: 0.5rem;
}

.fa-form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 0.5rem;
}

.fa-empty {
  text-align: center;
  padding: 2rem;
}

.fa-list {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.fa-item {
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 0.5rem;
  padding: 0.75rem;
}

.fa-item.fa-pinned {
  border-color: #f59e0b;
  background: #fffbeb;
}

.fa-item.fa-resolved {
  opacity: 0.6;
}

.fa-item-header {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 0.5rem;
}

.fa-type-icon {
  width: 24px;
  height: 24px;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.875rem;
}

.fa-item-meta {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.fa-author {
  font-size: 0.75rem;
  font-weight: 500;
}

.fa-date {
  font-size: 0.625rem;
  color: #9ca3af;
}

.fa-item-actions {
  display: flex;
  gap: 0.125rem;
}

.fa-content {
  font-size: 0.875rem;
  line-height: 1.5;
}

.fa-replies {
  margin-top: 0.5rem;
  padding-top: 0.5rem;
  border-top: 1px solid #e5e7eb;
}

.fa-reply {
  font-size: 0.75rem;
  margin-bottom: 0.25rem;
}

.fa-reply-author {
  font-weight: 500;
  color: #3b82f6;
  margin-right: 0.25rem;
}

.fa-reply-content {
  color: #374151;
}
</style>
