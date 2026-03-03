import { computed, ref } from 'vue';

export interface DNDSettings {
  enabled: boolean;
  schedule?: {
    start: string;
    end: string;
  };
  autoReply?: string;
  allowUrgent?: boolean;
}

export const useDoNotDisturb = () => {
  const dndSettings = ref<DNDSettings>({
    enabled: false,
    allowUrgent: true,
  });

  const isDNDActive = computed(() => {
    if (!dndSettings.value.enabled) {
      return false;
    }

    if (!dndSettings.value.schedule) {
      return true;
    }

    const now = new Date();
    const currentTime = now.getHours() * 60 + now.getMinutes();
    const [startHour, startMinute] = dndSettings.value.schedule.start.split(':').map(Number);
    const [endHour, endMinute] = dndSettings.value.schedule.end.split(':').map(Number);
    const startTime = startHour * 60 + startMinute;
    const endTime = endHour * 60 + endMinute;

    if (startTime <= endTime) {
      return currentTime >= startTime && currentTime < endTime;
    } else {
      return currentTime >= startTime || currentTime < endTime;
    }
  });

  const shouldBlockNotification = (notification: { priority?: string; }) => {
    if (!isDNDActive.value) {
      return false;
    }

    if (dndSettings.value.allowUrgent && notification.priority === 'urgent') {
      return false;
    }

    return true;
  };

  const enableDND = () => {
    dndSettings.value.enabled = true;
  };

  const disableDND = () => {
    dndSettings.value.enabled = false;
  };

  const toggleDND = () => {
    dndSettings.value.enabled = !dndSettings.value.enabled;
  };

  const setDNDSchedule = (start: string, end: string) => {
    dndSettings.value.schedule = { start, end };
  };

  const setDNDSettings = (settings: Partial<DNDSettings>) => {
    dndSettings.value = { ...dndSettings.value, ...settings };
  };

  return {
    dndSettings,
    isDNDActive,
    shouldBlockNotification,
    enableDND,
    disableDND,
    toggleDND,
    setDNDSchedule,
    setDNDSettings,
  };
};
