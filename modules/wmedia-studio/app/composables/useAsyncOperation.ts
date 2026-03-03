export interface AsyncOperationOptions {
	onSuccess?: () => void;
	onError?: (error: Error) => void;
	resetErrorOnStart?: boolean;
}

export interface AsyncOperationState<T = unknown> {
	data: Ref<T | null>;
	loading: Ref<boolean>;
	error: Ref<string | null>;
	execute: (...args: unknown[]) => Promise<T | null>;
	reset: () => void;
}

/**
 * Composable for handling async operations with loading and error states
 */
export function useAsyncOperation<T>(
	operation: (...args: unknown[]) => Promise<T>,
	options: AsyncOperationOptions = {},
): AsyncOperationState<T> {
	const { onSuccess, onError, resetErrorOnStart = true } = options;

	const data = ref<T | null>(null) as Ref<T | null>;
	const loading = ref(false);
	const error = ref<string | null>(null);

	const execute = async (...args: unknown[]): Promise<T | null> => {
		loading.value = true;
		if (resetErrorOnStart) {
			error.value = null;
		}

		try {
			const result = await operation(...args);
			data.value = result;
			onSuccess?.();
			return result;
		} catch (err) {
			const message = err instanceof Error ? err.message : "An error occurred";
			error.value = message;
			onError?.(err instanceof Error ? err : new Error(message));
			return null;
		} finally {
			loading.value = false;
		}
	};

	const reset = () => {
		data.value = null;
		loading.value = false;
		error.value = null;
	};

	return {
		data,
		loading,
		error,
		execute,
		reset,
	};
}

/**
 * Higher-order function to wrap an async operation with loading/error handling
 */
export function withAsyncHandling<T, Args extends unknown[]>(
	fn: (...args: Args) => Promise<T>,
	loadingRef: Ref<boolean>,
	errorRef: Ref<string | null>,
): (...args: Args) => Promise<T | null> {
	return async (...args: Args): Promise<T | null> => {
		loadingRef.value = true;
		errorRef.value = null;

		try {
			const result = await fn(...args);
			return result;
		} catch (err) {
			errorRef.value = err instanceof Error ? err.message : "An error occurred";
			throw err;
		} finally {
			loadingRef.value = false;
		}
	};
}

/**
 * Create standard loading/error refs for a composable
 */
export function useAsyncState() {
	const loading = ref(false);
	const error = ref<string | null>(null);

	const start = () => {
		loading.value = true;
		error.value = null;
	};

	const finish = () => {
		loading.value = false;
	};

	const setError = (err: unknown) => {
		error.value = err instanceof Error ? err.message : "An error occurred";
	};

	const reset = () => {
		loading.value = false;
		error.value = null;
	};

	return {
		loading,
		error,
		start,
		finish,
		setError,
		reset,
	};
}
