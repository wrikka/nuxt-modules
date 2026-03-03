<script setup lang="ts">
const _fetchOptions = {
  params: { folder: 'drafts' },
  key: 'drafts'
};

const _emptyState = {
  icon: 'mdi:file-document-outline',
  title: 'No drafts',
  message: "You have no saved drafts."
};
</script>

<template>
  <EmailListPage 
    title="Drafts" 
    :fetch-options="_fetchOptions" 
    :empty-state="_emptyState" 
  />
</template>
