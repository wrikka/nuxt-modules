<script setup>
defineProps({
  categories: { type: Array, required: true },
  getProductCount: { type: Function, required: true },
  getParentCategoryName: { type: Function, required: true }
});
const emit = defineEmits(["edit", "delete"]);
const getStatusBadgeClass = (isActive) => {
  return isActive ? "px-2 py-1 text-xs rounded-full bg-green-100 text-green-800" : "px-2 py-1 text-xs rounded-full bg-red-100 text-red-800";
};
const editCategory = (category) => {
  emit("edit", category);
};
const deleteCategory = (category) => {
  emit("delete", category);
};
</script>

<template>
  <div class="overflow-x-auto">
    <table class="min-w-full divide-y divide-gray-200">
      <thead class="bg-gray-50">
        <tr>
          <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
            ชื่อหมวดหมู่
          </th>
          <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
            รายละเอียด
          </th>
          <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
            หมวดหมู่แม่
          </th>
          <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
            สถานะ
          </th>
          <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
            สินค้า
          </th>
          <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
            ดำเนินการ
          </th>
        </tr>
      </thead>
      <tbody class="bg-white divide-y divide-gray-200">
        <tr v-for="category in categories" :key="category.id" class="hover:bg-gray-50">
          <td class="px-6 py-4 whitespace-nowrap">
            <div class="flex items-center">
              <img 
                v-if="category.image" 
                :src="category.image" 
                :alt="category.name"
                class="w-8 h-8 rounded-lg mr-3 object-cover"
              />
              <div>
                <div class="text-sm font-medium text-gray-900">{{ category.name }}</div>
                <div class="text-xs text-gray-500">ID: {{ category.id }}</div>
              </div>
            </div>
          </td>
          <td class="px-6 py-4">
            <div class="text-sm text-gray-900 max-w-xs truncate">
              {{ category.description || "-" }}
            </div>
          </td>
          <td class="px-6 py-4 whitespace-nowrap">
            <div class="text-sm text-gray-900">
              {{ getParentCategoryName(category.parentId) }}
            </div>
          </td>
          <td class="px-6 py-4 whitespace-nowrap">
            <span :class="getStatusBadgeClass(category.isActive)">
              {{ category.isActive ? "\u0E43\u0E0A\u0E49\u0E07\u0E32\u0E19" : "\u0E1B\u0E34\u0E14\u0E43\u0E0A\u0E49\u0E07\u0E32\u0E19" }}
            </span>
          </td>
          <td class="px-6 py-4 whitespace-nowrap">
            <div class="text-sm text-gray-900">
              {{ getProductCount(category.id) }} สินค้า
            </div>
          </td>
          <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
            <button
              @click="editCategory(category)"
              class="text-indigo-600 hover:text-indigo-900 mr-3"
            >
              แก้ไข
            </button>
            <button
              @click="deleteCategory(category)"
              class="text-red-600 hover:text-red-900"
            >
              ลบ
            </button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>
