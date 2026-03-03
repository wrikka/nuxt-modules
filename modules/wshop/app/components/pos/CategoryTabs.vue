<script setup lang="ts">
import type { Category } from '~~/shared/types'

defineProps<{
  categories: Category[]
  selectedCategory: number | null
}>()

const emit = defineEmits<{
  (e: 'update:selectedCategory', categoryId: number | null): void
}>()
</script>

<template>
  <div class="flex space-x-2 overflow-x-auto pb-2">
    <button
      @click="emit('update:selectedCategory', null)"
      :class="[
        'px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors',
        selectedCategory === null
          ? 'bg-blue-600 text-white'
          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
      ]"
    >
      All
    </button>
    <button
      v-for="category in categories"
      :key="category.id"
      @click="emit('update:selectedCategory', category.id)"
      :class="[
        'px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors',
        selectedCategory === category.id
          ? 'bg-blue-600 text-white'
          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
      ]"
    >
      {{ category.name }}
    </button>
  </div>
</template>
