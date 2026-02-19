import { computed, onMounted, onUnmounted, ref } from 'vue';
import type { ScheduledAction, ScheduledChange, ScheduleFilter } from '#feature-flags/types';

export const useSchedule = () => {
  const config = useRuntimeConfig();
  const debug = config.public.featureFlags?.debug ?? false;

  const schedules = ref<ScheduledChange[]>([]);
  const isLoading = ref(false);

  const fetchSchedules = async (filter?: ScheduleFilter) => {
    isLoading.value = true;

    try {
      const params = new URLSearchParams();
      if (filter?.flagKey) params.set('flagKey', filter.flagKey);
      if (filter?.status) params.set('status', filter.status);
      if (filter?.limit) params.set('limit', String(filter.limit));
      if (filter?.offset) params.set('offset', String(filter.offset));

      const response = await $fetch<{
        schedules: ScheduledChange[];
        total: number;
        pending: number;
      }>(`/api/feature-flags/schedule?${params}`);

      schedules.value = response.schedules;
      return response;
    } catch (error) {
      if (debug) {
        console.error('[FeatureFlags] Error fetching schedules:', error);
      }
      return { schedules: [], total: 0, pending: 0 };
    } finally {
      isLoading.value = false;
    }
  };

  const scheduleChange = async (
    flagKey: string,
    action: ScheduledAction,
    scheduledAt: Date | number,
    createdBy?: string,
  ) => {
    const timestamp = typeof scheduledAt === 'number' ? scheduledAt : scheduledAt.getTime();

    if (timestamp <= Date.now()) {
      throw new Error('Scheduled time must be in the future');
    }

    try {
      const response = await $fetch<{ success: boolean; schedule: ScheduledChange; }>(
        '/api/feature-flags/schedule',
        {
          method: 'POST',
          body: {
            flagKey,
            action,
            scheduledAt: timestamp,
            createdBy,
          },
        },
      );

      if (response.success) {
        await fetchSchedules();
      }

      return response;
    } catch (error) {
      if (debug) {
        console.error('[FeatureFlags] Error scheduling change:', error);
      }
      throw error;
    }
  };

  const cancelSchedule = async (id: string) => {
    try {
      const response = await $fetch<{ success: boolean; }>(
        '/api/feature-flags/schedule',
        {
          method: 'DELETE',
          body: { id },
        },
      );

      if (response.success) {
        await fetchSchedules();
      }

      return response;
    } catch (error) {
      if (debug) {
        console.error('[FeatureFlags] Error cancelling schedule:', error);
      }
      return { success: false };
    }
  };

  const scheduleEnable = (flagKey: string, scheduledAt: Date | number, createdBy?: string) => {
    return scheduleChange(flagKey, { type: 'enable' }, scheduledAt, createdBy);
  };

  const scheduleDisable = (flagKey: string, scheduledAt: Date | number, createdBy?: string) => {
    return scheduleChange(flagKey, { type: 'disable' }, scheduledAt, createdBy);
  };

  const schedulePercentage = (
    flagKey: string,
    percentage: number,
    scheduledAt: Date | number,
    createdBy?: string,
  ) => {
    return scheduleChange(
      flagKey,
      { type: 'set_percentage', payload: { percentage } },
      scheduledAt,
      createdBy,
    );
  };

  const pendingSchedules = computed(() => schedules.value.filter(s => s.status === 'pending'));

  const upcomingSchedules = computed(() =>
    pendingSchedules.value
      .filter(s => s.scheduledAt > Date.now())
      .sort((a, b) => a.scheduledAt - b.scheduledAt)
  );

  const formatScheduledTime = (timestamp: number): string => {
    return new Date(timestamp).toLocaleString();
  };

  const getTimeUntil = (timestamp: number): string => {
    const diff = timestamp - Date.now();

    if (diff <= 0) {
      return 'Overdue';
    }

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

    if (days > 0) {
      return `${days}d ${hours}h`;
    }
    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    }
    return `${minutes}m`;
  };

  // Auto-refresh schedules
  let refreshInterval: ReturnType<typeof setInterval> | null = null;

  onMounted(() => {
    void fetchSchedules({ status: 'pending' });
    refreshInterval = setInterval(() => {
      void fetchSchedules({ status: 'pending' });
    }, 60000);
  });

  onUnmounted(() => {
    if (refreshInterval) {
      clearInterval(refreshInterval);
    }
  });

  return {
    schedules,
    isLoading,
    pendingSchedules,
    upcomingSchedules,
    fetchSchedules,
    scheduleChange,
    scheduleEnable,
    scheduleDisable,
    schedulePercentage,
    cancelSchedule,
    formatScheduledTime,
    getTimeUntil,
  };
};
