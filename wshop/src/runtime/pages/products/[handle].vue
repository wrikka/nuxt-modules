<script setup lang="ts">
import { computed } from 'vue';
import { useRoute, useAsyncData, useHead, createError, useNuxtApp } from '#imports';
import type { Product } from '#shared/types';
import { useCart } from '~/composables/useCart';
import { useProductDisplay } from '~/composables/useProductDisplay';
import ProductImageGallery from '~/components/products/ProductImageGallery.vue';
import ProductDetails from '~/components/products/ProductDetails.vue';
import ProductVariantSelector from '~/components/products/ProductVariantSelector.vue';

const route = useRoute();
const { $toast } = useNuxtApp();
const handle = route.params.handle as string;
const { addToCart } = useCart();

// --- Data Fetching ---
const { data: product, pending: isLoading, error } = useAsyncData<Product>(
  `product-${handle}`,
  async () => {
    // In a real app, you might want to fetch from a service that returns a specific type
    const response = await $fetch<Product>(`/api/products/handle/${handle}`);
    return response;
  }
);

if (error.value && !product.value) {
  console.error(`Product with handle '${handle}' not found.`, error.value);
  throw createError({ statusCode: 404, statusMessage: 'Product not found', fatal: true });
}

// --- Variant Selection & Display Logic ---
const productForDisplay = computed(() => product.value || null);
const { selectedOptions, selectedVariant, displayedPrice, displayedImage } = useProductDisplay(productForDisplay);

const shareUrl = computed(() => process.client ? window.location.href : '');

const handleAddToCart = async () => {
  if (product.value && selectedVariant.value) {
    await addToCart(product.value, selectedVariant.value, 1);
    $toast.success('Added to cart!');
  } else if (product.value && product.value.type === 'digital') {
    const defaultVariant = product.value.variants?.[0];
    if (defaultVariant) {
      await addToCart(product.value, defaultVariant, 1);
      $toast.success('Added to cart!');
    } else {
      $toast.error('This product is not available for purchase.');
    }
  } else {
    $toast.warning('Please select an option.');
  }
};

// SEO Meta Tags
useHead(() => {
  if (!product.value) return { title: 'Product not found' };
  return {
    title: product.value.productSeoTitle || product.value.name,
    meta: [
      { name: 'description', content: product.value.productSeoDescription || product.value.description || '' },
      { name: 'keywords', content: product.value.productSeoKeywords || '' },
    ],
  };
});

</script>

<template>
  <div class="container mx-auto p-8">
    <div v-if="isLoading">Loading product...</div>
    <div v-else-if="error || !product">Error loading product details.</div>
    <div v-else>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-12">
        <ProductImageGallery :image-url="displayedImage" :alt-text="product.name" />

        <div>
          <ProductDetails 
            :name="product.name" 
            :price="displayedPrice" 
            :description="product.description"
          />

          <ProductVariantSelector 
            v-if="product.type === 'physical' && product.options && product.options.length > 0"
            :options="product.options" 
            v-model="selectedOptions"
          />

          <button 
            @click="handleAddToCart"
            :disabled="product.type === 'physical' && product.options && product.options.length > 0 && !selectedVariant"
            class="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            {{ (product.type === 'physical' && product.options && product.options.length > 0 && !selectedVariant) ? 'Unavailable' : 'Add to Cart' }}
          </button>
          <p v-if="product.type === 'physical' && product.options && product.options.length > 0 && !selectedVariant" class="text-red-500 text-sm mt-2">This combination is not available.</p>

          <SocialShareButtons 
            :url="shareUrl" 
            :title="product.name" 
            :description="product.description || ''"
            :image-url="displayedImage"
          />
        </div>
      </div>
    </div>
  </div>
</template>