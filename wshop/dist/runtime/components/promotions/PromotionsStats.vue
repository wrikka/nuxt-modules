<script setup>
defineProps({
  stats: { type: Object, required: true }
});
</script>

<template>
  <div class="grid grid-cols-1 md:grid-cols-4 gap-6">
    <div class="bg-white rounded-lg shadow-sm border p-6">
      <div class="flex items-center justify-between">
        <div>
          <p class="text-sm font-medium text-gray-600">ทั้งหมด</p>
          <p class="text-2xl font-bold text-gray-900">{{ stats.total }}</p>
        </div>
        <div class="p-3 bg-gray-100 rounded-lg">
          <Icon name="lucide:tag" class="w-6 h-6 text-gray-600" />
        </div>
      </div>
    </div>

    <div class="bg-white rounded-lg shadow-sm border p-6">
      <div class="flex items-center justify-between">
        <div>
          <p class="text-sm font-medium text-gray-600">ใช้งานอยู่</p>
          <p class="text-2xl font-bold text-green-600">{{ stats.active }}</p>
        </div>
        <div class="p-3 bg-green-100 rounded-lg">
          <Icon name="lucide:power" class="w-6 h-6 text-green-600" />
        </div>
      </div>
    </div>

    <div class="bg-white rounded-lg shadow-sm border p-6">
      <div class="flex items-center justify-between">
        <div>
          <p class="text-sm font-medium text-gray-600">รอดำเนินการ</p>
          <p class="text-2xl font-bold text-blue-600">{{ stats.scheduled }}</p>
        </div>
        <div class="p-3 bg-blue-100 rounded-lg">
          <Icon name="lucide:calendar" class="w-6 h-6 text-blue-600" />
        </div>
      </div>
    </div>

    <div class="bg-white rounded-lg shadow-sm border p-6">
      <div class="flex items-center justify-between">
        <div>
          <p class="text-sm font-medium text-gray-600">ถูกใช้งาน</p>
          <p class="text-2xl font-bold text-purple-600">{{ stats.totalUsage }}</p>
        </div>
        <div class="p-3 bg-purple-100 rounded-lg">
          <Icon name="lucide:trending-up" class="w-6 h-6 text-purple-600" />
        </div>
      </div>
    </div>
  </div>
</template>
