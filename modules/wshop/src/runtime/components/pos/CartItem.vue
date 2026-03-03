<script setup lang="ts">
import type { CartItem } from '~~/shared/types'

defineProps<{ item: CartItem }>()

const emit = defineEmits<{
  (e: 'update-quantity', itemId: number, quantity: number): void
  (e: 'remove-from-cart', itemId: number): void
}>()
</script>

<template>
  <div class="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
    <div class="flex-1">
      <h4 class="font-medium text-sm">{{ item.product?.name || 'Product' }}</h4>
      <p class="text-sm text-gray-600">฿{{ parseFloat(item.price).toFixed(2) }}</p>
    </div>
    
    <div class="flex items-center space-x-2">
      <button
        @click="emit('update-quantity', parseInt(item.id), item.quantity - 1)"
        class="w-8 h-8 rounded-lg bg-white border hover:bg-gray-100"
      >
        <Icon name="mdi:minus" class="w-4 h-4 mx-auto" />
      </button>
      <span class="w-12 text-center font-medium">{{ item.quantity }}</span>
      <button
        @click="emit('update-quantity', parseInt(item.id), item.quantity + 1)"
        class="w-8 h-8 rounded-lg bg-white border hover:bg-gray-100"
      >
        <Icon name="mdi:plus" class="w-4 h-4 mx-auto" />
      </button>
      <button
        @click="emit('remove-from-cart', parseInt(item.productId))"
        class="w-8 h-8 rounded-lg bg-red-100 text-red-600 hover:bg-red-200"
      >
        <Icon name="mdi:close" class="w-4 h-4 mx-auto" />
      </button>
    </div>
  </div>
</template>
