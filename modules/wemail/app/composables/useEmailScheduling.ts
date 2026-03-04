interface ScheduledEmail {
  id: string;
  email: {
    to: string;
    subject: string;
    body: string;
    from: string;
  };
  scheduledAt: string; // ISO date string
  status: 'pending' | 'sent' | 'failed' | 'cancelled';
  sentAt?: string;
  error?: string;
}

const SCHEDULED_EMAILS_KEY = 'wemail:scheduled';

export const useEmailScheduling = () => {
  const _scheduledEmails = ref<ScheduledEmail[]>([]);
  const _isLoaded = ref(false);
  const _checkInterval = ref<ReturnType<typeof setInterval> | null>(null);

  const _generateId = (): string => `sch-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;

  const loadScheduled = (): void => {
    if (typeof window === 'undefined') return;
    const stored = localStorage.getItem(SCHEDULED_EMAILS_KEY);
    if (stored) {
      try {
        _scheduledEmails.value = JSON.parse(stored);
      } catch {
        _scheduledEmails.value = [];
      }
    }
    _isLoaded.value = true;
  };

  const saveScheduled = (): void => {
    if (typeof window === 'undefined') return;
    localStorage.setItem(SCHEDULED_EMAILS_KEY, JSON.stringify(_scheduledEmails.value));
  };

  const scheduleEmail = (email: ScheduledEmail['email'], scheduledAt: Date): string => {
    const id = _generateId();
    const scheduled: ScheduledEmail = {
      id,
      email,
      scheduledAt: scheduledAt.toISOString(),
      status: 'pending',
    };

    _scheduledEmails.value.push(scheduled);
    saveScheduled();

    // Check if we should send immediately (for testing)
    _checkScheduledEmails();

    return id;
  };

  const cancelScheduled = (id: string): boolean => {
    const index = _scheduledEmails.value.findIndex(e => e.id === id);
    if (index === -1) return false;

    if (_scheduledEmails.value[index].status === 'pending') {
      _scheduledEmails.value[index].status = 'cancelled';
      saveScheduled();
      return true;
    }

    return false;
  };

  const rescheduleEmail = (id: string, newScheduledAt: Date): boolean => {
    const scheduled = _scheduledEmails.value.find(e => e.id === id);
    if (!scheduled || scheduled.status !== 'pending') return false;

    scheduled.scheduledAt = newScheduledAt.toISOString();
    saveScheduled();
    return true;
  };

  const _checkScheduledEmails = async (): Promise<void> => {
    const now = new Date();
    const pending = _scheduledEmails.value.filter(
      e => e.status === 'pending' && new Date(e.scheduledAt) <= now
    );

    for (const scheduled of pending) {
      try {
        // Send the email
        await $fetch('/api/emails', {
          method: 'POST',
          body: {
            from: scheduled.email.from || 'me',
            to: scheduled.email.to,
            subject: scheduled.email.subject,
            body: scheduled.email.body,
            folder: 'sent',
          },
        });

        scheduled.status = 'sent';
        scheduled.sentAt = now.toISOString();
      } catch (err) {
        scheduled.status = 'failed';
        scheduled.error = err instanceof Error ? err.message : 'Unknown error';
      }
    }

    if (pending.length > 0) {
      saveScheduled();
    }
  };

  const startScheduler = (checkIntervalMs = 60000): () => void => {
    // Check immediately
    _checkScheduledEmails();

    // Then check periodically
    _checkInterval.value = setInterval(_checkScheduledEmails, checkIntervalMs);

    return () => {
      if (_checkInterval.value) {
        clearInterval(_checkInterval.value);
        _checkInterval.value = null;
      }
    };
  };

  const getUpcoming = computed(() => {
    const now = new Date();
    return _scheduledEmails.value
      .filter(e => e.status === 'pending' && new Date(e.scheduledAt) > now)
      .sort((a, b) => new Date(a.scheduledAt).getTime() - new Date(b.scheduledAt).getTime());
  });

  const getHistory = computed(() => {
    return _scheduledEmails.value
      .filter(e => e.status === 'sent' || e.status === 'failed' || e.status === 'cancelled')
      .sort((a, b) => new Date(b.scheduledAt).getTime() - new Date(a.scheduledAt).getTime());
  });

  onMounted(() => {
    loadScheduled();
    startScheduler();
  });

  onUnmounted(() => {
    if (_checkInterval.value) {
      clearInterval(_checkInterval.value);
    }
  });

  return {
    scheduledEmails: _scheduledEmails,
    upcoming: getUpcoming,
    history: getHistory,
    isLoaded: _isLoaded,
    scheduleEmail,
    cancelScheduled,
    rescheduleEmail,
    startScheduler,
  };
};
