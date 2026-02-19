<script setup>
const props = defineProps({
  modelValue: { type: Boolean, required: true },
  products: { type: Array, required: true },
  processing: { type: Boolean, required: true }
});
const emit = defineEmits(["update:modelValue", "save"]);
const adjustmentForm = ref({
  productId: "",
  type: "in",
  quantity: 1,
  reason: ""
});
const closeModal = () => {
  emit("update:modelValue", false);
};
const save = () => {
  emit("save", adjustmentForm.value);
};
watch(() => props.modelValue, (newVal) => {
  if (newVal) {
    adjustmentForm.value = {
      productId: "",
      type: "in",
      quantity: 1,
      reason: ""
    };
  }
});
</script>

<template>
  <div v-if="modelValue" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
    <div class="bg-white rounded-lg p-6 w-full max-w-md">
      <h3 class="text-lg font-semibold mb-4">ปรับสต็อกสินค้า</h3>
      <form @submit.prevent="save">
        <div class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">สินค้า</label>
            <select
              v-model="adjustmentForm.productId"
              class="w-full px-3 py-2 border border-gray-300 rounded-lg"
              required
            >
              <option value="">เลือกสินค้า</option>
              <option v-for="product in products" :key="product.id" :value="product.id">
                {{ product.name }}
              </option>
            </select>
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">ประเภทการปรับ</label>
            <select
              v-model="adjustmentForm.type"
              class="w-full px-3 py-2 border border-gray-300 rounded-lg"
              required
            >
              <option value="in">เพิ่มสต็อก</option>
              <option value="out">ลดสต็อก</option>
              <option value="adjustment">ปรับปรุง</option>
            </select>
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">จำนวน</label>
            <input
              v-model.number="adjustmentForm.quantity"
              type="number"
              min="1"
              class="w-full px-3 py-2 border border-gray-300 rounded-lg"
              required
            />
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">เหตุผล</label>
            <textarea
              v-model="adjustmentForm.reason"
              rows="3"
              class="w-full px-3 py-2 border border-gray-300 rounded-lg"
              required
            ></textarea>
          </div>
        </div>
        
        <div class="flex justify-end space-x-2 mt-6">
          <button
            type="button"
            @click="closeModal"
            class="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            ยกเลิก
          </button>
          <button
            type="submit"
            :disabled="processing"
            class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
          >
            บันทึก
          </button>
        </div>
      </form>
    </div>
  </div>
</template>
