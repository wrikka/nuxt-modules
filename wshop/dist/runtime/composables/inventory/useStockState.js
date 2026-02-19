import { ref } from "vue";
export function useStockState() {
  const stockAlerts = ref([]);
  const stockMovements = ref([]);
  const stockTransfers = ref([]);
  const stockAdjustments = ref([]);
  const stockCounts = ref([]);
  const loading = ref(false);
  const error = ref(null);
  return {
    stockAlerts,
    stockMovements,
    stockTransfers,
    stockAdjustments,
    stockCounts,
    loading,
    error
  };
}
