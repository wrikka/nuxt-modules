<template>
  <div>
    <h2>Store List</h2>
        <div v-if="stores.length">
      <AdminStoresStoreListItem v-for="store in stores" :key="store.id" :store="store" />
    </div>
    <div v-else>
      <p>No stores found.</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Store } from '#shared/types';

defineProps<{
  stores: Store[]
}>()
</script>
