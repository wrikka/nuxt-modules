export const useSidebarStore = defineStore('sidebar', () => {
  const isSidebarOpen = ref(true);

  const toggleSidebar = () => {
    isSidebarOpen.value = !isSidebarOpen.value;
  };

  return {
    isSidebarOpen,
    toggleSidebar,
  };
});
