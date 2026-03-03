// d:/wshop/server/db/seed/apps.ts

import { db } from "~~/server/db"
import { apps } from "~~/server/db/schemas"

type AppSeed = Omit<typeof apps.$inferInsert, "screenshots" | "updatedAt">

export async function seedApps() {
	const sampleApps: AppSeed[] = [
		{
			id: "email-marketing",
			name: "Email Marketing",
			description: "Create and send beautiful email campaigns to your customers",
			version: "1.0.0",
			author: "WShop",
			category: "Marketing",
			icon: "📧",
			features: ["Email Templates", "Campaign Scheduling", "Analytics"],
			pricing: { type: "freemium", price: 29 },
			rating: { average: 4.5, count: 120 },
			downloads: "5000",
		},
		{
			id: "analytics-pro",
			name: "Analytics Pro",
			description: "Advanced analytics and reporting for your store",
			version: "2.1.0",
			author: "WShop",
			category: "Analytics",
			icon: "📊",
			features: ["Sales Reports", "Customer Insights", "Conversion Tracking"],
			pricing: { type: "paid", price: 19 },
			rating: { average: 4.8, count: 85 },
			downloads: "3500",
		},
		{
			id: "live-chat",
			name: "Live Chat",
			description: "Real-time chat support for your customers",
			version: "1.2.0",
			author: "WShop",
			category: "Customer Service",
			icon: "💬",
			features: ["Real-time Chat", "Chat History", "Agent Assignment"],
			pricing: { type: "free" },
			rating: { average: 4.3, count: 200 },
			downloads: "8000",
		},
		{
			id: "inventory-sync",
			name: "Inventory Sync",
			description: "Sync inventory across multiple locations",
			version: "1.0.0",
			author: "WShop",
			category: "Inventory",
			icon: "📦",
			features: ["Multi-location", "Auto-sync", "Low Stock Alerts"],
			pricing: { type: "paid", price: 49 },
			rating: { average: 4.6, count: 60 },
			downloads: "2000",
		},
	]

	for (const app of sampleApps) {
		await db.insert(apps).values(app).onConflictDoNothing()
	}

	console.log("✓ Apps seeded successfully")
}
