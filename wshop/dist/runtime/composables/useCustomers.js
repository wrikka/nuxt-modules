import { useFetch } from "#imports";
export function useCustomers() {
  const { data: customers, pending, error, refresh } = useFetch("/api/customers");
  const deleteCustomer = async (id) => {
    await $fetch(`/api/customers/${id}`, {
      method: "DELETE"
    });
    refresh();
  };
  return {
    customers,
    pending,
    error,
    refresh,
    deleteCustomer
  };
}
