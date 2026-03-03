<script setup lang="ts">
import type { Cart } from '~~/shared/types';

defineProps<{ 
  cart: Cart;
  checkoutUrl: string;
}>();
</script>

<template>
  <div>
    <h1>You left something in your cart!</h1>
    <p>Hi {{ cart.customer?.name || 'there' }},</p>
    <p>We noticed you left some items in your shopping cart. Don't miss out! Here's what you left behind:</p>
    
    <ul>
      <li v-for="item in cart.items" :key="item.id">
        {{ item.product.name }} ({{ item.quantity }}) - ${{ (Number(item.price) * item.quantity).toFixed(2) }}
      </li>
    </ul>

    <h3>Total: ${{ cart.subtotal }}</h3>

    <p>Ready to complete your order? Click the link below to return to your cart.</p>
    <a :href="checkoutUrl">Complete Your Order</a>

    <p>If you have any questions, feel free to reply to this email.</p>
    <p>Thanks,</p>
    <p>The WShop Team</p>
  </div>
</template>
