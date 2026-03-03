import type { FeatureFlag, FlagEvaluationContext, FlagEvaluationResult } from '#feature-flags/types';
import { BaseProvider } from './base';

interface FlagsmithFlag {
  id: number;
  name: string;
  enabled: boolean;
  feature_state_value: unknown;
}

export class FlagsmithProvider extends BaseProvider {
  name = 'flagsmith';
  private environmentId: string | undefined;
  private apiHost: string;

  constructor(config: Record<string, unknown> = {}) {
    super(config);
    this.environmentId = config.environmentId as string | undefined;
    this.apiHost = (config.apiHost as string) ?? 'https://api.flagsmith.com/api/v1';
  }

  async getFlag(key: string): Promise<FeatureFlag | null> {
    const flags = await this.fetchFlags();
    const flag = flags.find(f => f.name === key);

    if (!flag) {
      return null;
    }

    return {
      key: flag.name,
      name: flag.name,
      enabled: flag.enabled,
    };
  }

  async getAllFlags(): Promise<FeatureFlag[]> {
    const flags = await this.fetchFlags();
    return flags.map(flag => ({
      key: flag.name,
      name: flag.name,
      enabled: flag.enabled,
    }));
  }

  async evaluate(
    key: string,
    context?: FlagEvaluationContext,
  ): Promise<FlagEvaluationResult> {
    try {
      const flags = await this.fetchFlags(context);
      const flag = flags.find(f => f.name === key);

      if (!flag) {
        return this.createDefaultResult(key, false, 'OFF');
      }

      return {
        flag: key,
        enabled: flag.enabled,
        value: flag.feature_state_value,
        reason: 'DEFAULT',
      };
    } catch (error) {
      return this.handleError(error, key);
    }
  }

  private async fetchFlags(context?: FlagEvaluationContext): Promise<FlagsmithFlag[]> {
    if (!this.environmentId) {
      return [];
    }

    const url = context?.userId
      ? `${this.apiHost}/identities/?identifier=${context.userId}`
      : `${this.apiHost}/environments/${this.environmentId}/flags`;

    const response = await fetch(url, {
      headers: {
        'X-Environment-Key': this.environmentId,
      },
    });

    if (!response.ok) {
      throw new Error(`Flagsmith API error: ${response.status}`);
    }

    const data = await response.json();

    // Handle identity response
    if (data.flags) {
      return data.flags;
    }

    return data;
  }
}
