import type { FeatureFlag, FlagEvaluationContext, FlagEvaluationResult } from '#feature-flags/types';
import { BaseProvider } from './base';

interface LDClient {
  allFlagsState: (context: LDContext) => Promise<{ allValues: () => Record<string, boolean>; }>;
  variation: (key: string, context: LDContext, defaultValue: boolean) => Promise<boolean>;
  variationDetail: (
    key: string,
    context: LDContext,
    defaultValue: boolean,
  ) => Promise<{ value: boolean; reason: { kind: string; }; }>;
  flush: () => Promise<void>;
  close: () => Promise<void>;
}

interface LDContext {
  key: string;
  kind?: string;
  name?: string;
  email?: string;
  anonymous?: boolean;
  custom?: Record<string, unknown>;
}

export class LaunchDarklyProvider extends BaseProvider {
  name = 'launchdarkly';
  private client: LDClient | null = null;
  private sdkKey: string | undefined;
  private clientSideId: string | undefined;

  constructor(config: Record<string, unknown> = {}) {
    super(config);
    this.sdkKey = config.sdkKey as string | undefined;
    this.clientSideId = config.clientSideId as string | undefined;
  }

  async initialize(): Promise<void> {
    if (!this.sdkKey && !this.clientSideId) {
      throw new Error('LaunchDarkly requires sdkKey or clientSideId');
    }

    // Dynamic import for server-side
    if (import.meta.server && this.sdkKey) {
      try {
        const { init } = await import('launchdarkly-node-server-sdk');
        this.client = init({ sdkKey: this.sdkKey });
        await this.client.waitForInitialization();
      } catch {
        throw new Error('Failed to initialize LaunchDarkly SDK');
      }
    }
  }

  async getFlag(_key: string): Promise<FeatureFlag | null> {
    // LaunchDarkly doesn't have a direct getFlag method
    // We need to evaluate the flag
    return null;
  }

  async getAllFlags(): Promise<FeatureFlag[]> {
    // Not directly supported by LaunchDarkly
    return [];
  }

  async evaluate(
    key: string,
    context?: FlagEvaluationContext,
  ): Promise<FlagEvaluationResult> {
    if (!this.client) {
      return this.createDefaultResult(key, false, 'ERROR');
    }

    try {
      const ldContext: LDContext = {
        key: context?.userId ?? 'anonymous',
        kind: 'user',
        anonymous: !context?.userId,
        custom: context?.attributes,
      };

      const result = await this.client.variationDetail(key, ldContext, false);

      return {
        flag: key,
        enabled: result.value,
        reason: this.mapReason(result.reason.kind),
      };
    } catch (error) {
      return this.handleError(error, key);
    }
  }

  private mapReason(kind: string): FlagEvaluationResult['reason'] {
    switch (kind) {
      case 'TARGET_MATCH':
        return 'TARGET_MATCH';
      case 'RULE':
        return 'TARGET_MATCH';
      case 'PERCENTAGE':
        return 'PERCENTAGE_ROLLOUT';
      case 'OFF':
        return 'OFF';
      default:
        return 'DEFAULT';
    }
  }

  async close(): Promise<void> {
    if (this.client) {
      await this.client.flush();
      await this.client.close();
      this.client = null;
    }
  }
}
