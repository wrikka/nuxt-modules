interface SwipeAction {
  direction: 'left' | 'right';
  icon: string;
  label: string;
  color: string;
  action: () => void;
}

export const useSwipeGestures = (
  onSwipeLeft: () => void,
  onSwipeRight: () => void,
  threshold = 100
) => {
  const _isDragging = ref(false);
  const _startX = ref(0);
  const _currentX = ref(0);
  const _translateX = ref(0);
  const _isSwiping = ref(false);

  const _onTouchStart = (e: TouchEvent | MouseEvent) => {
    _isDragging.value = true;
    _isSwiping.value = false;
    _startX.value = 'touches' in e ? e.touches[0].clientX : e.clientX;
    _currentX.value = _startX.value;
  };

  const _onTouchMove = (e: TouchEvent | MouseEvent) => {
    if (!_isDragging.value) return;

    _currentX.value = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const diff = _currentX.value - _startX.value;

    // Only allow horizontal swipes
    if (Math.abs(diff) > 10) {
      _isSwiping.value = true;
    }

    // Add resistance
    const resistance = 0.6;
    _translateX.value = diff * resistance;
  };

  const _onTouchEnd = () => {
    if (!_isDragging.value) return;

    const diff = _currentX.value - _startX.value;

    if (Math.abs(diff) > threshold) {
      if (diff > 0) {
        // Swiped right
        onSwipeRight();
      } else {
        // Swiped left
        onSwipeLeft();
      }
    }

    _isDragging.value = false;
    _translateX.value = 0;
  };

  const bindSwipe = (element: HTMLElement): () => void => {
    const touchStart = (e: TouchEvent) => _onTouchStart(e);
    const touchMove = (e: TouchEvent) => _onTouchMove(e);
    const touchEnd = () => _onTouchEnd();

    const mouseDown = (e: MouseEvent) => _onTouchStart(e);
    const mouseMove = (e: MouseEvent) => _onTouchMove(e);
    const mouseUp = () => _onTouchEnd();

    element.addEventListener('touchstart', touchStart, { passive: true });
    element.addEventListener('touchmove', touchMove, { passive: true });
    element.addEventListener('touchend', touchEnd);

    element.addEventListener('mousedown', mouseDown);
    window.addEventListener('mousemove', mouseMove);
    window.addEventListener('mouseup', mouseUp);

    return () => {
      element.removeEventListener('touchstart', touchStart);
      element.removeEventListener('touchmove', touchMove);
      element.removeEventListener('touchend', touchEnd);

      element.removeEventListener('mousedown', mouseDown);
      window.removeEventListener('mousemove', mouseMove);
      window.removeEventListener('mouseup', mouseUp);
    };
  };

  const style = computed(() => ({
    transform: `translateX(${_translateX.value}px)`,
    transition: _isDragging.value ? 'none' : 'transform 0.3s ease-out',
  }));

  const swipeDirection = computed(() => {
    if (!_isDragging.value) return null;
    return _translateX.value > 0 ? 'right' : 'left';
  });

  const swipeProgress = computed(() => {
    const progress = Math.min(Math.abs(_translateX.value) / threshold, 1);
    return progress;
  });

  return {
    isDragging: _isDragging,
    isSwiping: _isSwiping,
    translateX: _translateX,
    swipeDirection,
    swipeProgress,
    style,
    bindSwipe,
  };
};

// Preset swipe actions for email list
export const useEmailSwipeActions = (
  emailId: number,
  actions: {
    onArchive?: () => void;
    onDelete?: () => void;
    onSnooze?: () => void;
    onStar?: () => void;
  }
) => {
  const leftSwipeAction = computed<SwipeAction>(() => ({
    direction: 'left',
    icon: 'mdi:archive',
    label: 'Archive',
    color: 'bg-blue-500',
    action: actions.onArchive || (() => {}),
  }));

  const rightSwipeAction = computed<SwipeAction>(() => ({
    direction: 'right',
    icon: 'mdi:delete',
    label: 'Delete',
    color: 'bg-red-500',
    action: actions.onDelete || (() => {}),
  }));

  return {
    leftAction: leftSwipeAction,
    rightAction: rightSwipeAction,
  };
};
