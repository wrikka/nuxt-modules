import { useClipboard as vueUseClipboard, useDebounceFn } from '@vueuse/core';

export function useDebounce<TArgs extends unknown[], TResult>(
  fn: (...args: TArgs) => TResult,
  delay: number = 300,
) {
  return useDebounceFn(fn, delay);
}

export function useClipboard() {
  const { copy, copied, text } = vueUseClipboard();

  return {
    copy,
    copied,
    text,
  };
}
