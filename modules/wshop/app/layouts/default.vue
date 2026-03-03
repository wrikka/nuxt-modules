<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900 font-sans">
    <StorefrontTheHeader />
    <main class="container mx-auto px-4 py-8">
      <slot />
    </main>
    <StorefrontTheFooter />
  </div>
</template>

<script setup lang="ts">
// Default layout for the public-facing storefront
useTheme();
</script>
