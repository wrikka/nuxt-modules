<template>
  <header class="flex justify-between items-center mb-8">
    <div>
      <UBreadcrumb :items="breadcrumbs" class="mb-2" />
      <h1 class="text-3xl font-bold">Dashboard</h1>
      <p class="text-gray-500 dark:text-gray-400 mt-1">
        Welcome back, here's a summary of your business.
      </p>
    </div>
    <UButton
      @click="toggleColorMode"
      variant="ghost"
      size="sm"
      :icon="colorMode.value === 'dark' ? 'i-mdi-white-balance-sunny' : 'i-mdi-weather-night'"
      aria-label="Toggle color mode"
    >
      {{ colorMode.value === 'dark' ? 'Light' : 'Dark' }} Mode
    </UButton>
  </header>
</template>

<script setup lang="ts">
const colorMode = useColorMode();

const breadcrumbs = [
  { label: 'Home', to: '/' },
  { label: 'Dashboard' },
];

const toggleColorMode = (): void => {
  colorMode.preference = colorMode.value === 'dark' ? 'light' : 'dark';
};
</script>
