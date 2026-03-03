<script setup lang="ts">
import { ref, computed } from '#imports';
import type { FlagTemplate, TemplateCategory } from '#feature-flags/types';
import { FLAG_TEMPLATES } from '#feature-flags/types/template';

const emit = defineEmits<{
  select: [template: FlagTemplate];
  close: [];
}>();

const searchQuery = ref('');
const selectedCategory = ref<TemplateCategory | 'all'>('all');

const categories: { key: TemplateCategory | 'all'; label: string }[] = [
  { key: 'all', label: 'All' },
  { key: 'ui', label: 'UI' },
  { key: 'beta', label: 'Beta' },
  { key: 'performance', label: 'Performance' },
  { key: 'security', label: 'Security' },
  { key: 'maintenance', label: 'Maintenance' },
  { key: 'integration', label: 'Integration' },
];

const filteredTemplates = computed(() => {
  let templates = FLAG_TEMPLATES;

  if (selectedCategory.value !== 'all') {
    templates = templates.filter((t) => t.category === selectedCategory.value);
  }

  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase();
    templates = templates.filter(
      (t) =>
        t.name.toLowerCase().includes(query) ||
        t.description.toLowerCase().includes(query) ||
        t.tags.some((tag) => tag.toLowerCase().includes(query)),
    );
  }

  return templates;
});

const selectTemplate = (template: FlagTemplate) => {
  emit('select', template);
};
</script>

<template>
  <div class="ft-container">
    <div class="ft-header">
      <h3>Flag Templates</h3>
      <button class="ft-btn ft-btn-ghost" @click="emit('close')">×</button>
    </div>

    <div class="ft-search">
      <input
        v-model="searchQuery"
        type="text"
        placeholder="Search templates..."
        class="ft-input"
      />
    </div>

    <div class="ft-categories">
      <button
        v-for="cat in categories"
        :key="cat.key"
        class="ft-category-btn"
        :class="{ 'ft-active': selectedCategory === cat.key }"
        @click="selectedCategory = cat.key"
      >
        {{ cat.label }}
      </button>
    </div>

    <div class="ft-grid">
      <div
        v-for="template in filteredTemplates"
        :key="template.id"
        class="ft-card"
        @click="selectTemplate(template)"
      >
        <div class="ft-card-header">
          <span class="ft-card-category">{{ template.category }}</span>
          <span class="ft-card-icon">🚩</span>
        </div>
        <h4 class="ft-card-title">{{ template.name }}</h4>
        <p class="ft-card-desc">{{ template.description }}</p>
        <div class="ft-card-tags">
          <span v-for="tag in template.tags.slice(0, 3)" :key="tag" class="ft-tag">
            {{ tag }}
          </span>
        </div>
      </div>
    </div>

    <div v-if="filteredTemplates.length === 0" class="ft-empty">
      No templates found
    </div>
  </div>
</template>

<style scoped>
.ft-container {
  font-family: system-ui, -apple-system, sans-serif;
  padding: 1rem;
  max-width: 600px;
}

.ft-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.ft-header h3 {
  margin: 0;
  font-size: 1.25rem;
}

.ft-btn {
  padding: 0.5rem 1rem;
  border: 1px solid #d1d5db;
  border-radius: 0.375rem;
  background: white;
  cursor: pointer;
  font-size: 0.875rem;
}

.ft-btn-ghost {
  background: transparent;
  border: none;
  font-size: 1.25rem;
  padding: 0.25rem 0.5rem;
}

.ft-search {
  margin-bottom: 1rem;
}

.ft-input {
  width: 100%;
  padding: 0.5rem 0.75rem;
  border: 1px solid #d1d5db;
  border-radius: 0.375rem;
  font-size: 0.875rem;
}

.ft-categories {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-bottom: 1rem;
}

.ft-category-btn {
  padding: 0.25rem 0.75rem;
  border: 1px solid #e5e7eb;
  border-radius: 9999px;
  background: white;
  cursor: pointer;
  font-size: 0.75rem;
  color: #6b7280;
}

.ft-category-btn.ft-active {
  background: #3b82f6;
  border-color: #3b82f6;
  color: white;
}

.ft-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 0.75rem;
}

.ft-card {
  background: #f9fafb;
  border: 1px solid #e5e7eb;
  border-radius: 0.5rem;
  padding: 0.75rem;
  cursor: pointer;
  transition: all 0.2s;
}

.ft-card:hover {
  border-color: #3b82f6;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.ft-card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.5rem;
}

.ft-card-category {
  font-size: 0.625rem;
  text-transform: uppercase;
  color: #6b7280;
  background: #e5e7eb;
  padding: 0.125rem 0.375rem;
  border-radius: 0.25rem;
}

.ft-card-icon {
  font-size: 1rem;
}

.ft-card-title {
  margin: 0 0 0.25rem;
  font-size: 0.875rem;
  font-weight: 600;
}

.ft-card-desc {
  margin: 0;
  font-size: 0.75rem;
  color: #6b7280;
  line-height: 1.4;
}

.ft-card-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 0.25rem;
  margin-top: 0.5rem;
}

.ft-tag {
  font-size: 0.625rem;
  background: #dbeafe;
  color: #1d4ed8;
  padding: 0.125rem 0.375rem;
  border-radius: 0.25rem;
}

.ft-empty {
  text-align: center;
  padding: 2rem;
  color: #9ca3af;
}
</style>
