<script setup lang="ts">
import type { Product, Category } from '~~/shared/types'
import CategoryTabs from './CategoryTabs.vue'
import ProductGrid from './ProductGrid.vue'

defineProps<{
  products: Product[]
  categories: Category[]
}>()

const emit = defineEmits<{
  (e: 'add-to-cart', product: Product): void
  (e: 'update:searchQuery', query: string): void
  (e: 'update:selectedCategory', categoryId: number | null): void
}>()

const searchQuery = ref('')
const selectedCategory = ref<number | null>(null)

watch(searchQuery, (newQuery) => {
  emit('update:searchQuery', newQuery)
})

watch(selectedCategory, (newCategory) => {
  emit('update:selectedCategory', newCategory)
})
</script>

<template>
  <div class="w-2/3 bg-white border-r">
    <div class="p-4 border-b">
      <div class="relative mb-4">
        <Icon name="mdi:magnify" class="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
        <input
          v-model="searchQuery"
          type="text"
          placeholder="ค้นหาสินค้า..."
          class="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
        />
      </div>
      
      <CategoryTabs
        :categories="categories"
        v-model:selectedCategory="selectedCategory"
      />
    </div>

    <div class="p-4 overflow-y-auto" style="height: calc(100vh - 200px);">
      <ProductGrid
        :products="products"
        @add-to-cart="emit('add-to-cart', $event)"
      />
    </div>
  </div>
</template>
