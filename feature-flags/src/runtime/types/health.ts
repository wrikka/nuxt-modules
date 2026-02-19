export interface FlagHealthStatus {
  key: string;
  status: HealthStatus;
  issues: HealthIssue[];
  lastEvaluated?: number;
  evaluationCount: number;
  lastModified?: number;
}

export type HealthStatus = 'healthy' | 'warning' | 'critical' | 'stale' | 'unused';

export interface HealthIssue {
  type: HealthIssueType;
  severity: 'low' | 'medium' | 'high';
  message: string;
  suggestion: string;
}

export type HealthIssueType =
  | 'unused'
  | 'stale'
  | 'orphan'
  | 'no-targeting'
  | 'full-rollout'
  | 'conflicting-rules'
  | 'missing-default';

export interface HealthReport {
  timestamp: number;
  totalFlags: number;
  healthyCount: number;
  warningCount: number;
  criticalCount: number;
  unusedCount: number;
  staleCount: number;
  flags: FlagHealthStatus[];
}

export interface HealthCheckConfig {
  staleThresholdDays: number;
  unusedThresholdDays: number;
  checkOrphans: boolean;
  checkConflicts: boolean;
}
