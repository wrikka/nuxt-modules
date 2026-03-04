import { defineEventHandler, readBody } from "h3"

export default defineEventHandler(async (event) => {
  const method = event.method

  if (method === "POST") {
    const body = await readBody(event)
    return {
      products: [],
      specs: [],
      differences: [],
      bestValue: "",
      bestRated: "",
      aiRecommendation: "",
    }
  }

  return { error: "Not found" }
})
