import { computed, ref } from 'vue';
import type {
  APIKey,
  APIKeyPermission,
  DataExport,
  ExportConfig,
  ExportFormat,
  ExportProgress,
} from '#analytics/types';
import { useAnalyticsConfig } from './useAnalyticsConfig';

export const useDataExport = () => {
  const exportConfig = useAnalyticsConfig().export as ExportConfig;

  const exports = ref<DataExport[]>([]);
  const apiKeys = ref<APIKey[]>([]);
  const currentExport = ref<ExportProgress | null>(null);
  const isLoading = ref(false);

  const isEnabled = computed(() => exportConfig.enabled);

  const createExport = (
    format: ExportFormat,
    data: Record<string, unknown> | Record<string, unknown>[],
    options: Partial<DataExport> = {},
  ): DataExport | null => {
    if (!isEnabled.value) return null;
    if (exports.value.length >= exportConfig.maxExports) return null;

    const dataArray = Array.isArray(data) ? data : [data];

    const exportItem: DataExport = {
      id: crypto.randomUUID(),
      type: 'custom',
      format,
      status: 'pending',
      filters: [],
      dateRange: { start: new Date(), end: new Date() },
      data: dataArray,
      createdAt: new Date(),
      expiresAt: new Date(Date.now() + exportConfig.retentionDays * 24 * 60 * 60 * 1000),
      ...options,
    };

    exports.value.push(exportItem);
    return exportItem;
  };

  const startExport = async (exportId: string): Promise<ExportProgress | null> => {
    const exportItem = exports.value.find(e => e.id === exportId);
    if (!exportItem) return null;

    isLoading.value = true;
    exportItem.status = 'processing';

    const progress: ExportProgress = {
      exportId,
      status: 'processing',
      progress: 0,
      startedAt: new Date(),
    };

    currentExport.value = progress;

    try {
      // Simulate export process
      for (let i = 0; i <= 100; i += 10) {
        await new Promise(resolve => setTimeout(resolve, 100));
        progress.progress = i;
        currentExport.value = { ...progress };
      }

      exportItem.status = 'completed';
      exportItem.fileUrl = `#export-${exportId}.${exportItem.format}`;
      exportItem.fileSize = Math.floor(Math.random() * exportConfig.maxFileSize);

      progress.status = 'completed';
      progress.completedAt = new Date();
      progress.downloadUrl = exportItem.fileUrl;

      return progress;
    } catch {
      exportItem.status = 'failed';
      progress.status = 'failed';
      return progress;
    } finally {
      isLoading.value = false;
    }
  };

  const cancelExport = (exportId: string): boolean => {
    const exportItem = exports.value.find(e => e.id === exportId);
    if (!exportItem || exportItem.status !== 'processing') return false;

    exportItem.status = 'cancelled';
    return true;
  };

  const deleteExport = (exportId: string): boolean => {
    const index = exports.value.findIndex(e => e.id === exportId);
    if (index === -1) return false;

    exports.value.splice(index, 1);
    return true;
  };

  const getExport = (exportId: string): DataExport | undefined => {
    return exports.value.find(e => e.id === exportId);
  };

  const downloadExport = (exportId: string): string | null => {
    const exportItem = getExport(exportId);
    if (!exportItem || exportItem.status !== 'completed') return null;

    return exportItem.fileUrl ?? null;
  };

  const createAPIKey = (
    name: string,
    permissions: APIKeyPermission[],
    expiresIn?: number,
  ): APIKey | null => {
    if (!isEnabled.value) return null;

    const key: APIKey = {
      id: crypto.randomUUID(),
      name,
      key: `wrikka_${crypto.randomUUID().replace(/-/g, '')}`,
      permissions,
      status: 'active',
      createdAt: new Date(),
      expiresAt: expiresIn ? new Date(Date.now() + expiresIn * 1000) : undefined,
    };

    apiKeys.value.push(key);
    return key;
  };

  const revokeAPIKey = (keyId: string): boolean => {
    const key = apiKeys.value.find(k => k.id === keyId);
    if (!key) return false;

    key.status = 'revoked';
    return true;
  };

  const deleteAPIKey = (keyId: string): boolean => {
    const index = apiKeys.value.findIndex(k => k.id === keyId);
    if (index === -1) return false;

    apiKeys.value.splice(index, 1);
    return true;
  };

  const getAPIKey = (keyId: string): APIKey | undefined => {
    return apiKeys.value.find(k => k.id === keyId);
  };

  const validateAPIKey = (keyString: string): APIKey | null => {
    const key = apiKeys.value.find(k => k.key === keyString && k.status === 'active');
    if (!key) return null;

    if (key.expiresAt && key.expiresAt < new Date()) {
      key.status = 'expired';
      return null;
    }

    return key;
  };

  const hasPermission = (key: APIKey, permission: APIKeyPermission): boolean => {
    return key.permissions.includes(permission);
  };

  const getExportsByFormat = (format: ExportFormat): DataExport[] => {
    return exports.value.filter(e => e.format === format);
  };

  const getActiveAPIKeys = (): APIKey[] => {
    return apiKeys.value.filter(k => k.status === 'active');
  };

  const exportToCSV = (data: Record<string, unknown>[]): string => {
    if (data.length === 0) return '';

    const headers = Object.keys(data[0]);
    const rows = data.map(row =>
      headers.map(h => {
        const value = row[h];
        if (value === null || value === undefined) return '';
        if (typeof value === 'object') return JSON.stringify(value);
        if (typeof value === 'symbol') return value.toString();
        if (typeof value === 'bigint') return value.toString();
        if (typeof value === 'function') return '';
        return typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean'
          ? String(value)
          : JSON.stringify(value);
      }).join(',')
    );

    return [headers.join(','), ...rows].join('\n');
  };

  const exportToJSON = (data: unknown): string => {
    return JSON.stringify(data, null, 2);
  };

  return {
    exports,
    apiKeys,
    currentExport,
    isLoading,
    isEnabled,
    createExport,
    startExport,
    cancelExport,
    deleteExport,
    getExport,
    downloadExport,
    createAPIKey,
    revokeAPIKey,
    deleteAPIKey,
    getAPIKey,
    validateAPIKey,
    hasPermission,
    getExportsByFormat,
    getActiveAPIKeys,
    exportToCSV,
    exportToJSON,
  };
};
