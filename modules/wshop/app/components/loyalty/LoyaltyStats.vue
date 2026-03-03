<script setup lang="ts">
defineProps<{
  stats: {
    totalMembers: number
    activeMembers: number
    pointsIssued: number
    pointsRedeemed: number
  }
}>()
</script>

<template>
  <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
    <div class="bg-gradient-to-r from-purple-500 to-purple-600 text-white p-4 rounded-lg">
      <div class="text-2xl font-bold">{{ stats.totalMembers }}</div>
      <div class="text-sm opacity-90">สมาชิกทั้งหมด</div>
    </div>
    <div class="bg-gradient-to-r from-blue-500 to-blue-600 text-white p-4 rounded-lg">
      <div class="text-2xl font-bold">{{ stats.activeMembers }}</div>
      <div class="text-sm opacity-90">สมาชิกที่ใช้งานอยู่</div>
    </div>
    <div class="bg-gradient-to-r from-green-500 to-green-600 text-white p-4 rounded-lg">
      <div class="text-2xl font-bold">{{ stats.pointsIssued.toLocaleString() }}</div>
      <div class="text-sm opacity-90">คะแนนที่ออก</div>
    </div>
    <div class="bg-gradient-to-r from-orange-500 to-orange-600 text-white p-4 rounded-lg">
      <div class="text-2xl font-bold">{{ stats.pointsRedeemed.toLocaleString() }}</div>
      <div class="text-sm opacity-90">คะแนนที่แลก</div>
    </div>
  </div>
</template>
