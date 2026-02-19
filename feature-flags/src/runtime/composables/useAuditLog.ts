import { ref, useRuntimeConfig } from '#imports';
import type { AuditLogEntry, AuditLogFilter } from '#feature-flags/types';

export const useAuditLog = () => {
  const config = useRuntimeConfig();
  const flagsConfig = config.public.featureFlags;

  const entries = ref<AuditLogEntry[]>([]);
  const isLoading = ref(false);
  const total = ref(0);

  const fetchEntries = async (filter?: AuditLogFilter) => {
    isLoading.value = true;

    try {
      const params = new URLSearchParams();
      if (filter?.flagKey) params.set('flagKey', filter.flagKey);
      if (filter?.action) params.set('action', filter.action);
      if (filter?.actorId) params.set('actorId', filter.actorId);
      if (filter?.startDate) params.set('startDate', String(filter.startDate));
      if (filter?.endDate) params.set('endDate', String(filter.endDate));
      if (filter?.limit) params.set('limit', String(filter.limit));
      if (filter?.offset) params.set('offset', String(filter.offset));

      const response = await $fetch<{
        entries: AuditLogEntry[];
        total: number;
        hasMore: boolean;
      }>(`/api/feature-flags/audit?${params}`);

      entries.value = response.entries;
      total.value = response.total;

      return response;
    } catch (error) {
      if (flagsConfig.debug) {
        console.error('[FeatureFlags] Error fetching audit log:', error);
      }
      return { entries: [], total: 0, hasMore: false };
    } finally {
      isLoading.value = false;
    }
  };

  const addEntry = async (
    action: AuditLogEntry['action'],
    flagKey: string,
    previousValue?: unknown,
    newValue?: unknown,
    actor?: AuditLogEntry['actor'],
    metadata?: Record<string, unknown>,
  ) => {
    try {
      await $fetch('/api/feature-flags/audit', {
        method: 'POST',
        body: {
          action,
          flagKey,
          previousValue,
          newValue,
          actor,
          metadata,
        },
      });
    } catch (error) {
      if (flagsConfig.debug) {
        console.error('[FeatureFlags] Error adding audit entry:', error);
      }
    }
  };

  const getHistoryForFlag = async (flagKey: string, limit = 50) => {
    return fetchEntries({ flagKey, limit });
  };

  const getRecentActivity = async (limit = 20) => {
    return fetchEntries({ limit });
  };

  const formatAction = (action: AuditLogEntry['action']): string => {
    const actionMap: Record<string, string> = {
      'flag:created': 'Flag created',
      'flag:updated': 'Flag updated',
      'flag:deleted': 'Flag deleted',
      'flag:enabled': 'Flag enabled',
      'flag:disabled': 'Flag disabled',
      'flag:targeting_added': 'Targeting rule added',
      'flag:targeting_removed': 'Targeting rule removed',
      'flag:rollout_changed': 'Rollout changed',
      'experiment:created': 'Experiment created',
      'experiment:started': 'Experiment started',
      'experiment:stopped': 'Experiment stopped',
      'experiment:variant_added': 'Variant added',
    };
    return actionMap[action] ?? action;
  };

  const formatTimestamp = (timestamp: number): string => {
    return new Date(timestamp).toLocaleString();
  };

  return {
    entries,
    isLoading,
    total,
    fetchEntries,
    addEntry,
    getHistoryForFlag,
    getRecentActivity,
    formatAction,
    formatTimestamp,
  };
};
