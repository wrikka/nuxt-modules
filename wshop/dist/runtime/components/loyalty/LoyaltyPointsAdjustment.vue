<script setup>
const props = defineProps({
  modelValue: { type: Boolean, required: true },
  member: { type: null, required: true },
  processing: { type: Boolean, required: true }
});
const emit = defineEmits(["update:modelValue", "save"]);
const pointsForm = ref({
  type: "earn",
  amount: 0,
  reason: ""
});
const closeModal = () => {
  emit("update:modelValue", false);
};
const save = () => {
  emit("save", pointsForm.value);
};
watch(() => props.modelValue, (newVal) => {
  if (newVal) {
    pointsForm.value = {
      type: "earn",
      amount: 0,
      reason: ""
    };
  }
});
</script>

<template>
  <div v-if="modelValue" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
    <div class="bg-white rounded-lg p-6 w-full max-w-md">
      <h3 class="text-lg font-semibold mb-4">ปรับคะแนน</h3>
      
      <form @submit.prevent="save">
        <div class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">สมาชิก</label>
            <div class="p-3 bg-gray-50 rounded-lg">
              <p class="font-medium">{{ member?.name }}</p>
              <p class="text-sm text-gray-600">คะแนนปัจจุบัน: {{ member?.currentPoints.toLocaleString() }}</p>
            </div>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">ประเภทการปรับ</label>
            <select
              v-model="pointsForm.type"
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="earn">เพิ่มคะแนน</option>
              <option value="redeem">ใช้คะแนน</option>
              <option value="expire">หมดอายุคะแนน</option>
            </select>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">จำนวนคะแนน *</label>
            <input
              v-model.number="pointsForm.amount"
              type="number"
              min="1"
              required
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">เหตุผล</label>
            <textarea
              v-model="pointsForm.reason"
              rows="3"
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              placeholder="ระบุเหตุผลการปรับคะแนน"
            />
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
            class="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50"
          >
            {{ processing ? "\u0E01\u0E33\u0E25\u0E31\u0E07\u0E1A\u0E31\u0E19\u0E17\u0E36\u0E01..." : "\u0E1A\u0E31\u0E19\u0E17\u0E36\u0E01" }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>
