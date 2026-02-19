<script setup lang="ts">
import type { Email } from '../../shared/types/email';

defineProps<{
  email: Email;
}>();
</script>

<template>
  <div class="p-4 flex flex-col gap-2 border-b border-slate-200 dark:border-zinc-800">
    <input v-model="email.to" type="email" placeholder="To" class="w-full bg-transparent focus:outline-none" />
    <hr class="border-slate-200 dark:border-zinc-800" />
    <input v-model="email.subject" type="text" placeholder="Subject" class="w-full bg-transparent focus:outline-none font-semibold" />
  </div>
</template>
