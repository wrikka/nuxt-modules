<script setup lang="ts">
import type { Promotion } from '~~/shared/types';
import PromotionListItem from './PromotionListItem.vue';

defineProps<{ promotions: Promotion[] }>();
const emit = defineEmits(['edit', 'duplicate', 'toggleStatus', 'delete', 'create']);
</script>

<template>
  <div class="space-y-4">
    <PromotionListItem
      v-for="promotion in promotions"
      :key="promotion.id"
      :promotion="promotion"
      @edit="emit('edit', $event)"
      @duplicate="emit('duplicate', $event)"
      @toggleStatus="emit('toggleStatus', $event)"
      @delete="emit('delete', $event)"
    />

    <!-- Empty State -->
    <div v-if="promotions.length === 0" class="text-center py-12">
      <Icon name="mdi:tag" class="w-12 h-12 mx-auto mb-4 text-gray-300" />
      <p class="text-gray-500">ยังไม่มีโปรโมชั่น</p>
      <button
        @click="emit('create')"
        class="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
      >
        สร้างโปรโมชั่นแรก
      </button>
    </div>
  </div>
</template>
