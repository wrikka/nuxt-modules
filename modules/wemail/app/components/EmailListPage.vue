<script setup lang="ts">
import type { UseFetchOptions } from '#app';

const props = defineProps<{
  title: string;
  fetchOptions: UseFetchOptions<Email[]>;
  emptyState: {
    icon: string;
    title: string;
    message: string;
  };
}>();

const { emails: _emails, pending: _pending, error, sortBy: _sortBy } = useEmailList(props.fetchOptions);

const sortOptions = [
  { label: 'Date (Newest First)', value: 'date-desc' },
  { label: 'Date (Oldest First)', value: 'date-asc' },
  { label: 'Sender (A-Z)', value: 'from-asc' },
  { label: 'Sender (Z-A)', value: 'from-desc' },
]
const { viewMode: _viewMode } = useEmailView();

if (error.value) {
  console.error(`Error fetching emails for ${props.title}:`, error.value);
}
</script>

<template>
  <div class="p-4 sm:p-6">
    <div class="flex justify-between items-center mb-4">
      <h1 class="text-2xl font-bold">{{ title }}</h1>
      <div class="flex items-center gap-4">
        <USelectMenu v-model="_sortBy" :options="sortOptions" value-attribute="value" option-attribute="label" />
        <EmailViewSwitcher />
      </div>
    </div>

    <div v-if="_pending" class="text-center">
      <p>Loading...</p>
    </div>
    <div v-else-if="error" class="text-center text-red-500">
      <p>Error loading emails.</p>
    </div>
    <div v-else-if="_emails && _emails.length">
      <EmailList v-if="_viewMode === 'list'" :emails="_emails" />
      <EmailGrid v-else-if="_viewMode === 'grid'" :emails="_emails" />
    </div>
    <EmptyState v-else :icon="emptyState.icon" :title="emptyState.title" :message="emptyState.message" />
  </div>
</template>
