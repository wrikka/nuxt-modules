<script setup lang="ts">
import { usePromotionUtils } from '~/composables/promotions/usePromotionUtils';

const promotionForm = defineModel<any>('form');
const processing = defineModel<boolean>('processing');
const editing = defineModel<boolean>('editing');

const emit = defineEmits(['save', 'close']);

const { getDiscountLabel, getDiscountPlaceholder } = usePromotionUtils();
</script>

<template>
  <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
    <div class="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
      <h3 class="text-lg font-semibold mb-4">
        {{ editing ? 'แก้ไขโปรโมชั่น' : 'สร้างโปรโมชั่นใหม่' }}
      </h3>
      
      <form @submit.prevent="emit('save')">
        <div class="space-y-4">
          <!-- Basic Info -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">ชื่อโปรโมชั่น *</label>
            <input
              v-model="promotionForm.name"
              type="text"
              required
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">รายละเอียด</label>
            <textarea
              v-model="promotionForm.description"
              rows="3"
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <!-- Type and Discount -->
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">ประเภท *</label>
              <select
                v-model="promotionForm.type"
                required
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value="percentage">ส่วนลด %</option>
                <option value="fixed">ส่วนลดคงที่</option>
                <option value="buy_x_get_y">ซื้อ X แถม Y</option>
                <option value="free_shipping">ส่งฟรี</option>
                <option value="bundle">แพ็คเกจ</option>
              </select>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">
                {{ getDiscountLabel(promotionForm.type) }} *
              </label>
              <input
                v-model="promotionForm.discountValue"
                type="number"
                step="0.01"
                required
                :placeholder="getDiscountPlaceholder(promotionForm.type)"
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <!-- Date Range -->
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">วันที่เริ่ม *</label>
              <input
                v-model="promotionForm.startDate"
                type="date"
                required
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">วันที่สิ้นสุด *</label>
              <input
                v-model="promotionForm.endDate"
                type="date"
                required
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <!-- Usage Limits -->
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">จำนวนครั้งสูงสุด</label>
              <input
                v-model.number="promotionForm.maxUsage"
                type="number"
                min="1"
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                placeholder="ไม่จำกัด"
              />
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">จำนวนครั้งต่อลูกค้า</label>
              <input
                v-model.number="promotionForm.maxUsagePerCustomer"
                type="number"
                min="1"
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                placeholder="ไม่จำกัด"
              />
            </div>
          </div>

          <!-- Conditions -->
          <div class="border-t pt-4">
            <h4 class="font-medium text-gray-700 mb-3">เงื่อนไข</h4>
            
            <div class="grid grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">ยอดซื้อขั้นต่ำ</label>
                <input
                  v-model.number="promotionForm.conditions.minPurchase"
                  type="number"
                  step="0.01"
                  min="0"
                  class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="0"
                />
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">จำนวนขั้นต่ำ</label>
                <input
                  v-model.number="promotionForm.conditions.minQuantity"
                  type="number"
                  min="0"
                  class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="0"
                />
              </div>
            </div>
          </div>
        </div>
        
        <div class="flex justify-end space-x-2 mt-6">
          <button
            type="button"
            @click="emit('close')"
            class="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            ยกเลิก
          </button>
          <button
            type="submit"
            :disabled="processing"
            class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
          >
            {{ processing ? 'กำลังบันทึก...' : 'บันทึก' }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>
