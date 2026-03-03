<script setup lang="ts">
import { computed, ref } from 'vue';
import type { Notification, NotificationType } from '../types';
import { useNotifications } from '../composables';
import { useSmartFilters } from '../composables/useSmartFilters';
import NotificationFilters from './notification/NotificationFilters.vue';
import NotificationList from './notification/NotificationList.vue';
import SaveFilterDialog from './notification/SaveFilterDialog.vue';

const props = withDefaults(defineProps<{
	isOpen?: boolean;
	showSearch?: boolean;
	showFilters?: boolean;
	showAdvancedFilters?: boolean;
	showBulkActions?: boolean;
	maxHeight?: string;
}>(), { isOpen: false, showSearch: true, showFilters: true, showAdvancedFilters: true, showBulkActions: true, maxHeight: '500px' });

const emit = defineEmits<{ close: []; notificationClick: [notification: Notification] }>();

const { notifications, markAsRead, markAllAsRead, remove, clearAll } = useNotifications();
const { filters, savedFilters, activeFilterId, quickFilterPresets, hasActiveFilters, resetFilters, saveFilter, loadFilter, deleteFilter, applyQuickFilter, filterNotifications } = useSmartFilters();

const showAdvanced = ref(false);
const showSavedFilters = ref(false);
const saveFilterName = ref('');
const showSaveFilterDialog = ref(false);
const tagsInput = ref('');
const selectedIds = ref<Set<string>>(new Set());
const isBulkSelectMode = ref(false);

const selectedCount = computed(() => selectedIds.value.size);
const isAllSelected = computed(() => selectedCount.value > 0 && selectedCount.value === filteredNotifications.value.length);
const isSomeSelected = computed(() => selectedCount.value > 0 && selectedCount.value < filteredNotifications.value.length);

const toggleSelection = (id: string) => selectedIds.value.has(id) ? selectedIds.value.delete(id) : selectedIds.value.add(id);
const toggleSelectAll = () => isAllSelected.value ? selectedIds.value.clear() : filteredNotifications.value.forEach(n => selectedIds.value.add(n.id));

const handleBulkMarkAsRead = async () => { for (const id of selectedIds.value) await markAsRead(id); selectedIds.value.clear(); };
const handleBulkDelete = () => { for (const id of selectedIds.value) remove(id); selectedIds.value.clear(); };
const handleClearAll = () => clearAll();

const handleSaveFilter = () => {
	if (saveFilterName.value.trim()) { saveFilter(saveFilterName.value.trim()); saveFilterName.value = ''; showSaveFilterDialog.value = false; }
};

const handleResetFilters = () => { resetFilters(); activeFilterId.value = null; tagsInput.value = ''; selectedIds.value.clear(); };
const handleNotificationClick = async (notification: Notification) => { if (!notification.read) await markAsRead(notification.id); emit('notificationClick', notification); };

const filteredNotifications = computed(() => filterNotifications(notifications.value));
const groupedNotifications = computed(() => {
	const groups: Record<string, Notification[]> = { urgent: [], high: [], normal: [], low: [] };
	for (const n of filteredNotifications.value) if (groups[n.priority]) groups[n.priority].push(n);
	return groups;
});
</script>

