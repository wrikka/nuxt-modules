export const useEmailView = () => {
  const viewMode = ref('list'); // 'list' or 'grid'

  return {
    viewMode,
  };
};
