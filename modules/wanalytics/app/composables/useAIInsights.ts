import { useRuntimeConfig } from '#imports';
import { computed, ref } from 'vue';
import type {
  AIInsight,
  AIInsightsConfig,
  AIInsightsReport,
  AIQueryResult,
  InsightSeverity,
  InsightType,
  PrioritizedRecommendation,
} from '#analytics/types';
import type { AnalyticsConfig } from '#analytics/types/config';

export const useAIInsights = () => {
  const config = useRuntimeConfig();
  const analyticsConfig = config.public.analytics as AnalyticsConfig;
  const aiConfig = analyticsConfig.aiInsights as AIInsightsConfig;

  const insights = ref<AIInsight[]>([]);
  const recommendations = ref<PrioritizedRecommendation[]>([]);
  const isLoading = ref(false);
  const error = ref<string | null>(null);

  const isEnabled = computed(() => aiConfig.enabled);
  const hasApiKey = computed(() => !!aiConfig.apiKey);

  const generateInsights = async (_data: Record<string, unknown>): Promise<AIInsight[]> => {
    if (!isEnabled.value || !hasApiKey.value) {
      return [];
    }

    isLoading.value = true;
    error.value = null;

    try {
      // This would call your AI backend
      // For now, return mock insights for UI
      const mockInsights: AIInsight[] = [
        {
          id: crypto.randomUUID(),
          type: 'performance',
          severity: 'warning',
          title: 'Page Load Time Increasing',
          description: 'Average page load time has increased by 15% over the past week.',
          recommendation: 'Consider optimizing images and reducing JavaScript bundle size.',
          impact: {
            affectedUsers: 2500,
            affectedRevenue: 0,
            affectedConversionRate: 2.5,
            affectedSessions: 3000,
          },
          timestamp: new Date(),
          read: false,
          dismissed: false,
        },
        {
          id: crypto.randomUUID(),
          type: 'traffic',
          severity: 'success',
          title: 'Traffic Spike Detected',
          description: 'Traffic has increased by 45% compared to last week.',
          recommendation: 'Monitor server capacity and consider scaling resources.',
          impact: {
            affectedUsers: 5000,
            affectedRevenue: 1500,
            affectedConversionRate: 0,
            affectedSessions: 6000,
          },
          timestamp: new Date(),
          read: false,
          dismissed: false,
        },
        {
          id: crypto.randomUUID(),
          type: 'conversion',
          severity: 'critical',
          title: 'Conversion Rate Drop',
          description: 'Conversion rate dropped by 8% on the checkout page.',
          recommendation: 'Review checkout flow for friction points. Consider A/B testing simplified checkout.',
          impact: {
            affectedUsers: 800,
            affectedRevenue: 5000,
            affectedConversionRate: 8,
            affectedSessions: 1200,
          },
          timestamp: new Date(),
          read: false,
          dismissed: false,
        },
        {
          id: crypto.randomUUID(),
          type: 'opportunity',
          severity: 'info',
          title: 'High-Value Traffic Source',
          description: 'Visitors from organic search have 2x higher conversion rate.',
          recommendation: 'Increase SEO investment for high-converting keywords.',
          impact: {
            affectedUsers: 1500,
            affectedRevenue: 3000,
            affectedConversionRate: 5,
            affectedSessions: 2000,
          },
          timestamp: new Date(),
          read: false,
          dismissed: false,
        },
      ];

      insights.value = mockInsights;
      return mockInsights;
    } catch (e) {
      error.value = e instanceof Error ? e.message : 'Failed to generate insights';
      return [];
    } finally {
      isLoading.value = false;
    }
  };

  const queryInsights = async (query: string): Promise<AIQueryResult> => {
    if (!isEnabled.value || !hasApiKey.value) {
      return {
        query,
        answer: 'AI insights are not enabled or API key is missing.',
        data: {},
        followUpQuestions: [],
      };
    }

    isLoading.value = true;
    error.value = null;

    try {
      // Mock response for UI
      return {
        query,
        answer:
          `Based on the data analysis, ${query.toLowerCase()}. The trends show positive growth in user engagement over the past month.`,
        data: {
          trend: 'upward',
          percentage: 12.5,
          period: '30 days',
        },
        chartData: [
          {
            type: 'line',
            labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
            datasets: [
              {
                label: 'Users',
                data: [1200, 1400, 1600, 1800],
                borderColor: '#3b82f6',
              },
            ],
          },
        ],
        followUpQuestions: [
          'What caused the traffic increase?',
          'Which pages have the highest bounce rate?',
          'How can I improve conversion rate?',
        ],
      };
    } catch (e) {
      error.value = e instanceof Error ? e.message : 'Failed to query insights';
      return {
        query,
        answer: 'An error occurred while processing your query.',
        data: {},
        followUpQuestions: [],
      };
    } finally {
      isLoading.value = false;
    }
  };

  const getReport = async (period: { start: Date; end: Date; }): Promise<AIInsightsReport | null> => {
    if (!isEnabled.value) return null;

    const generatedInsights = await generateInsights({ period });

    return {
      period,
      insights: generatedInsights,
      summary: {
        totalInsights: generatedInsights.length,
        criticalCount: generatedInsights.filter(i => i.severity === 'critical').length,
        warningCount: generatedInsights.filter(i => i.severity === 'warning').length,
        opportunitiesCount: generatedInsights.filter(i => i.type === 'opportunity').length,
        potentialImpact: generatedInsights.reduce((acc, i) => acc + i.impact.affectedRevenue, 0),
      },
      recommendations: [
        {
          id: crypto.randomUUID(),
          title: 'Optimize Checkout Flow',
          description: 'Simplify the checkout process to reduce cart abandonment.',
          priority: 1,
          effort: 'medium',
          impact: 'high',
          category: 'conversion',
        },
        {
          id: crypto.randomUUID(),
          title: 'Improve Page Speed',
          description: 'Optimize images and lazy load non-critical resources.',
          priority: 2,
          effort: 'low',
          impact: 'medium',
          category: 'performance',
        },
        {
          id: crypto.randomUUID(),
          title: 'Invest in SEO',
          description: 'Focus on high-converting keywords from organic search.',
          priority: 3,
          effort: 'high',
          impact: 'high',
          category: 'acquisition',
        },
      ],
    };
  };

  const markAsRead = (insightId: string) => {
    const insight = insights.value.find(i => i.id === insightId);
    if (insight) {
      insight.read = true;
    }
  };

  const dismiss = (insightId: string) => {
    const insight = insights.value.find(i => i.id === insightId);
    if (insight) {
      insight.dismissed = true;
    }
  };

  const getUnreadCount = (): number => {
    return insights.value.filter(i => !i.read && !i.dismissed).length;
  };

  const getCriticalCount = (): number => {
    return insights.value.filter(i => i.severity === 'critical' && !i.dismissed).length;
  };

  const getByType = (type: InsightType): AIInsight[] => {
    return insights.value.filter(i => i.type === type && !i.dismissed);
  };

  const getBySeverity = (severity: InsightSeverity): AIInsight[] => {
    return insights.value.filter(i => i.severity === severity && !i.dismissed);
  };

  return {
    insights,
    recommendations,
    isLoading,
    error,
    isEnabled,
    hasApiKey,
    generateInsights,
    queryInsights,
    getReport,
    markAsRead,
    dismiss,
    getUnreadCount,
    getCriticalCount,
    getByType,
    getBySeverity,
  };
};
