// d:/wshop/app/utils/promotions.ts

import type { Promotion } from "~~/shared/types"

export const getPromotionTypeLabel = (type: Promotion["type"]) => {
	switch (type) {
		case "percentage":
			return "ส่วนลดเปอร์เซ็นต์"
		case "fixed":
			return "ส่วนลดคงที่"
		case "buy_x_get_y":
			return "ซื้อ X แถม Y"
		case "free_shipping":
			return "ส่งฟรี"
		case "bundle":
			return "แพ็คเกจ"
		default:
			return type
	}
}

export const getPromotionTypeColor = (type: Promotion["type"]) => {
	switch (type) {
		case "percentage":
			return "bg-blue-100 text-blue-800"
		case "fixed":
			return "bg-green-100 text-green-800"
		case "buy_x_get_y":
			return "bg-purple-100 text-purple-800"
		case "free_shipping":
			return "bg-yellow-100 text-yellow-800"
		case "bundle":
			return "bg-orange-100 text-orange-800"
		default:
			return "bg-gray-100 text-gray-800"
	}
}

export const getStatusColor = (status: Promotion["status"]) => {
	switch (status) {
		case "active":
			return "bg-green-100 text-green-800"
		case "scheduled":
			return "bg-blue-100 text-blue-800"
		case "inactive":
			return "bg-gray-100 text-gray-800"
		default:
			return "bg-gray-100 text-gray-800"
	}
}

export const getStatusLabel = (status: Promotion["status"]) => {
	switch (status) {
		case "active":
			return "ใช้งานอยู่"
		case "scheduled":
			return "รอดำเนินการ"
		case "inactive":
			return "หมดอายุ"
		default:
			return status
	}
}
