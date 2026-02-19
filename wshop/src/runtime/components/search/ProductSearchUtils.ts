import type { Category } from "#shared/types"

export function useProductSearchUtils(categories: Category[]) {
	const getFilterLabel = (key: string, value: string): string => {
		switch (key) {
			case "search":
				return `ค้นหา: ${value}`
			case "categoryId":
				const category = categories.find(c => c.id === Number(value))
				return `หมวดหมู่: ${category?.name || value}`
			case "minPrice":
				return `ราคาต่ำสุด: ${value}`
			case "maxPrice":
				return `ราคาสูงสุด: ${value}`
			case "status":
				return `สถานะ: ${value}`
			case "stockStatus":
				const stockLabels = {
					in_stock: "มีสินค้า",
					low_stock: "สต็อกต่ำ",
					out_of_stock: "หมดสต็อก",
				}
				return `สต็อก: ${stockLabels[value as keyof typeof stockLabels] || value}`
			default:
				return `${key}: ${value}`
		}
	}

	return {
		getFilterLabel,
	}
}
