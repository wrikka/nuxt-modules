export interface FlagDependency {
  id: string;
  flagKey: string;
  dependsOn: string;
  condition: DependencyCondition;
  createdAt: number;
}

export interface DependencyCondition {
  type: 'enabled' | 'disabled' | 'equals' | 'not_equals';
  value?: unknown;
}

export interface DependencyResult {
  satisfied: boolean;
  unsatisfiedDependencies: Array<{
    flagKey: string;
    dependsOn: string;
    reason: string;
  }>;
}

export interface DependencyConfig {
  enabled: boolean;
  maxDepth: number;
  circularDetection: boolean;
}
