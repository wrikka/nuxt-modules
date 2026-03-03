<script setup lang="ts">
const { tabs: _tabs, activeTab: _activeTab, pending: _pending, error: _error, filteredEmails: _filteredEmails } = useInbox();
const { viewMode: _viewMode } = useEmailView();
</script>

<template>
  <div class="p-4 sm:p-6">
    <div class="flex justify-between items-center mb-4">
      <div class="flex border-b border-gray-200 dark:border-zinc-700">
        <button
          v-for="tab in _tabs"
          :key="tab"
          @click="_activeTab = tab"
          class="px-4 py-2 text-sm font-medium"
          :class="{
            'border-b-2 border-blue-500 text-blue-600 dark:text-blue-400': _activeTab === tab,
            'text-gray-500 dark:text-zinc-400 hover:text-gray-700 dark:hover:text-zinc-200': _activeTab !== tab
          }"
        >
          {{ tab }}
        </button>
      </div>
      <EmailViewSwitcher />
    </div>

    <div v-if="_pending" class="text-center">
      <p>Loading...</p>
    </div>
    <div v-else-if="_error" class="text-center text-red-500">
      <p>Error loading emails.</p>
    </div>
    <div v-else>
      <EmailList v-if="_viewMode === 'list'" :emails="_filteredEmails || []" />
      <EmailGrid v-else-if="_viewMode === 'grid'" :emails="_filteredEmails || []" />
    </div>
  </div>
</template>
