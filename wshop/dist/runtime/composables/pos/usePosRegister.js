import { ref } from "vue";
import { useAuth } from "~/composables/core/useAuth";
import { useAppStore } from "~/stores/app";
import { usePointOfSaleApi } from "./usePointOfSaleApi.js";
export function usePosRegister() {
  const registers = ref([]);
  const selectedRegister = ref(null);
  const loading = ref(false);
  const error = ref(null);
  const api = usePointOfSaleApi();
  const { user: currentUser } = useAuth();
  const { addNotification } = useAppStore();
  const loadRegisters = async () => {
    loading.value = true;
    error.value = null;
    try {
      registers.value = await api.fetchRegisters();
    } catch (err) {
      error.value = err instanceof Error ? err.message : "Failed to load registers";
    } finally {
      loading.value = false;
    }
  };
  const openRegister = async (registerId) => {
    try {
      await api.openRegister(registerId, currentUser.value?.id?.toString() || "");
      selectedRegister.value = registerId;
    } catch (err) {
      console.error("Failed to open register:", err);
      if (err instanceof Error) {
        addNotification({ type: "error", message: `\u0E44\u0E21\u0E48\u0E2A\u0E32\u0E21\u0E32\u0E23\u0E16\u0E40\u0E1B\u0E34\u0E14\u0E40\u0E04\u0E23\u0E37\u0E48\u0E2D\u0E07\u0E44\u0E14\u0E49: ${err.message}` });
      } else {
        addNotification({ type: "error", message: "\u0E44\u0E21\u0E48\u0E2A\u0E32\u0E21\u0E32\u0E23\u0E16\u0E40\u0E1B\u0E34\u0E14\u0E40\u0E04\u0E23\u0E37\u0E48\u0E2D\u0E07\u0E44\u0E14\u0E49" });
      }
    }
  };
  const endShift = async () => {
    if (!selectedRegister.value) return;
    loading.value = true;
    try {
      await api.closeRegister(selectedRegister.value);
    } catch (err) {
      console.error("Failed to end shift:", err);
      if (err instanceof Error) {
        addNotification({ type: "error", message: `\u0E44\u0E21\u0E48\u0E2A\u0E32\u0E21\u0E32\u0E23\u0E16\u0E08\u0E1A\u0E01\u0E30\u0E44\u0E14\u0E49: ${err.message}` });
      } else {
        addNotification({ type: "error", message: "\u0E44\u0E21\u0E48\u0E2A\u0E32\u0E21\u0E32\u0E23\u0E16\u0E08\u0E1A\u0E01\u0E30\u0E44\u0E14\u0E49" });
      }
    } finally {
      loading.value = false;
    }
  };
  const getSalesHistory = async (startDate, endDate) => {
    if (!selectedRegister.value) return [];
    try {
      const params = { registerId: selectedRegister.value };
      if (startDate) params.startDate = startDate;
      if (endDate) params.endDate = endDate;
      return await api.fetchSalesHistory(params);
    } catch (err) {
      console.error("Failed to get sales history:", err);
      if (err instanceof Error) {
        error.value = err.message;
      } else {
        error.value = "An unknown error occurred";
      }
      return [];
    }
  };
  return {
    registers,
    selectedRegister,
    loading,
    error,
    loadRegisters,
    openRegister,
    endShift,
    getSalesHistory
  };
}
