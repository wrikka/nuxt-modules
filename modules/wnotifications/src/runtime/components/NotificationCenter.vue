<script setup lang="ts">
import { computed, ref } from 'vue';
import type { Notification, NotificationType } from '../types';
import { useNotifications } from '../composables';
import { useSmartFilters } from '../composables/useSmartFilters';

const props = withDefaults(
  defineProps<{
    isOpen?: boolean;
    showSearch?: boolean;
    showFilters?: boolean;
    showAdvancedFilters?: boolean;
    showBulkActions?: boolean;
    maxHeight?: string;
  }>(),
  {
    isOpen: false,
    showSearch: true,
    showFilters: true,
    showAdvancedFilters: true,
    showBulkActions: true,
    maxHeight: '500px',
  },
);

const emit = defineEmits<{
  close: [];
  notificationClick: [notification: Notification];
}>();

const { notifications, markAsRead, markAllAsRead, remove, clearAll } = useNotifications();
const {
  filters,
  savedFilters,
  activeFilterId,
  quickFilterPresets,
  hasActiveFilters,
  resetFilters,
  saveFilter,
  loadFilter,
  deleteFilter,
  applyQuickFilter,
  filterNotifications,
} = useSmartFilters();

const showAdvanced = ref(false);
const showSavedFilters = ref(false);
const saveFilterName = ref('');
const showSaveFilterDialog = ref(false);
const tagsInput = ref('');
const selectedIds = ref<Set<string>>(new Set());
const isBulkSelectMode = ref(false);

const handleTagsChange = () => {
  filters.value.tags = tagsInput.value
    .split(',')
    .map(tag => tag.trim())
    .filter(tag => tag.length > 0);
};

const selectedCount = computed(() => selectedIds.value.size);
const isAllSelected = computed(() => selectedCount.value > 0 && selectedCount.value === filteredNotifications.value.length);
const isSomeSelected = computed(() => selectedCount.value > 0 && selectedCount.value < filteredNotifications.value.length);

const toggleSelection = (id: string) => {
  if (selectedIds.value.has(id)) {
    selectedIds.value.delete(id);
  } else {
    selectedIds.value.add(id);
  }
};

const toggleSelectAll = () => {
  if (isAllSelected.value) {
    selectedIds.value.clear();
  } else {
    filteredNotifications.value.forEach(n => selectedIds.value.add(n.id));
  }
};

const handleBulkMarkAsRead = async () => {
  for (const id of selectedIds.value) {
    await markAsRead(id);
  }
  selectedIds.value.clear();
};

const handleBulkDelete = () => {
  for (const id of selectedIds.value) {
    remove(id);
  }
  selectedIds.value.clear();
};

const filteredNotifications = computed(() => filterNotifications(notifications.value));

const groupedNotifications = computed(() => {
  const groups: Record<string, Notification[]> = {
    urgent: [],
    high: [],
    normal: [],
    low: [],
  };

  for (const notification of filteredNotifications.value) {
    if (groups[notification.priority]) {
      groups[notification.priority].push(notification);
    }
  }

  return groups;
});

const typeIcons: Record<NotificationType, string> = {
  info: 'i-heroicons-information-circle',
  success: 'i-heroicons-check-circle',
  warning: 'i-heroicons-exclamation-triangle',
  error: 'i-heroicons-x-circle',
  system: 'i-heroicons-cog',
  message: 'i-heroicons-chat-bubble-left',
};

const handleNotificationClick = async (notification: Notification) => {
  if (!notification.read) {
    await markAsRead(notification.id);
  }
  emit('notificationClick', notification);
};

const handleClearAll = () => {
  clearAll();
};

const handleSaveFilter = () => {
  if (saveFilterName.value.trim()) {
    saveFilter(saveFilterName.value.trim());
    saveFilterName.value = '';
    showSaveFilterDialog.value = false;
  }
};

const handleResetFilters = () => {
  resetFilters();
  activeFilterId.value = null;
  tagsInput.value = '';
  selectedIds.value.clear();
};
</script>

