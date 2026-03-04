export const usePreviewPane = () => {
  const _isOpen = ref(false);
  const _selectedEmailId = ref<number | null>(null);
  const _width = ref(50); // percentage

  const openPreview = (emailId: number): void => {
    _selectedEmailId.value = emailId;
    _isOpen.value = true;
  };

  const closePreview = (): void => {
    _isOpen.value = false;
    _selectedEmailId.value = null;
  };

  const togglePreview = (emailId?: number): void => {
    if (_isOpen.value && _selectedEmailId.value === emailId) {
      closePreview();
    } else if (emailId) {
      openPreview(emailId);
    }
  };

  const setWidth = (percentage: number): void => {
    _width.value = Math.max(30, Math.min(70, percentage));
  };

  const isPreviewOpen = computed(() => _isOpen.value);
  const selectedEmailId = computed(() => _selectedEmailId.value);
  const width = computed(() => `${_width.value}%`);
  const listWidth = computed(() => `${100 - _width.value}%`);

  return {
    isOpen: _isOpen,
    isPreviewOpen,
    selectedEmailId,
    width,
    listWidth,
    openPreview,
    closePreview,
    togglePreview,
    setWidth,
  };
};
