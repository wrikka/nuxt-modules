export interface DraftData {
  id?: number;
  to: string;
  subject: string;
  body: string;
  from: string;
  lastSaved: number;
}

const DRAFTS_STORAGE_KEY = 'wemail:drafts:auto-save';
const SAVE_DEBOUNCE_MS = 2000;

export const useAutoSaveDraft = () => {
  const _drafts = ref<DraftData[]>([]);
  const _isSaving = ref(false);
  const _lastSaved = ref<number | null>(null);
  const _saveTimeout = ref<ReturnType<typeof setTimeout> | null>(null);

  const loadDrafts = (): void => {
    if (typeof window === 'undefined') return;
    const stored = localStorage.getItem(DRAFTS_STORAGE_KEY);
    if (stored) {
      try {
        _drafts.value = JSON.parse(stored);
      } catch {
        _drafts.value = [];
      }
    }
  };

  const saveDrafts = (): void => {
    if (typeof window === 'undefined') return;
    localStorage.setItem(DRAFTS_STORAGE_KEY, JSON.stringify(_drafts.value));
  };

  const autoSave = (draft: Omit<DraftData, 'lastSaved'>): void => {
    _isSaving.value = true;

    if (_saveTimeout.value) {
      clearTimeout(_saveTimeout.value);
    }

    _saveTimeout.value = setTimeout(() => {
      const existingIndex = _drafts.value.findIndex(d => d.id === draft.id);
      const draftWithTimestamp: DraftData = {
        ...draft,
        lastSaved: Date.now(),
      };

      if (existingIndex >= 0) {
        _drafts.value[existingIndex] = draftWithTimestamp;
      } else {
        _drafts.value.push(draftWithTimestamp);
      }

      saveDrafts();
      _lastSaved.value = Date.now();
      _isSaving.value = false;
    }, SAVE_DEBOUNCE_MS);
  };

  const getDraft = (id?: number): DraftData | undefined => {
    if (!id) return undefined;
    return _drafts.value.find(d => d.id === id);
  };

  const removeDraft = (id?: number): void => {
    if (!id) return;
    _drafts.value = _drafts.value.filter(d => d.id !== id);
    saveDrafts();
  };

  const clearAllDrafts = (): void => {
    _drafts.value = [];
    saveDrafts();
  };

  const formattedLastSaved = computed(() => {
    if (!_lastSaved.value) return '';
    const date = new Date(_lastSaved.value);
    return date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
  });

  onMounted(() => {
    loadDrafts();
  });

  return {
    drafts: _drafts,
    isSaving: _isSaving,
    lastSaved: _lastSaved,
    formattedLastSaved,
    autoSave,
    getDraft,
    removeDraft,
    clearAllDrafts,
    loadDrafts,
  };
};
