<script setup lang="ts">
import type { Email } from '../../shared/types/email';

const props = defineProps<{
  email: Email;
}>();

function _getFaviconUrl(domain: string) {
  return `https://www.google.com/s2/favicons?domain=${domain}&sz=32`;
}

const _purchaseInfo = computed(() => {
  const amountRegex = /(\d{1,3}(,\d{3})*(\.\d+)?)\s?(THB|USD|\$)/i;
  const amountMatch = props.email.body.match(amountRegex);
  const amount = amountMatch ? amountMatch[1] : null;

  let status = 'Confirmed';
  if (props.email.subject.toLowerCase().includes('shipped')) {
    status = 'Shipped';
  } else if (props.email.subject.toLowerCase().includes('delivered')) {
    status = 'Delivered';
  } else if (props.email.subject.toLowerCase().includes('renewed')) {
    status = 'Renewed';
  }

  return {
    amount,
    status,
  };
});
</script>

<template>
  <NuxtLink :to="`/email/${email.id}`" class="block p-4 border rounded-lg shadow-sm hover:shadow-md transition-shadow bg-white dark:bg-zinc-800 dark:border-zinc-700">
    <div class="flex items-start gap-4">
      <img :src="_getFaviconUrl(email.domain)" :alt="`${email.from} favicon`" class="w-10 h-10 rounded-full flex-shrink-0" />
      <div class="flex-1">
        <div class="flex justify-between items-center">
          <p class="font-semibold text-slate-800 dark:text-zinc-200">{{ email.from }}</p>
          <p v-if="_purchaseInfo.amount" class="text-lg font-bold text-slate-900 dark:text-zinc-100">{{ _purchaseInfo.amount }} THB</p>
        </div>
        <p class="text-sm text-slate-600 dark:text-zinc-400">{{ email.subject }}</p>
        <div class="mt-2 flex items-center justify-between text-sm">
          <span
            class="px-2 py-1 rounded-full text-xs font-medium"
            :class="{
              'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300': _purchaseInfo.status === 'Delivered',
              'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300': _purchaseInfo.status === 'Shipped',
              'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300': _purchaseInfo.status === 'Confirmed',
              'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300': _purchaseInfo.status === 'Renewed',
            }"
          >
            {{ _purchaseInfo.status }}
          </span>
          <span class="text-slate-500 dark:text-zinc-400">{{ email.time }}</span>
        </div>
      </div>
    </div>
  </NuxtLink>
</template>
