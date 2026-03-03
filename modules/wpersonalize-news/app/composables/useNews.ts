import type { NewsCategory, NewsItem } from '#shared/types/news';

export const useNews = () => {
  const selectedCategory = useState<NewsCategory>('selectedCategory', () => 'All');
  const newsQuery = useState<string>('newsQuery', () => '');
  const bookmarked = useState<Set<string>>('bookmarked', () => new Set());

  const fetchQuery = computed(() => ({
    category: selectedCategory.value,
    q: newsQuery.value,
  }));

  const { data, refresh, pending, error } = useFetch<{ items: NewsItem[] }>('/api/news', {
    query: fetchQuery,
  });

  const items = computed(() => data.value?.items ?? []);

  const toggleBookmark = (id: string) => {
    if (bookmarked.value.has(id)) {
      bookmarked.value.delete(id);
    }
    else {
      bookmarked.value.add(id);
    }
  };

  const isBookmarked = (id: string): boolean => {
    return bookmarked.value.has(id);
  };

  const setCategory = (category: NewsCategory) => {
    selectedCategory.value = category;
  };

  const setSearchQuery = (query: string) => {
    newsQuery.value = query;
  };

  return {
    bookmarked,
    error,
    isBookmarked,
    items,
    newsQuery,
    pending,
    refresh,
    selectedCategory,
    setCategory,
    setSearchQuery,
    toggleBookmark,
  };
}
