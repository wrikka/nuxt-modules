import { defineEventHandler, readBody } from "h3"

export default defineEventHandler(async (event) => {
  const method = event.method

  if (method === "GET") {
    return []
  }

  if (method === "POST") {
    const body = await readBody(event)
    return {
      id: crypto.randomUUID(),
      ...body,
      code: Math.random().toString(36).substring(2, 8).toUpperCase(),
      status: "pending",
      totalEarnings: 0,
      totalReferrals: 0,
      totalSales: 0,
      balance: 0,
      referralUrl: "",
      createdAt: new Date(),
    }
  }

  return { error: "Not found" }
})
