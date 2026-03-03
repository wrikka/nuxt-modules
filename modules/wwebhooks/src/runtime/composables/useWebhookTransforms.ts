import { computed, ref } from 'vue';
import type { TransformRule } from '../utils/transform';

export const useWebhookTransforms = () => {
  const rules = ref<TransformRule[]>([]);
  const isLoading = ref(false);
  const error = ref<string | null>(null);

  const enabledRules = computed(() => rules.value.filter((r: TransformRule) => r.enabled));
  const disabledRules = computed(() => rules.value.filter((r: TransformRule) => !r.enabled));

  const fetchRules = async () => {
    isLoading.value = true;
    error.value = null;

    try {
      const response = await fetch('/api/webhooks/transforms');
      const data = (await response.json()) as TransformRule[];
      rules.value = data;
      return data;
    } catch (e) {
      error.value = e instanceof Error ? e.message : 'Failed to fetch transform rules';
      return [];
    } finally {
      isLoading.value = false;
    }
  };

  const createRule = async (rule: Omit<TransformRule, 'id'>) => {
    isLoading.value = true;
    error.value = null;

    try {
      const response = await fetch('/api/webhooks/transforms', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(rule),
      });
      const data = (await response.json()) as TransformRule;
      rules.value.push(data);
      return data;
    } catch (e) {
      error.value = e instanceof Error ? e.message : 'Failed to create transform rule';
      return null;
    } finally {
      isLoading.value = false;
    }
  };

  const updateRule = async (ruleId: string, updates: Partial<TransformRule>) => {
    isLoading.value = true;
    error.value = null;

    try {
      const response = await fetch(`/api/webhooks/transforms/${ruleId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates),
      });
      const data = (await response.json()) as TransformRule;
      const index = rules.value.findIndex(r => r.id === ruleId);
      if (index > -1) {
        rules.value[index] = data;
      }
      return data;
    } catch (e) {
      error.value = e instanceof Error ? e.message : 'Failed to update transform rule';
      return null;
    } finally {
      isLoading.value = false;
    }
  };

  const deleteRule = async (ruleId: string) => {
    try {
      await fetch(`/api/webhooks/transforms/${ruleId}`, { method: 'DELETE' });
      rules.value = rules.value.filter(r => r.id !== ruleId);
      return true;
    } catch (e) {
      error.value = e instanceof Error ? e.message : 'Failed to delete transform rule';
      return false;
    }
  };

  const toggleRule = async (ruleId: string) => {
    const rule = rules.value.find(r => r.id === ruleId);
    if (!rule) return false;
    return updateRule(ruleId, { enabled: !rule.enabled });
  };

  return {
    rules: computed(() => rules.value),
    enabledRules,
    disabledRules,
    isLoading: computed(() => isLoading.value),
    error: computed(() => error.value),
    fetchRules,
    createRule,
    updateRule,
    deleteRule,
    toggleRule,
  };
};
