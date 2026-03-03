<script setup lang="ts">
const _fetchOptions = {
  params: { starred: true },
  key: 'starred'
};

const _emptyState = {
  icon: 'mdi:star',
  title: 'No starred messages',
  message: "Stars are for messages that you want to remember. They'll appear here."
};
</script>

<template>
  <EmailListPage 
    title="Starred" 
    :fetch-options="_fetchOptions" 
    :empty-state="_emptyState" 
  />
</template>
