import type { NewsCategory } from '#shared/types/news';
import { defineStore } from 'pinia';

export const useNewsStore = defineStore('news', () => {
  const selectedCategory = ref<NewsCategory>('All');
  const searchQuery = ref('');
  const bookmarked = ref<Set<string>>(new Set());

  function setCategory(category: NewsCategory) {
    selectedCategory.value = category;
  }

  function setSearchQuery(query: string) {
    searchQuery.value = query;
  }

  function toggleBookmark(id: string) {
    if (bookmarked.value.has(id)) {
      bookmarked.value.delete(id);
    }
    else {
      bookmarked.value.add(id);
    }
  }

  function isBookmarked(id: string): boolean {
    return bookmarked.value.has(id);
  }

  function clearBookmarks() {
    bookmarked.value.clear();
  }

  return {
    selectedCategory,
    searchQuery,
    bookmarked,
    setCategory,
    setSearchQuery,
    toggleBookmark,
    isBookmarked,
    clearBookmarks,
  };
});
