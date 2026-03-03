<script setup lang="ts">
const _fetchOptions = {
  params: { folder: 'snoozed' },
  key: 'snoozed'
};

const _emptyState = {
  icon: 'mdi:clock-outline',
  title: 'No snoozed messages',
  message: "Messages you've snoozed will appear here."
};
</script>

<template>
  <EmailListPage 
    title="Snoozed" 
    :fetch-options="_fetchOptions" 
    :empty-state="_emptyState" 
  />
</template>
