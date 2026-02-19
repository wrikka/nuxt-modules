<template>
  <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
    <!-- Average Rating -->
    <div class="text-center">
      <div class="text-4xl font-bold text-gray-900 mb-2">
        {{ reviewStats.averageRating.toFixed(1) }}
      </div>
      <div class="flex items-center justify-center mb-2">
        <StarRating :rating="reviewStats.averageRating" :size="24" />
      </div>
      <div class="text-sm text-gray-600">
        {{ reviewStats.totalReviews }} รีวิว
      </div>
    </div>
    
    <!-- Rating Distribution -->
    <div class="space-y-2">
      <div v-for="(count, rating) in reviewStats.ratingDistribution" :key="rating" class="flex items-center">
        <span class="text-sm text-gray-600 w-12">{{ rating }} ดาว</span>
        <div class="flex-1 mx-3">
          <div class="bg-gray-200 rounded-full h-2">
            <div 
              class="bg-yellow-400 h-2 rounded-full"
              :style="{ width: `${count / reviewStats.totalReviews * 100}%` }"
            ></div>
          </div>
        </div>
        <span class="text-sm text-gray-600 w-12 text-right">{{ count }}</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import StarRating from "./StarRating.vue";
defineProps({
  reviewStats: { type: null, required: true }
});
</script>
