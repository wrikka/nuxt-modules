<template>
  <div class="border-b border-gray-200 pb-6 last:border-0">
    <div class="flex items-start justify-between mb-3">
      <div class="flex items-center">
        <div class="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center font-bold text-gray-600">
          {{ review.customer.name?.charAt(0) }}
        </div>
        <div>
          <div class="font-medium text-gray-900">{{ review.customer.name }}</div>
          <div class="flex items-center text-sm text-gray-500">
            <StarRating :rating="review.rating" :size="16" />
            <span class="ml-2">{{ formatDate(review.createdAt) }}</span>
          </div>
        </div>
      </div>
      
      <div v-if="review.isVerified" class="flex items-center text-green-600 text-sm">
        <NuxtIcon name="i-mdi-check-circle-outline" class="w-4 h-4 mr-1" />
        ยืนยันการซื้อ
      </div>
    </div>

    <div v-if="review.title" class="font-medium text-gray-900 mb-2">
      {{ review.title }}
    </div>

    <div class="text-gray-700 mb-3">
      {{ review.content }}
    </div>

    <div class="flex items-center justify-between">
      <div class="flex items-center space-x-4">
        <button
          @click="$emit('markHelpful', review.id)"
          :class="[
            'flex items-center text-sm',
            review.userMarkedHelpful ? 'text-blue-600' : 'text-gray-500 hover:text-blue-600'
          ]"
        >
          <NuxtIcon name="i-mdi-thumb-up-outline" class="w-4 h-4 mr-1" />
          ช่วยเหลือ ({{ review.helpful }})
        </button>
        
        <button
          @click="$emit('report', review.id)"
          class="flex items-center text-sm text-gray-500 hover:text-red-600"
        >
          <NuxtIcon name="i-mdi-flag-outline" class="w-4 h-4 mr-1" />
          รายงาน
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import StarRating from './StarRating.vue'
import type { Review } from '#shared/types'

interface Props {
  review: Review
}

interface Emits {
  (e: 'markHelpful', reviewId: string): void
  (e: 'report', reviewId: string): void
}

defineProps<Props>()
defineEmits<Emits>()

const formatDate = (dateString: string) => {
  const date = new Date(dateString)
  const now = new Date()
  const diffMs = now.getTime() - date.getTime()
  const diffDays = Math.floor(diffMs / 86400000)

  if (diffDays === 0) return 'วันนี้'
  if (diffDays === 1) return 'เมื่อวาน'
  if (diffDays < 7) return `${diffDays} วันที่แล้ว`
  if (diffDays < 30) return `${Math.floor(diffDays / 7)} สัปดาห์ที่แล้ว`
  if (diffDays < 365) return `${Math.floor(diffDays / 30)} เดือนที่แล้ว`
  return `${Math.floor(diffDays / 365)} ปีที่แล้ว`
}
</script>
