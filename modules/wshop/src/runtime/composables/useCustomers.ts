// d:/wshop/app/composables/useCustomers.ts

import { useFetch } from "#imports"
import type { Customer } from "~~/shared/types"

export function useCustomers() {
	const { data: customers, pending, error, refresh } = useFetch<Customer[]>("/api/customers")

	const deleteCustomer = async (id: string) => {
		await $fetch(`/api/customers/${id}`, {
			method: "DELETE",
		})
		refresh()
	}

	return {
		customers,
		pending,
		error,
		refresh,
		deleteCustomer,
	}
}
