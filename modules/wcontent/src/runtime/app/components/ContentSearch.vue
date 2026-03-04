<script setup lang="ts">
interface Props {
  collection?: string;
  placeholder?: string;
}

const props = withDefaults(defineProps<Props>(), {
  placeholder: "Search content...",
});

const query = ref("");
const debouncedQuery = useDebounce(query, 300);

const { search } = useContentSearch();

const { data: results, pending } = useAsyncData(
  () => debouncedQuery.value.length >= 2 
    ? search(debouncedQuery.value, { collections: props.collection ? [props.collection] : undefined, limit: 10 })
    : Promise.resolve([]),
  { watch: [debouncedQuery] }
);

const showResults = computed(() => debouncedQuery.value.length >= 2);
</script>

<template>
  <div class="content-search">
    <div class="search-input-wrapper">
      <input
        v-model="query"
        type="search"
        :placeholder="placeholder"
        class="search-input"
        aria-label="Search"
      />
      <span v-if="pending" class="search-loading">Loading...</span>
    </div>

    <div v-if="showResults" class="search-results">
      <div v-if="results?.length" class="results-list">
        <NuxtLink
          v-for="item in results"
          :key="item._path"
          :to="item._path"
          class="result-item"
        >
          <div class="result-title">{{ item.title || item._path }}</div>
          <div v-if="item.description" class="result-description">
            {{ item.description.slice(0, 100) }}...
          </div>
        </NuxtLink>
      </div>
      <div v-else-if="!pending" class="no-results">
        No results for "{{ debouncedQuery }}"
      </div>
    </div>
  </div>
</template>

<style scoped>
.content-search {
  position: relative;
}

.search-input-wrapper {
  position: relative;
}

.search-input {
  width: 100%;
  padding: 0.75rem 1rem;
  border: 1px solid var(--color-border);
  border-radius: 0.5rem;
  font-size: 1rem;
  background: var(--color-bg);
  color: var(--color-text);
}

.search-input:focus {
  outline: none;
  border-color: var(--color-primary);
}

.search-loading {
  position: absolute;
  right: 1rem;
  top: 50%;
  transform: translateY(-50%);
  font-size: 0.75rem;
  color: var(--color-text-muted);
}

.search-results {
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  margin-top: 0.5rem;
  background: var(--color-bg);
  border: 1px solid var(--color-border);
  border-radius: 0.5rem;
  max-height: 400px;
  overflow-y: auto;
  z-index: 50;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
}

.results-list {
  padding: 0.5rem;
}

.result-item {
  display: block;
  padding: 0.75rem;
  border-radius: 0.375rem;
  text-decoration: none;
  color: var(--color-text);
  transition: background-color 0.2s;
}

.result-item:hover {
  background-color: var(--color-bg-hover);
}

.result-title {
  font-weight: 500;
  margin-bottom: 0.25rem;
}

.result-description {
  font-size: 0.875rem;
  color: var(--color-text-secondary);
}

.no-results {
  padding: 1rem;
  text-align: center;
  color: var(--color-text-muted);
}
</style>
