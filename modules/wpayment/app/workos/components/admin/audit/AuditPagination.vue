<script setup lang="ts">
const props = defineProps<{
  current: number
  total: number
  from: number
  to: number
  hasPrev: boolean
  hasNext: boolean
  visiblePages: number[]
}>()

const emit = defineEmits<{
  prev: []
  next: []
  goTo: [page: number]
}>()
</script>

<template>
  <div class="pagination">
    <span class="pagination-info">Showing {{ from }}-{{ to }} of {{ total }} logs</span>
    <div class="pagination-controls">
      <button class="page-btn" :disabled="!hasPrev" @click="emit('prev')">Previous</button>
      <div class="page-numbers">
        <button
          v-for="page in visiblePages"
          :key="page"
          class="page-num"
          :class="{ active: page === current }"
          @click="emit('goTo', page)"
        >
          {{ page }}
        </button>
      </div>
      <button class="page-btn" :disabled="!hasNext" @click="emit('next')">Next</button>
    </div>
  </div>
</template>

<style scoped>
.pagination {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 0;
}

.pagination-info {
  font-size: 0.875rem;
  color: #6b7280;
}

.pagination-controls {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.page-btn {
  padding: 0.5rem 1rem;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  background: white;
  color: #374151;
  font-size: 0.875rem;
  cursor: pointer;
}

.page-btn:hover:not(:disabled) { background: #f9fafb; }
.page-btn:disabled { opacity: 0.5; cursor: not-allowed; }

.page-numbers {
  display: flex;
  gap: 0.25rem;
}

.page-num {
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid #d1d5db;
  border-radius: 4px;
  background: white;
  color: #374151;
  font-size: 0.875rem;
  cursor: pointer;
}

.page-num:hover { background: #f9fafb; }
.page-num.active { background: #3b82f6; border-color: #3b82f6; color: white; }
</style>
