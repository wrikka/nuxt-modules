<template>
  <div class="container mx-auto p-8">
    <h1 class="text-3xl font-bold mb-6">Shopping Cart</h1>
    <div v-if="pending">Loading...</div>
    <div v-else-if="error">Error loading cart.</div>
    <template v-else-if="cart">
      <CartEmpty v-if="itemCount === 0" />
      <div v-else class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <CartItems :items="cart.items" />
        <OrderSummary />
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
import CartEmpty from '~/components/cart/CartEmpty.vue';
import CartItems from '~/components/cart/CartItems.vue';
import OrderSummary from '~/components/cart/OrderSummary.vue';
import { useCart } from '~/composables/useCart';

const { cart, itemCount, pending, error } = useCart();
</script>
