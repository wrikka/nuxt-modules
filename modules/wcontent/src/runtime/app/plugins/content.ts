// Plugin for content initialization and live preview
export default defineNuxtPlugin((nuxtApp) => {
  // Initialize content state
  const contentState = useState("wcontent", () => ({
    initialized: false,
    collections: new Set(),
  }));

  // Live preview mode (dev only)
  if (import.meta.dev) {
    const { data: previewData } = useFetch("/api/content/preview");
    
    watch(previewData, (newData) => {
      if (newData) {
        // Trigger refresh of current content
        refreshNuxtData();
      }
    });
  }

  // Provide content helpers
  return {
    provide: {
      wcontent: {
        state: contentState,
        refresh: () => refreshNuxtData(),
      },
    },
  };
});
