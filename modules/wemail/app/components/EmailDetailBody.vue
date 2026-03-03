<script setup lang="ts">
import type { Email } from '../../shared/types/email';
import { getLabelClasses } from '~/utils/labels';

defineProps<{
  email: Email;
}>();
</script>

<template>
  <div class="p-8">
    <div class="flex items-center gap-4 mb-4">
      <h1 class="text-2xl font-bold">{{ email.subject }}</h1>
      <div class="flex items-center gap-1.5 ml-auto">
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
    <div class="flex items-center gap-4 mb-8 text-slate-600 dark:text-zinc-400">
      <img :src="`https://www.google.com/s2/favicons?domain=${email.domain}&sz=32`" alt="" class="w-10 h-10 rounded-full flex-shrink-0" />
      <div class="flex-1">
        <div class="flex items-center gap-2">
          <p class="font-semibold text-slate-800 dark:text-zinc-200">{{ email.from }}</p>
          <p class="text-xs text-slate-500 dark:text-zinc-400">{{ email.domain }}</p>
        </div>
        <p class="text-sm">to me</p>
      </div>
      <div class="text-sm flex items-center gap-4">
        <span>{{ new Date(email.time).toLocaleString() }}</span>
      </div>
    </div>
    <div class="prose dark:prose-invert max-w-none" v-html="email.body"></div>
  </div>
</template>
