import { useFetch } from "#imports"
import type { Order } from "~~/shared/types"

export function useOrders() {
	const { data: orders, pending, error, refresh } = useFetch<Order[]>("/api/orders")

	const deleteOrder = async (id: number) => {
		await $fetch(`/api/orders/${id}`, {
			method: "DELETE",
		})
		refresh()
	}

	return {
		orders,
		pending,
		error,
		refresh,
		deleteOrder,
	}
}
