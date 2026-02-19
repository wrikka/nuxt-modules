import { BaseProvider } from './base';
import type { FeatureFlag } from '#feature-flags/types';

export class LocalProvider extends BaseProvider {
  name = 'local';
  private flags: Map<string, FeatureFlag> = new Map();

  constructor(config: Record<string, unknown> = {}) {
    super(config);
    this.loadFlags(config.flags as Record<string, boolean | FeatureFlag> ?? {});
  }

  private loadFlags(flags: Record<string, boolean | FeatureFlag>) {
    for (const [key, value] of Object.entries(flags)) {
      if (typeof value === 'boolean') {
        this.flags.set(key, {
          key,
          name: key,
          enabled: value,
        });
      } else if (value && typeof value === 'object') {
        this.flags.set(key, value as FeatureFlag);
      }
    }
  }

  async getFlag(key: string): Promise<FeatureFlag | null> {
    return this.flags.get(key) ?? null;
  }

  async getAllFlags(): Promise<FeatureFlag[]> {
    return Array.from(this.flags.values());
  }

  async evaluate(
    key: string,
    context?: FlagEvaluationContext,
  ): Promise<FlagEvaluationResult> {
    const flag = this.flags.get(key);

    if (!flag) {
      return this.createDefaultResult(key, false, 'OFF');
    }

    // Check targeting rules
    if (flag.targeting && context?.attributes) {
      for (const rule of flag.targeting) {
        const attrValue = context.attributes[rule.attribute];
        if (attrValue !== undefined && this.matchRule(attrValue, rule.operator, rule.value)) {
          return {
            flag: key,
            enabled: flag.enabled,
            reason: 'TARGET_MATCH',
          };
        }
      }
    }

    // Check rollout percentage
    if (flag.rollout) {
      const stickiness = context?.userId ?? context?.sessionId ?? 'random';
      const hash = this.hashString(`${key}:${stickiness}`);
      const percentage = hash % 100;

      const isEnabled = percentage < flag.rollout.percentage;
      return {
        flag: key,
        enabled: isEnabled,
        reason: 'PERCENTAGE_ROLLOUT',
      };
    }

    return this.createDefaultResult(key, flag.enabled);
  }

  private matchRule(attrValue: unknown, operator: string, ruleValue: unknown): boolean {
    switch (operator) {
      case 'eq':
        return attrValue === ruleValue;
      case 'neq':
        return attrValue !== ruleValue;
      case 'gt':
        return Number(attrValue) > Number(ruleValue);
      case 'gte':
        return Number(attrValue) >= Number(ruleValue);
      case 'lt':
        return Number(attrValue) < Number(ruleValue);
      case 'lte':
        return Number(attrValue) <= Number(ruleValue);
      case 'contains':
        return String(attrValue).includes(String(ruleValue));
      case 'not_contains':
        return !String(attrValue).includes(String(ruleValue));
      case 'starts_with':
        return String(attrValue).startsWith(String(ruleValue));
      case 'ends_with':
        return String(attrValue).endsWith(String(ruleValue));
      case 'in':
        return Array.isArray(ruleValue) && ruleValue.includes(attrValue);
      case 'not_in':
        return Array.isArray(ruleValue) && !ruleValue.includes(attrValue);
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

  setFlag(key: string, value: boolean | FeatureFlag) {
    if (typeof value === 'boolean') {
      this.flags.set(key, {
        key,
        name: key,
        enabled: value,
      });
    } else {
      this.flags.set(key, value);
    }
  }

  removeFlag(key: string) {
    this.flags.delete(key);
  }

  clearFlags() {
    this.flags.clear();
  }
}
