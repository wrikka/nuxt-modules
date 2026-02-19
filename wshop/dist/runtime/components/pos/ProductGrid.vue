<script setup>
import ProductGridItem from "./ProductGridItem.vue";
defineProps({
  products: { type: Array, required: true }
});
const emit = defineEmits(["add-to-cart"]);
</script>

<template>
  <div class="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
    <ProductGridItem
      v-for="product in products"
      :key="product.id"
      :product="product"
      @add-to-cart="emit('add-to-cart', product)"
    />
  </div>
</template>
