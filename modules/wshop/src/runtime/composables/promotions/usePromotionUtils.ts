import type { Promotion } from "~~/shared/types"

export const usePromotionUtils = () => {
	const getStatusClass = (status: string) => {
		switch (status) {
			case "active":
				return "bg-green-100 text-green-800"
			case "inactive":
				return "bg-gray-100 text-gray-800"
			case "scheduled":
				return "bg-blue-100 text-blue-800"
			default:
				return "bg-gray-100 text-gray-800"
		}
	}

	const getStatusText = (status: string) => {
		switch (status) {
			case "active":
				return "ใช้งานอยู่"
			case "inactive":
				return "หมดอายุ"
			case "scheduled":
				return "จัดกำหนด"
			default:
				return status
		}
	}

	const getTypeText = (type: string) => {
		switch (type) {
			case "percentage":
				return "ส่วนลด %"
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

	const formatDiscount = (promotion: Promotion) => {
		switch (promotion.type) {
			case "percentage":
				return `${promotion.discountValue}%`
			case "fixed":
				return `฿${promotion.discountValue}`
			case "buy_x_get_y":
				return "ซื้อ X แถม Y"
			case "free_shipping":
				return "ส่งฟรี"
			case "bundle":
				return "แพ็คเกจ"
			default:
				return "-"
		}
	}

	const formatDate = (dateString: string) => {
		return new Date(dateString).toLocaleDateString("th-TH")
	}

	const getDiscountLabel = (type: string) => {
		switch (type) {
			case "percentage":
				return "ส่วนลด (%)"
			case "fixed":
				return "ส่วนลด (บาท)"
			case "buy_x_get_y":
				return "จำนวนที่ต้องซื้อ"
			case "free_shipping":
				return "ค่าส่งฟรี"
			case "bundle":
				return "ราคาแพ็คเกจ"
			default:
				return "ส่วนลด"
		}
	}

	const getDiscountPlaceholder = (type: string) => {
		switch (type) {
			case "percentage":
				return "10"
			case "fixed":
				return "100"
			case "buy_x_get_y":
				return "2"
			case "free_shipping":
				return "0"
			case "bundle":
				return "500"
			default:
				return "0"
		}
	}

	return {
		getStatusClass,
		getStatusText,
		getTypeText,
		formatDiscount,
		formatDate,
		getDiscountLabel,
		getDiscountPlaceholder,
	}
}
