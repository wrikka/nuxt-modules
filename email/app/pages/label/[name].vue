<script setup lang="ts">
const route = useRoute();
const labelName = computed(() => route.params.name as string);

const { emails: _emails, pending: _pending, error: _error, emptyState: _emptyState } = useLabelEmails(labelName);
const { viewMode: _viewMode } = useEmailView();
</script>

<template>
  <div class="p-4 sm:p-6">
    <div class="flex justify-between items-center mb-4">
      <h1 class="text-2xl font-bold capitalize">{{ labelName }}</h1>
      <EmailViewSwitcher />
    </div>

    <div v-if="_pending" class="text-center">
      <p>Loading...</p>
    </div>
    <div v-else-if="_error" class="text-center text-red-500">
      <p>Error loading emails for this label.</p>
    </div>
    <div v-else-if="_emails && _emails.length">
      <EmailList v-if="_viewMode === 'list'" :emails="_emails" />
      <EmailGrid v-else-if="_viewMode === 'grid'" :emails="_emails" />
    </div>
    <EmptyState v-else :icon="_emptyState.icon" :title="_emptyState.title" :message="_emptyState.message" />
  </div>
</template>
