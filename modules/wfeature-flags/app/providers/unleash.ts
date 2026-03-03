import type { FeatureFlag, FlagEvaluationContext, FlagEvaluationResult } from '#feature-flags/types';
import { BaseProvider } from './base';

interface UnleashToggle {
  name: string;
  enabled: boolean;
  strategies: Array<{ name: string; parameters: Record<string, unknown>; }>;
}

interface UnleashContext {
  userId?: string;
  sessionId?: string;
  remoteAddress?: string;
  properties?: Record<string, unknown>;
}

export class UnleashProvider extends BaseProvider {
  name = 'unleash';
  private url: string | undefined;
  private toggles: Map<string, UnleashToggle> = new Map();
  private lastFetch = 0;
  private refreshInterval = 60000; // 1 minute

  constructor(config: Record<string, unknown> = {}) {
    super(config);
    this.url = config.url as string | undefined;
  }

  async initialize(): Promise<void> {
    if (!this.url) {
      throw new Error('Unleash requires url configuration');
    }
    await this.refreshToggles();
  }

  private async refreshToggles(): Promise<void> {
    if (!this.url) {
      return;
    }

    const now = Date.now();
    if (now - this.lastFetch < this.refreshInterval) {
      return;
    }

    try {
      const response = await fetch(`${this.url}/api/client/features`, {
        headers: {
          'Accept': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`Unleash API error: ${response.status}`);
      }

      const data = await response.json();
      this.toggles.clear();

      for (const toggle of data.features ?? []) {
        this.toggles.set(toggle.name, toggle);
      }

      this.lastFetch = now;
    } catch {
      throw new Error('Failed to fetch Unleash toggles');
    }
  }

  async getFlag(key: string): Promise<FeatureFlag | null> {
    await this.refreshToggles();
    const toggle = this.toggles.get(key);

    if (!toggle) {
      return null;
    }

    return {
      key: toggle.name,
      name: toggle.name,
      enabled: toggle.enabled,
    };
  }

  async getAllFlags(): Promise<FeatureFlag[]> {
    await this.refreshToggles();
    return Array.from(this.toggles.values()).map(toggle => ({
      key: toggle.name,
      name: toggle.name,
      enabled: toggle.enabled,
    }));
  }

  async evaluate(
    key: string,
    context?: FlagEvaluationContext,
  ): Promise<FlagEvaluationResult> {
    await this.refreshToggles();
    const toggle = this.toggles.get(key);

    if (!toggle) {
      return this.createDefaultResult(key, false, 'OFF');
    }

    if (!toggle.enabled) {
      return this.createDefaultResult(key, false, 'OFF');
    }

    const unleashContext: UnleashContext = {
      userId: context?.userId,
      sessionId: context?.sessionId,
      properties: context?.attributes,
    };

    // Evaluate strategies
    for (const strategy of toggle.strategies) {
      const result = this.evaluateStrategy(strategy, unleashContext);
      if (result) {
        return {
          flag: key,
          enabled: true,
          reason: 'TARGET_MATCH',
        };
      }
    }

    return this.createDefaultResult(key, false, 'DEFAULT');
  }

  private evaluateStrategy(
    strategy: { name: string; parameters: Record<string, unknown>; },
    context: UnleashContext,
  ): boolean {
    switch (strategy.name) {
      case 'default':
        return true;

      case 'userWithId':
        const userIds = strategy.parameters.userIds as string[] ?? [];
        return context.userId ? userIds.includes(context.userId) : false;

      case 'flexibleRollout': {
        const percentage = (strategy.parameters.rollout as number) ?? 0;
        const stickiness = (strategy.parameters.stickiness as string) ?? 'default';
        const groupId = (strategy.parameters.groupId as string) ?? '';

        const stickinessValue = stickiness === 'userId'
          ? context.userId
          : stickiness === 'sessionId'
          ? context.sessionId
          : context.userId ?? context.sessionId;

        if (!stickinessValue) {
          return false;
        }

        const hash = this.hashString(`${groupId}:${stickinessValue}`);
        const normalized = (hash % 100) + 1;
        return normalized <= percentage;
      }

      case 'remoteAddress': {
        const ips = strategy.parameters.IPs as string[] ?? [];
        return context.remoteAddress ? ips.includes(context.remoteAddress) : false;
      }

      default:
        return false;
    }
  }

  private hashString(str: string): number {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash;
    }
    return Math.abs(hash);
  }
}
