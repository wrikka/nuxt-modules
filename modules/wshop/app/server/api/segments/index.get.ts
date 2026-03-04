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
      customerCount: 0,
      totalRevenue: 0,
      averageOrderValue: 0,
      createdAt: new Date(),
      updatedAt: new Date(),
    }
  }

  return { error: "Not found" }
})
