<script setup lang="ts">
import type { Inventory } from '~~/shared/types'
import { useInventory } from '~/composables/inventory/useInventory'
import StockAdjustmentModal from './StockAdjustmentModal.vue'
import InventoryTable from './InventoryTable.vue'
import StockStatusOverview from './StockStatusOverview.vue'

const {
  inventory,
  products,
  loading,
  processing,
  totalProducts,
  inStockCount,
  lowStockCount,
  outOfStockCount,
  loadInventory,
  loadProducts,
  adjustStock,
  subscribeToInventoryUpdates
} = useInventory()

const searchQuery = ref('')
const showStockAdjustment = ref(false)

const filteredInventory = computed(() => {
  if (!searchQuery.value) return inventory.value
  
  const query = searchQuery.value.toLowerCase()
  return inventory.value.filter(item =>
    item.productId.toString().includes(query)
  )
})

const refreshInventory = async () => {
  await Promise.all([loadInventory(), loadProducts()])
}

const handleStockAdjustment = async (adjustment: any) => {
  try {
    await adjustStock(adjustment)
    showStockAdjustment.value = false
  } catch (_error) {
    // Error handling is done in the composable
  }
}

const openStockAdjustment = () => {
  showStockAdjustment.value = true
}

const viewStockHistory = (item: Inventory) => {
  navigateTo(`/inventory/${item.productId}/history`)
}

let unsubscribe: (() => void) | null = null

onMounted(async () => {
  await refreshInventory()
  unsubscribe = subscribeToInventoryUpdates()
})

onUnmounted(() => {
  if (unsubscribe) {
    unsubscribe()
  }
})
</script>

<template>
  <div class="bg-white rounded-lg shadow-md p-6">
    <div class="flex justify-between items-center mb-6">
      <h2 class="text-xl font-semibold text-gray-800">จัดการสต็อกสินค้า</h2>
      <div class="flex space-x-2">
        <button
          @click="refreshInventory"
          :disabled="loading"
          class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
        >
          <Icon name="mdi:refresh" :class="{ 'animate-spin': loading }" class="w-4 h-4 inline mr-2" />
          รีเฟรช
        </button>
        <button
          @click="openStockAdjustment"
          class="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
        >
          <Icon name="mdi:plus" class="w-4 h-4 inline mr-2" />
          ปรับสต็อก
        </button>
      </div>
    </div>

    <StockStatusOverview
      :total-products="totalProducts"
      :in-stock-count="inStockCount"
      :low-stock-count="lowStockCount"
      :out-of-stock-count="outOfStockCount"
      class="mb-6"
    />

    <div class="mb-6">
      <div class="relative">
        <Icon name="mdi:magnify" class="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
        <input
          v-model="searchQuery"
          type="text"
          placeholder="ค้นหาสินค้า..."
          class="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
        />
      </div>
    </div>

    <InventoryTable
      :inventory="filteredInventory"
      @edit="openStockAdjustment"
      @view-history="viewStockHistory"
    />

    <StockAdjustmentModal
      v-model="showStockAdjustment"
      :products="products"
      :processing="processing"
      @save="handleStockAdjustment"
    />
  </div>
</template>
