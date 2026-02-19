<script setup lang="ts">
import type { Email } from '../../shared/types/email';

const props = defineProps<{
  email: Email;
}>();
const emit = defineEmits(['close']);

const replyContent = ref('');

async function _sendReply() {
  if (!replyContent.value) return;

  await $fetch('/api/emails', {
    method: 'POST',
    body: {
      from: 'me',
      to: props.email.from,
      subject: `Re: ${props.email.subject}`,
      body: replyContent.value,
      folder: 'sent',
    },
  });

  replyContent.value = '';
  emit('close');
}
</script>

<template>
  <div class="mt-8">
    <textarea v-model="replyContent" class="w-full p-2 border rounded-md dark:bg-zinc-800 dark:border-zinc-700" rows="4" placeholder="Write your reply..."></textarea>
    <div class="mt-2 flex justify-end gap-2">
      <button @click="emit('close')" class="px-4 py-2 rounded-md text-sm font-medium hover:bg-slate-100 dark:hover:bg-zinc-700">Cancel</button>
      <button @click="_sendReply" class="px-4 py-2 rounded-md bg-blue-600 text-white text-sm font-medium hover:bg-blue-700">Send</button>
    </div>
  </div>
</template>
