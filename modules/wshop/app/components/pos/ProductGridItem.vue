<script setup lang="ts">
import type { Product } from '#shared/types'

defineProps<{
  product: Product
}>()

const emit = defineEmits<{
  (e: 'add-to-cart', product: Product): void
}>()
</script>

<template>
  <div
    @click="emit('add-to-cart', product)"
    class="bg-white border rounded-lg p-3 hover:shadow-md transition-shadow cursor-pointer"
  >
    <div class="aspect-square bg-gray-100 rounded-lg mb-2 flex items-center justify-center">
      <!-- Placeholder for product image -->
      <Icon name="mdi:package-variant" class="w-8 h-8 text-gray-400" />
    </div>
    <h3 class="font-medium text-sm text-gray-900 truncate">{{ product.name }}</h3>
    <p class="text-lg font-bold text-blue-600">฿{{ Number(product.price).toFixed(2) }}</p>
    <p class="text-xs text-gray-500">สต็อก: {{ product.variants?.[0]?.stock ?? 0 }}</p>
  </div>
</template>
