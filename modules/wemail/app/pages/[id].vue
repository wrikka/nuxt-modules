<script setup lang="ts">
const { email: _email, pending: _pending, error: _error } = useEmailDetail();
</script>
<template>
  <div v-if="_pending">Loading...</div>
  <div v-else-if="_error || !_email">Error loading email.</div>
  <div v-else class="flex flex-col h-full">
    <EmailDetailHeader :email="_email" />
    <EmailDetailBody :email="_email" />
    <EmailReplyForm :email="_email" />
  </div>
</template>
