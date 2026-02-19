<template>
  <div class="flex items-center border-b border-gray-200 py-4 last:border-b-0">
    <img :src="item.imageSrc || 'https://via.placeholder.com/100'" :alt="item.name" class="w-24 h-24 object-cover rounded-md mr-4">
    <div class="flex-grow">
      <h2 class="font-semibold text-lg">{{ item.name }}</h2>
      <p class="text-sm text-gray-500">{{ formatOptions(item.options) }}</p>
      <p class="text-md font-bold text-gray-800">${{ item.price.toFixed(2) }}</p>
    </div>
    <div class="flex items-center">
      <input 
        type="number" 
        :value="item.quantity" 
        @input="updateQuantity(item.id, parseInt($event.target.value))" 
        min="1" 
        class="w-16 text-center border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm mx-4"
      >
      <button @click="removeFromCart(item.id)" class="text-red-500 hover:text-red-700 font-semibold">Remove</button>
    </div>
  </div>
</template>

<script setup>
import { formatOptions } from "~/shared/utils";
const { updateQuantity, removeFromCart } = useCart();
defineProps({
  item: { type: null, required: true }
});
</script>
