export interface BulkOperation {
  id: string;
  type: BulkOperationType;
  status: BulkOperationStatus;
  items: BulkOperationItem[];
  createdAt: number;
  completedAt?: number;
  progress: number;
}

export type BulkOperationType =
  | 'enable'
  | 'disable'
  | 'delete'
  | 'import'
  | 'export'
  | 'update-targeting'
  | 'update-rollout';

export type BulkOperationStatus = 'pending' | 'running' | 'completed' | 'failed' | 'cancelled';

export interface BulkOperationItem {
  flagKey: string;
  status: 'pending' | 'success' | 'failed';
  error?: string;
}

export interface ImportResult {
  total: number;
  created: number;
  updated: number;
  skipped: number;
  errors: ImportError[];
}

export interface ImportError {
  row: number;
  key?: string;
  error: string;
}

export interface ExportConfig {
  format: 'json' | 'yaml' | 'csv';
  includeDisabled: boolean;
  includeTargeting: boolean;
  includeVariants: boolean;
  includeMetadata: boolean;
}

export interface ImportConfig {
  mode: 'create' | 'update' | 'upsert';
  skipInvalid: boolean;
  validateOnly: boolean;
}
