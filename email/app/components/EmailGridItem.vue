<script setup lang="ts">
import type { Email } from '../../shared/types/email';
import { getLabelClasses } from '~/utils/labels';

const contextMenuStore = useContextMenuStore()
const { open: _openContextMenu } = contextMenuStore
const searchStore = useSearchStore()
const { searchQuery } = storeToRefs(searchStore)

const props = defineProps<{ 
  email: Email;
}>();

const fromRef = computed(() => props.email.from)
const subjectRef = computed(() => props.email.subject)
const _highlightedFrom = createHighlightedText(fromRef, searchQuery);
const _highlightedSubject = createHighlightedText(subjectRef, searchQuery);

function getFaviconUrl(domain: string) {
  return `https://www.google.com/s2/favicons?domain=${domain}&sz=32`;
}

async function _toggleStar() {
  await $fetch(`/api/emails/${props.email.id}`, {
    method: 'PATCH',
    body: { starred: !props.email.starred },
  });
  props.email.starred = !props.email.starred;
}
</script>

<template>
  <div
    class="relative p-4 border rounded-lg shadow-sm transition-shadow bg-white dark:bg-zinc-800 dark:border-zinc-700"
    :class="{
      'bg-slate-100 dark:bg-zinc-900': !email.read,
      'hover:shadow-md': true,
    }"
    @contextmenu.prevent="_openContextMenu($event, email)"
  >
    <NuxtLink :to="`/email/${email.id}`" class="absolute inset-0 z-0"></NuxtLink>
    <div class="relative z-10 flex flex-col h-full">
      <div class="flex items-start gap-3 mb-2">
        <img :src="getFaviconUrl(email.domain)" :alt="`${email.from} favicon`" class="w-8 h-8 rounded-full flex-shrink-0" />
        <div class="flex-1 min-w-0">
          <div class="flex justify-between items-center">
            <div class="text-sm truncate" :class="{'font-semibold': !email.read}" v-html="_highlightedFrom"></div>
            <button @click.prevent="_toggleStar" class="text-lg text-slate-400 dark:text-zinc-500 hover:text-yellow-500 dark:hover:text-yellow-400 flex-shrink-0 transition-colors z-20">
              <Icon :name="email.starred ? 'mdi:star' : 'mdi:star-outline'" :class="{'!text-yellow-500 dark:!text-yellow-400': email.starred}" />
            </button>
          </div>
          <div class="text-xs text-slate-500 dark:text-zinc-400">{{ email.time }}</div>
        </div>
      </div>
      
      <div class="flex-1 min-w-0 mb-3">
        <p class="text-sm font-semibold truncate" :class="{'font-bold': !email.read}" v-html="_highlightedSubject"></p>
        <p class="text-xs text-slate-500 dark:text-zinc-400 truncate">{{ email.body.substring(0, 100) }}...</p>
      </div>

      <div v-if="email.labels && email.labels.length" class="flex items-center gap-1.5 flex-wrap">
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
  </div>
</template>
