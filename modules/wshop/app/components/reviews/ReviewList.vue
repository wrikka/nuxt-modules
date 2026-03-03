<template>
  <div class="space-y-6">
    <ReviewItem
      v-for="review in reviews"
      :key="review.id"
      :review="review"
      @mark-helpful="$emit('markHelpful', $event)"
      @report="$emit('report', $event)"
    />
    
    <!-- Empty State -->
    <div v-if="reviews.length === 0" class="text-center py-12">
      <NuxtIcon name="i-mdi-message-outline" class="w-12 h-12 text-gray-400 mx-auto mb-4" />
      <p class="text-gray-500">ยังไม่มีรีวิวสำหรับสินค้านี้</p>
      <button
        @click="$emit('writeReview')"
        class="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
      >
        เขียนรีวิวแรก
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import ReviewItem from './ReviewItem.vue'
import type { Review } from '#shared/types'

interface Props {
  reviews: Review[]
}

interface Emits {
  (e: 'markHelpful', reviewId: string): void
  (e: 'report', reviewId: string): void
  (e: 'writeReview'): void
}

defineProps<Props>()
defineEmits<Emits>()
</script>
