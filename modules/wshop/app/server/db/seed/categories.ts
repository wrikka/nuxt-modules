import { db } from "~~/server/db"
import { categories } from "~~/server/db/schemas"

export async function seedCategories() {
	const sampleCategories = [
		{
			id: "1",
			name: "อิเล็กทรอนิกส์",
			description: "อุปกรณ์อิเล็กทรอนิกส์และแก็ดเจ็ตต่างๆ",
			parentId: null,
			image: "https://picsum.photos/seed/electronics/200/200.jpg",
			isActive: true,
		},
		{
			id: "5",
			name: "เสื้อผ้า",
			description: "เสื้อผ้าและแฟชั่น",
			parentId: null,
			image: "https://picsum.photos/seed/clothing/200/200.jpg",
			isActive: true,
		},
		{
			id: "6",
			name: "บ้านและสวน",
			description: "เฟอร์นิเจอร์และของตกแต่งบ้าน",
			parentId: null,
			image: "https://picsum.photos/seed/home/200/200.jpg",
			isActive: false,
		},
		{
			id: "2",
			name: "คอมพิวเตอร์",
			description: "คอมพิวเตอร์และอุปกรณ์ต่อพ่วง",
			parentId: "1",
			image: "https://picsum.photos/seed/computers/200/200.jpg",
			isActive: true,
		},
		{
			id: "4",
			name: "มือถือ",
			description: "สมาร์ทโฟนและแท็บเล็ต",
			parentId: "1",
			image: "https://picsum.photos/seed/mobile/200/200.jpg",
			isActive: true,
		},
		{
			id: "3",
			name: "โน้ตบุ๊ค",
			description: "โน้ตบุ๊คและอุปกรณ์เสริม",
			parentId: "2",
			image: "https://picsum.photos/seed/laptops/200/200.jpg",
			isActive: true,
		},
	]

	for (const category of sampleCategories) {
		await db.insert(categories).values(category).onConflictDoNothing()
	}

	console.log("✓ Categories seeded successfully")
}
