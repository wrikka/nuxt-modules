<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import { useWebhookEvents } from '#webhooks/composables';
import { useWebhookFilters } from '#webhooks/composables';
import type { WebhookEventSelect } from '#webhooks/repository';

const {
  events,
  isLoading,
  hasMore,
  fetchEvents,
  loadMore,
  deleteEvent,
  retryEvent,
} = useWebhookEvents();

const {
  filters,
  hasActiveFilters,
  setProvider,
  setStatus,
  setSearch,
  clearFilters,
} = useWebhookFilters();

const searchQuery = ref('');
const selectedEvents = ref<string[]>([]);

onMounted(() => {
  fetchEvents();
});

const formatTimestamp = (date: Date | string) => {
  return new Date(date).toLocaleString();
};

const truncateId = (id: string) => {
  return id.length > 8 ? `${id.slice(0, 8)}...` : id;
};

const providerBadgeColor = (provider: string) => {
  const colors: Record<string, string> = {
    stripe: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200',
    github: 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200',
    slack: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
    custom: 'bg-slate-100 text-slate-800 dark:bg-slate-700 dark:text-slate-200',
  };
  return colors[provider] || 'bg-gray-100 text-gray-800';
};

const statusBadgeColor = (event: WebhookEventSelect) => {
  if (event.processed && !event.error) {
    return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
  }
  if (event.error) {
    return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
  }
  return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
};

const getStatusLabel = (event: WebhookEventSelect) => {
  if (event.processed && !event.error) return 'Processed';
  if (event.error) return 'Failed';
  return 'Pending';
};

const handleSearch = () => {
  setSearch(searchQuery.value);
  fetchEvents({ search: searchQuery.value, offset: 0 });
};

const handleProviderFilter = (provider: 'stripe' | 'github' | 'slack' | 'custom' | 'all') => {
  setProvider(provider);
  fetchEvents({ provider: provider === 'all' ? undefined : provider, offset: 0 });
};

const handleStatusFilter = (status: 'all' | 'processed' | 'failed' | 'pending') => {
  setStatus(status);
  const processed = status === 'processed' ? true : status === 'failed' ? false : undefined;
  fetchEvents({ processed, offset: 0 });
};

const handleClearFilters = () => {
  clearFilters();
  searchQuery.value = '';
  fetchEvents({ offset: 0 });
};

const toggleSelect = (eventId: string) => {
  const index = selectedEvents.value.indexOf(eventId);
  if (index > -1) {
    selectedEvents.value.splice(index, 1);
  } else {
    selectedEvents.value.push(eventId);
  }
};

const allSelected = computed(() => {
  return events.value.length > 0 && selectedEvents.value.length === events.value.length;
});

const toggleSelectAll = () => {
  if (allSelected.value) {
    selectedEvents.value = [];
  } else {
    selectedEvents.value = events.value.map((e: { id: string }) => e.id);
  }
};
</script>

<template>
  <div class="webhook-event-list p-6 space-y-4">
    <div class="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
      <h2 class="text-xl font-bold">Webhook Events</h2>

      <div class="flex flex-wrap gap-2">
        <select
          class="px-3 py-2 border rounded dark:bg-gray-800 dark:border-gray-600"
          :value="filters.provider"
          @change="handleProviderFilter(($event.target as HTMLSelectElement).value as 'stripe' | 'github' | 'slack' | 'custom' | 'all')"
        >
          <option value="all">All Providers</option>
          <option value="stripe">Stripe</option>
          <option value="github">GitHub</option>
          <option value="slack">Slack</option>
          <option value="custom">Custom</option>
        </select>

        <select
          class="px-3 py-2 border rounded dark:bg-gray-800 dark:border-gray-600"
          :value="filters.status"
          @change="handleStatusFilter(($event.target as HTMLSelectElement).value as 'all' | 'processed' | 'failed' | 'pending')"
        >
          <option value="all">All Status</option>
          <option value="processed">Processed</option>
          <option value="failed">Failed</option>
          <option value="pending">Pending</option>
        </select>

        <div class="flex gap-1">
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Search events..."
            class="px-3 py-2 border rounded dark:bg-gray-800 dark:border-gray-600"
            @keyup.enter="handleSearch"
          />
          <button
            class="px-3 py-2 bg-gray-200 dark:bg-gray-700 rounded hover:bg-gray-300 dark:hover:bg-gray-600"
            @click="handleSearch"
          >
            Search
          </button>
        </div>

        <button
          v-if="hasActiveFilters"
          class="px-3 py-2 text-red-500 hover:text-red-600"
          @click="handleClearFilters"
        >
          Clear Filters
        </button>
      </div>
    </div>

    <div v-if="isLoading" class="text-center py-8">
      <div class="animate-spin w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full mx-auto" />
    </div>

    <div v-else-if="events.length === 0" class="text-center py-8 text-gray-500">
      No webhook events found
    </div>

    <template v-else>
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
        <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead class="bg-gray-50 dark:bg-gray-900">
            <tr>
              <th class="px-4 py-3 text-left">
                <input
                  type="checkbox"
                  :checked="allSelected"
                  @change="toggleSelectAll"
                />
              </th>
              <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">ID</th>
              <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Provider</th>
              <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Type</th>
              <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
              <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Timestamp</th>
              <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-200 dark:divide-gray-700">
            <tr
              v-for="event in events"
              :key="event.id"
              class="hover:bg-gray-50 dark:hover:bg-gray-700"
            >
              <td class="px-4 py-3">
                <input
                  type="checkbox"
                  :checked="selectedEvents.includes(event.id)"
                  @change="toggleSelect(event.id)"
                />
              </td>
              <td class="px-4 py-3 font-mono text-sm">{{ truncateId(event.id) }}</td>
              <td class="px-4 py-3">
                <span
                  class="px-2 py-1 rounded text-xs font-medium capitalize"
                  :class="providerBadgeColor(event.provider)"
                >
                  {{ event.provider }}
                </span>
              </td>
              <td class="px-4 py-3 text-sm">{{ event.type }}</td>
              <td class="px-4 py-3">
                <span
                  class="px-2 py-1 rounded text-xs font-medium"
                  :class="statusBadgeColor(event)"
                >
                  {{ getStatusLabel(event) }}
                </span>
              </td>
              <td class="px-4 py-3 text-sm text-gray-500">{{ formatTimestamp(event.timestamp) }}</td>
              <td class="px-4 py-3">
                <div class="flex gap-2">
                  <button
                    v-if="event.error"
                    class="px-2 py-1 text-xs bg-yellow-100 text-yellow-800 rounded hover:bg-yellow-200"
                    @click="retryEvent(event.id)"
                  >
                    Retry
                  </button>
                  <button
                    class="px-2 py-1 text-xs bg-red-100 text-red-800 rounded hover:bg-red-200"
                    @click="deleteEvent(event.id)"
                  >
                    Delete
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div v-if="hasMore" class="text-center">
        <button
          class="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          @click="loadMore"
        >
          Load More
        </button>
      </div>
    </template>
  </div>
</template>
