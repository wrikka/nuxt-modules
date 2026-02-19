<script setup lang="ts">
import type { Email } from '../../shared/types/email';

const _props = defineProps<{
  emails: Email[];
}>();
</script>

<template>
  <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
    <EmailGridItem v-for="email in _props.emails" :key="email.id" :email="email" />
  </div>
</template>
