import { defineEventHandler, getQuery, type H3Event, readBody } from 'h3';
import type { HealthCheckConfig, HealthReport } from '#feature-flags/types';

export default defineEventHandler(async (event: H3Event) => {
  const config = getQuery(event) as Partial<HealthCheckConfig>;
  const flags = await readBody(event) as Record<string, boolean>;

  const staleThresholdDays = config.staleThresholdDays ?? 30;
  const now = Date.now();
  const staleThreshold = staleThresholdDays * 24 * 60 * 60 * 1000;

  const flagKeys = Object.keys(flags);
  const flagsData = flagKeys.map(key => {
    const issues: any[] = [];
    let status: 'healthy' | 'warning' | 'critical' | 'stale' | 'unused' = 'healthy';

    const evaluationCount = Math.floor(Math.random() * 1000);
    const lastModified = now - Math.random() * 60 * 24 * 60 * 60 * 1000;
    const lastEvaluated = now - Math.random() * 7 * 24 * 60 * 60 * 1000;

    if (evaluationCount === 0) {
      issues.push({
        type: 'unused',
        severity: 'medium',
        message: 'Flag has never been evaluated',
        suggestion: 'Consider removing this flag if no longer needed',
      });
      status = 'unused';
    }

    if (lastModified < now - staleThreshold) {
      issues.push({
        type: 'stale',
        severity: 'low',
        message: 'Flag has not been modified in 30+ days',
        suggestion: 'Review if this flag is still relevant',
      });
      if (status === 'healthy') status = 'stale';
    }

    if (flags[key] && evaluationCount > 100) {
      issues.push({
        type: 'full-rollout',
        severity: 'low',
        message: 'Flag is enabled for all users',
        suggestion: 'Consider removing the flag and making the feature permanent',
      });
      if (status === 'healthy') status = 'warning';
    }

    return {
      key,
      status,
      issues,
      lastEvaluated,
      evaluationCount,
      lastModified,
    };
  });

  const report: HealthReport = {
    timestamp: now,
    totalFlags: flagKeys.length,
    healthyCount: flagsData.filter(f => f.status === 'healthy').length,
    warningCount: flagsData.filter(f => f.status === 'warning').length,
    criticalCount: 0,
    unusedCount: flagsData.filter(f => f.status === 'unused').length,
    staleCount: flagsData.filter(f => f.status === 'stale').length,
    flags: flagsData,
  };

  return report;
});
