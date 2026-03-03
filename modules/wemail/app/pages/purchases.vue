<script setup lang="ts">
const _fetchOptions = {
  params: { folder: 'purchases' },
  key: 'purchases'
};

const _emptyState = {
  icon: 'mdi:cart-outline',
  title: 'No Purchases',
  message: "Emails related to your purchases will appear here."
};
</script>

<template>
  <EmailListPage 
    title="Purchases" 
    :fetch-options="_fetchOptions" 
    :empty-state="_emptyState" 
  />
</template>
