import { useRuntimeConfig } from '#imports';
import { computed, onMounted, ref } from 'vue';
import type {
  ABTest,
  ABTestConfig,
  ABTestResult,
  ABTestStatistics,
  ABTestVariant,
  TargetingCondition,
} from '#analytics/types';
import type { AnalyticsConfig } from '#analytics/types/config';

export const useABTest = () => {
  const config = useRuntimeConfig();
  const analyticsConfig = config.public.analytics as AnalyticsConfig;
  const abConfig = analyticsConfig.abTesting as ABTestConfig;

  const tests = ref<ABTest[]>([]);
  const activeVariant = ref<Map<string, string>>(new Map());
  const results = ref<Map<string, ABTestResult[]>>(new Map());
  const isLoading = ref(false);

  const isEnabled = computed(() => abConfig.enabled);

  const createTest = (
    name: string,
    description: string,
    variants: Omit<ABTestVariant, 'id'>[],
    targetMetric: string,
    targeting: ABTest['targeting'] = { conditions: [], userPercentage: 100 },
  ): ABTest => {
    const controlVariant = variants.find(v => v.type === 'control');
    const treatmentVariants = variants.filter(v => v.type === 'treatment');

    const test: ABTest = {
      id: crypto.randomUUID(),
      name,
      description,
      status: 'draft',
      variants: [
        { ...controlVariant!, id: crypto.randomUUID() },
        ...treatmentVariants.map(v => ({ ...v, id: crypto.randomUUID() })),
      ],
      targetMetric,
      startDate: new Date(),
      trafficAllocation: 100,
      targeting,
    };

    tests.value.push(test);
    return test;
  };

  const startTest = (testId: string): boolean => {
    const test = tests.value.find(t => t.id === testId);
    if (!test || test.status !== 'draft') return false;

    test.status = 'running';
    test.startDate = new Date();
    return true;
  };

  const pauseTest = (testId: string): boolean => {
    const test = tests.value.find(t => t.id === testId);
    if (!test || test.status !== 'running') return false;

    test.status = 'paused';
    return true;
  };

  const resumeTest = (testId: string): boolean => {
    const test = tests.value.find(t => t.id === testId);
    if (!test || test.status !== 'paused') return false;

    test.status = 'running';
    return true;
  };

  const endTest = (testId: string, _winner?: string): boolean => {
    const test = tests.value.find(t => t.id === testId);
    if (!test || test.status === 'completed') return false;

    test.status = 'completed';
    test.endDate = new Date();
    return true;
  };

  const deleteTest = (testId: string): boolean => {
    const index = tests.value.findIndex(t => t.id === testId);
    if (index === -1) return false;

    tests.value.splice(index, 1);
    return true;
  };

  const getTest = (testId: string): ABTest | undefined => {
    return tests.value.find(t => t.id === testId);
  };

  const getActiveTests = (): ABTest[] => {
    return tests.value.filter(t => t.status === 'running');
  };

  const assignVariant = (testId: string): string | null => {
    const test = getTest(testId);
    if (!test || test.status !== 'running') return null;

    // Check if user is already assigned
    if (activeVariant.value.has(testId)) {
      return activeVariant.value.get(testId)!;
    }

    // Check targeting conditions
    if (!checkTargeting(test.targeting)) {
      return null;
    }

    // Random assignment based on traffic allocation
    if (Math.random() * 100 > test.trafficAllocation) {
      return null;
    }

    // Assign variant based on traffic percentages
    const random = Math.random() * 100;
    let cumulative = 0;

    for (const variant of test.variants) {
      cumulative += variant.trafficPercentage;
      if (random <= cumulative) {
        activeVariant.value.set(testId, variant.id);
        return variant.id;
      }
    }

    return null;
  };

  const checkTargeting = (targeting: ABTest['targeting']): boolean => {
    if (targeting.userPercentage < 100 && Math.random() * 100 > targeting.userPercentage) {
      return false;
    }

    for (const condition of targeting.conditions) {
      if (!checkCondition(condition)) {
        return false;
      }
    }

    return true;
  };

  const checkCondition = (condition: TargetingCondition): boolean => {
    switch (condition.type) {
      case 'url':
        return checkUrlCondition(condition);
      case 'device':
        return checkDeviceCondition(condition);
      case 'browser':
        return checkBrowserCondition(condition);
      case 'country':
        return true; // Would check actual country
      case 'user_property':
        return true; // Would check user properties
      case 'event':
        return true; // Would check event history
      default:
        return true;
    }
  };

  const checkUrlCondition = (condition: TargetingCondition): boolean => {
    const url = window.location.href;
    const value = condition.value as string;

    switch (condition.operator) {
      case 'equals':
        return url === value;
      case 'contains':
        return url.includes(value);
      case 'starts_with':
        return url.startsWith(value);
      case 'ends_with':
        return url.endsWith(value);
      case 'matches':
        return new RegExp(value).test(url);
      default:
        return true;
    }
  };

  const checkDeviceCondition = (condition: TargetingCondition): boolean => {
    const ua = navigator.userAgent;
    const value = (condition.value as string).toLowerCase();

    if (value === 'mobile') return /mobile|android|iphone/i.test(ua);
    if (value === 'tablet') return /tablet|ipad/i.test(ua);
    if (value === 'desktop') return !/mobile|tablet|ipad/i.test(ua);

    return true;
  };

  const checkBrowserCondition = (condition: TargetingCondition): boolean => {
    const ua = navigator.userAgent.toLowerCase();
    const value = (condition.value as string).toLowerCase();

    if (value === 'chrome') return ua.includes('chrome');
    if (value === 'firefox') return ua.includes('firefox');
    if (value === 'safari') return ua.includes('safari') && !ua.includes('chrome');
    if (value === 'edge') return ua.includes('edg');

    return true;
  };

  const getVariant = (testId: string): ABTestVariant | null => {
    const test = getTest(testId);
    if (!test) return null;

    const variantId = activeVariant.value.get(testId);
    if (!variantId) return null;

    return test.variants.find(v => v.id === variantId) ?? null;
  };

  const getVariantConfig = (testId: string): Record<string, unknown> | null => {
    const variant = getVariant(testId);
    return variant?.config ?? null;
  };

  const trackConversion = (testId: string, _value: number = 1): void => {
    const variantId = activeVariant.value.get(testId);
    if (!variantId) return;

    // Would send to backend
  };

  const getResults = async (testId: string): Promise<ABTestResult[] | null> => {
    const test = getTest(testId);
    if (!test) return null;

    isLoading.value = true;

    try {
      // Mock results
      const mockResults: ABTestResult[] = test.variants.map(variant => ({
        testId,
        variantId: variant.id,
        visitors: Math.floor(Math.random() * 1000) + 500,
        conversions: Math.floor(Math.random() * 100) + 20,
        conversionRate: Math.random() * 10 + 2,
        revenue: Math.floor(Math.random() * 10000) + 1000,
        averageOrderValue: Math.floor(Math.random() * 100) + 50,
        bounceRate: Math.random() * 30 + 20,
        avgSessionDuration: Math.floor(Math.random() * 300) + 60,
      }));

      results.value.set(testId, mockResults);
      return mockResults;
    } finally {
      isLoading.value = false;
    }
  };

  const getStatistics = async (testId: string): Promise<ABTestStatistics | null> => {
    const testResults = await getResults(testId);
    if (!testResults || testResults.length < 2) return null;

    const control = testResults[0];
    const treatment = testResults[1];

    const relativeImprovement = ((treatment.conversionRate - control.conversionRate) / control.conversionRate) * 100;

    return {
      testId,
      winner: relativeImprovement > 5 ? treatment.variantId : null,
      confidence: Math.min(95, 70 + Math.abs(relativeImprovement) * 2),
      significanceReached: Math.abs(relativeImprovement) > 5,
      pValue: 0.05 - (Math.abs(relativeImprovement) * 0.001),
      effectSize: Math.abs(relativeImprovement) / 100,
      relativeImprovement,
      recommendation: relativeImprovement > 5
        ? 'declare_winner'
        : relativeImprovement > 2
        ? 'continue_testing'
        : 'no_difference',
    };
  };

  onMounted(() => {
    // Assign variants for all active tests
    getActiveTests().forEach(test => {
      assignVariant(test.id);
    });
  });

  return {
    tests,
    activeVariant,
    results,
    isLoading,
    isEnabled,
    createTest,
    startTest,
    pauseTest,
    resumeTest,
    endTest,
    deleteTest,
    getTest,
    getActiveTests,
    assignVariant,
    getVariant,
    getVariantConfig,
    trackConversion,
    getResults,
    getStatistics,
  };
};
