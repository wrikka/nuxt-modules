<script setup lang="ts">
import type { Email } from '../../shared/types/email';

defineProps<{
  emails: Email[];
}>();
</script>

<template>
  <div>
    <ul v-if="emails && emails.length" class="divide-y divide-gray-200 dark:divide-gray-800">
      <li v-for="email in emails" :key="email.id">
        <EmailListItem :email="email" />
      </li>
    </ul>
    <EmptyState v-else icon="mdi:email-outline" title="No messages" message="There are no messages in this category." />
  </div>
</template>
