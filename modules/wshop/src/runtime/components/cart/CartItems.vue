<template>
  <div class="lg:col-span-2 bg-white p-6 rounded-lg shadow-md">
    <CartItem v-for="item in items" :key="item.id" :item="item" />
  </div>
</template>

<script setup lang="ts">
import type { CartItem as CartItemType } from '~/shared/types/cart';
import CartItem from './CartItem.vue';

defineProps<{
  items: CartItemType[];
}>();
</script>
