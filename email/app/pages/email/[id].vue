<script setup lang="ts">
const { email: _email, pending: _pending, error: _error, markAsUnread: _markAsUnread, deleteEmail: _deleteEmail, toggleStar: _toggleStar } = useEmailDetail();
</script>

<template>
  <div v-if="_pending" class="p-4">Loading...</div>
  <div v-else-if="_error || !_email" class="p-4">Error loading email.</div>
  <div v-else class="flex flex-col h-full">
    <div class="p-4 border-b border-slate-200 dark:border-zinc-800">
      <h1 class="text-2xl font-bold mb-2">{{ _email.subject }}</h1>
      <div class="flex items-center justify-between">
        <div class="flex items-center gap-3">
          <img :src="`https://www.google.com/s2/favicons?domain=${_email.domain}&sz=24`" :alt="`${_email.from} favicon`" class="w-6 h-6 rounded-full" />
          <div>
            <div class="font-semibold">{{ _email.from }}</div>
            <div class="text-sm text-slate-500 dark:text-zinc-400">To: {{ _email.to }}</div>
          </div>
        </div>
        <div class="text-sm text-slate-500 dark:text-zinc-400">{{ _email.time }}</div>
      </div>
    </div>

    <div class="p-4 flex items-center gap-2 border-b border-slate-200 dark:border-zinc-800">
        <button class="px-3 py-1.5 text-sm flex items-center gap-2 rounded-md bg-slate-100 dark:bg-zinc-800 hover:bg-slate-200 dark:hover:bg-zinc-700">
            <Icon name="mdi:reply" />
            <span>Reply</span>
        </button>
        <button class="px-3 py-1.5 text-sm flex items-center gap-2 rounded-md bg-slate-100 dark:bg-zinc-800 hover:bg-slate-200 dark:hover:bg-zinc-700">
            <Icon name="mdi:reply-all" />
            <span>Reply All</span>
        </button>
        <button class="px-3 py-1.5 text-sm flex items-center gap-2 rounded-md bg-slate-100 dark:bg-zinc-800 hover:bg-slate-200 dark:hover:bg-zinc-700">
            <Icon name="mdi:arrow-right" />
            <span>Forward</span>
        </button>
        <div class="ml-auto flex items-center gap-2">
            <button @click="_toggleStar" class="p-2 text-lg rounded-full hover:bg-slate-200 dark:hover:bg-zinc-700">
                <Icon :name="_email.starred ? 'mdi:star' : 'mdi:star-outline'" :class="{'text-yellow-500 dark:text-yellow-400': _email.starred}" />
            </button>
            <button @click="_deleteEmail" class="p-2 text-lg rounded-full hover:bg-slate-200 dark:hover:bg-zinc-700">
                <Icon name="mdi:delete-outline" />
            </button>
            <button @click="_markAsUnread" class="p-2 text-lg rounded-full hover:bg-slate-200 dark:hover:bg-zinc-700">
                <Icon name="mdi:email-open-outline" />
            </button>
        </div>
    </div>

    <div class="p-4 overflow-y-auto flex-1">
      <div class="prose dark:prose-invert max-w-none prose-sm sm:prose-base focus:outline-none" v-html="_email.body"></div>
    </div>
  </div>
</template>
