import type { UseFetchOptions } from '#app';
import type { Email } from '../../shared/types/email';

export type SortOption = 'date-desc' | 'date-asc' | 'from-asc' | 'from-desc';

const sortFunctions: Record<SortOption, (a: Email, b: Email) => number> = {
  'date-asc': (a, b) => new Date(a.time).getTime() - new Date(b.time).getTime(),
  'date-desc': (a, b) => new Date(b.time).getTime() - new Date(a.time).getTime(),
  'from-asc': (a, b) => a.from.localeCompare(b.from),
  'from-desc': (a, b) => b.from.localeCompare(a.from),
};

export const useEmailList = (options: UseFetchOptions<Email[]>) => {
  const { data: emails, pending, error, refresh } = useFetch<Email[]>('/api/emails', options);

  const sortBy = ref<SortOption>('date-desc');

  const sortedEmails = computed(() => {
    if (!emails.value) {
      return [];
    }
    
    const emailsCopy = [...emails.value];
    const sorter = sortFunctions[sortBy.value];
    
    return emailsCopy.sort(sorter);
  });

  return {
    emails: sortedEmails,
    pending,
    error,
    refresh,
    sortBy,
  };
};
