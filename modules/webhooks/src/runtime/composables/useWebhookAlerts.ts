import { computed, ref } from 'vue';
import type { AlertChannel, AlertConfig } from '../utils/alerts';

export const useWebhookAlerts = () => {
  const configs = ref<AlertConfig[]>([]);
  const isLoading = ref(false);
  const error = ref<string | null>(null);

  const enabledConfigs = computed(() => configs.value.filter((c: AlertConfig) => c.enabled));

  const fetchConfigs = async () => {
    isLoading.value = true;
    error.value = null;

    try {
      const response = await fetch('/api/webhooks/alerts');
      const data = await response.json() as AlertConfig[];
      configs.value = data;
      return data;
    } catch (e) {
      error.value = e instanceof Error ? e.message : 'Failed to fetch alert configs';
      return [];
    } finally {
      isLoading.value = false;
    }
  };

  const createConfig = async (config: Omit<AlertConfig, 'id'>) => {
    isLoading.value = true;
    error.value = null;

    try {
      const response = await fetch('/api/webhooks/alerts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(config),
      });
      const data = (await response.json()) as AlertConfig;
      configs.value.push(data);
      return data;
    } catch (e) {
      error.value = e instanceof Error ? e.message : 'Failed to create alert config';
      return null;
    } finally {
      isLoading.value = false;
    }
  };

  const updateConfig = async (id: string, updates: Partial<AlertConfig>) => {
    isLoading.value = true;
    error.value = null;

    try {
      const response = await fetch(`/api/webhooks/alerts/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates),
      });
      const data = (await response.json()) as AlertConfig;
      const index = configs.value.findIndex(c => c.id === id);
      if (index > -1) {
        configs.value[index] = data;
      }
      return data;
    } catch (e) {
      error.value = e instanceof Error ? e.message : 'Failed to update alert config';
      return null;
    } finally {
      isLoading.value = false;
    }
  };

  const deleteConfig = async (id: string) => {
    try {
      await fetch(`/api/webhooks/alerts/${id}`, { method: 'DELETE' });
      configs.value = configs.value.filter(c => c.id !== id);
      return true;
    } catch (e) {
      error.value = e instanceof Error ? e.message : 'Failed to delete alert config';
      return false;
    }
  };

  const addChannel = async (configId: string, channel: AlertChannel) => {
    const config = configs.value.find(c => c.id === configId);
    if (!config) return null;

    return updateConfig(configId, {
      channels: [...config.channels, channel],
    });
  };

  const removeChannel = async (configId: string, channelIndex: number) => {
    const config = configs.value.find(c => c.id === configId);
    if (!config) return null;

    const channels = [...config.channels];
    channels.splice(channelIndex, 1);

    return updateConfig(configId, { channels });
  };

  const toggleConfig = async (id: string) => {
    const config = configs.value.find(c => c.id === id);
    if (!config) return null;
    return updateConfig(id, { enabled: !config.enabled });
  };

  return {
    configs: computed(() => configs.value),
    enabledConfigs,
    isLoading: computed(() => isLoading.value),
    error: computed(() => error.value),
    fetchConfigs,
    createConfig,
    updateConfig,
    deleteConfig,
    addChannel,
    removeChannel,
    toggleConfig,
  };
};
