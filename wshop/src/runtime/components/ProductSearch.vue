<script setup lang="ts">
import type { Product, Category, ProductFilters } from '#shared/types'
import { useProductSearchState } from './search/ProductSearchState'
import { useProductSearchActions } from './search/ProductSearchActions'
import { useProductSearchUtils } from './search/ProductSearchUtils'

interface Props {
  categories?: Category[]
}

const props = withDefaults(defineProps<Props>(), {
  categories: () => []
})

const emit = defineEmits<{
  search: [query: string, filters: ProductFilters, sortBy: string]
}>()

// Initialize state
const searchState = useProductSearchState()
const {
  searchQuery,
  viewMode,
  sortBy,
  filters,
  activeFilters,
  hasActiveFilters
} = searchState

// Initialize actions
const searchActions = useProductSearchActions(
  searchQuery,
  filters,
  sortBy,
  emit
)
const {
  debouncedSearch,
  applyFilters,
  removeFilter,
  clearAllFilters,
  toggleView
} = searchActions

// Initialize utils
const searchUtils = useProductSearchUtils(props.categories)
const { getFilterLabel } = searchUtils

// Watch for external changes
watch(() => props.categories, () => {
  // Re-apply filters when categories change
}, { deep: true })
</script>

<template>


  <div class="bg-white rounded-lg shadow-md p-6">
    <div class="space-y-4">
      <!-- Search Input -->
      <div class="relative">
        <NuxtIcon name="i-mdi-magnify" class="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
        <input
          v-model="searchQuery"
          type="text"
          placeholder="ค้นหาสินค้า..."
          class="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          @input="debouncedSearch"
        />
      </div>

      <!-- Advanced Filters -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <!-- Category Filter -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">หมวดหมู่</label>
          <select
            v-model="filters.categoryId"
            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            @change="applyFilters"
          >
            <option value="">ทั้งหมด</option>
            <option v-for="category in categories" :key="category.id" :value="category.id">
              {{ category.name }}
            </option>
          </select>
        </div>

        <!-- Price Range -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">ช่วงราคา</label>
          <div class="flex space-x-2">
            <input
              v-model="filters.minPrice"
              type="number"
              placeholder="ต่ำสุด"
              class="w-1/2 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              @input="debouncedSearch"
            />
            <input
              v-model="filters.maxPrice"
              type="number"
              placeholder="สูงสุด"
              class="w-1/2 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              @input="debouncedSearch"
            />
          </div>
        </div>

        <!-- Status Filter -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">สถานะ</label>
          <select
            v-model="filters.status"
            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            @change="applyFilters"
          >
            <option value="">ทั้งหมด</option>
            <option value="Active">Active</option>
            <option value="Archived">Archived</option>
          </select>
        </div>

        <!-- Stock Filter -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">สต็อก</label>
          <select
            v-model="filters.stockStatus"
            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            @change="applyFilters"
          >
            <option value="">ทั้งหมด</option>
            <option value="in_stock">มีสินค้า</option>
            <option value="low_stock">สต็อกต่ำ</option>
            <option value="out_of_stock">หมดสต็อก</option>
          </select>
        </div>
      </div>

      <!-- Sorting Options -->
      <div class="flex items-center space-x-4">
        <label class="text-sm font-medium text-gray-700">เรียงตาม:</label>
        <select
          v-model="sortBy"
          class="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          @change="applyFilters"
        >
          <option value="name_asc">ชื่อ (A-Z)</option>
          <option value="name_desc">ชื่อ (Z-A)</option>
          <option value="price_asc">ราคา (ต่ำ-สูง)</option>
          <option value="price_desc">ราคา (สูง-ต่ำ)</option>
          <option value="inventory">สต็อก (มาก-น้อย)</option>
          <option value="created_at">วันที่สร้าง (ใหม่-เก่า)</option>
        </select>

        <button
          @click="toggleView"
          class="p-2 border border-gray-300 rounded-lg hover:bg-gray-50"
          :class="{ 'bg-blue-50 border-blue-300': viewMode === 'grid' }"
        >
          <NuxtIcon 
            :name="viewMode === 'grid' ? 'i-mdi-view-list' : 'i-mdi-view-grid'" 
            class="w-5 h-5" 
          />
        </button>
      </div>

      <!-- Active Filters -->
      <div v-if="hasActiveFilters" class="flex flex-wrap gap-2">
        <span class="text-sm text-gray-600">ตัวกรองที่ใช้:</span>
        <span
          v-for="(value, key) in activeFilters"
          :key="key"
          class="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
        >
          {{ getFilterLabel(key, value) }}
          <button
            @click="removeFilter(key)"
            class="ml-1 hover:text-blue-600"
          >
            <NuxtIcon name="i-mdi-close" class="w-3 h-3" />
          </button>
        </span>
        <button
          @click="clearAllFilters"
          class="text-sm text-red-600 hover:text-red-800"
        >
          ล้างทั้งหมด
        </button>
      </div>
    </div>
  </div>


</template>
