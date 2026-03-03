<template>
  <div>
    <h1>Settings</h1>
        <div class="space-y-4">
      <h2 class="text-xl font-semibold">Admin Settings</h2>
      <ul class="list-disc list-inside">
        <li><NuxtLink to="/admin/settings/general" class="text-blue-500 hover:underline">General</NuxtLink></li>
        <li><NuxtLink to="/admin/settings/theme" class="text-blue-500 hover:underline">Theme</NuxtLink></li>
        <li><NuxtLink to="/admin/settings/shipping" class="text-blue-500 hover:underline">Shipping</NuxtLink></li>
        <li><NuxtLink to="/admin/settings/payments" class="text-blue-500 hover:underline">Payments</NuxtLink></li>
        <li><NuxtLink to="/admin/settings/themes" class="text-blue-500 hover:underline">Themes</NuxtLink></li>
        <li><NuxtLink to="/admin/settings/theme-customizer" class="text-blue-500 hover:underline">Theme Customizer</NuxtLink></li>
      </ul>
    </div>
  </div>
</template>

<script setup lang="ts">
// Page logic will go here
</script>
