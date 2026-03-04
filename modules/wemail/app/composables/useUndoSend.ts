interface QueuedEmail {
  id: string;
  email: {
    to: string;
    subject: string;
    body: string;
    from: string;
  };
  sendAt: number;
  timeoutId?: ReturnType<typeof setTimeout>;
}

const UNDO_DELAY_MS = 5000; // 5 seconds to undo

export const useUndoSend = () => {
  const _queuedEmails = ref<QueuedEmail[]>([]);
  const _pendingEmail = ref<QueuedEmail | null>(null);
  const _canUndo = ref(false);
  const _undoTimeout = ref<ReturnType<typeof setTimeout> | null>(null);
  const _countdown = ref(0);

  const queueEmail = async (email: QueuedEmail['email']): Promise<string> => {
    const id = `queued-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
    const queuedEmail: QueuedEmail = {
      id,
      email,
      sendAt: Date.now() + UNDO_DELAY_MS,
    };

    _pendingEmail.value = queuedEmail;
    _canUndo.value = true;
    _countdown.value = Math.ceil(UNDO_DELAY_MS / 1000);

    // Start countdown
    const countdownInterval = setInterval(() => {
      _countdown.value -= 1;
      if (_countdown.value <= 0) {
        clearInterval(countdownInterval);
      }
    }, 1000);

    // Set timeout for actual send
    _undoTimeout.value = setTimeout(async () => {
      await _sendQueuedEmail(id);
    }, UNDO_DELAY_MS);

    return id;
  };

  const _sendQueuedEmail = async (id: string): Promise<void> => {
    const queued = _queuedEmails.value.find(e => e.id === id) || _pendingEmail.value;
    if (!queued || queued.id !== id) return;

    // Actually send the email via API
    await $fetch('/api/emails', {
      method: 'POST',
      body: {
        from: queued.email.from || 'me',
        to: queued.email.to,
        subject: queued.email.subject,
        body: queued.email.body,
        folder: 'sent',
      },
    });

    // Clean up
    _queuedEmails.value = _queuedEmails.value.filter(e => e.id !== id);
    if (_pendingEmail.value?.id === id) {
      _pendingEmail.value = null;
      _canUndo.value = false;
    }
  };

  const undoSend = (): boolean => {
    if (!_canUndo.value || !_pendingEmail.value) return false;

    // Cancel the send
    if (_undoTimeout.value) {
      clearTimeout(_undoTimeout.value);
      _undoTimeout.value = null;
    }

    // Move to drafts instead
    const draft = _pendingEmail.value;
    $fetch('/api/emails', {
      method: 'POST',
      body: {
        from: draft.email.from || 'me',
        to: draft.email.to,
        subject: draft.email.subject,
        body: draft.email.body,
        folder: 'drafts',
      },
    });

    _queuedEmails.value = _queuedEmails.value.filter(e => e.id !== draft.id);
    _pendingEmail.value = null;
    _canUndo.value = false;
    _countdown.value = 0;

    return true;
  };

  return {
    pendingEmail: _pendingEmail,
    canUndo: _canUndo,
    countdown: _countdown,
    queueEmail,
    undoSend,
  };
};
