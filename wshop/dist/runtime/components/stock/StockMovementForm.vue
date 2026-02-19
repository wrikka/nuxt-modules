<script setup>
import { computed } from "vue";
import { useStockMovementForm } from "~/composables/inventory/useStockMovementForm";
import { movementTypes, getCommonReasons } from "~/constants/stock";
const props = defineProps({
  productId: { type: String, required: false },
  loading: { type: Boolean, required: false }
});
const emit = defineEmits(["submit", "cancel"]);
const {
  movementType,
  quantity,
  reason,
  reference,
  isFormValid,
  loading,
  handleSubmit,
  setReason
} = useStockMovementForm(props, emit);
const commonReasons = computed(() => getCommonReasons(movementType.value));
const handleCancel = () => {
  emit("cancel");
};
</script>

<template>
  <div class="bg-white rounded-lg p-6">
    <div class="flex items-center mb-6">
      <Icon name="lucide:package" class="w-6 h-6 text-blue-600 mr-2" />
      <h3 class="text-lg font-semibold">บันทึกการเคลื่อนไหวสต็อก</h3>
    </div>

    <!-- Product Info -->
    <div v-if="productId" class="bg-gray-50 rounded-lg p-4 mb-6">
      <div class="text-sm text-gray-600 mb-1">รหัสสินค้า</div>
      <div class="font-medium">{{ productId }}</div>
    </div>

    <!-- Movement Type -->
    <div class="mb-6">
      <label class="block text-sm font-medium text-gray-700 mb-3">
        ประเภทการเคลื่อนไหว
      </label>
      <div class="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div
          v-for="type in movementTypes"
          :key="type.value"
          @click="movementType = type.value"
          :class="[
  'p-3 border rounded-lg cursor-pointer transition-colors',
  movementType === type.value ? `border-${type.color}-500 bg-${type.color}-50` : 'border-gray-200 hover:border-gray-300'
]"
        >
          <div class="flex flex-col items-center">
            <Icon 
              :name="type.icon" 
              class="w-5 h-5 mb-1"
              :class="movementType === type.value ? `text-${type.color}-600` : 'text-gray-600'"
            />
            <span class="text-sm font-medium">{{ type.label }}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Quantity -->
    <div class="mb-6">
      <label class="block text-sm font-medium text-gray-700 mb-2">
        จำนวน
      </label>
      <div class="flex items-center space-x-2">
        <button
          @click="quantity = Math.max(1, quantity - 1)"
          class="p-2 border border-gray-300 rounded-lg hover:bg-gray-100"
        >
          <Icon name="lucide:minus" class="w-4 h-4" />
        </button>
        <input
          v-model.number="quantity"
          type="number"
          min="1"
          class="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-center"
        />
        <button
          @click="quantity += 1"
          class="p-2 border border-gray-300 rounded-lg hover:bg-gray-100"
        >
          <Icon name="lucide:plus" class="w-4 h-4" />
        </button>
      </div>
    </div>

    <!-- Reason -->
    <div class="mb-6">
      <label class="block text-sm font-medium text-gray-700 mb-2">
        เหตุผล
      </label>
      <div class="grid grid-cols-2 md:grid-cols-3 gap-2 mb-3">
        <button
          v-for="commonReason in commonReasons"
          :key="commonReason"
          @click="setReason(commonReason)"
          :class="[
  'px-3 py-2 text-sm rounded-lg border transition-colors',
  reason === commonReason ? 'border-blue-500 bg-blue-50 text-blue-700' : 'border-gray-200 hover:border-gray-300'
]"
        >
          {{ commonReason }}
        </button>
      </div>
      <textarea
        v-model="reason"
        rows="3"
        placeholder="ระบุเหตุผลเพิ่มเติม..."
        class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
      ></textarea>
    </div>

    <!-- Reference (Optional) -->
    <div class="mb-6">
      <label class="block text-sm font-medium text-gray-700 mb-2">
        เอกสารอ้างอิง (ไม่จำเป็น)
      </label>
      <input
        v-model="reference"
        type="text"
        placeholder="เช่น PO-001, INV-002"
        class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
      />
    </div>

    <!-- Action Buttons -->
    <div class="flex space-x-3">
      <button
        @click="handleCancel"
        class="flex-1 px-4 py-3 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors"
      >
        ยกเลิก
      </button>
      <button
        @click="handleSubmit"
        :disabled="!isFormValid || loading"
        class="flex-1 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        <span v-if="loading">กำลังบันทึก...</span>
        <span v-else>บันทึก</span>
      </button>
    </div>
  </div>
</template>
