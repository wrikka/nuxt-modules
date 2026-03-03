import { db } from "~~/server/db"
import { loyaltyPrograms, loyaltyTiers } from "~~/server/db/schemas"

export async function seedLoyalty() {
	const [program] = await db.insert(loyaltyPrograms).values({
		name: "WShop Rewards",
		pointsPerCurrency: "1",
		currencyPerPoint: "0.5",
		minimumPoints: 100,
		isActive: true,
	}).onConflictDoNothing().returning()

	if (!program) {
		console.log("Default loyalty program already exists.")
	}

	const tiers = [
		{
			programId: program?.id || "default-program",
			name: "บรอนซ์",
			minPoints: 0,
			benefits: [
				"ส่วนลด 5% ทุกครั้ง",
				"สะสมแต้ม 1 แต้มต่อทุก 20 บาท",
				"รับข่าวสารและโปรโมชั่นพิเศษ",
			],
			color: "#CD7F32",
		},
		{
			programId: program?.id || "default-program",
			name: "ซิลเวอร์",
			minPoints: 250,
			benefits: [
				"ส่วนลด 10% ทุกครั้ง",
				"สะสมแต้ม 1.2 แต้มต่อทุก 20 บาท",
				"บริการจัดส่งฟรีเมื่อซื้อขั้นต่ำ 500 บาท",
				"รับของขวัญวันเกิด",
				"เข้าร่วมงานพิเศษสำหรับสมาชิก",
			],
			color: "#C0C0C0",
		},
		{
			programId: program?.id || "default-program",
			name: "โกลด์",
			minPoints: 750,
			benefits: [
				"ส่วนลด 15% ทุกครั้ง",
				"สะสมแต้ม 1.5 แต้มต่อทุก 20 บาท",
				"บริการจัดส่งฟรีไม่มีขั้นต่ำ",
				"รับของขวัญวันเกิดพิเศษ",
				"บริการลูกค้าพิเศษ 24 ชม.",
				"เข้าถึงสินค้าล่วงหน้า",
				"เช็คเอาท์ช่องพิเศษ",
			],
			color: "#FFD700",
		},
		{
			programId: program?.id || "default-program",
			name: "แพลตินัม",
			minPoints: 2500,
			benefits: [
				"ส่วนลด 20% ทุกครั้ง",
				"สะสมแต้ม 2 แต้มต่อทุก 20 บาท",
				"บริการจัดส่งฟรีแบบด่วนพิเศษ",
				"ของขวัญวันเกิดพรีเมียม",
				"ที่ปรึกษาส่วนตัว",
				"เข้าถึงสินค้าจำกัดพิเศษ",
				"งานเลี้ยงส่วนตัวประจำปี",
				"คืนสินค้าภายใน 30 วัน",
				"บริการ VIP ทุกระดับ",
			],
			color: "#E5E4E2",
		},
	]

	for (const tier of tiers) {
		await db.insert(loyaltyTiers).values(tier).onConflictDoNothing()
	}

	console.log("✓ Loyalty program and tiers seeded successfully")
}
