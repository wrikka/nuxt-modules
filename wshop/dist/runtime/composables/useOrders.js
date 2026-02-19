import { useFetch } from "#imports";
export function useOrders() {
  const { data: orders, pending, error, refresh } = useFetch("/api/orders");
  const deleteOrder = async (id) => {
    await $fetch(`/api/orders/${id}`, {
      method: "DELETE"
    });
    refresh();
  };
  return {
    orders,
    pending,
    error,
    refresh,
    deleteOrder
  };
}
