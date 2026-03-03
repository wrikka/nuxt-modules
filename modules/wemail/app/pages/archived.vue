<script setup lang="ts">
const _fetchOptions = {
  params: { folder: 'archived' },
  key: 'archived'
};

const _emptyState = {
  icon: 'mdi:archive-outline',
  title: 'No archived messages',
  message: "Archived messages will appear here."
};
</script>

<template>
  <EmailListPage 
    title="Archived" 
    :fetch-options="_fetchOptions" 
    :empty-state="_emptyState" 
  />
</template>
