export interface ChangelogEntry {
  id: string;
  flagKey: string;
  action: ChangelogAction;
  timestamp: number;
  actor: Actor;
  changes: ChangeDetail[];
  environment: string;
  reason?: string;
}

export type ChangelogAction =
  | 'created'
  | 'enabled'
  | 'disabled'
  | 'updated'
  | 'deleted'
  | 'targeting_changed'
  | 'rollout_changed'
  | 'variant_added'
  | 'variant_removed';

import type { Actor } from './audit';

export interface ChangeDetail {
  field: string;
  oldValue: unknown;
  newValue: unknown;
  path?: string;
}

export interface ChangelogTimeline {
  entries: ChangelogEntry[];
  pagination: {
    total: number;
    page: number;
    pageSize: number;
    hasMore: boolean;
  };
}

export interface ChangelogFilter {
  flagKey?: string;
  action?: ChangelogAction[];
  actor?: string;
  startDate?: number;
  endDate?: number;
  environment?: string;
}

export interface ChangelogDiff {
  entryId: string;
  before: Record<string, unknown>;
  after: Record<string, unknown>;
  diff: DiffItem[];
}

export interface DiffItem {
  path: string;
  type: 'added' | 'removed' | 'changed';
  oldValue?: unknown;
  newValue?: unknown;
}
