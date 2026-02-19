<script setup>
import StarRating from "../StarRating.vue";
defineProps({
  stats: { type: null, required: true }
});
</script>

<template>
  <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
    <div class="text-center">
      <div class="text-4xl font-bold text-gray-900 mb-2">
        {{ stats.averageRating.toFixed(1) }}
      </div>
      <div class="flex items-center justify-center mb-2">
        <StarRating :rating="stats.averageRating" :size="24" />
      </div>
      <div class="text-sm text-gray-600">
        {{ stats.totalReviews }} รีวิว
      </div>
    </div>
    
    <div class="space-y-2">
      <div v-for="(count, rating) in stats.ratingDistribution" :key="rating" class="flex items-center">
        <span class="text-sm text-gray-600 w-12">{{ rating }} ดาว</span>
        <div class="flex-1 mx-3">
          <div class="bg-gray-200 rounded-full h-2">
            <div 
              class="bg-yellow-400 h-2 rounded-full"
              :style="{ width: `${stats.totalReviews > 0 ? count / stats.totalReviews * 100 : 0}%` }"
            ></div>
          </div>
        </div>
        <span class="text-sm text-gray-600 w-12 text-right">{{ count }}</span>
      </div>
    </div>
  </div>
</template>
