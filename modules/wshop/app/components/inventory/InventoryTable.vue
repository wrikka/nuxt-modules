<script setup lang="ts">
import type { Inventory } from '~~/shared/types'

defineProps<{
  inventory: Inventory[]
}>()

const emit = defineEmits<{
  (e: 'edit', item: Inventory): void
  (e: 'viewHistory', item: Inventory): void
}>()

const getStockStatusClass = (quantity: number) => {
  if (quantity === 0) return 'text-red-600'
  if (quantity <= 10) return 'text-yellow-600'
  return 'text-green-600'
}

const getStockBadgeClass = (quantity: number, reorderLevel: number) => {
  if (quantity === 0) return 'px-2 py-1 text-xs rounded-full bg-red-100 text-red-800'
  if (quantity <= reorderLevel) return 'px-2 py-1 text-xs rounded-full bg-yellow-100 text-yellow-800'
  return 'px-2 py-1 text-xs rounded-full bg-green-100 text-green-800'
}

const getStockStatusText = (quantity: number, reorderLevel: number) => {
  if (quantity === 0) return 'หมดสต็อก'
  if (quantity <= reorderLevel) return 'สต็อกต่ำ'
  return 'มีสินค้า'
}

const editItem = (item: Inventory) => {
  emit('edit', item)
}

const viewHistory = (item: Inventory) => {
  emit('viewHistory', item)
}
</script>

<template>
  <div class="overflow-x-auto">
    <table class="min-w-full divide-y divide-gray-200">
      <thead class="bg-gray-50">
        <tr>
          <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
            สินค้า
          </th>
          <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
            สต็อกปัจจุบัน
          </th>
          <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
            สต็อกสำรอง
          </th>
          <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
            สต็อกว่าง
          </th>
          <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
            ระดับสั่งซื้อ
          </th>
          <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
            สถานะ
          </th>
          <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
            ดำเนินการ
          </th>
        </tr>
      </thead>
      <tbody class="bg-white divide-y divide-gray-200">
        <tr v-for="item in inventory" :key="item.id" class="hover:bg-gray-50">
          <td class="px-6 py-4 whitespace-nowrap">
            <div class="text-sm font-medium text-gray-900">Product {{ item.productId }}</div>
            <div class="text-sm text-gray-500">ID: {{ item.productId }}</div>
          </td>
          <td class="px-6 py-4 whitespace-nowrap">
            <div class="text-sm text-gray-900">{{ item.quantity }}</div>
          </td>
          <td class="px-6 py-4 whitespace-nowrap">
            <div class="text-sm text-gray-900">{{ item.reservedQuantity }}</div>
          </td>
          <td class="px-6 py-4 whitespace-nowrap">
            <div class="text-sm font-medium" :class="getStockStatusClass(item.availableQuantity)">
              {{ item.availableQuantity }}
            </div>
          </td>
          <td class="px-6 py-4 whitespace-nowrap">
            <div class="text-sm text-gray-900">{{ item.reorderLevel }}</div>
          </td>
          <td class="px-6 py-4 whitespace-nowrap">
            <span :class="getStockBadgeClass(item.availableQuantity, item.reorderLevel)">
              {{ getStockStatusText(item.availableQuantity, item.reorderLevel) }}
            </span>
          </td>
          <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
            <button
              @click="editItem(item)"
              class="text-indigo-600 hover:text-indigo-900 mr-3"
            >
              แก้ไข
            </button>
            <button
              @click="viewHistory(item)"
              class="text-gray-600 hover:text-gray-900"
            >
              ประวัติ
            </button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>
