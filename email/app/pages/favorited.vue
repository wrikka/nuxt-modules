<script setup lang="ts">
const _fetchOptions = {
  params: { favorited: true },
  key: 'favorited'
};

const _emptyState = {
  icon: 'mdi:heart',
  title: 'No favorited messages',
  message: "Favorites are for messages that you want to remember. They'll appear here."
};
</script>

<template>
  <EmailListPage 
    title="Favorites" 
    :fetch-options="_fetchOptions" 
    :empty-state="_emptyState" 
  />
</template>
