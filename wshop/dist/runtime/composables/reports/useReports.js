import { useFetch } from "#imports";
export const useReports = () => {
  const { data: summary, pending: summaryPending, error: summaryError } = useFetch(
    "/api/reports/sales-summary"
  );
  const { data: topProducts, pending: topProductsPending, error: topProductsError } = useFetch("/api/reports/top-products");
  const { data: customerStats, pending: customerStatsPending, error: customerStatsError } = useFetch("/api/reports/customer-stats");
  const pending = computed(
    () => summaryPending.value || topProductsPending.value || customerStatsPending.value
  );
  const error = computed(
    () => summaryError.value || topProductsError.value || customerStatsError.value
  );
  return {
    // Data
    summary,
    topProducts,
    customerStats,
    // State
    pending,
    summaryPending,
    topProductsPending,
    customerStatsPending,
    error
  };
};
