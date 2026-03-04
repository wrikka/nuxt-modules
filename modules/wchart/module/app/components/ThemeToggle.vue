<script setup lang="ts">
import { useChartTheme } from "../composables/useChartTheme";

const { theme, toggleTheme } = useChartTheme();
</script>

<template>
  <button @click="toggleTheme" class="px-4 py-2 border border-gray-300 rounded bg-white cursor-pointer flex items-center gap-2 hover:bg-gray-100">
    <Icon :name="theme === 'light' ? 'lucide:moon' : 'lucide:sun'" />
    {{ theme === 'light' ? 'Dark' : 'Light' }} Mode
  </button>
</template>
