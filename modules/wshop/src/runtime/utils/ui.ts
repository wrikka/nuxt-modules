/**
 * Get status class for order and payment status
 */
export const getStatusClass = (status: string): string => {
	switch (status.toLowerCase()) {
		case "paid":
		case "delivered":
		case "active":
			return "bg-green-200 text-green-900"
		case "pending":
			return "bg-yellow-200 text-yellow-900"
		case "processing":
		case "shipped":
			return "bg-blue-200 text-blue-900"
		case "failed":
		case "cancelled":
		case "inactive":
			return "bg-red-200 text-red-900"
		default:
			return "bg-gray-200 text-gray-900"
	}
}