<template>
	<Teleport to="body">
		<Transition name="fade">
			<div v-if="isOpen" class="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm" @click="emit('close')" />
		</Transition>
		<Transition name="slide">
			<div v-if="isOpen" class="fixed right-0 top-0 z-50 h-full w-full max-w-md bg-white shadow-2xl dark:bg-gray-900">
				<!-- Header -->
				<div class="flex items-center justify-between border-b p-4 dark:border-gray-700">
					<div class="flex items-center gap-3">
						<h2 class="text-lg font-semibold">Notifications</h2>
						<span v-if="notifications.filter((n: Notification) => !n.read).length > 0" class="rounded-full bg-blue-500 px-2 py-0.5 text-xs text-white">{{ notifications.filter((n: Notification) => !n.read).length }} new</span>
					</div>
					<div class="flex items-center gap-2">
						<button v-if="showBulkActions && selectedCount > 0" class="flex items-center gap-1.5 rounded-lg bg-blue-500 px-3 py-2 text-sm text-white hover:bg-blue-600" @click="handleBulkMarkAsRead"><div class="i-heroicons-check h-4 w-4" />Mark as read ({{ selectedCount }})</button>
						<button v-if="showBulkActions && selectedCount > 0" class="flex items-center gap-1.5 rounded-lg bg-red-500 px-3 py-2 text-sm text-white hover:bg-red-600" @click="handleBulkDelete"><div class="i-heroicons-trash h-4 w-4" />Delete ({{ selectedCount }})</button>
						<button v-if="showBulkActions && selectedCount > 0" class="rounded-lg p-2 text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800" @click="selectedIds.clear()"><div class="i-heroicons-x-mark h-5 w-5" /></button>
						<button v-if="showBulkActions" class="rounded-lg p-2 text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800" title="Toggle bulk select" @click="isBulkSelectMode = !isBulkSelectMode"><div :class="isBulkSelectMode ? 'i-heroicons-check-square' : 'i-heroicons-square'" class="h-5 w-5" /></button>
						<button v-if="!showBulkActions || selectedCount === 0" class="rounded-lg p-2 text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800" title="Mark all as read" @click="markAllAsRead"><div class="i-heroicons-check-double h-5 w-5" /></button>
						<button v-if="!showBulkActions || selectedCount === 0" class="rounded-lg p-2 text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800" title="Clear all" @click="handleClearAll"><div class="i-heroicons-trash h-5 w-5" /></button>
						<button class="rounded-lg p-2 text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800" @click="emit('close')"><div class="i-heroicons-x-mark h-5 w-5" /></button>
					</div>
				</div>

				<!-- Bulk Select Header -->
				<div v-if="showBulkActions && isBulkSelectMode" class="flex items-center justify-between border-b bg-gray-50 px-4 py-2 dark:border-gray-700 dark:bg-gray-800">
					<div class="flex items-center gap-2">
						<input type="checkbox" :checked="isAllSelected" :indeterminate="isSomeSelected" class="rounded border-gray-300" @change="toggleSelectAll" />
						<span class="text-sm text-gray-600 dark:text-gray-400">{{ selectedCount }} selected</span>
					</div>
					<button class="text-sm text-blue-500 hover:text-blue-600" @click="isBulkSelectMode = false">Cancel</button>
				</div>

				<!-- Filters -->
				<NotificationFilters
					v-model:filters="filters"
					v-model:tagsInput="tagsInput"
					v-model:showAdvanced="showAdvanced"
					v-model:showSavedFilters="showSavedFilters"
					:has-active-filters="hasActiveFilters"
					:active-filter-id="activeFilterId"
					:quick-filter-presets="quickFilterPresets"
					:saved-filters="savedFilters"
					:show-search="showSearch"
					:show-filters="showFilters"
					:show-advanced-filters="showAdvancedFilters"
					@apply-preset="applyQuickFilter"
					@reset="handleResetFilters"
					@save="showSaveFilterDialog = true"
					@load-filter="loadFilter"
					@delete-filter="deleteFilter"
				/>

				<!-- Save Filter Dialog -->
				<SaveFilterDialog v-model:name="saveFilterName" :show="showSaveFilterDialog" @save="handleSaveFilter" @cancel="showSaveFilterDialog = false" />

				<!-- Notifications List -->
				<NotificationList
					:notifications="filteredNotifications"
					:grouped-notifications="groupedNotifications"
					:selected-ids="selectedIds"
					:is-bulk-select-mode="isBulkSelectMode"
					:max-height="maxHeight"
					@click="handleNotificationClick"
					@toggle="toggleSelection"
					@dismiss="remove"
				/>
			</div>
		</Transition>
	</Teleport>
</template>

<style scoped>
.fade-enter-active, .fade-leave-active { transition: opacity 0.2s ease; }
.fade-enter-from, .fade-leave-to { opacity: 0; }
.slide-enter-active, .slide-leave-active { transition: transform 0.3s ease; }
.slide-enter-from, .slide-leave-to { transform: translateX(100%); }
</style>
