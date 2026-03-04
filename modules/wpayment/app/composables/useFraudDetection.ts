import { readonly, ref } from 'vue';
import type {
  RiskEvaluationParams,
  RiskEvaluationResult,
  RiskRule,
  PaymentResult,
  UseFraudDetectionReturn,
} from '#wpayment/types';

export function useFraudDetection(): UseFraudDetectionReturn {
  const riskScore = ref(0);
  const riskLevel = ref<'low' | 'medium' | 'high' | 'unknown'>('unknown');
  const loading = ref(false);

  const evaluateRisk = async (params: RiskEvaluationParams): Promise<RiskEvaluationResult> => {
    loading.value = true;

    try {
      const result = await $fetch<RiskEvaluationResult>('/api/fraud/evaluate', {
        method: 'POST',
        body: params,
      });

      riskScore.value = result.score;
      riskLevel.value = result.level;

      return result;
    } finally {
      loading.value = false;
    }
  };

  const blockPayment = async (paymentIntentId: string, reason: string): Promise<PaymentResult> => {
    loading.value = true;

    try {
      await $fetch('/api/fraud/block', {
        method: 'POST',
        body: { paymentIntentId, reason },
      });

      return { success: true };
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to block payment';
      return { success: false, error: { code: 'block_failed', message, retryable: false } };
    } finally {
      loading.value = false;
    }
  };

  const allowPayment = async (paymentIntentId: string): Promise<PaymentResult> => {
    loading.value = true;

    try {
      await $fetch('/api/fraud/allow', {
        method: 'POST',
        body: { paymentIntentId },
      });

      return { success: true };
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to allow payment';
      return { success: false, error: { code: 'allow_failed', message, retryable: false } };
    } finally {
      loading.value = false;
    }
  };

  const reviewPayment = async (paymentIntentId: string): Promise<PaymentResult> => {
    loading.value = true;

    try {
      await $fetch('/api/fraud/review', {
        method: 'POST',
        body: { paymentIntentId },
      });

      return { success: true };
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to review payment';
      return { success: false, error: { code: 'review_failed', message, retryable: false } };
    } finally {
      loading.value = false;
    }
  };

  const getRiskRules = async (): Promise<RiskRule[]> => {
    const result = await $fetch<RiskRule[]>('/api/fraud/rules');
    return result;
  };

  return {
    riskScore: readonly(riskScore),
    riskLevel: readonly(riskLevel),
    loading: readonly(loading),
    evaluateRisk,
    blockPayment,
    allowPayment,
    reviewPayment,
    getRiskRules,
  };
}
