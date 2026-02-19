<script setup>
import { usePromotionUtils } from "~/composables/promotions/usePromotionUtils";
defineProps({
  promotion: { type: null, required: true }
});
const emit = defineEmits(["edit", "duplicate", "toggleStatus", "delete"]);
const { getStatusClass, getStatusText, getTypeText, formatDiscount, formatDate } = usePromotionUtils();
</script>

<template>
  <div class="border rounded-lg p-4 hover:shadow-md transition-shadow">
    <div class="flex items-start justify-between">
      <div class="flex-1">
        <div class="flex items-center space-x-2 mb-2">
          <h3 class="text-lg font-medium text-gray-900">{{ promotion.name }}</h3>
          <span
            :class="[
  'px-2 py-1 text-xs font-medium rounded-full',
  getStatusClass(promotion.status)
]"
          >
            {{ getStatusText(promotion.status) }}
          </span>
          <span class="px-2 py-1 text-xs font-medium bg-purple-100 text-purple-800 rounded-full">
            {{ getTypeText(promotion.type) }}
          </span>
        </div>
        
        <p class="text-gray-600 mb-3">{{ promotion.description }}</p>
        
        <div class="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
          <div>
            <span class="text-gray-500">ส่วนลด:</span>
            <div class="font-medium">
              {{ formatDiscount(promotion) }}
            </div>
          </div>
          <div>
            <span class="text-gray-500">วันที่เริ่ม:</span>
            <div class="font-medium">
              {{ formatDate(promotion.startDate) }}
            </div>
          </div>
          <div>
            <span class="text-gray-500">วันที่สิ้นสุด:</span>
            <div class="font-medium">
              {{ formatDate(promotion.endDate) }}
            </div>
          </div>
          <div>
            <span class="text-gray-500">การใช้งาน:</span>
            <div class="font-medium">
              {{ promotion.usageCount }} / {{ promotion.maxUsage || "\u221E" }}
            </div>
          </div>
        </div>

        <!-- Conditions -->
        <div v-if="promotion.conditions" class="mt-3">
          <h4 class="text-sm font-medium text-gray-700 mb-2">เงื่อนไข:</h4>
          <ul class="text-sm text-gray-600 space-y-1">
            <li v-if="promotion.conditions.minPurchase">
              • ซื้อขั้นต่ำ: ฿{{ promotion.conditions.minPurchase }}
            </li>
            <li v-if="promotion.conditions.minQuantity">
              • ซื้อขั้นต่ำ: {{ promotion.conditions.minQuantity }} ชิ้น
            </li>
            <li v-if="promotion.conditions.customerTypes">
              • ประเภทลูกค้า: {{ promotion.conditions.customerTypes.join(", ") }}
            </li>
            <li v-if="promotion.conditions.productCategories">
              • หมวดหมู่: {{ promotion.conditions.productCategories.join(", ") }}
            </li>
          </ul>
        </div>
      </div>

      <div class="flex space-x-2 ml-4">
        <button
          @click="emit('edit', promotion)"
          class="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"
          title="แก้ไข"
        >
          <Icon name="mdi:pencil" class="w-4 h-4" />
        </button>
        <button
          @click="emit('duplicate', promotion)"
          class="p-2 text-green-600 hover:bg-green-50 rounded-lg"
          title="ทำซ้ำ"
        >
          <Icon name="mdi:content-copy" class="w-4 h-4" />
        </button>
        <button
          @click="emit('toggleStatus', promotion)"
          :class="[
  'p-2 rounded-lg',
  promotion.status === 'active' ? 'text-orange-600 hover:bg-orange-50' : 'text-green-600 hover:bg-green-50'
]"
          :title="promotion.status === 'active' ? '\u0E2B\u0E22\u0E38\u0E14\u0E43\u0E0A\u0E49\u0E07\u0E32\u0E19' : '\u0E40\u0E23\u0E34\u0E48\u0E21\u0E43\u0E0A\u0E49\u0E07\u0E32\u0E19'"
        >
          <Icon name="mdi:power" class="w-4 h-4" />
        </button>
        <button
          @click="emit('delete', promotion)"
          class="p-2 text-red-600 hover:bg-red-50 rounded-lg"
          title="ลบ"
        >
          <Icon name="mdi:delete" class="w-4 h-4" />
        </button>
      </div>
    </div>
  </div>
</template>
