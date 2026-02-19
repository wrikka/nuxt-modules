import { defineEventHandler, type H3Event, readBody, useRuntimeConfig } from 'h3';
import type { FlagEvaluationContext, FlagEvaluationResult } from '#feature-flags/types';

interface EvaluateRequest {
  flag: string;
  context?: FlagEvaluationContext;
}

export default defineEventHandler(async (event: H3Event) => {
  const config = useRuntimeConfig();
  const defaultFlags: Record<string, boolean> = config.public.featureFlags?.defaultFlags ?? {};
  const localProviderFlags: Record<string, unknown> = config.public.featureFlags?.providers?.local?.flags ?? {};

  const body = await readBody<EvaluateRequest>(event);
  const { flag, context } = body;

  // Check if flag exists in defaults
  const defaultEnabled = defaultFlags[flag] ?? false;

  // Check local provider
  let enabled = defaultEnabled;
  let reason: FlagEvaluationResult['reason'] = 'DEFAULT';

  if (localProviderFlags[flag]) {
    const localFlag = localProviderFlags[flag];
    if (typeof localFlag === 'boolean') {
      enabled = localFlag;
      reason = 'DEFAULT';
    } else if (typeof localFlag === 'object' && localFlag !== null && 'enabled' in localFlag) {
      const flagObj = localFlag as {
        enabled: boolean;
        rollout?: { percentage: number; };
        targeting?: Array<{
          attribute: string;
          operator: string;
          value: unknown;
        }>;
      };

      // Check targeting rules first
      if (flagObj.targeting && context?.attributes) {
        for (const rule of flagObj.targeting) {
          const attrValue = context.attributes[rule.attribute];
          if (attrValue !== undefined) {
            const match = evaluateTargetingRule(attrValue, rule.operator, rule.value);
            if (match) {
              enabled = flagObj.enabled;
              reason = 'TARGET_MATCH';
              break;
            }
          }
        }
      }

      // Check rollout percentage
      if (reason !== 'TARGET_MATCH' && flagObj.rollout) {
        const stickiness = context?.userId ?? context?.sessionId ?? 'random';
        const hash = hashString(`${flag}:${stickiness}`);
        const percentage = hash % 100;

        if (percentage < flagObj.rollout.percentage) {
          enabled = true;
          reason = 'PERCENTAGE_ROLLOUT';
        } else {
          enabled = false;
          reason = 'PERCENTAGE_ROLLOUT';
        }
      }

      if (reason === 'DEFAULT') {
        enabled = flagObj.enabled;
      }
    }
  }

  const result: FlagEvaluationResult = {
    flag,
    enabled,
    reason,
  };

  return result;
});

function evaluateTargetingRule(
  attrValue: unknown,
  operator: string,
  ruleValue: unknown,
): boolean {
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

function hashString(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  return Math.abs(hash);
}
