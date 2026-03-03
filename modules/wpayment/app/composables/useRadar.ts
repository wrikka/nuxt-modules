import { readonly, ref } from 'vue';
import type { EarlyFraudWarning, RadarRule, RiskAssessment, UseRadarReturn, ValueList } from '#wpayment/types';

export function useRadar(): UseRadarReturn {
  const earlyFraudWarnings = ref<EarlyFraudWarning[]>([]);
  const valueLists = ref<ValueList[]>([]);
  const rules = ref<RadarRule[]>([]);
  const riskAssessment = ref<RiskAssessment | null>(null);
  const loading = ref(false);
  const error = ref<string | null>(null);

  const listEarlyFraudWarnings = async (params?: any): Promise<EarlyFraudWarning[]> => {
    loading.value = true;
    try {
      const result = await $fetch<EarlyFraudWarning[]>('/api/stripe/radar/fraud-warnings', { query: params });
      earlyFraudWarnings.value = result;
      return result;
    } finally {
      loading.value = false;
    }
  };

  const retrieveEarlyFraudWarning = async (warningId: string): Promise<EarlyFraudWarning> => {
    loading.value = true;
    try {
      return await $fetch<EarlyFraudWarning>(`/api/stripe/radar/fraud-warning/${warningId}`);
    } finally {
      loading.value = false;
    }
  };

  const createValueList = async (params: any): Promise<ValueList> => {
    loading.value = true;
    try {
      return await $fetch<ValueList>('/api/stripe/radar/value-list', { method: 'POST', body: params });
    } finally {
      loading.value = false;
    }
  };

  const retrieveValueList = async (valueListId: string): Promise<ValueList> => {
    loading.value = true;
    try {
      return await $fetch<ValueList>(`/api/stripe/radar/value-list/${valueListId}`);
    } finally {
      loading.value = false;
    }
  };

  const updateValueList = async (valueListId: string, params: any): Promise<ValueList> => {
    loading.value = true;
    try {
      return await $fetch<ValueList>(`/api/stripe/radar/value-list/${valueListId}`, { method: 'PATCH', body: params });
    } finally {
      loading.value = false;
    }
  };

  const deleteValueList = async (valueListId: string): Promise<void> => {
    loading.value = true;
    try {
      await $fetch(`/api/stripe/radar/value-list/${valueListId}`, { method: 'DELETE' });
    } finally {
      loading.value = false;
    }
  };

  const listValueLists = async (): Promise<ValueList[]> => {
    loading.value = true;
    try {
      const result = await $fetch<ValueList[]>('/api/stripe/radar/value-lists');
      valueLists.value = result;
      return result;
    } finally {
      loading.value = false;
    }
  };

  const createValueListItem = async (params: any) => {
    loading.value = true;
    try {
      return await $fetch('/api/stripe/radar/value-list-item', { method: 'POST', body: params });
    } finally {
      loading.value = false;
    }
  };

  const deleteValueListItem = async (itemId: string): Promise<void> => {
    loading.value = true;
    try {
      await $fetch(`/api/stripe/radar/value-list-item/${itemId}`, { method: 'DELETE' });
    } finally {
      loading.value = false;
    }
  };

  const listValueListItems = async (valueListId: string) => {
    loading.value = true;
    try {
      return await $fetch(`/api/stripe/radar/value-list/${valueListId}/items`);
    } finally {
      loading.value = false;
    }
  };

  const createRule = async (params: any): Promise<RadarRule> => {
    loading.value = true;
    try {
      return await $fetch<RadarRule>('/api/stripe/radar/rule', { method: 'POST', body: params });
    } finally {
      loading.value = false;
    }
  };

  const retrieveRule = async (ruleId: string): Promise<RadarRule> => {
    loading.value = true;
    try {
      return await $fetch<RadarRule>(`/api/stripe/radar/rule/${ruleId}`);
    } finally {
      loading.value = false;
    }
  };

  const updateRule = async (params: any): Promise<RadarRule> => {
    loading.value = true;
    try {
      return await $fetch<RadarRule>(`/api/stripe/radar/rule/${params.ruleId}`, { method: 'PATCH', body: params });
    } finally {
      loading.value = false;
    }
  };

  const deleteRule = async (ruleId: string): Promise<void> => {
    loading.value = true;
    try {
      await $fetch(`/api/stripe/radar/rule/${ruleId}`, { method: 'DELETE' });
    } finally {
      loading.value = false;
    }
  };

  const listRules = async (): Promise<RadarRule[]> => {
    loading.value = true;
    try {
      const result = await $fetch<RadarRule[]>('/api/stripe/radar/rules');
      rules.value = result;
      return result;
    } finally {
      loading.value = false;
    }
  };

  const assessRisk = async (paymentIntentId: string): Promise<RiskAssessment> => {
    loading.value = true;
    try {
      const result = await $fetch<RiskAssessment>(`/api/stripe/radar/assess/${paymentIntentId}`);
      riskAssessment.value = result;
      return result;
    } finally {
      loading.value = false;
    }
  };

  const createSession = async () => {
    loading.value = true;
    try {
      return await $fetch('/api/stripe/radar/session', { method: 'POST' });
    } finally {
      loading.value = false;
    }
  };

  return {
    earlyFraudWarnings: readonly(earlyFraudWarnings),
    valueLists: readonly(valueLists),
    rules: readonly(rules),
    riskAssessment: readonly(riskAssessment),
    loading: readonly(loading),
    error: readonly(error),
    listEarlyFraudWarnings,
    retrieveEarlyFraudWarning,
    createValueList,
    retrieveValueList,
    updateValueList,
    deleteValueList,
    listValueLists,
    createValueListItem,
    deleteValueListItem,
    listValueListItems,
    createRule,
    retrieveRule,
    updateRule,
    deleteRule,
    listRules,
    assessRisk,
    createSession,
  };
}
