<script setup>
import StarRating from "../StarRating.vue";
const props = defineProps({
  review: { type: null, required: true }
});
const emit = defineEmits(["mark-helpful", "report", "open-image"]);
const formatDate = (dateString) => {
  const date = new Date(dateString);
  const now = /* @__PURE__ */ new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffDays = Math.floor(diffMs / 864e5);
  if (diffDays === 0) return "\u0E27\u0E31\u0E19\u0E19\u0E35\u0E49";
  if (diffDays === 1) return "\u0E40\u0E21\u0E37\u0E48\u0E2D\u0E27\u0E32\u0E19";
  if (diffDays < 7) return `${diffDays} \u0E27\u0E31\u0E19\u0E17\u0E35\u0E48\u0E41\u0E25\u0E49\u0E27`;
  if (diffDays < 30) return `${Math.floor(diffDays / 7)} \u0E2A\u0E31\u0E1B\u0E14\u0E32\u0E2B\u0E4C\u0E17\u0E35\u0E48\u0E41\u0E25\u0E49\u0E27`;
  if (diffDays < 365) return `${Math.floor(diffDays / 30)} \u0E40\u0E14\u0E37\u0E2D\u0E19\u0E17\u0E35\u0E48\u0E41\u0E25\u0E49\u0E27`;
  return `${Math.floor(diffDays / 365)} \u0E1B\u0E35\u0E17\u0E35\u0E48\u0E41\u0E25\u0E49\u0E27`;
};
</script>

<template>
  <div class="border-b border-gray-200 pb-6 last:border-0">
    <div class="flex items-start justify-between mb-3">
      <div class="flex items-center">
        <div class="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center font-bold text-gray-600 mr-3">
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
        <Icon name="i-mdi-check-circle-outline" class="w-4 h-4 mr-1" />
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
          @click="emit('mark-helpful', review.id)"
          :class="[
  'flex items-center text-sm',
  review.userMarkedHelpful ? 'text-blue-600' : 'text-gray-500 hover:text-blue-600'
]"
        >
          <Icon name="i-mdi-thumb-up-outline" class="w-4 h-4 mr-1" />
          ช่วยเหลือ ({{ review.helpful }})
        </button>
        
        <button
          @click="emit('report', review.id)"
          class="flex items-center text-sm text-gray-500 hover:text-red-600"
        >
          <Icon name="i-mdi-flag-outline" class="w-4 h-4 mr-1" />
          รายงาน
        </button>
      </div>
    </div>
  </div>
</template>
