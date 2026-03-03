import { defineEventHandler, type H3Event, readBody } from 'h3';
import type { EnvDiffSummary, EnvironmentDiff, FlagEnvDiff } from '#feature-flags/types';

export default defineEventHandler(async (event: H3Event) => {
  const body = await readBody<{ sourceEnv: string; targetEnv: string; }>(event);
  const { sourceEnv, targetEnv } = body;

  const flags: FlagEnvDiff[] = [
    {
      key: 'new-dashboard',
      source: { enabled: true, rollout: { percentage: 50, stickiness: 'userId' } },
      target: { enabled: true, rollout: { percentage: 100, stickiness: 'userId' } },
      diffType: 'changed',
      changes: [{ field: 'rollout.percentage', sourceValue: 50, targetValue: 100 }],
    },
    {
      key: 'beta-feature',
      source: { enabled: true },
      target: null,
      diffType: 'removed',
      changes: [],
    },
    {
      key: 'api-v2',
      source: null,
      target: { enabled: false },
      diffType: 'added',
      changes: [],
    },
    {
      key: 'dark-mode',
      source: { enabled: true },
      target: { enabled: true },
      diffType: 'unchanged',
      changes: [],
    },
  ];

  const summary: EnvDiffSummary = {
    totalFlags: 4,
    added: 1,
    removed: 1,
    changed: 1,
    unchanged: 1,
    riskLevel: 'medium',
    warnings: ['Flag "beta-feature" will be removed in production', 'Rollout percentage change may affect all users'],
  };

  const diff: EnvironmentDiff = {
    sourceEnv,
    targetEnv,
    comparedAt: Date.now(),
    flags,
    summary,
  };

  return diff;
});
