<script setup>
const filterStatus = defineModel("status", { type: String });
const filterType = defineModel("type", { type: String });
const searchQuery = defineModel("search", { type: String });
</script>

<template>
  <div class="flex flex-wrap items-center gap-4 mb-6">
    <select
      v-model="filterStatus"
      class="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
    >
      <option value="">ทุกสถานะ</option>
      <option value="active">ใช้งานอยู่</option>
      <option value="inactive">หมดอายุ</option>
      <option value="scheduled">จัดกำหนด</option>
    </select>

    <select
      v-model="filterType"
      class="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
    >
      <option value="">ทุกประเภท</option>
      <option value="percentage">ส่วนลด %</option>
      <option value="fixed">ส่วนลดคงที่</option>
      <option value="buy_x_get_y">ซื้อ X แถม Y</option>
      <option value="free_shipping">ส่งฟรี</option>
      <option value="bundle">แพ็คเกจ</option>
    </select>

    <div class="flex items-center">
      <input
        v-model="searchQuery"
        type="text"
        placeholder="ค้นหาโปรโมชั่น..."
        class="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
      />
    </div>
  </div>
</template>
