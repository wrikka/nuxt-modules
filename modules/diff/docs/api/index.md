# API Reference

## Core Functions

### diff

Computes the difference between two values.

```ts
function diff(
  expected: unknown,
  actual: unknown,
  options?: DiffOptions
): DiffResult
```

**Parameters:**

- `expected`: The expected value to compare against
- `actual`: The actual value to compare
- `options`: Optional diff configuration

**Returns:** A `DiffResult` object containing added, deleted, and updated properties.

## Composables

### useDiff

Reactive composable for computing diffs with Vue reactivity.

```ts
function useDiff(
  expected: unknown,
  actual: unknown,
  options?: DiffOptions
): {
  diffResult: Readonly<Ref<DiffResult>>;
}
```

**Parameters:**

- `expected`: The expected value (reactive)
- `actual`: The actual value (reactive)
- `options`: Optional diff configuration

**Returns:** Object with `diffResult` computed property.

### useUnifiedDiff

Composable for generating unified diff output.

```ts
function useUnifiedDiff(
  diff: DiffResult,
  options?: UnifiedDiffOptions
): {
  unifiedDiff: ComputedRef<string>;
}
```

**Parameters:**

- `diff`: The diff result to format
- `options`: Formatting options

**Returns:** Object with `unifiedDiff` computed property containing formatted diff text.

### useDiffStatus

Composable for analyzing diff statistics.

```ts
function useDiffStatus(diff: DiffResult): {
  isEmpty: ComputedRef<boolean>;
  hasChanges: ComputedRef<boolean>;
  addedCount: ComputedRef<number>;
  deletedCount: ComputedRef<number>;
  updatedCount: ComputedRef<number>;
  totalChanges: ComputedRef<number>;
}
```

**Parameters:**

- `diff`: The diff result to analyze

**Returns:** Object with computed properties for diff status and counts.

## Types

### ChangeType

Enum representing the type of change.

```ts
enum ChangeType {
  COMMON = "common",
  ADD = "add",
  DELETE = "delete",
  UPDATED = "updated",
}
```

### DiffResult

Interface representing the result of a diff operation.

```ts
interface DiffResult {
  added: Record<string, unknown>;
  deleted: Record<string, unknown>;
  updated: Record<string, unknown>;
}
```

### DiffOptions

Configuration options for diff operations.

```ts
interface DiffOptions {
  ignorePaths?: string[];
}
```

### UnifiedDiffOptions

Options for unified diff formatting.

```ts
interface UnifiedDiffOptions {
  title?: string;
  contextLines?: number;
}
```

### DiffError

Interface for diff-related errors.

```ts
interface DiffError {
  name: string;
  message: string;
  code?: string;
  details?: unknown;
}
```

### ValidationOptions

Options for diff validation.

```ts
interface ValidationOptions {
  strict?: boolean;
  maxDepth?: number;
}
```

### DiffValidationResult

Result of diff validation.

```ts
interface DiffValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
}
```

### DiffValidatorOptions

Options for diff validation with additional constraints.

```ts
interface DiffValidatorOptions {
  allowCircularReferences?: boolean;
  maxArrayLength?: number;
  maxDepth?: number;
  maxObjectSize?: number;
  validateTypes?: boolean;
}
```
