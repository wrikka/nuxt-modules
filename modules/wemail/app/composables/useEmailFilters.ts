export type FilterActionType = 'mark-as-read' | 'mark-as-unread' | 'star' | 'unstar' | 'archive' | 'delete' | 'move-to-folder' | 'apply-label' | 'remove-label' | 'forward' | 'notify';

export interface FilterAction {
  type: FilterActionType;
  params?: Record<string, string>;
}

export interface EmailFilter {
  id: string;
  name: string;
  conditions: {
    field: 'from' | 'to' | 'subject' | 'body';
    operator: 'contains' | 'not-contains' | 'equals' | 'starts-with' | 'ends-with' | 'matches-regex';
    value: string;
  }[];
  actions: FilterAction[];
  enabled: boolean;
  priority: number; // Higher number = executed first
}

export const useEmailFilters = () => {
  const _filters = ref<EmailFilter[]>([]);
  const _isLoaded = ref(false);

  const FILTERS_STORAGE_KEY = 'wemail:filters';

  const _generateId = (): string => `filter-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;

  const loadFilters = (): void => {
    if (typeof window === 'undefined') return;
    const stored = localStorage.getItem(FILTERS_STORAGE_KEY);
    if (stored) {
      try {
        _filters.value = JSON.parse(stored);
      } catch {
        _filters.value = [];
      }
    }
    _isLoaded.value = true;
  };

  const saveFilters = (): void => {
    if (typeof window === 'undefined') return;
    localStorage.setItem(FILTERS_STORAGE_KEY, JSON.stringify(_filters.value));
  };

  const createFilter = (filter: Omit<EmailFilter, 'id'>): EmailFilter => {
    const newFilter: EmailFilter = {
      ...filter,
      id: _generateId(),
    };
    _filters.value.push(newFilter);
    _filters.value.sort((a, b) => b.priority - a.priority);
    saveFilters();
    return newFilter;
  };

  const updateFilter = (id: string, updates: Partial<Omit<EmailFilter, 'id'>>): EmailFilter | null => {
    const index = _filters.value.findIndex(f => f.id === id);
    if (index === -1) return null;

    _filters.value[index] = { ..._filters.value[index], ...updates };
    _filters.value.sort((a, b) => b.priority - a.priority);
    saveFilters();
    return _filters.value[index];
  };

  const deleteFilter = (id: string): boolean => {
    const index = _filters.value.findIndex(f => f.id === id);
    if (index === -1) return false;

    _filters.value.splice(index, 1);
    saveFilters();
    return true;
  };

  const toggleFilter = (id: string): boolean => {
    const filter = _filters.value.find(f => f.id === id);
    if (!filter) return false;

    filter.enabled = !filter.enabled;
    saveFilters();
    return true;
  };

  const moveFilter = (id: string, direction: 'up' | 'down'): boolean => {
    const index = _filters.value.findIndex(f => f.id === id);
    if (index === -1) return false;

    const newIndex = direction === 'up' ? index - 1 : index + 1;
    if (newIndex < 0 || newIndex >= _filters.value.length) return false;

    const temp = _filters.value[index];
    _filters.value[index] = _filters.value[newIndex];
    _filters.value[newIndex] = temp;

    // Update priorities
    _filters.value.forEach((f, i) => {
      f.priority = _filters.value.length - i;
    });

    saveFilters();
    return true;
  };

  const applyFiltersToEmail = async (emailId: number, emailData: {
    from: string;
    to?: string;
    subject: string;
    body: string;
  }): Promise<void> => {
    for (const filter of _filters.value) {
      if (!filter.enabled) continue;

      const matches = filter.conditions.every(condition => {
        const fieldValue = emailData[condition.field]?.toLowerCase() || '';
        const conditionValue = condition.value.toLowerCase();

        switch (condition.operator) {
          case 'contains':
            return fieldValue.includes(conditionValue);
          case 'not-contains':
            return !fieldValue.includes(conditionValue);
          case 'equals':
            return fieldValue === conditionValue;
          case 'starts-with':
            return fieldValue.startsWith(conditionValue);
          case 'ends-with':
            return fieldValue.endsWith(conditionValue);
          case 'matches-regex':
            try {
              return new RegExp(conditionValue, 'i').test(fieldValue);
            } catch {
              return false;
            }
          default:
            return false;
        }
      });

      if (matches) {
        for (const action of filter.actions) {
          await _executeAction(emailId, action);
        }
      }
    }
  };

  const _executeAction = async (emailId: number, action: FilterAction): Promise<void> => {
    const updates: Record<string, unknown> = {};

    switch (action.type) {
      case 'mark-as-read':
        updates.read = true;
        break;
      case 'mark-as-unread':
        updates.read = false;
        break;
      case 'star':
        updates.starred = true;
        break;
      case 'unstar':
        updates.starred = false;
        break;
      case 'archive':
        updates.folder = 'archived';
        break;
      case 'delete':
        updates.folder = 'trash';
        break;
      case 'move-to-folder':
        if (action.params?.folder) {
          updates.folder = action.params.folder;
        }
        break;
      case 'apply-label':
        if (action.params?.label) {
          updates.labels = [action.params.label];
        }
        break;
      case 'remove-label':
        if (action.params?.label) {
          // Get current email first
          const email = await $fetch(`/api/emails/${emailId}`);
          if (email && Array.isArray(email.labels)) {
            updates.labels = email.labels.filter((l: string) => l !== action.params?.label);
          }
        }
        break;
      case 'forward':
        if (action.params?.to) {
          // Forward logic would be handled separately
          console.log(`Forwarding email ${emailId} to ${action.params.to}`);
        }
        break;
      case 'notify':
        // Browser notification
        if (Notification.permission === 'granted') {
          new Notification('New Email', {
            body: 'An email matched your filter criteria',
          });
        }
        break;
    }

    if (Object.keys(updates).length > 0) {
      await $fetch(`/api/emails/${emailId}`, {
        method: 'PATCH',
        body: updates,
      });
    }
  };

  onMounted(() => {
    loadFilters();
  });

  return {
    filters: _filters,
    isLoaded: _isLoaded,
    loadFilters,
    createFilter,
    updateFilter,
    deleteFilter,
    toggleFilter,
    moveFilter,
    applyFiltersToEmail,
  };
};
