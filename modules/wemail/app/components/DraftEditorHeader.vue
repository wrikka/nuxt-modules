<script setup lang="ts">
import type { Editor } from '@tiptap/vue-3';
import type { Email } from '../../shared/types/email';

const props = defineProps<{
  email: Email;
  editor: Editor;
}>();

const router = useRouter();

async function _sendEmail() {
  if (!props.editor) return;

  await $fetch(`/api/emails/${props.email.id}`, {
    method: 'PATCH',
    body: {
      to: props.email.to,
      subject: props.email.subject,
      body: props.editor.getHTML(),
      folder: 'sent',
    },
  });
  await router.push('/sent');
};

async function _deleteDraft() {
  await $fetch(`/api/emails/${props.email.id}`, { method: 'DELETE' });
  await router.push('/drafts');
};
</script>

<template>
  <div class="p-4 border-b border-slate-200 dark:border-zinc-800 flex items-center justify-between">
    <div class="flex items-center gap-2">
      <button @click="router.back()" class="p-2 rounded-lg hover:bg-slate-200 dark:hover:bg-zinc-800">
        <Icon name="carbon:arrow-left" class="text-xl" />
      </button>
      <h2 class="font-semibold">New Message</h2>
    </div>
    <div class="flex items-center gap-2">
            <button @click="_deleteDraft" class="p-2 hover:bg-slate-200 dark:hover:bg-zinc-800 rounded-lg">
        <Icon name="carbon:trash-can" class="text-xl" />
      </button>
            <button @click="_sendEmail" class="flex items-center gap-2 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600">
        Send
      </button>
    </div>
  </div>
</template>
