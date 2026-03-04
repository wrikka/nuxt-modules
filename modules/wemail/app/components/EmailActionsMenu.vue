<script setup lang="ts">
import type { Email } from '../../shared/types/email';

const props = defineProps<{
  email: Email;
}>();

const emit = defineEmits(['refresh']);

const { printEmail, isPrinting } = usePrintEmail();
const { exportAsEml, exportAsHtml, exportAsPdf } = useExportEmail();
const { formatSnoozeTime, openSnoozeModal, unsnoozeEmail } = useSnooze();
const { showShortcutsHelp } = useGmailShortcuts({
  compose: () => navigateTo('/drafts'),
  search: () => {},
  reply: () => {},
  archive: async () => {
    await $fetch(`/api/emails/${props.email.id}`, {
      method: 'PATCH',
      body: { folder: 'archived' },
    });
    emit('refresh');
  },
  delete: async () => {
    await $fetch(`/api/emails/${props.email.id}`, {
      method: 'PATCH',
      body: { folder: 'trash' },
    });
    emit('refresh');
  },
  star: async () => {
    await $fetch(`/api/emails/${props.email.id}`, {
      method: 'PATCH',
      body: { starred: !props.email.starred },
    });
    emit('refresh');
  },
});

const _showActions = ref(false);

const _handlePrint = () => {
  printEmail({
    subject: props.email.subject,
    from: props.email.from,
    to: props.email.to,
    time: props.email.time,
    body: props.email.body,
  });
};

const _handleExport = (format: 'eml' | 'html' | 'pdf') => {
  switch (format) {
    case 'eml':
      exportAsEml(props.email);
      break;
    case 'html':
      exportAsHtml(props.email);
      break;
    case 'pdf':
      exportAsPdf(props.email);
      break;
  }
};

const _handleSnooze = () => {
  openSnoozeModal(props.email.id);
};

const _handleUnsnooze = async () => {
  await unsnoozeEmail(props.email.id);
  emit('refresh');
};
</script>

<template>
  <div class="relative">
    <button
      @click="_showActions = !_showActions"
      class="p-2 rounded-lg hover:bg-slate-200 dark:hover:bg-zinc-700"
    >
      <Icon name="mdi:dots-vertical" class="text-xl" />
    </button>

    <div
      v-if="_showActions"
      class="absolute right-0 top-full mt-1 w-48 bg-white dark:bg-zinc-800 rounded-lg shadow-lg border border-slate-200 dark:border-zinc-700 z-50"
    >
      <div class="py-1">
        <button
          v-if="email.folder === 'snoozed'"
          @click="_handleUnsnooze"
          class="w-full px-4 py-2 text-left text-sm hover:bg-slate-100 dark:hover:bg-zinc-700 flex items-center gap-2"
        >
          <Icon name="mdi:alarm-off" />
          Unsnooze
        </button>
        <button
          v-else
          @click="_handleSnooze"
          class="w-full px-4 py-2 text-left text-sm hover:bg-slate-100 dark:hover:bg-zinc-700 flex items-center gap-2"
        >
          <Icon name="mdi:alarm" />
          Snooze
        </button>

        <div class="border-t border-slate-200 dark:border-zinc-700 my-1"></div>

        <button
          @click="_handlePrint"
          :disabled="isPrinting"
          class="w-full px-4 py-2 text-left text-sm hover:bg-slate-100 dark:hover:bg-zinc-700 flex items-center gap-2"
        >
          <Icon name="mdi:printer" />
          Print
        </button>

        <div class="border-t border-slate-200 dark:border-zinc-700 my-1"></div>

        <div class="px-4 py-1 text-xs text-slate-500 dark:text-zinc-400">Export</div>
        <button
          @click="_handleExport('eml')"
          class="w-full px-4 py-2 text-left text-sm hover:bg-slate-100 dark:hover:bg-zinc-700 flex items-center gap-2"
        >
          <Icon name="mdi:email" />
          As .eml
        </button>
        <button
          @click="_handleExport('html')"
          class="w-full px-4 py-2 text-left text-sm hover:bg-slate-100 dark:hover:bg-zinc-700 flex items-center gap-2"
        >
          <Icon name="mdi:code-html" />
          As HTML
        </button>
        <button
          @click="_handleExport('pdf')"
          class="w-full px-4 py-2 text-left text-sm hover:bg-slate-100 dark:hover:bg-zinc-700 flex items-center gap-2"
        >
          <Icon name="mdi:file-pdf" />
          As PDF
        </button>

        <div class="border-t border-slate-200 dark:border-zinc-700 my-1"></div>

        <button
          @click="showShortcutsHelp"
          class="w-full px-4 py-2 text-left text-sm hover:bg-slate-100 dark:hover:bg-zinc-700 flex items-center gap-2"
        >
          <Icon name="mdi:keyboard" />
          Shortcuts
        </button>
      </div>
    </div>
  </div>
</template>
