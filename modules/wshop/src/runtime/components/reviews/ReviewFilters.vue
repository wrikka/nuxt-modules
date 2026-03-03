<script setup lang="ts">
const sortBy = defineModel<string>('sortBy')
const filterRating = defineModel<string>('filterRating')
const showVerifiedOnly = defineModel<boolean>('showVerifiedOnly')
</script>

<template>
  <div class="flex flex-wrap items-center gap-4">
    <select
      v-model="sortBy"
      class="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
    >
      <option value="most_recent">ล่าสุดก่อน</option>
      <option value="highest_rating">คะแนนสูงสุด</option>
      <option value="lowest_rating">คะแนนต่ำสุด</option>
      <option value="most_helpful">ช่วยเหลือมากที่สุด</option>
    </select>
    
    <select
      v-model="filterRating"
      class="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
    >
      <option value="">ทุกคะแนน</option>
      <option value="5">5 ดาว</option>
      <option value="4">4 ดาว</option>
      <option value="3">3 ดาว</option>
      <option value="2">2 ดาว</option>
      <option value="1">1 ดาว</option>
    </select>

    <div class="flex items-center">
      <input
        v-model="showVerifiedOnly"
        type="checkbox"
        id="verified-only"
        class="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
      />
      <label for="verified-only" class="ml-2 text-sm">แสดงเฉพาะรีวิวที่ยืนยัน</label>
    </div>
  </div>
</template>
