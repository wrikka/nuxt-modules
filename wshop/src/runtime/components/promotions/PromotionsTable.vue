<script setup lang="ts">
import type { Promotion } from '~~/shared/types';
import { 
  getPromotionTypeLabel, 
  getPromotionTypeColor, 
  getStatusColor, 
  getStatusLabel, 
  formatCurrency, 
  formatDate 
} from '~/utils/promotions';

defineProps<{ promotions: Promotion[]; loading: boolean; }>();

const emit = defineEmits(['edit', 'toggle-status', 'duplicate', 'delete']);
</script>

<template>
  <div class="bg-white rounded-lg shadow-sm border">
    <!-- Loading State -->
    <div v-if="loading" class="text-center py-12">
      <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
      <p class="text-gray-600">กำลังโหลดข้อมูล...</p>
    </div>

    <!-- Empty State -->
    <div v-else-if="promotions.length === 0" class="text-center py-12">
      <Icon name="lucide:tag" class="w-12 h-12 mx-auto mb-4 text-gray-300" />
      <p class="text-gray-600">ไม่พบโปรโมชั่น</p>
    </div>

    <!-- Promotions Table -->
    <div v-else class="overflow-x-auto">
      <table class="w-full">
        <thead class="bg-gray-50 border-b">
          <tr>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">โปรโมชั่น</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ประเภท</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">มูลค่า</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">วันที่</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">สถานะ</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">การใช้งาน</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">จัดการ</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-gray-200">
          <tr v-for="promotion in promotions" :key="promotion.id" class="hover:bg-gray-50">
            <td class="px-6 py-4">
              <div>
                <div class="font-medium text-gray-900">{{ promotion.name }}</div>
                <div class="text-sm text-gray-600">{{ promotion.description }}</div>
                <div v-if="promotion.code" class="text-sm text-blue-600">โค้ด: {{ promotion.code }}</div>
              </div>
            </td>
            <td class="px-6 py-4">
              <span :class="['px-2 py-1 text-xs rounded-full', getPromotionTypeColor(promotion.type)]">
                {{ getPromotionTypeLabel(promotion.type) }}
              </span>
            </td>
            <td class="px-6 py-4">
              <div class="font-medium text-gray-900">
                <span v-if="promotion.type === 'percentage'">{{ promotion.value }}%</span>
                <span v-else-if="promotion.type === 'fixed'">{{ formatCurrency(promotion.value) }}</span>
                <span v-else>-</span>
              </div>
              <div v-if="promotion.minimumAmount" class="text-sm text-gray-600">
                ขั้นต่ำ {{ formatCurrency(promotion.minimumAmount) }}
              </div>
            </td>
            <td class="px-6 py-4">
              <div class="text-sm text-gray-900">
                {{ formatDate(promotion.startDate) }} - {{ formatDate(promotion.endDate) }}
              </div>
            </td>
            <td class="px-6 py-4">
              <span :class="['px-2 py-1 text-xs rounded-full', getStatusColor(promotion.status)]">
                {{ getStatusLabel(promotion.status) }}
              </span>
            </td>
            <td class="px-6 py-4">
              <div class="text-sm text-gray-900">
                {{ promotion.usageCount }} / {{ promotion.usageLimit || '∞' }}
              </div>
            </td>
            <td class="px-6 py-4">
              <div class="flex items-center space-x-2">
                <button @click="emit('edit', promotion)" class="p-1 text-blue-600 hover:text-blue-800" title="แก้ไข">
                  <Edit class="w-4 h-4" />
                </button>
                <button @click="emit('toggle-status', promotion)" :class="['p-1', promotion.status === 'active' ? 'text-orange-600 hover:text-orange-800' : 'text-green-600 hover:text-green-800']" :title="promotion.status === 'active' ? 'ปิดใช้งาน' : 'เปิดใช้งาน'">
                  <Power class="w-4 h-4" />
                </button>
                <button @click="emit('duplicate', promotion)" class="p-1 text-purple-600 hover:text-purple-800" title="คัดลอก">
                  <Copy class="w-4 h-4" />
                </button>
                <button @click="emit('delete', promotion)" class="p-1 text-red-600 hover:text-red-800" title="ลบ">
                  <Trash2 class="w-4 h-4" />
                </button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>
