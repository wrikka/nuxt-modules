export const useStockApi = () => {
  const stockAlerts = useStockAlerts();
  const stockOperations = useStockOperations();
  const stockTransfers = useStockTransfers();
  const getStockStatistics = async () => {
    try {
      const data = await $fetch("/api/stock/statistics");
      return data;
    } catch (err) {
      console.error("Error getting stock statistics:", err);
      throw err;
    }
  };
  return {
    // From stock alerts
    ...stockAlerts,
    // From stock operations
    ...stockOperations,
    // From stock transfers
    ...stockTransfers,
    // Additional methods
    getStockStatistics
  };
};
