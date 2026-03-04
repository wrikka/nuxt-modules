export interface DiffResult {
  added: Record<string, unknown>;
  deleted: Record<string, unknown>;
  updated: Record<string, unknown>;
}

export interface DiffOptions {
  ignorePaths?: string[];
  // Add other options as needed
}

export type Seen = Map<object, WeakMap<object, boolean>>;

export enum ChangeType {
  ADDED = 'added',
  ADD = 'add',
  DELETED = 'deleted',
  DELETE = 'delete',
  COMMON = 'common',
  MODIFIED = 'modified'
}
