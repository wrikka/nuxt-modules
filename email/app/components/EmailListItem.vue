<script setup lang="ts">
import type { Email } from '../../shared/types/email';
import { getLabelClasses } from '~/utils/labels';

const contextMenuStore = useContextMenuStore()
const { open: _openContextMenu } = contextMenuStore
const searchStore = useSearchStore()
const { searchQuery } = storeToRefs(searchStore)

const settingsStore = useSettingsStore()
const { density: _density } = storeToRefs(settingsStore)

const props = defineProps<{
  email: Email;
}>();

const _faviconUrl = computed(() => `https://www.google.com/s2/favicons?domain=${props.email.domain}&sz=16`);

const fromRef = computed(() => props.email.from)
const subjectRef = computed(() => props.email.subject)
const _highlightedFrom = createHighlightedText(fromRef, searchQuery);
const _highlightedSubject = createHighlightedText(subjectRef, searchQuery);

async function _toggleStar() {
  await $fetch(`/api/emails/${props.email.id}`, {
    method: 'PATCH',
    body: { starred: !props.email.starred },
  });
  props.email.starred = !props.email.starred;
}
</script>

<template>
  <NuxtLink
    :to="`/email/${email.id}`"
    class="border-b border-slate-200 dark:border-zinc-800 cursor-pointer flex items-center gap-3 transition-colors"
    :class="[
      _density === 'comfortable' ? 'p-3' : 'p-2',
      {
        'bg-slate-100 dark:bg-zinc-800 dark:bg-opacity-50': !email.read,
        'hover:bg-slate-200 hover:bg-opacity-60 dark:hover:bg-zinc-800': !email.read,
        'hover:bg-slate-100 hover:bg-opacity-80 dark:hover:bg-zinc-800 dark:hover:bg-opacity-80': email.read,
      }
    ]"
    @contextmenu.prevent="_openContextMenu($event, email)"
  >
    <div class="flex items-center gap-3 w-48 flex-shrink-0">
      <input type="checkbox" flex-shrink-0 @click.prevent class="form-checkbox h-4 w-4 text-blue-600 rounded border-gray-300 dark:border-zinc-700 focus:ring-blue-500" />
      <button @click.prevent="_toggleStar" class="text-lg text-slate-400 dark:text-zinc-500 hover:text-yellow-500 dark:hover:text-yellow-400 flex-shrink-0 transition-colors">
        <Icon :name="email.starred ? 'mdi:star' : 'mdi:star-outline'" :class="{'!text-yellow-500 dark:!text-yellow-400': email.starred}" />
      </button>
      <img :src="_faviconUrl" :alt="`${email.from} favicon`" w-4 h-4 flex-shrink-0 rounded-full />
      <div class="flex-1 min-w-0">
        <div class="truncate text-sm" :class="{'font-semibold': !email.read}" v-html="_highlightedFrom"></div>
      </div>
    </div>

    <div class="flex-1 min-w-0 flex items-center gap-2">
      <span class="text-sm truncate" :class="{'font-semibold': !email.read}" v-html="_highlightedSubject"></span>
      <span class="text-xs text-slate-500 dark:text-zinc-400 truncate">- {{ email.body.substring(0, 50) }}...</span>
      <div class="flex items-center gap-1.5 ml-auto pl-4">
        <div
          v-for="label in email.labels"
          :key="label"
          class="px-2 py-0.5 rounded-full text-xs font-medium"
          :class="getLabelClasses(label)"
        >
          {{ label }}
        </div>
      </div>
    </div>

    <div class="text-xs text-slate-500 dark:text-zinc-400 flex-shrink-0">
      <div v-if="email.folder === 'snoozed' && email.snoozedUntil" class="flex items-center gap-1 text-yellow-600 dark:text-yellow-500">
        <Icon name="mdi:clock-outline" />
        <span>{{ new Date(email.snoozedUntil).toLocaleDateString() }}</span>
      </div>
      <span v-else>{{ email.time }}</span>
    </div>
  </NuxtLink>
</template>
