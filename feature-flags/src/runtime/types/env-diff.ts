export interface EnvironmentDiff {
  sourceEnv: string;
  targetEnv: string;
  comparedAt: number;
  flags: FlagEnvDiff[];
  summary: EnvDiffSummary;
}

export interface FlagEnvDiff {
  key: string;
  source: FlagEnvConfig | null;
  target: FlagEnvConfig | null;
  diffType: 'added' | 'removed' | 'changed' | 'unchanged';
  changes: EnvChangeDetail[];
}

export interface FlagEnvConfig {
  enabled: boolean;
  rollout?: {
    percentage: number;
    stickiness: string;
  };
  targeting?: {
    attribute: string;
    operator: string;
    value: unknown;
  }[];
  variants?: {
    name: string;
    value: unknown;
    weight: number;
  }[];
}

export interface EnvChangeDetail {
  field: string;
  sourceValue: unknown;
  targetValue: unknown;
}

export interface EnvDiffSummary {
  totalFlags: number;
  added: number;
  removed: number;
  changed: number;
  unchanged: number;
  riskLevel: 'low' | 'medium' | 'high';
  warnings: string[];
}

export interface EnvDiffConfig {
  sourceEnv: string;
  targetEnv: string;
  includeDisabled: boolean;
  includeTargeting: boolean;
  includeVariants: boolean;
}
