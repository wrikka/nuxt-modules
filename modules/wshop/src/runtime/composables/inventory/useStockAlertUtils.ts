import type { StockAlert } from "#shared/types"

export const useStockAlertUtils = () => {
	const getAlertIcon = (alertType: StockAlert["alertType"]): string => {
		switch (alertType) {
			case "low_stock":
				return "lucide:trending-down"
			case "out_of_stock":
				return "lucide:x"
			case "overstock":
				return "lucide:trending-up"
			default:
				return "lucide:alert-triangle"
		}
	}

	const getSeverityColor = (severity: StockAlert["severity"]): string => {
		switch (severity) {
			case "critical":
				return "text-red-600 bg-red-50 border-red-200"
			case "high":
				return "text-orange-600 bg-orange-50 border-orange-200"
			case "medium":
				return "text-yellow-600 bg-yellow-50 border-yellow-200"
			case "low":
				return "text-blue-600 bg-blue-50 border-blue-200"
			default:
				return "text-gray-600 bg-gray-50 border-gray-200"
		}
	}

	const getSeverityLabel = (severity: StockAlert["severity"]): string => {
		switch (severity) {
			case "critical":
				return "วิกฤต"
			case "high":
				return "สูง"
			case "medium":
				return "ปานกลาง"
			case "low":
				return "ต่ำ"
			default:
				return "ทั่วไป"
		}
	}

	const formatTime = (date: Date): string => {
		const now = new Date()
		const diff = now.getTime() - new Date(date).getTime()
		const minutes = Math.floor(diff / 60000)
		const hours = Math.floor(minutes / 60)
		const days = Math.floor(hours / 24)

		if (days > 0) return `${days} วันที่แล้ว`
		if (hours > 0) return `${hours} ชั่วโมงที่แล้ว`
		if (minutes > 0) return `${minutes} นาทีที่แล้ว`
		return "เมื่อสักครู่"
	}

	const getAlertStats = (alerts: StockAlert[]) => {
		const unreadAlerts = alerts.filter((alert: StockAlert) => !alert.isRead)

		return {
			total: alerts.length,
			unread: unreadAlerts.length,
			critical: alerts.filter((a: StockAlert) => a.severity === "critical").length,
			high: alerts.filter((a: StockAlert) => a.severity === "high").length,
			medium: alerts.filter((a: StockAlert) => a.severity === "medium").length,
			low: alerts.filter((a: StockAlert) => a.severity === "low").length,
		}
	}

	const getUnreadAlerts = (alerts: StockAlert[]): StockAlert[] =>
		alerts.filter((alert: StockAlert) => !alert.isRead)

	return {
		getAlertIcon,
		getSeverityColor,
		getSeverityLabel,
		formatTime,
		getAlertStats,
		getUnreadAlerts,
	}
}
