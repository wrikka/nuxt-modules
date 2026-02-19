import { useFetch } from "#imports";
export const useLoyalty = () => {
  const { data: program, pending: pendingProgram, error: errorProgram, refresh: refreshProgram } = useFetch("/api/loyalty/program");
  const { data: customers, pending: pendingCustomers, error: errorCustomers } = useFetch("/api/loyalty/customers");
  const saveProgram = async (updatedProgram) => {
    try {
      await $fetch("/api/loyalty/program", {
        method: "PUT",
        body: updatedProgram
      });
      await refreshProgram();
    } catch (error) {
      console.error("Failed to save loyalty program:", error);
      throw error;
    }
  };
  return {
    program,
    pendingProgram,
    errorProgram,
    customers,
    pendingCustomers,
    errorCustomers,
    saveProgram
  };
};