<template>
  <Teleport to="body">
    <Transition name="fade">
      <div
        v-if="isOpen"
        class="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm"
        @click="emit('close')"
      />
    </Transition>

    <Transition name="slide">
      <div
        v-if="isOpen"
        class="fixed right-0 top-0 z-50 h-full w-full max-w-md bg-white shadow-2xl dark:bg-gray-900"
      >
        <!-- Header -->
        <div class="flex items-center justify-between border-b p-4 dark:border-gray-700">
          <div class="flex items-center gap-3">
            <h2 class="text-lg font-semibold">Notifications</h2>
            <span
              v-if="notifications.filter((n: Notification) => !n.read).length > 0"
              class="rounded-full bg-blue-500 px-2 py-0.5 text-xs text-white"
            >
              {{ notifications.filter((n: Notification) => !n.read).length }} new
            </span>
          </div>
          <div class="flex items-center gap-2">
            <button
              v-if="showBulkActions && selectedCount > 0"
              class="flex items-center gap-1.5 rounded-lg bg-blue-500 px-3 py-2 text-sm text-white hover:bg-blue-600"
              @click="handleBulkMarkAsRead"
            >
              <div class="i-heroicons-check h-4 w-4" />
              Mark as read ({{ selectedCount }})
            </button>
            <button
              v-if="showBulkActions && selectedCount > 0"
              class="flex items-center gap-1.5 rounded-lg bg-red-500 px-3 py-2 text-sm text-white hover:bg-red-600"
              @click="handleBulkDelete"
            >
              <div class="i-heroicons-trash h-4 w-4" />
              Delete ({{ selectedCount }})
            </button>
            <button
              v-if="showBulkActions && selectedCount > 0"
              class="rounded-lg p-2 text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800"
              @click="selectedIds.clear()"
            >
              <div class="i-heroicons-x-mark h-5 w-5" />
            </button>
            <button
              v-if="showBulkActions"
              class="rounded-lg p-2 text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800"
              title="Toggle bulk select"
              @click="isBulkSelectMode = !isBulkSelectMode"
            >
              <div :class="isBulkSelectMode ? 'i-heroicons-check-square' : 'i-heroicons-square'" class="h-5 w-5" />
            </button>
            <button
              v-if="!showBulkActions || selectedCount === 0"
              class="rounded-lg p-2 text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800"
              title="Mark all as read"
              @click="markAllAsRead"
            >
              <div class="i-heroicons-check-double h-5 w-5" />
            </button>
            <button
              v-if="!showBulkActions || selectedCount === 0"
              class="rounded-lg p-2 text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800"
              title="Clear all"
              @click="handleClearAll"
            >
              <div class="i-heroicons-trash h-5 w-5" />
            </button>
            <button
              class="rounded-lg p-2 text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800"
              @click="emit('close')"
            >
              <div class="i-heroicons-x-mark h-5 w-5" />
            </button>
          </div>
        </div>

        <!-- Bulk Select Header -->
        <div
          v-if="showBulkActions && isBulkSelectMode"
          class="flex items-center justify-between border-b bg-gray-50 px-4 py-2 dark:border-gray-700 dark:bg-gray-800"
        >
          <div class="flex items-center gap-2">
            <input
              type="checkbox"
              :checked="isAllSelected"
              :indeterminate="isSomeSelected"
              class="rounded border-gray-300"
              @change="toggleSelectAll"
            />
            <span class="text-sm text-gray-600 dark:text-gray-400">
              {{ selectedCount }} selected
            </span>
          </div>
          <button
            class="text-sm text-blue-500 hover:text-blue-600"
            @click="isBulkSelectMode = false"
          >
            Cancel
          </button>
        </div>

        <!-- Quick Filters -->
        <div v-if="showSearch || showFilters" class="border-b p-4 dark:border-gray-700">
          <div v-if="showSearch" class="mb-3">
            <div class="relative">
              <div class="i-heroicons-magnifying-glass absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <input
                v-model="filters.searchQuery"
                type="text"
                placeholder="Search notifications..."
                class="w-full rounded-lg border border-gray-200 bg-gray-50 py-2 pl-10 pr-4 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-gray-700 dark:bg-gray-800"
              />
            </div>
          </div>

          <div v-if="showFilters" class="flex flex-wrap gap-2">
            <select
              v-model="filters.type"
              class="rounded-lg border border-gray-200 bg-gray-50 px-3 py-1.5 text-sm dark:border-gray-700 dark:bg-gray-800"
            >
              <option value="all">All Types</option>
              <option value="info">Info</option>
              <option value="success">Success</option>
              <option value="warning">Warning</option>
              <option value="error">Error</option>
              <option value="system">System</option>
              <option value="message">Message</option>
            </select>

            <select
              v-model="filters.priority"
              class="rounded-lg border border-gray-200 bg-gray-50 px-3 py-1.5 text-sm dark:border-gray-700 dark:bg-gray-800"
            >
              <option value="all">All Priorities</option>
              <option value="urgent">Urgent</option>
              <option value="high">High</option>
              <option value="normal">Normal</option>
              <option value="low">Low</option>
            </select>

            <label class="flex items-center gap-1.5 text-sm">
              <input
                v-model="filters.unreadOnly"
                type="checkbox"
                class="rounded border-gray-300"
              />
              Unread only
            </label>
          </div>

          <!-- Quick Filter Presets -->
          <div v-if="showSearch || showFilters" class="mt-3 flex flex-wrap gap-2">
            <button
              v-for="preset in quickFilterPresets"
              :key="preset.id"
              class="flex items-center gap-1.5 rounded-lg border border-gray-200 bg-gray-50 px-3 py-1.5 text-sm hover:bg-gray-100 dark:border-gray-700 dark:bg-gray-800 dark:hover:bg-gray-700"
              :class="{
                'border-blue-500 bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400': activeFilterId === preset.id,
              }"
              @click="applyQuickFilter(preset.id)"
            >
              <div :class="preset.icon" class="h-4 w-4" />
              {{ preset.name }}
            </button>
          </div>

          <!-- Advanced Filters Toggle -->
          <div v-if="showAdvancedFilters" class="mt-3 flex items-center justify-between">
            <button
              class="flex items-center gap-1.5 text-sm text-blue-500 hover:text-blue-600"
              @click="showAdvanced = !showAdvanced"
            >
              <div :class="showAdvanced ? 'i-heroicons-chevron-up' : 'i-heroicons-chevron-down'" class="h-4 w-4" />
              {{ showAdvanced ? 'Hide' : 'Show' }} advanced filters
            </button>

            <div class="flex items-center gap-2">
              <button
                v-if="hasActiveFilters"
                class="rounded px-2 py-1 text-xs text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700"
                @click="handleResetFilters"
              >
                Reset filters
              </button>
              <button
                class="flex items-center gap-1.5 rounded px-2 py-1 text-xs text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20"
                @click="showSavedFilters = !showSavedFilters"
              >
                <div class="i-heroicons-bookmark h-4 w-4" />
                Saved ({{ savedFilters.length }})
              </button>
            </div>
          </div>

          <!-- Advanced Filters -->
          <div v-if="showAdvanced && showAdvancedFilters" class="mt-3 space-y-3 rounded-lg border border-gray-200 bg-gray-50 p-3 dark:border-gray-700 dark:bg-gray-800">
            <div>
              <label class="mb-1 block text-xs font-medium text-gray-600 dark:text-gray-400">Date Range</label>
              <div class="flex gap-2">
                <input
                  v-model="filters.dateRange?.start"
                  type="date"
                  class="flex-1 rounded border border-gray-200 bg-white px-2 py-1.5 text-sm dark:border-gray-700 dark:bg-gray-900"
                />
                <input
                  v-model="filters.dateRange?.end"
                  type="date"
                  class="flex-1 rounded border border-gray-200 bg-white px-2 py-1.5 text-sm dark:border-gray-700 dark:bg-gray-900"
                />
              </div>
            </div>

            <div>
              <label class="mb-1 block text-xs font-medium text-gray-600 dark:text-gray-400">Tags</label>
              <input
                v-model="tagsInput"
                type="text"
                placeholder="Comma-separated tags"
                class="w-full rounded border border-gray-200 bg-white px-2 py-1.5 text-sm dark:border-gray-700 dark:bg-gray-900"
                @input="handleTagsChange"
              />
            </div>

            <button
              class="w-full rounded bg-blue-500 px-3 py-1.5 text-sm text-white hover:bg-blue-600"
              @click="showSaveFilterDialog = true"
            >
              Save current filters
            </button>
          </div>

          <!-- Saved Filters -->
          <div v-if="showSavedFilters && savedFilters.length > 0" class="mt-3 space-y-2">
            <div class="text-xs font-medium text-gray-600 dark:text-gray-400">Saved Filters</div>
            <div
              v-for="filter in savedFilters"
              :key="filter.id"
              class="flex items-center justify-between rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 dark:border-gray-700 dark:bg-gray-800"
              :class="{
                'border-blue-500 bg-blue-50 dark:bg-blue-900/30': activeFilterId === filter.id,
              }"
            >
              <button
                class="flex-1 text-left text-sm"
                @click="loadFilter(filter.id)"
              >
                {{ filter.name }}
              </button>
              <button
                class="rounded p-1 text-gray-400 hover:text-red-500"
                @click="deleteFilter(filter.id)"
              >
                <div class="i-heroicons-trash h-4 w-4" />
              </button>
            </div>
          </div>
        </div>

        <!-- Save Filter Dialog -->
        <Teleport to="body">
          <Transition name="fade">
            <div
              v-if="showSaveFilterDialog"
              class="fixed inset-0 z-[60] bg-black/50 backdrop-blur-sm"
              @click="showSaveFilterDialog = false"
            />
          </Transition>
          <Transition name="slide-up">
            <div
              v-if="showSaveFilterDialog"
              class="fixed bottom-0 left-0 right-0 z-[60] rounded-t-2xl bg-white p-6 shadow-2xl dark:bg-gray-900"
            >
              <h3 class="mb-4 text-lg font-semibold">Save Filter</h3>
              <input
                v-model="saveFilterName"
                type="text"
                placeholder="Filter name"
                class="mb-4 w-full rounded-lg border border-gray-200 bg-gray-50 px-4 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-gray-700 dark:bg-gray-800"
                @keyup.enter="handleSaveFilter"
              />
              <div class="flex gap-2">
                <button
                  class="flex-1 rounded-lg border border-gray-200 px-4 py-2 text-gray-600 hover:bg-gray-50 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-800"
                  @click="showSaveFilterDialog = false"
                >
                  Cancel
                </button>
                <button
                  class="flex-1 rounded-lg bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
                  @click="handleSaveFilter"
                >
                  Save
                </button>
              </div>
            </div>
          </Transition>
        </Teleport>

        <!-- Notifications List -->
        <div class="overflow-y-auto" :style="{ maxHeight }">
          <div v-if="filteredNotifications.length === 0" class="flex flex-col items-center justify-center py-12 text-gray-500">
            <div class="i-heroicons-bell-slash mb-3 h-12 w-12" />
            <p>No notifications</p>
          </div>

          <template v-else>
            <div
              v-for="priority in ['urgent', 'high', 'normal', 'low']"
              :key="priority"
            >
              <div
                v-if="groupedNotifications[priority].length > 0"
                class="border-b px-4 py-2 text-xs font-medium uppercase tracking-wider text-gray-400 dark:border-gray-700"
              >
                {{ priority }}
              </div>

              <div
                v-for="notification in groupedNotifications[priority]"
                :key="notification.id"
                class="group cursor-pointer border-b p-4 transition-colors hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-gray-800"
                :class="{ 'bg-blue-50/50 dark:bg-blue-900/10': !notification.read }"
                @click="handleNotificationClick(notification)"
              >
                <div class="flex gap-3">
                  <!-- Checkbox (only shown in bulk select mode) -->
                  <div
                    v-if="showBulkActions && isBulkSelectMode"
                    class="flex h-10 w-10 flex-shrink-0 items-center justify-center"
                    @click.stop
                  >
                    <input
                      type="checkbox"
                      :checked="selectedIds.has(notification.id)"
                      class="rounded border-gray-300"
                      @change.stop="toggleSelection(notification.id)"
                    />
                  </div>

                  <!-- Icon -->
                  <div
                    class="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full"
                    :class="[
                      notification.type === 'error' ? 'bg-red-100 text-red-600 dark:bg-red-900/30' : '',
                      notification.type === 'success' ? 'bg-green-100 text-green-600 dark:bg-green-900/30' : '',
                      notification.type === 'warning' ? 'bg-yellow-100 text-yellow-600 dark:bg-yellow-900/30' : '',
                      notification.type === 'info' ? 'bg-blue-100 text-blue-600 dark:bg-blue-900/30' : '',
                      notification.type === 'system' ? 'bg-gray-100 text-gray-600 dark:bg-gray-800' : '',
                      notification.type === 'message' ? 'bg-purple-100 text-purple-600 dark:bg-purple-900/30' : '',
                    ]"
                  >
                    <div :class="typeIcons[notification.type]" class="h-5 w-5" />
                  </div>

                  <!-- Content -->
                  <div class="min-w-0 flex-1">
                    <div class="flex items-start justify-between gap-2">
                      <p
                        class="truncate font-medium"
                        :class="{ 'font-bold': !notification.read }"
                      >
                        {{ notification.title }}
                      </p>
                      <span class="flex-shrink-0 text-xs text-gray-400">
                        {{ new Date(notification.createdAt).toLocaleDateString() }}
                      </span>
                    </div>
                    <p class="mt-1 line-clamp-2 text-sm text-gray-600 dark:text-gray-400">
                      {{ notification.message }}
                    </p>

                    <!-- Actions -->
                    <div class="mt-2 flex gap-2 opacity-0 transition-opacity group-hover:opacity-100">
                      <button
                        class="rounded px-2 py-1 text-xs text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700"
                        @click.stop="remove(notification.id)"
                      >
                        Dismiss
                      </button>
                      <button
                        v-if="notification.url"
                        class="rounded px-2 py-1 text-xs text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20"
                      >
                        View details
                      </button>
                    </div>
                  </div>

                  <!-- Unread indicator -->
                  <div
                    v-if="!notification.read"
                    class="mt-1.5 h-2 w-2 flex-shrink-0 rounded-full bg-blue-500"
                  />
                </div>
              </div>
            </div>
          </template>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.slide-enter-active,
.slide-leave-active {
  transition: transform 0.3s ease;
}

.slide-enter-from,
.slide-leave-to {
  transform: translateX(100%);
}

.slide-up-enter-active,
.slide-up-leave-active {
  transition: transform 0.3s ease;
}

.slide-up-enter-from,
.slide-up-leave-to {
  transform: translateY(100%);
}
</style>
