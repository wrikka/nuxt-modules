interface SnoozeOption {
  label: string;
  value: string;
  getDate: () => Date;
}

export interface CustomSnooze {
  until: string;
  reason?: string;
}

const SNOOZE_OPTIONS: SnoozeOption[] = [
  {
    label: 'Later today',
    value: 'later-today',
    getDate: () => {
      const d = new Date();
      d.setHours(d.getHours() + 4);
      return d;
    },
  },
  {
    label: 'Tomorrow',
    value: 'tomorrow',
    getDate: () => {
      const d = new Date();
      d.setDate(d.getDate() + 1);
      d.setHours(9, 0, 0, 0);
      return d;
    },
  },
  {
    label: 'Next week',
    value: 'next-week',
    getDate: () => {
      const d = new Date();
      d.setDate(d.getDate() + 7);
      d.setHours(9, 0, 0, 0);
      return d;
    },
  },
  {
    label: 'This weekend',
    value: 'this-weekend',
    getDate: () => {
      const d = new Date();
      const daysUntilSaturday = 6 - d.getDay();
      d.setDate(d.getDate() + (daysUntilSaturday <= 0 ? 7 : daysUntilSaturday));
      d.setHours(9, 0, 0, 0);
      return d;
    },
  },
];

export const useSnooze = () => {
  const _showModal = ref(false);
  const _selectedEmailId = ref<number | null>(null);
  const _customDate = ref<string>('');
  const _customTime = ref<string>('');
  const _isCustom = ref(false);

  const snoozeOptions = computed(() => SNOOZE_OPTIONS);

  const openSnoozeModal = (emailId: number): void => {
    _selectedEmailId.value = emailId;
    _isCustom.value = false;
    _customDate.value = '';
    _customTime.value = '';
    _showModal.value = true;
  };

  const closeSnoozeModal = (): void => {
    _showModal.value = false;
    _selectedEmailId.value = null;
  };

  const snoozeEmail = async (optionValue: string): Promise<boolean> => {
    if (!_selectedEmailId.value) return false;

    const option = SNOOZE_OPTIONS.find(o => o.value === optionValue);
    if (!option) return false;

    const until = option.getDate().toISOString();

    await $fetch(`/api/emails/${_selectedEmailId.value}`, {
      method: 'PATCH',
      body: {
        folder: 'snoozed',
        snoozedUntil: until,
      },
    });

    closeSnoozeModal();
    return true;
  };

  const snoozeCustom = async (): Promise<boolean> => {
    if (!_selectedEmailId.value || !_customDate.value) return false;

    const time = _customTime.value || '09:00';
    const dateTime = new Date(`${_customDate.value}T${time}`);

    if (dateTime <= new Date()) {
      return false;
    }

    await $fetch(`/api/emails/${_selectedEmailId.value}`, {
      method: 'PATCH',
      body: {
        folder: 'snoozed',
        snoozedUntil: dateTime.toISOString(),
      },
    });

    closeSnoozeModal();
    return true;
  };

  const unsnoozeEmail = async (emailId: number): Promise<boolean> => {
    await $fetch(`/api/emails/${emailId}`, {
      method: 'PATCH',
      body: {
        folder: 'inbox',
        snoozedUntil: null,
      },
    });
    return true;
  };

  const formatSnoozeTime = (isoString: string): string => {
    const date = new Date(isoString);
    const now = new Date();
    const diffMs = date.getTime() - now.getTime();
    const diffHours = Math.ceil(diffMs / (1000 * 60 * 60));
    const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24));

    if (diffHours < 24) {
      return `Snoozed for ${diffHours} hours`;
    } else {
      return `Snoozed for ${diffDays} days`;
    }
  };

  return {
    showModal: _showModal,
    selectedEmailId: _selectedEmailId,
    customDate: _customDate,
    customTime: _customTime,
    isCustom: _isCustom,
    snoozeOptions,
    openSnoozeModal,
    closeSnoozeModal,
    snoozeEmail,
    snoozeCustom,
    unsnoozeEmail,
    formatSnoozeTime,
  };
};
