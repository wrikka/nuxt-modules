<template>
  <header class="bg-white dark:bg-gray-800 shadow-md sticky top-0 z-40">
    <nav class="container mx-auto px-4 py-4 flex justify-between items-center">
      <NuxtLink to="/" class="text-2xl font-bold text-gray-900 dark:text-white">WShop</NuxtLink>
      <div class="hidden md:flex items-center space-x-4">
        <NuxtLink to="/products" class="text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white px-3 py-2 rounded-md text-sm font-medium">{{ t('nav.products') }}</NuxtLink>
        <NuxtLink to="/blog" class="text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white px-3 py-2 rounded-md text-sm font-medium">{{ t('nav.blog') }}</NuxtLink>
      </div>
      <div class="flex items-center space-x-4">
        <NuxtLink to="/cart" class="relative group">
          <Icon name="lucide:shopping-cart" class="h-6 w-6 text-gray-600 dark:text-gray-300 group-hover:text-gray-900 dark:group-hover:text-white" />
          <span v-if="cart?.itemCount && cart.itemCount > 0" class="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
            {{ cart.itemCount }}
          </span>
        </NuxtLink>
        <LanguageSwitcher />
        <ColorModeButton />
      </div>
    </nav>
  </header>
</template>

<script setup lang="ts">
const { cart } = useCart();
const { t } = useI18n();
</script>
