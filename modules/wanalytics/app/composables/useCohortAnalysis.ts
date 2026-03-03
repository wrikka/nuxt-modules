import { computed, ref } from 'vue';
import type {
  Cohort,
  CohortAnalysis,
  CohortComparison,
  CohortConfig,
  CohortCriteria,
  CohortType,
  DateRange,
} from '#analytics/types';
import { useAnalyticsConfig } from './useAnalyticsConfig';

export const useCohortAnalysis = () => {
  const cohortConfig = useAnalyticsConfig().cohorts as CohortConfig;

  const cohorts = ref<Cohort[]>([]);
  const analyses = ref<Map<string, CohortAnalysis>>(new Map());
  const isLoading = ref(false);

  const isEnabled = computed(() => cohortConfig.enabled);

  const createCohort = (
    name: string,
    type: CohortType,
    criteria: CohortCriteria,
  ): Cohort => {
    const cohort: Cohort = {
      id: crypto.randomUUID(),
      name,
      type,
      criteria,
      size: 0,
      createdAt: new Date(),
    };

    cohorts.value.push(cohort);
    return cohort;
  };

  const deleteCohort = (cohortId: string): boolean => {
    const index = cohorts.value.findIndex(c => c.id === cohortId);
    if (index === -1) return false;

    cohorts.value.splice(index, 1);
    analyses.value.delete(cohortId);
    return true;
  };

  const getCohort = (cohortId: string): Cohort | undefined => {
    return cohorts.value.find(c => c.id === cohortId);
  };

  const analyzeCohort = async (
    cohortId: string,
    period: DateRange,
    granularity: 'day' | 'week' | 'month' = 'week',
  ): Promise<CohortAnalysis | null> => {
    const cohort = getCohort(cohortId);
    if (!cohort) return null;

    isLoading.value = true;

    try {
      // Mock cohort analysis data
      const dataPoints = granularity === 'day' ? 30 : granularity === 'week' ? 12 : 6;

      const data = Array.from({ length: dataPoints }, (_, i) => ({
        period: i,
        users: Math.floor(1000 * Math.pow(0.85, i)),
        percentage: Math.floor(100 * Math.pow(0.85, i)),
        revenue: Math.floor(1000 * Math.pow(0.9, i)),
        events: Math.floor(500 * Math.pow(0.8, i)),
      }));

      const analysis: CohortAnalysis = {
        cohortId,
        period,
        granularity,
        data,
        retention: {
          day1: 85,
          day7: 65,
          day14: 50,
          day30: 35,
          day60: 25,
          day90: 18,
        },
        metrics: {
          avgLifetimeValue: 250,
          avgSessionCount: 12,
          avgSessionDuration: 480,
          churnRate: 15,
          growthRate: 8,
        },
      };

      analyses.value.set(cohortId, analysis);
      return analysis;
    } finally {
      isLoading.value = false;
    }
  };

  const compareCohorts = async (
    cohortIds: string[],
    _period: DateRange,
  ): Promise<CohortComparison | null> => {
    if (cohortIds.length < 2) return null;

    isLoading.value = true;

    try {
      const cohortList = cohortIds.map(id => getCohort(id)).filter(Boolean) as Cohort[];

      const comparisonData = Array.from({ length: 12 }, (_, period) => {
        const values: Record<string, number> = {};
        cohortIds.forEach((id, index) => {
          values[id] = Math.floor(100 * Math.pow(0.85 - index * 0.05, period));
        });
        return { period, values };
      });

      const insights = cohortList.slice(1).map((
        cohort,
        _index,
      ): {
        type: 'stable' | 'improvement' | 'decline';
        description: string;
        cohortA: string;
        cohortB: string;
        change: number;
      } => ({
        type: cohortList[0].size > cohort.size
          ? 'decline' as const
          : cohortList[0].size < cohort.size
          ? 'improvement' as const
          : 'stable' as const,
        description: `${cohort.name} shows ${cohortList[0].size > cohort.size ? 'lower' : 'higher'} retention`,
        cohortA: cohortList[0].id,
        cohortB: cohort.id,
        change: Math.random() * 20 - 10,
      }));

      return {
        cohorts: cohortList,
        comparison: comparisonData,
        insights,
      };
    } finally {
      isLoading.value = false;
    }
  };

  const getRetentionRate = (cohortId: string, days: number): number => {
    const analysis = analyses.value.get(cohortId);
    if (!analysis) return 0;

    const retentionMap: Record<number, keyof typeof analysis.retention> = {
      1: 'day1',
      7: 'day7',
      14: 'day14',
      30: 'day30',
      60: 'day60',
      90: 'day90',
    };

    const key = retentionMap[days];
    return key ? analysis.retention[key] : 0;
  };

  const getChurnRate = (cohortId: string): number => {
    const analysis = analyses.value.get(cohortId);
    return analysis?.metrics.churnRate ?? 0;
  };

  const getLifetimeValue = (cohortId: string): number => {
    const analysis = analyses.value.get(cohortId);
    return analysis?.metrics.avgLifetimeValue ?? 0;
  };

  const initDefaultCohorts = () => {
    if (!cohortConfig.autoCreate) return;

    cohortConfig.defaultCohorts.forEach(type => {
      createCohort(
        `${type.replace('_', ' ')} cohort`,
        type,
        { field: 'createdAt', operator: 'between', value: [new Date(), new Date()] },
      );
    });
  };

  return {
    cohorts,
    analyses,
    isLoading,
    isEnabled,
    createCohort,
    deleteCohort,
    getCohort,
    analyzeCohort,
    compareCohorts,
    getRetentionRate,
    getChurnRate,
    getLifetimeValue,
    initDefaultCohorts,
  };
};
