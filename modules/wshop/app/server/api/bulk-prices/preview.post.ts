import { defineEventHandler, readBody } from "h3"

export default defineEventHandler(async (event) => {
  const method = event.method

  if (method === "POST") {
    const body = await readBody(event)
    return {
      changes: [],
      totalProducts: 0,
      totalChange: 0,
      averageChange: 0,
      affectedRevenue: 0,
    }
  }

  return { error: "Not found" }
})
