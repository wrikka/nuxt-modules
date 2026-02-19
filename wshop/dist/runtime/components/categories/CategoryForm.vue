<script setup>
const props = defineProps({
  modelValue: { type: Boolean, required: true },
  category: { type: [Object, null], required: true },
  parentCategories: { type: Array, required: true },
  processing: { type: Boolean, required: true }
});
const emit = defineEmits(["update:modelValue", "save"]);
const localCategory = ref({});
watch(() => props.category, (newVal) => {
  localCategory.value = { ...newVal };
}, { immediate: true, deep: true });
const isEditing = computed(() => !!localCategory.value.id);
const closeModal = () => {
  emit("update:modelValue", false);
};
const save = () => {
  emit("save", localCategory.value);
};
</script>

<template>
  <div v-if="modelValue" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
    <div class="bg-white rounded-lg p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
      <h3 class="text-lg font-semibold mb-4">
        {{ isEditing ? "\u0E41\u0E01\u0E49\u0E44\u0E02\u0E2B\u0E21\u0E27\u0E14\u0E2B\u0E21\u0E39\u0E48" : "\u0E40\u0E1E\u0E34\u0E48\u0E21\u0E2B\u0E21\u0E27\u0E14\u0E2B\u0E21\u0E39\u0E48\u0E43\u0E2B\u0E21\u0E48" }}
      </h3>
      <form @submit.prevent="save">
        <div class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">ชื่อหมวดหมู่ *</label>
            <input
              v-model="localCategory.name"
              type="text"
              required
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">รายละเอียด</label>
            <textarea
              v-model="localCategory.description"
              rows="3"
              class="w-full px-3 py-2 border border-gray-300 rounded-lg"
            ></textarea>
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">หมวดหมู่แม่</label>
            <select
              v-model="localCategory.parentId"
              class="w-full px-3 py-2 border border-gray-300 rounded-lg"
            >
              <option :value="null">ไม่มี (ราก)</option>
              <option 
                v-for="cat in parentCategories" 
                :key="cat.id" 
                :value="cat.id"
                :disabled="isEditing && cat.id === localCategory.id"
              >
                {{ cat.name }}
              </option>
            </select>
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">รูปภาพ</label>
            <input
              v-model="localCategory.image"
              type="url"
              placeholder="https://example.com/image.jpg"
              class="w-full px-3 py-2 border border-gray-300 rounded-lg"
            />
          </div>
          
          <div>
            <label class="flex items-center">
              <input
                v-model="localCategory.isActive"
                type="checkbox"
                class="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span class="ml-2 text-sm">ใช้งาน</span>
            </label>
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
