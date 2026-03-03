import { computed, ref } from 'vue';
import type { Notification } from '../types';
import type { FilterOptions, QuickFilterPreset, SavedFilter } from '../types/filters';

export const useSmartFilters = () => {
  const filters = ref<FilterOptions>({
    searchQuery: '',
    type: 'all',
    priority: 'all',
    unreadOnly: false,
  });

  const savedFilters = ref<SavedFilter[]>([]);
  const activeFilterId = ref<string | null>(null);

  const quickFilterPresets: QuickFilterPreset[] = [
    {
      id: 'all',
      name: 'All',
      icon: 'i-heroicons-inbox',
      filters: {},
    },
    {
      id: 'unread',
      name: 'Unread',
      icon: 'i-heroicons-envelope',
      filters: { unreadOnly: true },
    },
    {
      id: 'urgent',
      name: 'Urgent',
      icon: 'i-heroicons-exclamation-circle',
      filters: { priority: 'urgent' },
    },
    {
      id: 'today',
      name: 'Today',
      icon: 'i-heroicons-calendar',
      filters: {
        dateRange: {
          start: new Date(new Date().setHours(0, 0, 0, 0)),
          end: new Date(new Date().setHours(23, 59, 59, 999)),
        },
      },
    },
    {
      id: 'week',
      name: 'This Week',
      icon: 'i-heroicons-calendar-days',
      filters: {
        dateRange: {
          start: new Date(new Date().setDate(new Date().getDate() - 7)),
          end: new Date(),
        },
      },
    },
  ];

  const applyFilter = (newFilters: Partial<FilterOptions>) => {
    filters.value = { ...filters.value, ...newFilters };
  };

  const resetFilters = () => {
    filters.value = {
      searchQuery: '',
      type: 'all',
      priority: 'all',
      unreadOnly: false,
    };
  };

  const saveFilter = (name: string) => {
    const newFilter: SavedFilter = {
      id: `filter_${Date.now()}`,
      name,
      filters: { ...filters.value },
      createdAt: new Date(),
    };
    savedFilters.value.push(newFilter);
    return newFilter;
  };

  const loadFilter = (filterId: string) => {
    const filter = savedFilters.value.find(f => f.id === filterId);
    if (filter) {
      filters.value = { ...filter.filters };
      activeFilterId.value = filterId;
    }
  };

  const deleteFilter = (filterId: string) => {
    const index = savedFilters.value.findIndex(f => f.id === filterId);
    if (index > -1) {
      savedFilters.value.splice(index, 1);
      if (activeFilterId.value === filterId) {
        activeFilterId.value = null;
      }
    }
  };

  const applyQuickFilter = (presetId: string) => {
    const preset = quickFilterPresets.find(p => p.id === presetId);
    if (preset) {
      filters.value = { ...preset.filters };
      activeFilterId.value = null;
    }
  };

  const filterNotifications = (notifications: Notification[]) => {
    let result = [...notifications];

    if (filters.value.searchQuery) {
      const query = filters.value.searchQuery.toLowerCase();
      result = result.filter(
        n =>
          n.title.toLowerCase().includes(query)
          || n.message.toLowerCase().includes(query)
          || (n.data && JSON.stringify(n.data).toLowerCase().includes(query)),
      );
    }

    if (filters.value.type && filters.value.type !== 'all') {
      result = result.filter(n => n.type === filters.value.type);
    }

    if (filters.value.priority && filters.value.priority !== 'all') {
      result = result.filter(n => n.priority === filters.value.priority);
    }

    if (filters.value.unreadOnly) {
      result = result.filter(n => !n.read);
    }

    if (filters.value.dateRange) {
      const { start, end } = filters.value.dateRange;
      if (start) {
        result = result.filter(n => new Date(n.createdAt) >= start);
      }
      if (end) {
        result = result.filter(n => new Date(n.createdAt) <= end);
      }
    }

    if (filters.value.tags && filters.value.tags.length > 0) {
      result = result.filter(n =>
        filters.value.tags!.some(tag =>
          (n.data?.tags as string[] | undefined)?.includes(tag)
          || n.title.toLowerCase().includes(tag.toLowerCase())
          || n.message.toLowerCase().includes(tag.toLowerCase())
        )
      );
    }

    if (filters.value.category && filters.value.category !== 'all') {
      result = result.filter(n => n.data?.category === filters.value.category);
    }

    return result;
  };

  const hasActiveFilters = computed(() => {
    return (
      !!filters.value.searchQuery
      || filters.value.type !== 'all'
      || filters.value.priority !== 'all'
      || filters.value.unreadOnly
      || !!filters.value.dateRange
      || (filters.value.tags && filters.value.tags.length > 0)
      || (filters.value.category && filters.value.category !== 'all')
    );
  });

  return {
    filters,
    savedFilters,
    activeFilterId,
    quickFilterPresets,
    hasActiveFilters,
    applyFilter,
    resetFilters,
    saveFilter,
    loadFilter,
    deleteFilter,
    applyQuickFilter,
    filterNotifications,
  };
};
