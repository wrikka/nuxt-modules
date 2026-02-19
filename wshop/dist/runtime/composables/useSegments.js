import { useFetch } from "#imports";
export const useSegments = () => {
  const { data: segments, pending, error, refresh } = useFetch("/api/segments");
  const deleteSegment = async (segmentId) => {
    try {
      await $fetch(`/api/segments/${segmentId}`, { method: "DELETE" });
      await refresh();
    } catch (err) {
      console.error("Failed to delete segment:", err);
      throw err;
    }
  };
  return {
    segments,
    pending,
    error,
    refresh,
    deleteSegment
  };
};
