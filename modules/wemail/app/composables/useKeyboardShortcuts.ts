export interface Shortcut {
  key: string;
  description: string;
  action: () => void;
  modifier?: 'ctrl' | 'alt' | 'shift' | 'meta';
}

export const useKeyboardShortcuts = (shortcuts: Shortcut[]) => {
  const _isModalOpen = ref(false);

  const _handleKeydown = (event: KeyboardEvent) => {
    // Don't trigger shortcuts when typing in inputs
    if (event.target instanceof HTMLInputElement || 
        event.target instanceof HTMLTextAreaElement) {
      // Allow Escape even in inputs
      if (event.key !== 'Escape') return;
    }

    for (const shortcut of shortcuts) {
      let matches = event.key.toLowerCase() === shortcut.key.toLowerCase();

      if (shortcut.modifier) {
        const modifierMap: Record<string, boolean> = {
          ctrl: event.ctrlKey,
          alt: event.altKey,
          shift: event.shiftKey,
          meta: event.metaKey,
        };
        matches = matches && modifierMap[shortcut.modifier];
      }

      if (matches) {
        event.preventDefault();
        shortcut.action();
        return;
      }
    }
  };

  const showShortcutsHelp = () => {
    _isModalOpen.value = true;
  };

  const hideShortcutsHelp = () => {
    _isModalOpen.value = false;
  };

  onMounted(() => {
    document.addEventListener('keydown', _handleKeydown);
  });

  onUnmounted(() => {
    document.removeEventListener('keydown', _handleKeydown);
  });

  return {
    isModalOpen: _isModalOpen,
    showShortcutsHelp,
    hideShortcutsHelp,
  };
};

// Predefined Gmail-style shortcuts
export const useGmailShortcuts = (actions: {
  compose: () => void;
  search: () => void;
  reply?: () => void;
  replyAll?: () => void;
  forward?: () => void;
  archive?: () => void;
  delete?: () => void;
  star?: () => void;
  next?: () => void;
  prev?: () => void;
}) => {
  const shortcuts: Shortcut[] = [
    { key: 'c', description: 'Compose new email', action: actions.compose },
    { key: '/', description: 'Search', action: actions.search },
    { key: 'r', description: 'Reply', action: actions.reply || (() => {}) },
    { key: 'a', description: 'Reply all', action: actions.replyAll || (() => {}) },
    { key: 'f', description: 'Forward', action: actions.forward || (() => {}) },
    { key: 'e', description: 'Archive', action: actions.archive || (() => {}) },
    { key: '#', description: 'Delete', action: actions.delete || (() => {}) },
    { key: 's', description: 'Star/Unstar', action: actions.star || (() => {}) },
    { key: 'j', description: 'Next email', action: actions.next || (() => {}) },
    { key: 'k', description: 'Previous email', action: actions.prev || (() => {}) },
  ];

  return useKeyboardShortcuts(shortcuts);
};
