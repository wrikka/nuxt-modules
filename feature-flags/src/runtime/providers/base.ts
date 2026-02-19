import type {
  FeatureFlag,
  FeatureFlagProvider,
  FlagEvaluationContext,
  FlagEvaluationResult,
} from '#feature-flags/types';

export abstract class BaseProvider implements FeatureFlagProvider {
  abstract name: string;
  protected config: Record<string, unknown>;

  constructor(config: Record<string, unknown> = {}) {
    this.config = config;
  }

  abstract getFlag(key: string): Promise<FeatureFlag | null>;
  abstract getAllFlags(): Promise<FeatureFlag[]>;
  abstract evaluate(
    key: string,
    context?: FlagEvaluationContext,
  ): Promise<FlagEvaluationResult>;

  protected createDefaultResult(
    flag: string,
    enabled = false,
    reason: FlagEvaluationResult['reason'] = 'DEFAULT',
  ): FlagEvaluationResult {
    return {
      flag,
      enabled,
      reason,
    };
  }

  protected handleError(_error: unknown, flag: string): FlagEvaluationResult {
    return {
      flag,
      enabled: false,
      reason: 'ERROR',
    };
  }
}
