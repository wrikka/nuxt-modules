export const useSearchStore = defineStore('search', () => {
  const searchQuery = ref('');

  return {
    searchQuery,
  };
});
