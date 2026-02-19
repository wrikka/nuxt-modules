<script setup lang="ts">
const searchQuery = defineModel<string>('searchQuery');
const selectedStatus = defineModel<string>('selectedStatus');
</script>

<template>
  <div class="bg-white rounded-lg shadow-sm border p-4">
    <div class="flex flex-col md:flex-row gap-4">
      <!-- Search -->
      <div class="flex-1 relative">
        <Icon name="lucide:search" class="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
        <input
          v-model="searchQuery"
          type="text"
          placeholder="ค้นหาโปรโมชั่น..."
          class="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <!-- Status Filter -->
      <div class="flex items-center space-x-2">
        <Icon name="lucide:filter" class="w-5 h-5 text-gray-400" />
        <select
          v-model="selectedStatus"
          class="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
        >
          <option value="all">ทั้งหมด</option>
          <option value="active">ใช้งานอยู่</option>
          <option value="scheduled">รอดำเนินการ</option>
          <option value="expired">หมดอายุ</option>
        </select>
      </div>
    </div>
  </div>
</template>
