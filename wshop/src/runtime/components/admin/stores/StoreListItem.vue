<script setup lang="ts">
import type { Store } from '#shared/types';

const props = defineProps<{
  store: Store
}>();

const storeLocation = computed(() => {
  if (!props.store.address) return 'No address';
  return `${props.store.address.city}, ${props.store.address.country}`;
});
</script>

<template>
  <div>
    <div class="flex justify-between items-center">
      <div>
        <h3 class="font-bold">{{ store.name }}</h3>
        <p class="text-sm text-gray-500">{{ storeLocation }}</p>
      </div>
      <NuxtLink :to="`/admin/stores/${store.id}`" class="px-3 py-1 text-sm border rounded">View</NuxtLink>
    </div>
  </div>
</template>
