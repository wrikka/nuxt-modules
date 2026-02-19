<script setup lang="ts">
const { emails: _emails, pending: _pending, error: _error } = useSent();
</script>
<template>
  <div v-if="_pending">Loading...</div>
  <div v-else-if="_error">Error loading sent emails.</div>
  <EmailList v-else :emails="_emails || []" />
</template>
